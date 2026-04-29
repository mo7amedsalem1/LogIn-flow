import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page auth-page">
      <section className="card content-card center-card card-stack">
        <span className="pill">404</span>
        <h2 className="section-title">This page does not exist.</h2>
        <p className="muted">
          Use the links below to return to the authentication flow.
        </p>
        <div className="button-row">
          <Link className="button primary" to="/login">
            Go to login
          </Link>
          <Link className="button secondary" to="/register">
            Create an account
          </Link>
        </div>
      </section>
    </div>
  );
}
