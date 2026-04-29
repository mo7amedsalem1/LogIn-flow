import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import AuthShell from "../components/AuthShell";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { getApiErrorMessage } from "../utils/http";
import { getDefaultRouteByRole } from "../utils/role";

export default function VerifyTwoFactorPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    pendingTwoFactor,
    completeLogin,
    clearPendingTwoFactor,
  } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  if (!pendingTwoFactor?.twoFactorToken) {
    return <Navigate replace to="/login" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await authService.verifyTwoFactor({
        twoFactorToken: pendingTwoFactor.twoFactorToken,
        code,
      });

      completeLogin(response);
      navigate(getDefaultRouteByRole(response.user.role), { replace: true });
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Could not verify your authentication code. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      footerLinkLabel="Start over"
      footerLinkTo="/login"
      footerText="Need a new login session?"
      subtitle={`Enter the 6-digit code from your authenticator app for ${pendingTwoFactor.email}.`}
      title="Verify 2FA"
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Authentication code</span>
          <span className="field-hint">
            Codes refresh every 30 seconds. We accept a small time window for
            clock skew.
          </span>
          <input
            autoComplete="one-time-code"
            className="code-input"
            inputMode="numeric"
            maxLength={6}
            name="code"
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="123456"
            required
            value={code}
          />
        </label>

        <StatusMessage type="error">{error}</StatusMessage>

        <div className="button-row">
          <button
            className="button primary"
            disabled={submitting || code.length !== 6}
            type="submit"
          >
            {submitting ? "Verifying..." : "Verify and sign in"}
          </button>
          <button
            className="button ghost"
            onClick={clearPendingTwoFactor}
            type="button"
          >
            Clear session
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
