import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./nav-bar.css";
import NavItem from "./nav-item";

function NavBar({ user = null, onLogout = () => {} }) {
  const location = useLocation();
  const navItems = ["Home", "Focus", "Tasks"];

  const getActivePage = () => {
    const path = location.pathname.slice(1);
    return path.charAt(0).toUpperCase() + path.slice(1) || "Home";
  };

  return (
<<<<<<< HEAD
    <nav className="nav-bar" aria-label="Primary">
      <div className="nav-brand">
        <span className="nav-logo" aria-hidden="true">
          ◐
        </span>
        <span className="nav-brand-name">FocusFlow</span>
=======
    <nav className="nav-bar">
      <div className="companyholder">
        <h1>Focus Flow</h1>
>>>>>>> f8d8ce6f84a34b501541e3da6da3a0c323e07526
      </div>

      <ul className="nav-list">
        {navItems.map((name) => (
          <NavItem key={name} name={name} active={getActivePage() === name} />
        ))}
      </ul>

      {user && (
        <div className="nav-user">
          <span className="nav-user-name">{user.username}</span>
          <button
            type="button"
            className="nav-logout"
            onClick={onLogout}
            aria-label="Log out of your account"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

NavBar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
  onLogout: PropTypes.func,
};

export default NavBar;
