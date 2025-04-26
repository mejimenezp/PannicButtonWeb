import React from "react";
import "../assets/css/ContratoUsuario.css";

const ContratoUsuario = () => {
  return (
    <main className="contract-container">
      <div className="containerContrato">
        <h1 className="contract-title">Solicitud de Acceso como Usuario</h1>

        <p>
          Nuestra aplicación móvil de Botón de Pánico está diseñada para brindar asistencia inmediata en situaciones de emergencia. Al presionar el botón, se envía una alerta con tu ubicación a tus contactos de confianza o al personal autorizado.
        </p>

        <p>
          Este sistema está pensado para mejorar la seguridad de los usuarios, permitiéndoles pedir ayuda rápida en momentos críticos como robos, accidentes o amenazas.
        </p>

        <h2>¿Por qué necesitas aceptar el contrato?</h2>
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
          className="btn"
          download
        >
          Descargar Contrato de Uso (PDF)
        </a>

        <p className="contract-instruction">
  Luego de revisar el contrato y firmarlo, envíalo a nuestro correo <a href="mailto:soporte@fte.com.co">soporte@fte.com.co</a> y luego puedes continuar con el proceso de registro en la aplicación.
</p>

      </div>
    </main>
  );
};

export default ContratoUsuario;
