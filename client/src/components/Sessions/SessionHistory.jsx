import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./SessionHistory.css";

const SessionHistory = ({ refreshTrigger }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSessions();
  }, [refreshTrigger, page]);

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://focusflow-vexk.onrender.com/api/sessions?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await res.json();
      const sessionList = data.sessions || data || [];
      setSessions(Array.isArray(sessionList) ? sessionList : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://focusflow-vexk.onrender.com/api/sessions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setSessions(sessions.filter((s) => s._id !== id));
        setTotal((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Delete failed:", err);
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
    return <div className="session-history-loading">Loading sessions...</div>;
  }

  if (error) {
    return <div className="session-history-error">{error}</div>;
  }

  return (
    <div className="session-history-container">
      <div className="session-history-header">
        <h3>Session History</h3>
        <span className="session-count">{total} total sessions</span>
      </div>
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
                  onClick={() => handleDelete(session._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="pagination">
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
          </div>
        </>
      )}
    </div>
  );
};

SessionHistory.propTypes = {
  refreshTrigger: PropTypes.number,
};

SessionHistory.defaultProps = {
  refreshTrigger: 0,
};

export default SessionHistory;
