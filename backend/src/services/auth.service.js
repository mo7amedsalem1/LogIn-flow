const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const prisma = require("../prisma");
const { env } = require("../config/env");
const { AppError } = require("../utils/app-error");
const { encrypt, decrypt } = require("../utils/crypto");
const {
  signAccessToken,
  signTwoFactorToken,
  verifyTwoFactorToken,
} = require("../utils/jwt");
const { publicUserSelect, sanitizeUser } = require("../utils/user");

const invalidCredentialsError = () =>
  new AppError(401, "Invalid email or password");

const assertRoleAssignmentAllowed = (role, roleEnrollmentCode) => {
  if (role === "USER") {
    return;
  }

  const requiredCode =
    role === "ADMIN"
      ? env.ADMIN_ROLE_SETUP_CODE
      : env.MANAGER_ROLE_SETUP_CODE;

  if (!requiredCode || roleEnrollmentCode !== requiredCode) {
    throw new AppError(
      403,
      `${role === "ADMIN" ? "Admin" : "Manager"} registration requires a valid invite code`,
    );
  }
};

const registerUser = async ({
  name,
  email,
  password,
  role,
  roleEnrollmentCode,
}) => {
  assertRoleAssignmentAllowed(role, roleEnrollmentCode);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(409, "An account with that email already exists");
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  const secret = speakeasy.generateSecret({
    length: 20,
    issuer: env.TWO_FA_APP_NAME,
    name: email,
  });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      twoFactorSecret: encrypt(secret.base32),
      twoFactorEnabled: true,
    },
    select: publicUserSelect,
  });

  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

  return {
    message: "Registration successful. Scan the QR code to complete 2FA setup.",
    user: sanitizeUser(user),
    qrCodeDataUrl,
    manualEntryKey: secret.base32,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
      twoFactorEnabled: true,
    },
  });

  if (!user) {
    throw invalidCredentialsError();
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw invalidCredentialsError();
  }

  if (!user.twoFactorEnabled) {
    throw new AppError(403, "Two-factor authentication is not configured");
  }

  return {
    message: "Primary credentials validated. Enter your 2FA code to continue.",
    requiresTwoFactor: true,
    twoFactorToken: signTwoFactorToken(user.id),
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const verifyUserTwoFactor = async ({ twoFactorToken, code }) => {
  let payload;

  try {
    payload = verifyTwoFactorToken(twoFactorToken);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(401, "Your login session expired. Please sign in again.");
    }

    throw new AppError(401, "Invalid 2FA session");
  }

  if (payload.purpose !== "2fa") {
    throw new AppError(401, "Invalid 2FA session");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      ...publicUserSelect,
      twoFactorSecret: true,
    },
  });

  if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new AppError(401, "Two-factor authentication is not configured");
  }

  const isValid = speakeasy.totp.verify({
    secret: decrypt(user.twoFactorSecret),
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!isValid) {
    throw new AppError(401, "Invalid authentication code");
  }

  return {
    message: "Authentication successful",
    tokenType: "Bearer",
    accessToken: signAccessToken(user),
    expiresIn: env.JWT_EXPIRES_IN,
    user: sanitizeUser(user),
  };
};

module.exports = {
  registerUser,
  loginUser,
  verifyUserTwoFactor,
};
