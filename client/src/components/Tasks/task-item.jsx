import PropTypes from "prop-types";
import "./task-item.css";

function TaskItem({
  name = "task",
  desc = "not found",
  datetime = new Date(),
  done = false,
  onClick
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
  let btnText = "Finish"
  if (currTime.valueOf() > time) {
    status = "Late";
  }

  if (done) {
    status = "Done";
    btnText = "Drop"
  }

  return (
    <div class="item">
      <p>
        {name} • {status}
      </p>
      <p class="desc">{desc}</p>
      <btn class="finish" onClick={onClick}>
        {btnText}
      </btn>
    </div>
  );
}

TaskItem.propTypes = {
  name: PropTypes.string,
  desc: PropTypes.string,
  datetime: PropTypes.instanceOf(Date),
  done: PropTypes.bool,
  onClick: PropTypes.func,
};

export default TaskItem;
