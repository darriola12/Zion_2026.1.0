import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [openData, setOpenData] = useState(false);
  const location = useLocation();

  // Abrir el dropdown automáticamente si estamos en /data/*
  const isDataRoute = location.pathname.startsWith("/data");

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">ZION TIES LLC</div>

      <nav className="sidebar__nav">
        <NavLink to="/" end className="sidebar__link">
          Home
        </NavLink>

        <NavLink to="/orders" className="sidebar__link">
          Orders
        </NavLink>

        <NavLink to="/analytics" className="sidebar__link">
          Analytics
        </NavLink>

        {/* DATA DROPDOWN */}
        <button
          className={`sidebar__link sidebar__dropdown-btn ${
            openData || isDataRoute ? "sidebar__link--active" : ""
          }`}
          onClick={() => setOpenData(!openData)}
        >
          Data
          <span className={`sidebar__arrow ${openData ? "open" : ""}`}>
            ▾
          </span>
        </button>

        {(openData || isDataRoute) && (
          <div className="sidebar__dropdown">
            <NavLink
              to="/data/missions"
              className="sidebar__sublink"
            >
              Missions
            </NavLink>

            <NavLink
              to="/data/customers"
              className="sidebar__sublink"
            >
              Customers
            </NavLink>
          </div>
        )}
      </nav>

      <div className="sidebar__footer">© 2025 ZION TIES LLC </div>
    </aside>
  );
};

export default Sidebar;
