import React from "react";
import { Link } from "react-router-dom";
import aboutImage from "../assets/images/BAnner.png";

const About = () => {
  return (
    <section className="about_section layout_padding">
      <div className="container">
        <div className="row">
          {/* Texto y botón */}
          <div className="col-lg-5 col-md-6">
            <div className="detail-box fade-in">
              <Link to="/privacidad" className="btn">
                Más Información
              </Link>
              <h2>¿Qué es el Botón de Pánico?</h2>
              <p>
                Nuestra aplicación te permite enviar alertas de emergencia con tu ubicación en tiempo real a tus contactos de confianza.  
                Diseñada para brindarte seguridad en situaciones críticas.
              </p>
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
