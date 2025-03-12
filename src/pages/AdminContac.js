import React, { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../api/contacts";
import ContactForm from "../components/ContactForm";
import "../assets/css/admin.css";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error("❌ Error al cargar contactos:", error);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
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

      {/* Formulario para agregar/editar contacto */}
      <ContactForm loadContacts={loadContacts} editingContact={editingContact} setEditingContact={setEditingContact} />

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
                  <td>{contact.Cont_Name}</td>
                  <td>{contact.Cont_Phone}</td>
                  <td>{contact.Cont_Email}</td>
                  <td>{contact.TipoContacto || "No especificado"}</td>
                  <td>{contact.Departamento || "No especificado"}</td>
                  <td>{contact.Area || "No especificada"}</td>
                  <td>{contact.Ciudad || "No especificada"}</td>
                  <td>{contact.Vereda || "No especificada"}</td>
                  <td>{contact.Localidad || "No especificada"}</td>
                  <td>
                    <button className="btn btn-edit" onClick={() => handleEdit(contact)}>✏️ Editar</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(contact.Cont_ID)}>🗑 Eliminar</button>
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
