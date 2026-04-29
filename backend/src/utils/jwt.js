const jwt = require("jsonwebtoken");

const { env } = require("../config/env");

const commonOptions = {
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
};

const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    env.JWT_SECRET,
    {
      ...commonOptions,
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );

const signTwoFactorToken = (userId) =>
  jwt.sign(
    {
      sub: userId,
      purpose: "2fa",
    },
    env.JWT_PREAUTH_SECRET,
    {
      ...commonOptions,
      expiresIn: env.JWT_PREAUTH_EXPIRES_IN,
    },
  );

const verifyAccessToken = (token) =>
  jwt.verify(token, env.JWT_SECRET, commonOptions);

const verifyTwoFactorToken = (token) =>
  jwt.verify(token, env.JWT_PREAUTH_SECRET, commonOptions);

module.exports = {
  signAccessToken,
  signTwoFactorToken,
  verifyAccessToken,
  verifyTwoFactorToken,
};
