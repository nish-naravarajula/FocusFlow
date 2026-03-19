import TaskItem from "./task-item";
import "./task-nav.css";

function TaskList({
  tasks,
  filter1 = () => {
    return true;
  },
  filter2 = () => {
    return true;
  },
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
            datetime={task.due}
            done={task.done}
            Finish={() => toggleComplete(task.id)}
            Delete={() => deleteTask(task.id)}
          />
        ))}
    </>
  );
}

export default TaskList;
