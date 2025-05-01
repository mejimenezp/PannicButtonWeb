import React from "react";
import { Link } from "react-router-dom";
import aboutImage from "../assets/images/BAnner.png";
import LogoFundacion from "../assets/images/banner_mobiler.png";
import "../assets/css/about.css";

const About = () => {
  return (
    <section className="about_section layout_padding">
      <div className="container">
        <div className="row">
          {/* Texto y botón */}
          <div className="col-lg-5 col-md-6">
            <div className="detail-box fade-in" style={{ position: "relative", textAlign: "center" }}>
              <a 
                href="https://www.fte.com.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="logo-link"
              >
                <img 
                  src={LogoFundacion} 
                  alt="Logo Fundación Transparencia Electoral" 
                  className="logo-fundacion"
                />
              </a>
              <h2>¿Qué es el Botón de Pánico?</h2>
              <p>
              Nuestra aplicación te permite enviar alertas de emergencia desde tu celular Androi y Iphone con sólo presionar un botón puedes enviar tu ubicación en tiempo real a tus contactos de confianza para hacerles saber que te encuentras en una situacion de emergencia. Diseñada para brindarte seguridad en situaciones críticas. Desarrollada por <strong>la Fundación Transparencia Electoral</strong>.
              </p>
              <Link to="/contrato-usuario" className="btn">
              ¿Mas informacion?
              </Link>
            </div>
          </div>

          {/* Imagen */}
          <div className="col-lg-7 col-md-6">
            <div className="app-carousel fade-in">
              <img src={aboutImage} alt="Botón de Pánico" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
