import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "../../api/client";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./SessionHistory.css";

const SessionHistory = ({ refreshTrigger = 0 }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.getSessions(page, 10);
      const list = data.sessions || data || [];
      setSessions(Array.isArray(list) ? list : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, page]);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    try {
      await api.deleteSession(confirmTarget._id);
      setSessions((prev) => prev.filter((s) => s._id !== confirmTarget._id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmTarget(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="session-history-container">
        <p className="session-history-loading">Loading sessions…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="session-history-container">
        <p className="session-history-error" role="alert">
          {error}
        </p>
      </div>
    );
  }

  return (
    <section
      className="session-history-container"
      aria-labelledby="session-history-heading"
    >
      <header className="session-history-header">
        <h3 id="session-history-heading">Session history</h3>
        <span className="session-count">{total} total</span>
      </header>

      {sessions.length === 0 ? (
        <p className="no-sessions">
          No sessions yet. Start your first focus session!
        </p>
      ) : (
        <>
          <ul className="session-list">
            {sessions.map((session) => (
              <li key={session._id} className="session-item">
                <div className="session-info">
                  <span className={`session-type ${session.type}`}>
                    {session.type}
                  </span>
                  <span className="session-label">{session.label}</span>
                  <span className="session-duration">
                    {session.duration} min
                  </span>
                  <span className="session-date">
                    {formatDate(session.completedAt)}
                  </span>
                </div>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setConfirmTarget(session)}
                  aria-label={`Delete ${session.label} session`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <nav className="pagination" aria-label="Session pagination">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </nav>
        </>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this session?"
        message={
          confirmTarget
            ? `This will permanently remove "${confirmTarget.label}" (${confirmTarget.duration} min). This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </section>
  );
};

SessionHistory.propTypes = {
  refreshTrigger: PropTypes.number,
};

export default SessionHistory;