import { useState, useEffect } from "react";
import "./Tasks.css";
import TaskNav from "../components/Tasks/task-nav";
import TaskList from "../components/Tasks/task-list";
import CreateTask from "../components/Tasks/create-task";
import PropTypes from "prop-types";

function normalizeTask(task) {
  const rawId = task._id ?? task.id;
  const id = rawId?.$oid ?? rawId?.toString?.() ?? rawId;

  return {
    id,
    name: task.name,
    desc: task.desc,
    due: task.due,
    done: task.done ?? false,
  };
}

function Tasks({ refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("todo");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch tasks");
      }

      const data = await res.json();
      setTasks(Array.isArray(data) ? data.map(normalizeTask) : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: task.name,
          desc: task.desc,
          due: task.due,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      setTasks((prev) => [...prev, normalizeTask(data)]);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleComplete = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedDone = !task.done;
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ done: updatedDone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, done: updatedDone } : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not Authenticated");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: taskId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete task");
      }
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  const late = (task) => {
    const due = new Date(task.due).valueOf();
    return due < new Date() && !task.done;
  };

  const done = (task) => {
    return task.done;
  };

  const todo = (task) => {
    return !task.done;
  };

  const getFunc = (status) => {
    return status === "late" ? late : status === "done" ? done : todo;
  };

  return (
    <div className="wrap">
      <div className="top">
        <TaskNav status={status} setStatus={setStatus} />
      </div>
      <div className="task-holder">
        <div className="holder add" onClick={() => setIsCreating(true)}>
          <h5>Add</h5>
        </div>

        <TaskList
          tasks={tasks}
          filter1={getFunc(status)}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
        />
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

Tasks.defaultProps = {
  refreshTrigger: 0,
};

export default Tasks;
