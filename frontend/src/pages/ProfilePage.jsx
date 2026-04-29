import { useEffect, useState } from "react";

import StatusMessage from "../components/StatusMessage";
import { resourceService } from "../services/resourceService";
import { getApiErrorMessage } from "../utils/http";
import { ROLE_LABELS } from "../utils/role";

export default function ProfilePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      try {
        const response = await resourceService.getProfile();

        if (!ignore) {
          setData(response);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(
            getApiErrorMessage(
              requestError,
              "Could not load your profile at the moment.",
            ),
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="card content-card card-stack">
      <div>
        <span className="pill">Protected Route</span>
        <h2 className="section-title">User profile</h2>
        <p className="muted">
          This page calls `GET /api/profile` with your bearer token.
        </p>
      </div>

      {loading ? <StatusMessage>Loading profile...</StatusMessage> : null}
      <StatusMessage type="error">{error}</StatusMessage>

      {data ? (
        <div className="info-grid">
          <div className="info-row">
            <strong>Message</strong>
            <span>{data.message}</span>
          </div>
          <div className="info-row">
            <strong>Name</strong>
            <span>{data.user.name}</span>
          </div>
          <div className="info-row">
            <strong>Email</strong>
            <span>{data.user.email}</span>
          </div>
          <div className="info-row">
            <strong>Role</strong>
            <span>{ROLE_LABELS[data.user.role]}</span>
          </div>
          <div className="info-row">
            <strong>2FA enabled</strong>
            <span>{data.user.twoFactorEnabled ? "Yes" : "No"}</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
