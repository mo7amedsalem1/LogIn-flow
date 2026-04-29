import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <section className="card content-card center-card card-stack">
      <span className="pill">Access denied</span>
      <h2 className="section-title">You do not have permission for this page.</h2>
      <p className="muted">
        The frontend route guard blocked access before rendering the page, and the
        backend would reject the same request as well.
      </p>
      <div className="button-row">
        <Link className="button primary" to="/dashboard">
          Back to dashboard
        </Link>
        <Link className="button secondary" to="/profile">
          Open profile
        </Link>
      </div>
    </section>
  );
}
