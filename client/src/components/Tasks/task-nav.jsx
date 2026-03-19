import "./task-nav.css";

function TaskNav({ status, setStatus }) {
  return (
    <>
      <div className="task-bar">
        <div
          className={`nav-item ${status === "late" ? "active" : ""}`}
          onClick={() => setStatus("late")}
        >
          <a>Late</a>
        </div>
        <div
          className={`nav-item ${status === "todo" ? "active" : ""}`}
          onClick={() => setStatus("todo")}
        >
          <a>TODO</a>
        </div>
        <div
          className={`nav-item ${status === "done" ? "active" : ""}`}
          onClick={() => setStatus("done")}
        >
          <a>Done</a>
        </div>
      </div>
    </>
  );
}

export default TaskNav;
