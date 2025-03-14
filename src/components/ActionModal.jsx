import React from "react";
import "../assets/css/modal.css";

const ActionModal = ({ user, onClose, onEdit, onDelete, onShowContacts }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Acciones para {user.Usua_Name}</h3>
        <button onClick={() => onEdit(user)}>✏️ Editar</button>
        <button onClick={() => onDelete(user.Usua_ID)}>🗑 Eliminar</button>
        <button onClick={() => onShowContacts(user)}>📇 Ver contactos</button>
        <button className="btn-close" onClick={onClose}>
          ❌ Cerrar
        </button>
      </div>
    </div>
  );
};

export default ActionModal;
