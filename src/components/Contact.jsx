import React from "react";

const Contact = () => {
  return (
    <section className="contact">
      <div className="container">
        <h2>Contacto y Soporte</h2>
        <p>Si necesitas ayuda o tienes preguntas, contáctanos.</p>

        {/* Información de contacto */}
        <div className="contact-info">
          <p>
            <i className="fa fa-phone" aria-hidden="true"></i> Tel: +57 3185788810
          </p>
          <p>
            <i className="fa fa-envelope" aria-hidden="true"></i> Email: <a href="mailto:maurviam@yahoo.com">maurviam@yahoo.com</a>
          </p>
        </div>

        <form>
          <input type="text" placeholder="Nombre" required />
          <input type="email" placeholder="Correo electrónico" required />
          <textarea placeholder="Tu mensaje" required></textarea>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;