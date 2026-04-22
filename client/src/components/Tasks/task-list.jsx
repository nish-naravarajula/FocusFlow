import PropTypes from "prop-types";
import TaskItem from "./task-item";
import "./task-list.css";

function TaskList({
  tasks,
  filter1 = () => true,
  filter2 = () => true,
  toggleComplete,
  deleteTask,
}) {
  const visible = tasks.filter(filter1).filter(filter2);

  if (visible.length === 0) {
    return <p className="task-list-empty">No tasks to show.</p>;
  }

  return (
    <ul className="task-list">
      {visible.map((task) => (
        <li key={task.id} className="task-list-item">
          <TaskItem
            name={task.name}
            desc={task.desc}
            type={task.type}
            datetime={task.due}
            done={task.done}
            onToggle={() => toggleComplete(task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        </li>
      ))}
    </ul>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  filter1: PropTypes.func,
  filter2: PropTypes.func,
  toggleComplete: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};

export default TaskList;
