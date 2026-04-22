import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
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

function Home({ refreshTrigger = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("todo");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await api.getTasks(1, 100);
      const taskList = data.tasks || data;
      setTasks(Array.isArray(taskList) ? taskList.map(normalizeTask) : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const createTask = async (task) => {
    try {
      const data = await api.createTask({
        name: task.name,
        desc: task.desc,
        type: task.type,
        due: task.due,
      });
      setTasks((prev) => [...prev, normalizeTask(data)]);
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
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  }, [refreshTrigger]);

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

  const late = (task) =>
    new Date(task.due).valueOf() < new Date() && !task.done;

  const done = (task) => task.done;
  const todo = (task) => !task.done;

  const getFunc = (s) => (s === "late" ? late : s === "done" ? done : todo);

  const upcomingTasks = tasks.filter(todo).slice(0, 20).reverse();

  return (
    <>
      {error && (
        <p className="auth-error" role="alert" style={{ margin: "1rem" }}>
          {error}
        </p>
      )}

      <div className="mainpage">
        <section className="column" aria-labelledby="overview-heading">
          <div className="holder overview">
            <h2 id="overview-heading">Upcoming</h2>
            {upcomingTasks.length === 0 ? (
              <p className="overview-empty">No upcoming tasks.</p>
            ) : (
              <ul>
                {upcomingTasks.map((task) => (
                  <li key={task.id} className={late(task) ? "late" : ""}>
                    {task.name}
                    {!inWeek(task)
                      ? ` · ${new Date(task.due).getMonth() + 1}/${new Date(
                          task.due
                        ).getDate()}`
                      : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="column" aria-labelledby="stats-heading">
          <div className="holder stats">
            <h2 id="stats-heading">Focus stats</h2>
            <SessionsGraph refreshTrigger={refreshTrigger} />
            <StreakDisplay refreshTrigger={refreshTrigger} />
          </div>

          <div className="holder">
            <h2>This week&apos;s tasks</h2>
            <button
              type="button"
              className="home-add-btn"
              onClick={() => setIsCreating(true)}
            >
              + Add task
            </button>
            <div className="tasks">
              <TaskList
                tasks={tasks}
                filter1={inWeek}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
              />
            </div>
            <Link to="/tasks" className="home-more-btn">
              See all tasks →
            </Link>
          </div>
        </section>

        <section className="column" aria-labelledby="progress-heading">
          <div className="holder prog">
            <h2 id="progress-heading" className="sr-only">
              Progress by task type
            </h2>
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
        </section>
      </div>

      <CreateTask
        open={isCreating}
        onClose={() => setIsCreating(false)}
        onCreate={createTask}
      />
    </>
  );
}

Home.propTypes = {
  refreshTrigger: PropTypes.number,
};

export default Home;