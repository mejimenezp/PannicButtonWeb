import React from "react";
import "../assets/css/modal.css"; // Asegúrate de tener estilos para el modal

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ❌
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
