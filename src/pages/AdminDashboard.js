import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/admin.css";
import { getSupportUsers } from "../api/soporte";
import AzureMapaUsuarios from "../components/MapaUser"; // Asegúrate de usar el nombre correcto

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUserRole = localStorage.getItem("role");
  const isSupport = currentUserRole === "support";

  const [usuariosSoporte, setUsuariosSoporte] = useState([]);

  useEffect(() => {
    const fetchSupportUsers = async () => {
      try {
        const currentUserServId = localStorage.getItem("servId");
        const data = await getSupportUsers(currentUserServId);
        console.log("Usuarios de soporte:", data);
        setUsuariosSoporte(data);
      } catch (error) {
        console.error("Error al obtener usuarios de soporte:", error);
      }
    };

    if (isSupport) {
      fetchSupportUsers();
    }
  }, [isSupport]);

  return (
    <div className="admin-dashboard">
      <h2>
        {isSupport
          ? "Panel de Administración (Soporte)"
          : "Panel de Administración"}
      </h2>

      <div className="admin-options">
        <button
          className="btn btn-users"
          onClick={() => navigate("/adminUsers")}
        >
          👥 Gestionar Usuarios
        </button>
        <button
          className="btn btn-contacts"
          onClick={() => navigate("/adminContacts")}
        >
          📞 Gestionar Contactos
        </button>
      </div>

      {/* Mostrar el mapa solo si es soporte */}
      {isSupport && usuariosSoporte.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Ubicación de usuarios asignados</h3>
          <AzureMapaUsuarios
            usuarios={usuariosSoporte}
            azureMapsKey="9r3EMmW6nr0CwbibwdNYrhAqBnsUEDdrp1a0EdeXgSyb63b2vio9JQQJ99BDACYeBjFNWioQAAAgAZMP2PbD"
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
