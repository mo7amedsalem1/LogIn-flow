const asyncHandler = require("../utils/async-handler");

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Profile access granted",
    user: req.user,
  });
});

const getAdminResource = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Admin access granted",
    user: req.user,
    permissions: ["users:read", "users:write", "audit:read"],
  });
});

const getManagerResource = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Manager access granted",
    user: req.user,
    permissions: ["team:read", "reports:read", "reports:write"],
  });
});

module.exports = {
  getProfile,
  getAdminResource,
  getManagerResource,
};
