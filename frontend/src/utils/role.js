export const ROLE_LABELS = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  USER: "User",
};

export const getDefaultRouteByRole = (role) => {
  if (role === "ADMIN") {
    return "/admin";
  }

  if (role === "MANAGER") {
    return "/manager";
  }

  return "/profile";
};

export const canAccessManagerArea = (role) =>
  role === "ADMIN" || role === "MANAGER";
