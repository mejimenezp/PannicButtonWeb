import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/admin";
import "../assets/css/btadmin.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleMenuSelect = (option) => {
    setMenuOpen(false);
    if (option === "admin") {
      navigate("/admin");
    } else if (option === "logout") {
      logout();
      navigate("/login");
    }
  };

  return (
    <header className="header_section">
      <div className="header_top">
        <div className="container-fluid">
          <div className="contact_nav">
            {isLoggedIn ? (
              <div className="dropdown">
                <button onClick={() => setMenuOpen(!menuOpen)} className="admin-button">
                  <i className="fa fa-user-cog" aria-hidden="true"></i>
                  <span> Opciones ▼</span>
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleMenuSelect("admin")}>🔧 Panel Admin</button>
                    <button onClick={() => handleMenuSelect("logout")}>🚪 Cerrar Sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate("/login")} className="admin-button">
                <i className="fa fa-sign-in-alt" aria-hidden="true"></i>
                <span> Inicio de sesión</span>
              </button>
            )}

            <a href="mailto:soporte.botondepanico@gmail.com">
              <i className="fa fa-envelope" aria-hidden="true"></i>
              <span>Email: soporte@fte.com.co</span>
            </a>
          </div>
        </div>
      </div>

      <div className="header_bottom">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg custom_nav-container">
            <a className="navbar-brand" href="/">
              <span>PanicButton</span>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className=""> </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav">
              {!isLoggedIn && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/">Inicio</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/soporte">Soporte</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
