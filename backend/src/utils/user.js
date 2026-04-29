const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  twoFactorEnabled: true,
  createdAt: true,
  updatedAt: true,
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  twoFactorEnabled: user.twoFactorEnabled,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

module.exports = {
  publicUserSelect,
  sanitizeUser,
};
