import "./nav-item.css";

function NavItem({ name, active = false, onClick }) {
  return (
    <div className={`nav-item ${name} ${active ? " active" : ""}`}>
      <a href={`/${name}`} onClick={onClick}>
        {name}
      </a>
    </div>
  );
}

export default NavItem;