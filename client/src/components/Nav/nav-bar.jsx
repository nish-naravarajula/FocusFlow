import { useEffect, useState } from "react";
import "./nav-bar.css";
import NavItem from "./nav-item";

const STORAGE_KEY = "focusFlow.activeNav";

function NavBar() {
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) ?? "Home";
  });

  const navItems = ["Home", "Focus", "Tasks", "Calendar"];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeItem);
  }, [activeItem]);

  return (
    <div className="nav-bar">
      <div className="companyholder">
        <h1>Focus Flow</h1>
      </div>

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

export default NavBar;
