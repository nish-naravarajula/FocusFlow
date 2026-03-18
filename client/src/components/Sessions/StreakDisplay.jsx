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
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="streak-loading">Loading stats...</div>;
  }

  return (
    <div className="streak-container">
      <div className="stat-card streak">
        <span className="stat-icon">🔥</span>
        <span className="stat-value">{stats.streak}</span>
        <span className="stat-label">Day Streak</span>
      </div>
      <div className="stat-card sessions">
        <span className="stat-icon">✅</span>
        <span className="stat-value">{stats.totalSessions}</span>
        <span className="stat-label">Total Sessions</span>
      </div>
      <div className="stat-card minutes">
        <span className="stat-icon">⏱️</span>
        <span className="stat-value">{stats.totalMinutes}</span>
        <span className="stat-label">Total Minutes</span>
      </div>
      <div className="stat-card average">
        <span className="stat-icon">📊</span>
        <span className="stat-value">{stats.averagePerDay}</span>
        <span className="stat-label">Avg Min/Day</span>
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
