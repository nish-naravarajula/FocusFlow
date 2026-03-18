import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./StreakDisplay.css";

const StreakDisplay = ({ refreshTrigger }) => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    streak: 0,
    averagePerDay: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/sessions/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="streak-loading">Loading...</div>;
  }

  return (
    <div className="streak-container">
      <div className="streak-grid">
        <div className="streak-card">
          <span className="streak-icon">🔥</span>
          <span className="streak-value">{stats.streak}</span>
          <span className="streak-label">Day Streak</span>
        </div>
        <div className="streak-card">
          <span className="streak-icon">✅</span>
          <span className="streak-value">{stats.totalSessions}</span>
          <span className="streak-label">Sessions</span>
        </div>
        <div className="streak-card">
          <span className="streak-icon">⏱️</span>
          <span className="streak-value">{stats.totalMinutes}</span>
          <span className="streak-label">Minutes</span>
        </div>
        <div className="streak-card">
          <span className="streak-icon">📊</span>
          <span className="streak-value">{stats.averagePerDay}</span>
          <span className="streak-label">Avg/Day</span>
        </div>
      </div>
    </div>
  );
};

StreakDisplay.propTypes = {
  refreshTrigger: PropTypes.number,
};

StreakDisplay.defaultProps = {
  refreshTrigger: 0,
};

export default StreakDisplay;
