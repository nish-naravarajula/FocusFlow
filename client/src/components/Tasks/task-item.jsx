import "./task-item.css";

function TaskItem({
  name = "task",
  desc = "not found",
  datetime = new Date(),
  type = "work",
  done = false,
  Finish,
  Delete,
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

  const currTime = new Date();
  const time = new Date(datetime);

  let status = weekday[time.getDay()];
  let btnText = "Finish";
  if (currTime.valueOf() > time) {
    status = "Late";
  }

  if (done) {
    status = "Done";
    btnText = "Drop";
  }

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const inWeek = () => {
    const due = time.valueOf();
    return due >= startOfWeek.valueOf() && due < endOfWeek.valueOf();
  };

  if (!inWeek()) {
    status = `${status} ${time.getMonth() + 1}/${time.getDate()}/${time.getFullYear()}`;
  }

  return (
    <div className="item">
      <p>
        {name} • {status}
      </p>
      <p>{type}</p>
      <p className="desc">{desc}</p>
      <button className="button finish" onClick={Finish}>
        {btnText}
      </button>
      <button className="button delete" onClick={Delete}>
        Delete
      </button>
    </div>
  );
}

export default TaskItem;
