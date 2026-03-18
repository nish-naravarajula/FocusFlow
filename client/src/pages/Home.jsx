import "./Home.css";
import TaskBar from "../components/Nav/task-prog-bar.jsx";
import TaskItem from "../components/Tasks/task-item.jsx";
import SessionsGraph from "../components/Sessions/SessionsGraph.jsx";
import StreakDisplay from "../components/Sessions/StreakDisplay.jsx";

function Home({ refreshTrigger }) {
  return (
    <>
      <div className="mainpage row">
        {/* OVERVIEW COL */}
        <div className="column holder overview col-3">
          <h2>Overview:</h2>
          <ul>
            <li>Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
            <li>Task 4</li>
            <li>Task 5</li>
            <li>Task 6</li>
            <li>Task 7</li>
            <li>Task 8</li>
            <li>Task 9</li>
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
            <div className="holder task">
              <h4>Task 1</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam
                nemo, non laudantium tempore soluta ipsam, veritatis
                perspiciatis ad in accusamus, rem neque optio voluptates aliquam
                fugiat! Ad eligendi ullam voluptatibus!
              </p>
            </div>
            <div className="holder more">
              <h5>More</h5>
            </div>
          </div>
        </div>

        {/* PROGRESS COL */}
        <div className="column holder prog col-3">
          <div className="prog-circle"></div>
          <TaskBar></TaskBar>
          <div className="task-items">
            <TaskItem
              name="task 1"
              desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit."
              complete="true"
            ></TaskItem>
            <TaskItem
              name="task 2"
              desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit."
            ></TaskItem>
            <TaskItem
              name="task 3"
              desc="Lorem ipsum dolor sit amet consectetur, adipisicing elit."
            ></TaskItem>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
