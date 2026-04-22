import PropTypes from "prop-types";
import "./task-nav.css";

const OPTIONS = [
  { value: "late", label: "Late" },
  { value: "todo", label: "To do" },
  { value: "done", label: "Done" },
];

function TaskNav({ status, setStatus }) {
  return (
    <div
      className="task-nav"
      role="tablist"
      aria-label="Filter tasks by status"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={status === opt.value}
          className={`task-nav-btn ${status === opt.value ? "active" : ""}`}
          onClick={() => setStatus(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

TaskNav.propTypes = {
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
};

export default TaskNav;
