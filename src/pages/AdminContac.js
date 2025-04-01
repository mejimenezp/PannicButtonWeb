import React, { useEffect, useState } from "react";
import { getContacts, deleteContact} from "../api/contacts";
import { getSupportContacts} from "../api/soporte";
import ContactForm from "../components/ContactForm";
import "../assets/css/admin.css";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Carga inicial de contactos
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const role = localStorage.getItem("role"); // Obtener el rol del usuario
      let data;

      if (role === "support") { // Si es un usuario de soporte
        data = await getSupportContacts(); // Llama a la nueva función con cont_id
      } else {
        data = await getContacts(); // Obtiene todos los contactos para otros roles
      }

      setContacts(data);
    } catch (error) {
      console.error("❌ Error al cargar contactos:", error);
    }
  };

  // Control de la barra lateral
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleAddNew = () => {
    setEditingContact(null);
    setIsSidebarOpen(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsSidebarOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este contacto?")) {
      try {
        await deleteContact(id);
        loadContacts();
      } catch (error) {
        console.error("❌ Error al eliminar contacto:", error);
      }
    }
  };

  return (
    <div className="admin-container">
      <h2>Administración de Contactos</h2>

      {/* Botón para agregar nuevo contacto */}
      <button className="btn btn-add" onClick={handleAddNew}>
        ➕ Agregar Contacto
      </button>

      {/* Barra lateral con formulario */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <button onClick={toggleSidebar} className="btn btn-close"></button>
        <ContactForm
          loadContacts={loadContacts}
          editingContact={editingContact}
          setEditingContact={setEditingContact}
        />
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
              <th>Departamento</th>
              <th>Área</th>
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
                  <td title={contact.Cont_Name}>{contact.Cont_Name}</td>
                  <td>{contact.Cont_Phone}</td>
                  <td title={contact.Cont_Email}>{contact.Cont_Email}</td>
                  <td>{contact.TipoContacto || "No especificado"}</td>
                  <td>{contact.Departamento || "No especificado"}</td>
                  <td>{contact.Area || "No especificada"}</td>
                  <td>{contact.Ciudad || "No especificada"}</td>
                  <td>{contact.Vereda || "No especificada"}</td>
                  <td>{contact.Localidad || "No especificada"}</td>
                  <td>
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(contact)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(contact.Cont_ID)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-contacts">
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
