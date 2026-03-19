import PropTypes from "prop-types";
import TaskItem from "./task-item";
import "./task-nav.css";

function TaskList({
  tasks,
  filter1 = () => true,
  filter2 = () => true,
  toggleComplete,
  deleteTask,
}) {
  return (
    <>
      {tasks
        .filter(filter1)
        .filter(filter2)
        .map((task) => (
          <TaskItem
            key={task.id}
            name={task.name}
            desc={task.desc}
            type={task.type}
            datetime={task.due}
            done={task.done}
            Finish={() => toggleComplete(task.id)}
            Delete={() => deleteTask(task.id)}
          />
        ))}
    </>
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
