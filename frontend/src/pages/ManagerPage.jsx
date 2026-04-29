import { useEffect, useState } from "react";

import StatusMessage from "../components/StatusMessage";
import { resourceService } from "../services/resourceService";
import { getApiErrorMessage } from "../utils/http";

export default function ManagerPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadManagerResource = async () => {
      try {
        const response = await resourceService.getManager();

        if (!ignore) {
          setData(response);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(
            getApiErrorMessage(
              requestError,
              "Could not load the manager workspace right now.",
            ),
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadManagerResource();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="card content-card card-stack">
      <div>
        <span className="pill">RBAC</span>
        <h2 className="section-title">Manager workspace</h2>
        <p className="muted">
          This view is available only to managers and admins. The backend also
          enforces the same rule on `GET /api/manager`.
        </p>
      </div>

      {loading ? <StatusMessage>Loading manager permissions...</StatusMessage> : null}
      <StatusMessage type="error">{error}</StatusMessage>

      {data ? (
        <>
          <StatusMessage type="success">{data.message}</StatusMessage>
          <div className="resource-list">
            {data.permissions.map((permission) => (
              <span className="resource-item" key={permission}>
                {permission}
              </span>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
