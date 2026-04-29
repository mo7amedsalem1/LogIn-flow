const rateLimit = require("express-rate-limit");

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message,
    },
  });

const apiLimiter = createLimiter(
  15 * 60 * 1000,
  250,
  "Too many requests from this IP. Please try again later.",
);

const registerLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many registration attempts. Please try again later.",
);

const loginLimiter = createLimiter(
  15 * 60 * 1000,
  15,
  "Too many login attempts. Please try again later.",
);

const verifyTwoFactorLimiter = createLimiter(
  10 * 60 * 1000,
  20,
  "Too many 2FA attempts. Please sign in again shortly.",
);

module.exports = {
  apiLimiter,
  registerLimiter,
  loginLimiter,
  verifyTwoFactorLimiter,
};
