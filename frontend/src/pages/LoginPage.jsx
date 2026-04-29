import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { getApiErrorMessage } from "../utils/http";

const initialForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, storePendingTwoFactor } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await authService.login(form);

      storePendingTwoFactor({
        twoFactorToken: response.twoFactorToken,
        email: response.user.email,
        role: response.user.role,
      });

      setMessage(response.message);
      navigate("/verify-2fa", { replace: true });
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Sign-in failed. Please check your email and password.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      footerLinkLabel="Create an account"
      footerLinkTo="/register"
      footerText="Need access?"
      subtitle="Use your email and password first. We’ll ask for your TOTP code before issuing the JWT."
      title="Login"
    >
      <form className="form-grid" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          label="Password"
          name="password"
          onChange={handleChange}
          placeholder="Enter your password"
          required
          type="password"
          value={form.password}
        />

        <StatusMessage type="error">{error}</StatusMessage>
        <StatusMessage type="info">{message}</StatusMessage>

        <div className="button-row">
          <button className="button primary" disabled={submitting} type="submit">
            {submitting ? "Checking credentials..." : "Continue to 2FA"}
          </button>
          <Link className="button secondary" to="/register">
            Register instead
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
