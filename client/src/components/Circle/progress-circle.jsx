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
    const type = task.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(task);
    return acc;
  }, {});

  // Convert to array with completion %
  const typeStats = Object.entries(grouped).map(([type, items]) => {
    const total = items.length;
    const completed = items.filter((t) => t.done).length;
    return {
      type,
      total,
      completed,
      percent: total === 0 ? 0 : completed / total,
    };
  });

  const topTypes = typeStats.sort((a, b) => b.total - a.total).slice(0, 4);

<<<<<<< HEAD
  // Circle settings — concentric rings
=======
  // Circle settings
>>>>>>> f8d8ce6f84a34b501541e3da6da3a0c323e07526
  const baseRadius = 80;
  const strokeWidth = 10;
  const gap = 15;

  // Use accent colors for each ring instead of black
  const ringColors = [
    "var(--color-accent-600)",
    "var(--color-accent-500)",
    "var(--color-warning)",
    "var(--color-primary-500)",
  ];

  return (
    <div className="progress-container">
      {topTypes.length === 0 ? (
        <p className="progress-empty">No tasks this week yet.</p>
      ) : (
        <>
          <svg
            width="200"
            height="200"
            role="img"
            aria-label={`Weekly progress: ${topTypes
              .map((t) => `${t.type} ${Math.round(t.percent * 100)}%`)
              .join(", ")}`}
          >
            {topTypes.map((t, index) => {
              const radius = baseRadius - index * (strokeWidth + gap);
              const circumference = 2 * Math.PI * radius;
              const offset = circumference * (1 - t.percent);

              return (
                <g key={t.type}>
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="var(--color-border)"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke={ringColors[index]}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "50% 50%",
                      transition: "stroke-dashoffset 500ms ease",
                    }}
                  />
                </g>
              );
            })}
          </svg>

          <ul className="progress-labels" aria-hidden="true">
            {topTypes.map((t, index) => (
              <li key={t.type} className="progress-label">
                <span
                  className="progress-label-dot"
                  style={{ background: ringColors[index] }}
                />
                <span className="progress-label-type">{t.type}</span>
                <span className="progress-label-percent">
                  {Math.round(t.percent * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

ProgressCircles.propTypes = {
<<<<<<< HEAD
  tasks: PropTypes.array.isRequired,
=======
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
>>>>>>> f8d8ce6f84a34b501541e3da6da3a0c323e07526
};

export default ProgressCircles;
