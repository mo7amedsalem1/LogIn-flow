import { useEffect, useState } from "react";

import StatusMessage from "../components/StatusMessage";
import { resourceService } from "../services/resourceService";
import { getApiErrorMessage } from "../utils/http";

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadAdminResource = async () => {
      try {
        const response = await resourceService.getAdmin();

        if (!ignore) {
          setData(response);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(
            getApiErrorMessage(
              requestError,
              "Could not load the admin workspace right now.",
            ),
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadAdminResource();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="card content-card card-stack">
      <div>
        <span className="pill">Highest Privilege</span>
        <h2 className="section-title">Admin workspace</h2>
        <p className="muted">
          This page demonstrates strict admin-only access on both the route guard
          and the protected backend endpoint.
        </p>
      </div>

      {loading ? <StatusMessage>Loading admin permissions...</StatusMessage> : null}
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
