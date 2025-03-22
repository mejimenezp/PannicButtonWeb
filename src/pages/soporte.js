import React from "react";
import { Link } from "react-router-dom";

const Soporte = () => {
  return (
    <>
      <main className="support-container">
        <div className="container">
          <h1 className="support-title">Centro de Soporte</h1>
          <p>Bienvenido a nuestro centro de soporte. Aquí encontrarás respuestas a preguntas frecuentes y cómo contactarnos.</p>
          
          <h2>Preguntas Frecuentes</h2>
          <h3>1. ¿Cómo funciona la aplicación?</h3>
          <p>La aplicación permite enviar alertas de emergencia a los contactos de confianza del usuario con solo presionar un botón.</p>
          
          <h3>2. ¿Cómo se valida un número de teléfono?</h3>
          <p>Al descargar la aplicación, se solicita el número de teléfono únicamente para validar si ya está registrado en nuestra base de datos.</p>
          
          <h3>3. ¿Cómo se gestionan los contactos de emergencia?</h3>
          <p>La lista de contactos de emergencia está predefinida y únicamente el administrador tiene acceso para gestionarla.</p>
          
          <h3>4. ¿Quién puede crear usuarios y contactos?</h3>
          <p>Solo el administrador tiene permisos para crear y administrar usuarios y contactos dentro de la aplicación.</p>
          
          <h3>5. ¿La aplicación funciona sin conexión a internet?</h3>
          <p>Para acceder y utilizar todas las funcionalidades de la aplicación, es indispensable contar con una conexión a internet.</p>
          
          <h2>Contacto</h2>
          <p>Si necesitas asistencia, puedes comunicarte con nosotros a través de los siguientes medios:</p>
          <ul>
            <li>Correo electrónico: <a href="mailto:soporte@fte.com.co">soporte@fte.com.co</a></li>
            <li>Teléfono: +57 3057101857</li>
            <li>Dirección:Carrera 18 # 15-25  socorro Santander</li>
          </ul>
          
          <div className="back-button">
            <Link to="/" className="btn">Volver al inicio</Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Soporte;
