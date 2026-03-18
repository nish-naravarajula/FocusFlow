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

  // Generate line path
  const generateLinePath = () => {
    const graphWidth = 100;
    const graphHeight = 100;
    const padding = 0;
    const stepX = (graphWidth - padding * 2) / (weekData.length - 1);

    const points = weekData.map((value, index) => {
      const x = padding + index * stepX;
      const y = graphHeight - (value / maxValue) * graphHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="sessions-graph-container">
      <h2>Sessions</h2>
      <div className="graph-wrapper">
        <div className="graph-y-axis">
          <span>{maxValue}</span>
          <span>{maxValue / 2}</span>
          <span>0</span>
        </div>
        <div className="graph-area">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="line-graph"
          >
            <path
              d={generateLinePath()}
              fill="none"
              stroke="#1a1a2e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="graph-x-axis">
            {days.map((day) => (
              <span key={day} className="x-label">
                {day}
              </span>
            ))}
          </div>
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
