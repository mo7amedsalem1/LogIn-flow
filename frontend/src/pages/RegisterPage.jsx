import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { getApiErrorMessage } from "../utils/http";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "USER",
  roleEnrollmentCode: "",
};

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "role" && value === "USER" ? { roleEnrollmentCode: "" } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await authService.register(form);
      setResult(response);
      setForm((current) => ({ ...initialForm, email: current.email }));
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Registration failed. Please review your details and try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      footerLinkLabel="Sign in"
      footerLinkTo="/login"
      footerText="Already onboarded?"
      subtitle="Create an account, choose a role, and get your authenticator app QR code immediately."
      title="Register"
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <FormField
          autoComplete="name"
          label="Full name"
          name="name"
          onChange={handleChange}
          placeholder="Jane Doe"
          required
          value={form.name}
        />
        <FormField
          autoComplete="email"
          label="Email"
          name="email"
          onChange={handleChange}
          placeholder="jane@example.com"
          required
          type="email"
          value={form.email}
        />
        <FormField
          autoComplete="new-password"
          hint="Use at least 12 characters with upper, lower, number, and special characters."
          label="Password"
          name="password"
          onChange={handleChange}
          placeholder="StrongerThanDemo123!"
          required
          type="password"
          value={form.password}
        />
        <FormField
          as="select"
          label="Role"
          name="role"
          onChange={handleChange}
          required
          value={form.role}
        >
          <option value="USER">User</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </FormField>

        {form.role !== "USER" ? (
          <FormField
            hint="Privileged roles require a server-side invite code."
            label="Role invite code"
            name="roleEnrollmentCode"
            onChange={handleChange}
            placeholder={
              form.role === "ADMIN" ? "Admin invite code" : "Manager invite code"
            }
            required
            type="password"
            value={form.roleEnrollmentCode}
          />
        ) : null}

        <StatusMessage type="error">{error}</StatusMessage>

        <div className="button-row">
          <button className="button primary" disabled={submitting} type="submit">
            {submitting ? "Creating account..." : "Register"}
          </button>
          <Link className="button secondary" to="/login">
            Continue to login
          </Link>
        </div>
      </form>

      {result ? (
        <div className="qr-panel">
          <StatusMessage type="success">{result.message}</StatusMessage>
          <div className="qr-box">
            <div>
              <h3>Scan your QR code</h3>
              <p className="muted">
                Use Google Authenticator, Microsoft Authenticator, 1Password, or
                another TOTP app before signing in.
              </p>
            </div>
            <div className="qr-code-frame">
              <img alt="2FA QR code" src={result.qrCodeDataUrl} />
            </div>
            <div className="card-stack">
              <span className="field-label">Manual setup key</span>
              <span className="secret-value">{result.manualEntryKey}</span>
            </div>
            <p className="muted">
              After scanning, continue to the <Link to="/login">login page</Link>.
            </p>
          </div>
        </div>
      ) : null}
    </AuthShell>
  );
}
