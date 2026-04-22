import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "../../api/client";
import "./SessionsGraph.css";

const SessionsGraph = ({ refreshTrigger = 0 }) => {
  const [weekData, setWeekData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [maxValue, setMaxValue] = useState(10);

  const processSessionData = (sessions) => {
    const today = new Date();
    const days = [0, 0, 0, 0, 0, 0, 0];
    sessions.forEach((session) => {
      const sessionDate = new Date(session.completedAt);
      const diffDays = Math.floor(
        (today - sessionDate) / (1000 * 60 * 60 * 24)
      );
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

  const fetchSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await api.getSessions(1, 500);
      const sessions = data.sessions || data;
      processSessionData(sessions);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const days = ["M", "T", "W", "Th", "F", "S", "Su"];

  const generateLinePath = () => {
    const graphWidth = 100;
    const graphHeight = 100;
    const stepX = graphWidth / (weekData.length - 1);
    const points = weekData.map((value, index) => {
      const x = index * stepX;
      const y = graphHeight - (value / maxValue) * graphHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  return (
    <section
      className="sessions-graph-container"
      aria-labelledby="sessions-graph-heading"
    >
      <h3 id="sessions-graph-heading">This week</h3>
      <div className="graph-wrapper">
        <div className="graph-y-axis" aria-hidden="true">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>
        <div className="graph-area">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="line-graph"
            role="img"
            aria-label={`Weekly focus minutes: ${weekData.join(", ")}`}
          >
            <path
              d={generateLinePath()}
              fill="none"
              stroke="var(--color-accent-600)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="graph-x-axis" aria-hidden="true">
            {days.map((day) => (
              <span key={day} className="x-label">
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

SessionsGraph.propTypes = {
  refreshTrigger: PropTypes.number,
};

export default SessionsGraph;