import React, { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../api/contacts";
import { getSupportContacts } from "../api/soporte";
import ContactForm from "../components/ContactForm";
import SupportContactForm from "../components/SupportContactForm";
import "../assets/css/admin.css";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [actionContact, setActionContact] = useState(null);

  // Obtener información del usuario actual
  const currentUserRole = localStorage.getItem("role");
  const isSupport = currentUserRole === "support";
  const currentUserServId = parseInt(localStorage.getItem("serv_id") || "0");
  const currentUserLevels = {
    serv_id: currentUserServId,
    serv_name: localStorage.getItem("serv_name"),
    dpto_id: localStorage.getItem("Dpto_ID"),
    area_id: localStorage.getItem("Area_ID"),
    ciud_id: localStorage.getItem("Ciud_ID"),
    vere_id: localStorage.getItem("Vere_ID"),
    loca_id: localStorage.getItem("Loca_ID")
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = isSupport ? await getSupportContacts(currentUserServId) : await getContacts();
      setContacts(data);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
      alert("Error al cargar contactos");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen) setEditingContact(null);
  };

  const handleCloseForm = () => {
    setEditingContact(null);
    setIsSidebarOpen(false);
  };
  

  const handleAddNew = () => {
    setEditingContact(null);
    setIsSidebarOpen(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsSidebarOpen(true);
    setActionContact(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este contacto?")) return;
    
    try {
      await deleteContact(id);
      loadContacts();
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      alert("No tienes permisos para esta acción");
    }
    setActionContact(null);
  };

  return (
    <div className="admin-container">
      <h2>
        {isSupport
          ? "Administración de Usuarios (Soporte)"
          : "Administración de Usuarios"}
      </h2>

      {/* Mostrar el nombre del servicio si existe */}
      {isSupport && localStorage.getItem("serv_name") && (
        <p style={{ marginTop: "-10px", marginBottom: "15px", fontWeight: "500", color: "#444" }}>
          El usuario soporte tiene el tipo de servicio: {localStorage.getItem("serv_name")}
        </p>
      )}


      {/* Mostrar botón solo para admin */}
      
        <button className="btn btn-add" onClick={handleAddNew}>
          ➕ Agregar Contacto
        </button>
      

      {/* Sidebar con formulario */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
      {!isSupport && (
      <button 
      onClick={handleCloseForm} 
      className="btn btn-close" 
      style={{
        background: "none",
        border: "none",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        color: "#333"
      }}
    >
      Cerrar <span style={{ color: "red" }}>❌</span>
    </button>
    )}


        
        {/* Seleccionar formulario basado en rol */}
        {isSupport ? (
          <SupportContactForm
            loadContacts={loadContacts}
            editingContact={editingContact}
            setEditingContact={setEditingContact}
            closeForm={() => setIsSidebarOpen(false)}
            userLevels={currentUserLevels}
          />
        ) : (
          <ContactForm
            loadContacts={loadContacts}
            editingContact={editingContact}
            setEditingContact={setEditingContact}
            closeForm={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* Tabla de contactos */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Tipo de Contacto</th>
              {!isSupport && <th>Departamento</th>}
              {!isSupport && <th>Área</th>}
              <th>Ciudad</th>
              <th>Vereda</th>
              <th>Localidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact.Cont_ID}>
                  <td>{contact.Cont_Name}</td>
                  <td>{contact.Cont_Phone}</td>
                  <td>{contact.Cont_Email}</td>
                  <td>{contact.TipoContacto || "No especificado"}</td>
                  {!isSupport && <td>{contact.Departamento || "No especificado"}</td>}
                  {!isSupport && <td>{contact.Area || "No especificada"}</td>}
                  <td>{contact.Ciudad || "No especificada"}</td>
                  <td>{contact.Vereda || "No especificada"}</td>
                  <td>{contact.Localidad || "No especificada"}</td>
                  <td className="actions-cell">
                    <button className="btn btn-edit" onClick={() => handleEdit(contact)}>✏️</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(contact.Cont_ID)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isSupport ? 8 : 10} className="no-contacts">
                  No hay contactos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContacts;
