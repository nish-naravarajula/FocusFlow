import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./nav-item.css";

function NavItem({ name, active = false }) {
  const path = `/${name.toLowerCase()}`;

  return (
    <div className={`nav-item ${name} ${active ? "active" : ""}`}>
      <Link to={path}>{name}</Link>
    </div>
  );
}

NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

NavItem.defaultProps = {
  active: false,
};

export default NavItem;
