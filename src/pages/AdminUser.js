import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, getUserContacts } from "../api/users";
import { getSupportUsers } from "../api/soporte";
import UserForm from "../components/UserForm";
import SupportUserForm from "../components/SupportUserForm";
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
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = isSupport ? await getSupportUsers(currentUserServId) : await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      alert("Error al cargar usuarios");
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
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No tienes permisos para esta acción");
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
      console.error("Error al cargar contactos:", error);
    }
    setActionUser(null);
  };

  const openActionsModal = (user) => setActionUser(user);
  const closeActionsModal = () => setActionUser(null);

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
          El usuario soporte tiene el tipo de servico: {localStorage.getItem("serv_name")}
        </p>
      )}


      {/* Mostrar botón solo para admin */}
     
        <button className="btn btn-add" onClick={handleAddNew}>
          ➕ Agregar Usuario
        </button>
      

      {/* Sidebar con formulario */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
      {!isSupport && (
      <button 
      onClick={toggleSidebar} 
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
          <SupportUserForm
            loadUsers={loadUsers}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            closeForm={() => setIsSidebarOpen(false)}
            userLevels={currentUserLevels}
          />
        ) : (
          <UserForm
            loadUsers={loadUsers}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            closeForm={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* Tabla de usuarios */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Servicio</th>
              {!isSupport && <th>Departamento</th>}
              {!isSupport && <th>Área</th>}
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
                  {!isSupport && <td>{user.Departamento || "No especificado"}</td>}
                  {!isSupport && <td>{user.Area || "No especificada"}</td>}
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
                <td colSpan={isSupport ? 8 : 10} className="no-users">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de contactos */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3>Contactos de {selectedUser?.Usua_Name}</h3>
          {userContacts.length > 0 ? (
            <ul className="contacts-list">
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

      {/* Modal de acciones */}
      <ActionModal
        user={actionUser}
        onClose={closeActionsModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShowContacts={handleShowContacts}
        isSupport={isSupport}
        currentUserServId={currentUserServId}
      />
    </div>
  );
};

export default Admin;