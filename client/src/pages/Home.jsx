import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import CreateTask from "../components/Tasks/create-task.jsx";
import ProgressCircles from "../components/Circle/progress-circle.jsx";
import SessionsGraph from "../components/Sessions/SessionsGraph.jsx";
import StreakDisplay from "../components/Sessions/StreakDisplay.jsx";
import TaskNav from "../components/Tasks/task-nav.jsx";
import TaskList from "../components/Tasks/task-list.jsx";

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

function Home({ refreshTrigger }) {
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
          type: task.type,
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
    <>
      <div className="mainpage row">
        {/* OVERVIEW COL */}
        <div className="column holder overview col-3">
          <h2>Overview:</h2>
          <ul>
            {tasks
              .filter(todo)
              .slice(0, 20)
              .reverse()
              .map((task) => (
                <li className={late(task) ? "late" : ""}>
                  {task.name}
                  {!inWeek(task)
                    ? ` ${new Date(task.due).getMonth() + 1}/${new Date(task.due).getDate()}`
                    : ""}
                </li>
              ))}
          </ul>
        </div>

        {/* STAT COL */}
        <div className="column col-6">
          <div className="holder stats">
            <h2>Focus Stats</h2>
            <SessionsGraph refreshTrigger={refreshTrigger} />
            <StreakDisplay refreshTrigger={refreshTrigger} />
          </div>
          <div className="tasks holder">
            <div className="holder add" onClick={() => setIsCreating(true)}>
              <h5>Add</h5>
            </div>
            <TaskList
              tasks={tasks}
              filter1={inWeek}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
            />
            <Link to="/tasks" className="holder more">
              <h5>More</h5>
            </Link>{" "}
          </div>
        </div>
        <CreateTask
          open={isCreating}
          onClose={() => setIsCreating(false)}
          onCreate={createTask}
        />

        {/* PROGRESS COL */}
        <div className="column holder prog col-3">
          <ProgressCircles tasks={tasks} />
          <TaskNav status={status} setStatus={setStatus} />
          <div className="tasks">
            <TaskList
              tasks={tasks}
              filter1={inWeek}
              filter2={getFunc(status)}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
            />
          </div>
        </div>
      </div>
    </>
  );
}

Home.propTypes = {
  refreshTrigger: PropTypes.number,
};

Home.defaultProps = {
  refreshTrigger: 0,
};

export default Home;
