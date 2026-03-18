import "./task-item.css";

function TaskItem({
  name = "task",
  desc = "not found",
  datetime = new Date(),
  complete = false,
}) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currTime = new Date();
  let time = new Date(datetime);

  let status = weekday[time.getDay()];
  if (currTime.valueOf < time) {
    status = "Late";
  }

  if (complete) {
    status = "Done";
  }

  return (
    <div class="item">
      <p>
        {name} • {status}
      </p>
      <p>{desc}</p>
    </div>
  );
}

export default TaskItem;
