import React from "react";
import { Link } from "react-router-dom";
import Soporte from "../pages/soporte";

const Header = () => {
  return (
    <header className="header_section">
      <div className="header_top">
        <div className="container-fluid">
          <div className="contact_nav">
            <a href="tel:+573001234567">
              <i className="fa fa-phone" aria-hidden="true"></i>
            </a>
            <a href="mailto:soporte.botondepanico@gmail.com">
              <i className="fa fa-envelope" aria-hidden="true"></i>
              <span>Email: soporte.botondepanico@gmail.com</span>
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
                <li className="nav-item">
                  <Link className="nav-link" to="/">Inicio</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/soporte">Soporte</Link>
                </li>
              </ul>
              <Link to="/soporte" className="btn btn-support">Soporte</Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
