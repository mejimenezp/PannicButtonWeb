import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/users";
import UserForm from "../components/UserForm";
import "../assets/css/admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  
    // Limpia el formulario al cerrar
    if (isSidebarOpen) setEditingUser(null);
  };
  

  const handleAddNew = () => {
    setEditingUser(null);
    setIsSidebarOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsSidebarOpen(true);
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
  };

  return (
    <div className="admin-container">
      <h2>Administración de Usuarios</h2>

      {/* Botón para agregar nuevo usuario */}
      <button className="btn btn-add" onClick={handleAddNew}>
        ➕ Agregar Usuario
      </button>

      {/* Barra lateral con formulario */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <button onClick={toggleSidebar} className="btn btn-close">
        </button>
        <UserForm
          loadUsers={loadUsers}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
        />
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
                  <td>
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(user.Usua_ID)}
                    >
                      🗑
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
    </div>
  );
};

export default Admin;
