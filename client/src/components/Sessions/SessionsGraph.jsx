import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./SessionsGraph.css";

const SessionsGraph = ({ refreshTrigger }) => {
  const [weekData, setWeekData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [maxValue, setMaxValue] = useState(10);

  useEffect(() => {
    fetchSessions();
  }, [refreshTrigger]);

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const sessions = await res.json();
        processSessionData(sessions);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  const processSessionData = (sessions) => {
    const today = new Date();
    const days = [0, 0, 0, 0, 0, 0, 0];

    sessions.forEach((session) => {
      const sessionDate = new Date(session.completedAt);
      const diffTime = today - sessionDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 7 && diffDays >= 0) {
        const sessionDay = sessionDate.getDay();
        const index = sessionDay === 0 ? 6 : sessionDay - 1;
        days[index] += session.duration;
      }
    });

    setWeekData(days);
    const max = Math.max(...days, 10);
    setMaxValue(Math.ceil(max / 5) * 5);
  };

  const days = ["M", "T", "W", "Th", "F", "S", "Su"];

  return (
    <div className="sessions-graph-container">
      <h2>Sessions</h2>
      <div className="graph-wrapper">
        <div className="graph-y-axis">
          <span>{maxValue}</span>
          <span>{maxValue / 2}</span>
          <span>0</span>
        </div>
        <div className="graph-bars">
          {weekData.map((value, index) => (
            <div key={days[index]} className="bar-column">
              <div
                className="bar"
                style={{ height: `${(value / maxValue) * 100}%` }}
              />
              <span className="bar-label">{days[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SessionsGraph.propTypes = {
  refreshTrigger: PropTypes.number,
};

SessionsGraph.defaultProps = {
  refreshTrigger: 0,
};

export default SessionsGraph;
