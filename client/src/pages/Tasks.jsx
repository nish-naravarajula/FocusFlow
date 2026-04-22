import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "../api/client";
import "./Tasks.css";
import TaskNav from "../components/Tasks/task-nav";
import TaskList from "../components/Tasks/task-list";
import CreateTask from "../components/Tasks/create-task";

function normalizeTask(task) {
  const rawId = task._id ?? task.id;
  const id = rawId?.$oid ?? rawId?.toString?.() ?? rawId;
  return {
    id,
    name: task.name,
    desc: task.desc,
    type: task.type,
    due: task.due,
    done: task.done ?? false,
  };
}

function Tasks({ refreshTrigger = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("todo");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setError("");
    try {
      const data = await api.getTasks(page, 20);
      const list = data.tasks || data;
      setTasks(Array.isArray(list) ? list.map(normalizeTask) : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, page]);

  const createTask = async (task) => {
    try {
      const data = await api.createTask({
        name: task.name,
        desc: task.desc,
        type: task.type,
        due: task.due,
      });
      setTasks((prev) => [...prev, normalizeTask(data)]);
      setTotal((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComplete = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updatedDone = !task.done;
    try {
      await api.updateTask(taskId, { done: updatedDone });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, done: updatedDone } : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setTotal((prev) => prev - 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const late = (t) => new Date(t.due).valueOf() < new Date() && !t.done;
  const done = (t) => t.done;
  const todo = (t) => !t.done;
  const getFunc = (s) => (s === "late" ? late : s === "done" ? done : todo);

  return (
<<<<<<< HEAD
    <div className="tasks-page">
      <header className="tasks-page-header">
        <h2>Your tasks</h2>
        <div className="tasks-page-controls">
          <TaskNav status={status} setStatus={setStatus} />
          <span className="tasks-page-count">{total} total</span>
        </div>
      </header>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      <div className="tasks-page-body">
        <button
          type="button"
          className="tasks-add-btn"
          onClick={() => setIsCreating(true)}
        >
          + Add a new task
=======
    <div className="wrap">
      <div className="top">
        <TaskNav status={status} setStatus={setStatus} />
        <span className="task-count">{total} total tasks</span>
      </div>
      <div className="task-holder">
        <button className="holder add" onClick={() => setIsCreating(true)} type="button">
          <h5>Add Task</h5>
>>>>>>> f8d8ce6f84a34b501541e3da6da3a0c323e07526
        </button>

        <TaskList
          tasks={tasks}
          filter1={getFunc(status)}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
        />

        <nav className="pagination" aria-label="Task pagination">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </nav>
      </div>

      <CreateTask
        open={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={createTask}
      />
    </div>
  );
}

Tasks.propTypes = {
  refreshTrigger: PropTypes.number,
};

export default Tasks;