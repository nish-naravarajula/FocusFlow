import { useEffect, useState } from "react";
import "./create-task.css";
import PropTypes from "prop-types";

function CreateTask({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("work");
  const [due, setDue] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setDesc("");
      setType("work");
      setDue("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    const newTask = {
      id: crypto?.randomUUID?.() || `${Date.now()}`,
      name: name.trim(),
      desc: desc.trim(),
      type: type.trim(),
      due: due ? new Date(due).toISOString() : null,
      done: false,
    };

    onCreate?.(newTask);
    onClose?.();
  };

  return (
    <div className="create-task-overlay" onClick={onClose}>
      <div
        className="create-task-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="create-task-header">
          <h2>Create Task</h2>
          <button className="create-task-close" type="button" onClick={onClose}>
            ×
          </button>
        </header>

        <form className="create-task-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter task name"
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              placeholder="description"
              rows={3}
            />
          </label>

          <label>
            Type
            <input
              value={type}
              onChange={(event) => setType(event.target.value)}
              placeholder="Enter type of task"
              required
            />
          </label>

          <label>
            Due date
            <input
              type="datetime-local"
              value={due}
              onChange={(event) => setDue(event.target.value)}
              required
            />
          </label>

          <div className="create-task-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Create
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
