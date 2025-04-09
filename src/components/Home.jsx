import React from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import imagen1 from "../assets/images/imagen1.PNG";
import imagen3 from "../assets/images/imagen3.PNG";
import imagen4 from "../assets/images/imagen4.PNG";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

const Home = () => {
  return (
    <header className="header">
      <div className="container">
        {/* Título y Logo */}
        <div className="title-container">
          <h1 className="title">Botón de Pánico</h1>
         
        </div>

        {/* Descripción */}
        <p className="app-description">
          Una aplicación diseñada para brindarte ayuda en situaciones de emergencia.
        </p>

        {/* Carrusel de imágenes */}
        <div className="carousel-container">
          
          <Slider {...settings} className="app-carousel">
            {[imagen1, imagen3, imagen4].map((img, index) => (
              <div key={index} className="carousel-slide">
                <img src={img} alt={`Captura ${index + 1}`} className="carousel-img" />
              </div>
            ))}
          </Slider>
        </div>

        {/* Disponibilidad */}
        <p className="available-text">
          Ya disponible en <strong>Android</strong><br />
        ⏳ Próximamente disponible para <strong>iOS y Android</strong>.
        </p>

      </div>
    </header>
  );
};

export default Home;
