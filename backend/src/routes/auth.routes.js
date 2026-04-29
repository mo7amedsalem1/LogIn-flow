const express = require("express");

const validate = require("../middleware/validate.middleware");
const {
  registerLimiter,
  loginLimiter,
  verifyTwoFactorLimiter,
} = require("../middleware/rate-limit.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const {
  register,
  login,
  verifyTwoFactor,
  getCurrentUser,
} = require("../controllers/auth.controller");
const {
  registerSchema,
  loginSchema,
  verifyTwoFactorSchema,
} = require("../validators/auth.schemas");

const router = express.Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post(
  "/verify-2fa",
  verifyTwoFactorLimiter,
  validate(verifyTwoFactorSchema),
  verifyTwoFactor,
);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;
