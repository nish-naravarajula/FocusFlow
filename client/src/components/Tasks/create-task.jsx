import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./create-task.css";

const MAX_NAME = 60;
const MAX_DESC = 200;

const TYPE_OPTIONS = ["work", "school", "personal"];

function CreateTask({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("work");
  const [due, setDue] = useState("");

  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName("");
      setDesc("");
      setType("work");
      setDue("");
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onCreate?.({
      name: trimmedName,
      desc: desc.trim(),
      type: type.trim(),
      due: due ? new Date(due).toISOString() : null,
      done: false,
    });
    onClose?.();
  };

  return (
    <div className="create-task-overlay">
      <div
        ref={dialogRef}
        className="create-task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
      >
        <header className="create-task-header">
          <h2 id="create-task-title">Create task</h2>
          <button
            type="button"
            className="create-task-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <form className="create-task-form" onSubmit={handleSubmit} noValidate>
          <div className="create-task-field">
            <label htmlFor="task-name">Title</label>
            <input
              ref={firstFieldRef}
              id="task-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Finish 5610 assignment"
              maxLength={MAX_NAME}
              required
            />
            <span className="create-task-hint">
              {name.length}/{MAX_NAME}
            </span>
          </div>

          <div className="create-task-field">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              placeholder="Optional notes"
              rows={3}
              maxLength={MAX_DESC}
            />
            <span className="create-task-hint">
              {desc.length}/{MAX_DESC}
            </span>
          </div>

          <div className="create-task-field">
            <label htmlFor="task-type">Type</label>
            <select
              id="task-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              required
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="create-task-field">
            <label htmlFor="task-due">Due date</label>
            <input
              id="task-due"
              type="datetime-local"
              value={due}
              onChange={(event) => setDue(event.target.value)}
              required
            />
          </div>

          <div className="create-task-actions">
            <button
              type="button"
              className="create-task-btn create-task-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-task-btn create-task-btn-primary"
              disabled={!name.trim()}
            >
              Create task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateTask.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateTask;