const prisma = require("../prisma");
const { verifyAccessToken } = require("../utils/jwt");
const { publicUserSelect } = require("../utils/user");
const { AppError } = require("../utils/app-error");
const asyncHandler = require("../utils/async-handler");

const authenticate = asyncHandler(async (req, _res, next) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    throw new AppError(401, "Authentication required");
  }

  const token = authorization.slice(7).trim();

  let payload;

  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(401, "Session expired. Please sign in again.");
    }

    throw new AppError(401, "Invalid authentication token");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: publicUserSelect,
  });

  if (!user) {
    throw new AppError(401, "Authentication required");
  }

  req.user = user;
  req.auth = { token, payload };
  next();
});

const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError(401, "Authentication required"));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(
      new AppError(403, "You do not have permission to access this resource"),
    );
  }

  return next();
};

module.exports = {
  authenticate,
  authorize,
};
