import React from "react";

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <h2>Funciones Principales</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>📍 Ubicación en tiempo real</h3>
            <p>Envía tu ubicación exacta a tus contactos de confianza.</p>
          </div>
          <div className="feature-item">
            <h3>📩 Notificación instantánea</h3>
            <p>Envía un mensaje de alerta y correo a tus contactos.</p>
          </div>
          <div className="feature-item">
            <h3>🔐 Seguridad garantizada</h3>
            <p>Tus datos están protegidos y solo se comparten en emergencias.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
