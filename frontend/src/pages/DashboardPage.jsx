import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  canAccessManagerArea,
  getDefaultRouteByRole,
  ROLE_LABELS,
} from "../utils/role";

export default function DashboardPage() {
  const { user } = useAuth();
  const recommendedRoute = getDefaultRouteByRole(user.role);

  return (
    <div className="grid cols-2">
      <section className="card content-card card-stack">
        <div>
          <span className="pill">{ROLE_LABELS[user.role]}</span>
          <h2 className="section-title">Dashboard</h2>
          <p className="muted">
            Your JWT is active, your account is protected by TOTP, and route access
            is now enforced on both the frontend and backend.
          </p>
        </div>

        <div className="metric-grid">
          <div className="metric">
            <div className="metric-label">2FA</div>
            <div className="metric-value">
              {user.twoFactorEnabled ? "Enabled" : "Pending"}
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Primary route</div>
            <div className="metric-value">{recommendedRoute}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Role</div>
            <div className="metric-value">{ROLE_LABELS[user.role]}</div>
          </div>
        </div>

        <div className="button-row">
          <Link className="button primary" to={recommendedRoute}>
            Open my role workspace
          </Link>
          <Link className="button secondary" to="/profile">
            View profile
          </Link>
        </div>
      </section>

      <section className="card content-card card-stack">
        <div>
          <h2 className="section-title">Session overview</h2>
          <p className="muted">
            This view is driven from authenticated state that was hydrated through
            `/api/auth/me`.
          </p>
        </div>

        <div className="info-grid">
          <div className="info-row">
            <strong>Name</strong>
            <span>{user.name}</span>
          </div>
          <div className="info-row">
            <strong>Email</strong>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <strong>Role</strong>
            <span>{ROLE_LABELS[user.role]}</span>
          </div>
          <div className="info-row">
            <strong>Created</strong>
            <span>{new Date(user.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="list">
          <div className="list-item">Admins can access `/admin` and `/manager`.</div>
          <div className="list-item">
            Managers can access `/manager` and their own profile.
          </div>
          <div className="list-item">
            Users can access their profile and shared dashboard only.
          </div>
          {canAccessManagerArea(user.role) ? (
            <div className="list-item">Your role includes manager-level access.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
