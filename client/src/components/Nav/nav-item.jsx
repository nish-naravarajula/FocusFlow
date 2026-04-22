import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./nav-item.css";

function NavItem({ name, active = false }) {
  const path = `/${name.toLowerCase()}`;

  return (
    <li className="nav-item">
      <Link
        to={path}
        className={`nav-link ${active ? "active" : ""}`}
        aria-current={active ? "page" : undefined}
      >
        {name}
      </Link>
    </li>
  );
}

NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default NavItem;
