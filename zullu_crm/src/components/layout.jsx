import React, { useState } from "react";
import "./layout.scss";
import { useNavigate, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false); // close drawer on mobile
  };

  return (
    <div className="layout">
      {/* Overlay (mobile) */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <h2>Zullu CRM</h2>

        <ul>
          <li
            className={location.pathname === "/home" ? "active" : ""}
            onClick={() => handleNavigate("/home")}
          >
            Home
          </li>

          <li
            className={location.pathname === "/users" ? "active" : ""}
            onClick={() => handleNavigate("/users")}
          >
            Users
          </li>

          <li
            className={location.pathname === "/transactions" ? "active" : ""}
            onClick={() => handleNavigate("/transactions")}
          >
            Transactions
          </li>
        </ul>
      </div>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          {/* Hamburger */}
          <div className="menu-icon" onClick={() => setOpen(true)}>
            ☰
          </div>

          <h3>{location.pathname.replace("/", "").toUpperCase()}</h3>

          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
