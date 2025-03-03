import React from "react";

const Header = () => {
  return (
    <header className="header_section">
      <div className="header_top">
        <div className="container-fluid">
          <div className="contact_nav">
            <a href="tel:+573001234567">
              <i className="fa fa-phone" aria-hidden="true"></i>
              <span>Emergencia: +57 300 123 4567</span>
            </a>
            <a href="mailto:soporte@panicbutton.com">
              <i className="fa fa-envelope" aria-hidden="true"></i>
              <span>Email: soporte@panicbutton.com</span>
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
                  <a className="nav-link" href="/">Inicio</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/registro">Registro</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/contactos">Contactos</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/configuracion">Configuración</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
