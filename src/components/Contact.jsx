import React from "react";


const Contact = () => {
  return (
    <section className="contact">
      <div className="container">
        <h2>Contacto y Soporte</h2>
        <p>Si necesitas ayuda o tienes preguntas, contáctanos.</p>
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
