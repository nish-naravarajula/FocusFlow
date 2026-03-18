import { useEffect, useState } from "react";
import "./task-prog-bar.css";
import NavItem from "./nav-item";

const STORAGE_KEY = "focusFlow.activeTask";

function TaskBar() {
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? "TODO";
  });

  const navItems = ["Late", "TODO", "Done"];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeItem);
  }, [activeItem]);

  return (
    <div className="task-bar">
      {navItems.map((name) => (
        <NavItem
          key={name}
          name={name}
          active={activeItem === name}
          onClick={() => setActiveItem(name)}
        />
      ))}
    </div>
  );
}

TaskBar.propTypes = {};
export default TaskBar;
