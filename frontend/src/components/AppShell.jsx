import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { canAccessManagerArea, ROLE_LABELS } from "../utils/role";

export default function AppShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = [
    { to: "/dashboard", label: "Dashboard", visible: true },
    { to: "/profile", label: "Profile", visible: true },
    { to: "/manager", label: "Manager", visible: canAccessManagerArea(user.role) },
    { to: "/admin", label: "Admin", visible: user.role === "ADMIN" },
  ].filter((link) => link.visible);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="page">
      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <h1 className="brand-name">Secure Auth Platform</h1>
            <p className="brand-note">
              Signed in as {user.name} with {ROLE_LABELS[user.role]} access
            </p>
          </div>
          <div className="button-row">
            <span className="user-chip">
              <span className="pill">{ROLE_LABELS[user.role]}</span>
              <span>{user.email}</span>
            </span>
            <button className="button ghost" onClick={handleLogout} type="button">
              Log out
            </button>
          </div>
        </header>

        <nav className="card nav-card">
          <div className="nav-links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <span className="subtle">
            Unauthorized users are redirected automatically.
          </span>
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
