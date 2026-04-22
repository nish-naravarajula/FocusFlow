import { useState } from "react";
import PropTypes from "prop-types";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./task-item.css";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function TaskItem({
  name = "Untitled task",
  desc = "",
  datetime = new Date(),
  type = "work",
  done = false,
  onToggle,
  onDelete,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const currTime = new Date();
  const time = new Date(datetime);

  let status = WEEKDAYS[time.getDay()];
  let isLate = false;
  if (currTime.valueOf() > time && !done) {
    status = "Late";
    isLate = true;
  }
  if (done) {
    status = "Done";
  }

  // Start / end of current week
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const inWeek =
    time.valueOf() >= startOfWeek.valueOf() &&
    time.valueOf() < endOfWeek.valueOf();

  if (!inWeek) {
    status = `${status} · ${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;
  }

  const toggleLabel = done ? "Mark as not done" : "Mark as done";

  return (
    <article
      className={`task-item ${done ? "is-done" : ""} ${isLate ? "is-late" : ""}`}
    >
      <div className="task-item-main">
        <header className="task-item-header">
          <h3 className="task-item-title">{name}</h3>
          <span className="task-item-type">{type}</span>
        </header>
        {desc && <p className="task-item-desc">{desc}</p>}
        <p className="task-item-status">
          <span className="sr-only">Status: </span>
          {status}
        </p>
      </div>

      <div className="task-item-actions">
        <button
          type="button"
          className="task-item-btn task-item-btn-toggle"
          onClick={onToggle}
          aria-label={`${toggleLabel}: ${name}`}
        >
          {done ? "Undo" : "Finish"}
        </button>
        <button
          type="button"
          className="task-item-btn task-item-btn-delete"
          onClick={() => setConfirmOpen(true)}
          aria-label={`Delete task: ${name}`}
        >
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this task?"
        message={`"${name}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete?.();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  );
}

TaskItem.propTypes = {
  name: PropTypes.string,
  desc: PropTypes.string,
  datetime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  type: PropTypes.string,
  done: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskItem;
