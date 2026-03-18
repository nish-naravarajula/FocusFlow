import { useState } from "react";
import "./App.css";
import NavBar from "./components/Nav/nav-bar.jsx";
import TaskBar from "./components/Nav/task-prog-bar.jsx";
import TaskItem from "./components/Tasks/task-item.jsx";

function App() {
  return (
    <>
      <NavBar />
      <div class="container">
        <div class="mainpage row">
          <div class="column holder overview col-3">
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
          <div class="column col-6">
            <div class="holder stats">
              {/* TODO GRAPH STATS */}
              <h2>Focus Stats</h2>
            </div>
            <div class="tasks holder">
              <div class="holder task">
                <h4>Task 1</h4>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam
                  nemo, non laudantium tempore soluta ipsam, veritatis
                  perspiciatis ad in accusamus, rem neque optio voluptates
                  aliquam fugiat! Ad eligendi ullam voluptatibus!
                </p>
              </div>
              <div class="holder more">
                <h5>More</h5>
              </div>
            </div>
          </div>
          <div class="column holder prog col-3">
            {/* TODO: PROGRESS CIRCLE */}
            <div class="prog-circle"></div>
            <TaskBar></TaskBar>
            <div class="task-items">
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
      </div>
    </>
  );
}

export default App;
