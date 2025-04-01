import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, getUserContacts } from "../api/users";
import { getSupportUsers } from "../api/soporte"; // Importar la nueva función
import UserForm from "../components/UserForm";
import Modal from "../components/Modal";
import ActionModal from "../components/ActionModal"; 
import "../assets/css/admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userContacts, setUserContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionUser, setActionUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const role = localStorage.getItem("role"); // Obtener el rol del usuario
      let data;

      if (role === "support") { // Si es usuario de soporte
        data = await getSupportUsers();
      } else {
        data = await getUsers();
      }

      setUsers(data);
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen) setEditingUser(null);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setIsSidebarOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsSidebarOpen(true);
    setActionUser(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
      }
    }
    setActionUser(null);
  };

  const handleShowContacts = async (user) => {
    setSelectedUser(user);
    try {
      const contacts = await getUserContacts(user.Usua_Phone);
      setUserContacts(contacts);
      setIsModalOpen(true);
    } catch (error) {
      console.error("❌ Error al cargar contactos:", error);
    }
    setActionUser(null);
  };

  const openActionsModal = (user) => setActionUser(user);
  const closeActionsModal = () => setActionUser(null);

  return (
    <div className="admin-container">
      <h2>Administración de Usuarios</h2>

      <button className="btn btn-add" onClick={handleAddNew}>
        ➕ Agregar Usuario
      </button>

      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <button onClick={toggleSidebar} className="btn btn-close"></button>
        <UserForm
          loadUsers={loadUsers}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Servicio</th>
              <th>Departamento</th>
              <th>Área</th>
              <th>Ciudad</th>
              <th>Vereda</th>
              <th>Localidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.Usua_ID}>
                  <td title={user.Usua_Name}>{user.Usua_Name}</td>
                  <td>{user.Usua_Phone}</td>
                  <td title={user.Usua_Email}>{user.Usua_Email}</td>
                  <td>{user.Servicio || "No especificado"}</td>
                  <td>{user.Departamento || "No especificado"}</td>
                  <td>{user.Area || "No especificada"}</td>
                  <td>{user.Ciudad || "No especificada"}</td>
                  <td>{user.Vereda || "No especificada"}</td>
                  <td>{user.Localidad || "No especificada"}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-more"
                      onClick={() => openActionsModal(user)}
                    >
                      ⋮
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-users">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3>Contactos de {selectedUser?.Usua_Name}</h3>
          {userContacts.length > 0 ? (
            <ul>
              {userContacts.map((contact, index) => (
                <li key={index}>
                  📞 {contact.Cont_Name} - {contact.Cont_Phone} - {contact.Cont_Email}
                  <br />
                  🏷️ <strong>{contact.Grupo}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>Este usuario no tiene contactos asociados.</p>
          )}
        </Modal>
      )}

      <ActionModal
        user={actionUser}
        onClose={closeActionsModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShowContacts={handleShowContacts}
      />
    </div>
  );
};

export default Admin;
