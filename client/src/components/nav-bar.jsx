import { useState } from "react";
import "./nav-bar.css";

function NavBar() {
  return (

    <div class="nav-bar">
      <div class="companyholder">
        <h1>Focus Flow</h1>
      </div>
      <div class="nav-item home active">
        <a href="/">Home</a>
      </div>
      <div class="nav-item focus">
        <a href="/focus">Focus</a>
      </div>
      <div class="nav-item tasks">
        <a href="/tasks">Tasks</a>
      </div>
      <div class="nav-item calendar">
        <a href="/calendar">Calendar</a>
      </div>
    </div>
  );
}

export default NavBar;
