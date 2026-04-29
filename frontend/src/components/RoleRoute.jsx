import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to="/unauthorized" />;
  }

  return <Outlet />;
}
