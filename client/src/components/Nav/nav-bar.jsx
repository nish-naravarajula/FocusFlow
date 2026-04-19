import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./nav-bar.css";
import NavItem from "./nav-item";

function NavBar({ user, onLogout }) {
  const location = useLocation();
  const navItems = ["Home", "Focus", "Tasks"];

  const getActivePage = () => {
    const path = location.pathname.slice(1); // remove leading /
    return path.charAt(0).toUpperCase() + path.slice(1) || "Home";
  };

  return (
    <nav className="nav-bar">
      <div className="companyholder">
        <h1>Focus Flow</h1>
      </div>

      {navItems.map((name) => (
        <NavItem key={name} name={name} active={getActivePage() === name} />
      ))}

      {user && (
        <div className="nav-user">
          <span>{user.username}</span>
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

NavBar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

NavBar.defaultProps = {
  user: null,
  onLogout: () => {},
};

export default NavBar;
