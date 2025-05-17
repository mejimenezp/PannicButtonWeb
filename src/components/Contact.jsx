import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

function Contact() {
  const [state, handleSubmit] = useForm("xkgryvry");

  if (state.succeeded) {
    return <p className="success-message">¡Mensaje enviado con éxito! Te responderemos pronto.</p>;
  }

  return (
    <section className="contact">
      <div className="container">
        <h2>Contacto y Soporte</h2>
        <p>Si necesitas ayuda o tienes preguntas, contáctanos.</p>

        <div className="contact-info">
          <p><i className="fa fa-phone" aria-hidden="true"></i> Tel: +57 3185788810</p>
          <p><i className="fa fa-envelope" aria-hidden="true"></i> Email: <a href="mailto:maurviam@yahoo.com">maurviam@yahoo.com</a></p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            required
          />
          <ValidationError prefix="Nombre" field="name" errors={state.errors} />

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} />

          <textarea
            id="message"
            name="message"
            placeholder="Tu mensaje"
            required
          />
          <ValidationError prefix="Mensaje" field="message" errors={state.errors} />

          <button type="submit" disabled={state.submitting}>
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
