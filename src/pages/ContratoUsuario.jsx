import React from "react";
import "../assets/css/ContratoUsuario.css";

const ContratoUsuario = () => {
  return (
    <main className="contract-container">
      <div className="containerContrato">
        <h1 className="contract-title">Como acceder al servicio?</h1>

        <p>
          Nuestra aplicación móvil de Botón de Pánico está diseñada para brindar asistencia inmediata en situaciones de emergencia. Al presionar el botón, se envía una alerta con tu ubicación a tus contactos de confianza o al personal autorizado.
        </p>

        <p>
          Este sistema está pensado para mejorar la seguridad de los usuarios, permitiéndoles pedir ayuda rápida en momentos críticos como robos, accidentes o amenazas.
        </p>


        <p>
          Antes de usar la aplicación, es necesario que leas y aceptes los términos legales que regulan su uso. Este contrato define tus derechos, responsabilidades y cómo se maneja tu información dentro de la plataforma.
        </p>

        <p>
          La aceptación del contrato es un requisito obligatorio para poder registrarte y utilizar la aplicación.
        </p>

        <a
          href="/documentos/CONTRATO_USO_LICENCIA.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="boton"
          download
        >
          Descargar Contrato de Uso
        </a>

        <p className="contract-instruction">
        Una vez revises y firmes el contrato, envíalo a nuestro correo <a href="mailto:soporte@fte.com.co">soporte@fte.com.co</a>. Después de enviarlo, recibirás las instrucciones para descargar e instalar  al Botón de Pánico en tu teléfono móvil.
</p>

      </div>
    </main>
  );
};

export default ContratoUsuario;
