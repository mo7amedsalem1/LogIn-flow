const asyncHandler = require("../utils/async-handler");
const {
  registerUser,
  loginUser,
  verifyUserTwoFactor,
} = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.status(200).json(result);
});

const verifyTwoFactor = asyncHandler(async (req, res) => {
  const result = await verifyUserTwoFactor(req.body);
  res.status(200).json(result);
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

module.exports = {
  register,
  login,
  verifyTwoFactor,
  getCurrentUser,
};
