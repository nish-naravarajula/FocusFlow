import PropTypes from "prop-types";
import "./task-nav.css";

function TaskNav({ status, setStatus }) {
  return (
    <div className="task-bar">
      <button
        type="button"
        className={`nav-item ${status === "late" ? "active" : ""}`}
        onClick={() => setStatus("late")}
      >
        Late
      </button>
      <button
        type="button"
        className={`nav-item ${status === "todo" ? "active" : ""}`}
        onClick={() => setStatus("todo")}
      >
        TODO
      </button>
      <button
        type="button"
        className={`nav-item ${status === "done" ? "active" : ""}`}
        onClick={() => setStatus("done")}
      >
        Done
      </button>
    </div>
  );
}

TaskNav.propTypes = {
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
};

export default TaskNav;
