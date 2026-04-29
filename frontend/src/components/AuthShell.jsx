import { Link } from "react-router-dom";

export default function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLinkLabel,
  footerLinkTo,
}) {
  return (
    <div className="page auth-page">
      <div className="auth-shell">
        <aside className="hero-panel">
          <div className="card-stack">
            <span className="eyebrow">Secure Access</span>
            <div className="card-stack">
              <h1 className="hero-title">Authentication built for real teams.</h1>
              <p className="hero-copy">
                Register, scan your authenticator app, finish 2FA, and land in the
                right role-based workspace.
              </p>
            </div>
          </div>

          <div className="list">
            <div className="list-item">Password hashing with bcrypt</div>
            <div className="list-item">Encrypted TOTP secrets and QR onboarding</div>
            <div className="list-item">JWT route protection and RBAC</div>
          </div>
        </aside>

        <section className="card auth-card">
          <div className="card-stack">
            <div>
              <h2 className="section-title">{title}</h2>
              <p className="muted">{subtitle}</p>
            </div>
            {children}
            {footerText && footerLinkLabel && footerLinkTo ? (
              <p className="muted">
                {footerText} <Link to={footerLinkTo}>{footerLinkLabel}</Link>
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
