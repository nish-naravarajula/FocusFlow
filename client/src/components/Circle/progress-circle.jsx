import PropTypes from "prop-types";
import "./progress-circle.css";

function ProgressCircles({ tasks }) {
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const inWeek = (task) => {
    const due = new Date(task.due).valueOf();
    return due >= startOfWeek.valueOf() && due < endOfWeek.valueOf();
  };

  const weekTasks = tasks.filter(inWeek);

  // Group tasks by type
  const grouped = weekTasks.reduce((acc, task) => {
    const type = task.type || "unknown";
    if (!acc[type]) acc[type] = [];
    acc[type].push(task);
    return acc;
  }, {});

  // Convert to array with completion %
  const typeStats = Object.entries(grouped).map(([type, tasks]) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    return {
      type,
      total,
      completed,
      percent: total === 0 ? 0 : completed / total,
    };
  });

  // Take top 4 by total tasks
  const topTypes = typeStats.sort((a, b) => b.total - a.total).slice(0, 4);

  // Circle settings
  const baseRadius = 80;
  const strokeWidth = 10;
  const gap = 15;

  return (
    <div className="progress-container">
      <svg width="200" height="200">
        {topTypes.map((t, index) => {
          const radius = baseRadius - index * (strokeWidth + gap);
          const circumference = 2 * Math.PI * radius;
          const offset = circumference * (1 - t.percent);

          return (
            <g key={t.type}>
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#eee"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#000"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Labels */}
      <div className="labels">
        {topTypes.map((t) => (
          <div key={t.type}>
            {t.type}: {Math.round(t.percent * 100)}%
          </div>
        ))}
      </div>
    </div>
  );
}

ProgressCircles.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      done: PropTypes.bool,
      due: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    })
  )
};

ProgressCircles.defaultProps = {
  tasks: [],
};

export default ProgressCircles;
