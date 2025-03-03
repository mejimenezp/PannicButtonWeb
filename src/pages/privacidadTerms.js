import React from "react";
import { Link } from "react-router-dom";



const Privacidad = () => {
  return (
    <>
      
      <main className="privacy-container">
        <div className="container">
          <h1 className="privacy-title">Política de Privacidad</h1>
          <p>
            En nuestra aplicación, valoramos tu privacidad. Aquí te explicamos cómo manejamos tu información.
          </p>
          <h2>1. Información que recopilamos</h2>
          <p>Recopilamos tu nombre, número de teléfono y ubicación para garantizar tu seguridad en emergencias.</p>
          
          <h2>2. Uso de la información</h2>
          <p>Tu información solo se usa para enviar alertas de emergencia a tus contactos de confianza.</p>
          
          <h2>3. Seguridad</h2>
          <p>Mantenemos medidas de seguridad estrictas para proteger tu información personal.</p>
          
          <h2>4. Contacto</h2>
          <p>Si tienes preguntas sobre nuestra política de privacidad, contáctanos en <a href="mailto:soporte@botondepanico.com">soporte@botondepanico.com</a>.</p>
          
          <div className="back-button">
            <Link to="/" className="btn">Volver al inicio</Link>
          </div>
        </div>
      </main>
      
    </>
  );
};

export default Privacidad;
