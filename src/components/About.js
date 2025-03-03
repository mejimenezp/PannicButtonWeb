import React from "react";
import { Link } from "react-router-dom";
import aboutImage from "../assets/images/BAnner.png";


const About = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  };

  return (
    <section className="about_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-6">
            <div className="detail-box">
              <h2>¿Qué es el Botón de Pánico?</h2>
              <p>
                Nuestra aplicación te permite enviar alertas de emergencia con 
                tu ubicación en tiempo real a tus contactos de confianza. 
                Diseñada para brindarte seguridad en situaciones críticas.
              </p>
              <Link to="/privacidad" className="btn">Más Información</Link>
            </div>
          </div>

          <div className="col-lg-7 col-md-6">
            <div className="img-box">
              <img src={aboutImage} alt="Botón de Pánico" />
            </div>
          </div>
        </div>

    
      </div>
    </section>
  );
};

export default About;
