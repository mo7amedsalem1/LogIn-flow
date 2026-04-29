import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "../components/AppShell";
import LoadingScreen from "../components/LoadingScreen";
import PrivateRoute from "../components/PrivateRoute";
import RoleRoute from "../components/RoleRoute";
import { useAuth } from "../context/AuthContext";
import AdminPage from "../pages/AdminPage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import ManagerPage from "../pages/ManagerPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import VerifyTwoFactorPage from "../pages/VerifyTwoFactorPage";

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Loading your access rules..." />;
  }

  return <Navigate replace to={isAuthenticated ? "/dashboard" : "/login"} />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootRedirect />} path="/" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<VerifyTwoFactorPage />} path="/verify-2fa" />

      <Route element={<PrivateRoute />}>
        <Route element={<AppShell />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          <Route element={<ProfilePage />} path="/profile" />
          <Route element={<UnauthorizedPage />} path="/unauthorized" />

          <Route element={<RoleRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
            <Route element={<ManagerPage />} path="/manager" />
          </Route>

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<AdminPage />} path="/admin" />
          </Route>
        </Route>
      </Route>

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}
