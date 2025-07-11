import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/admin.css";
import { getSupportUsers } from "../api/soporte";
import MapaUsuarios from "../components/MapaUser";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUserRole = localStorage.getItem("role");
  const isSupport = currentUserRole === "support";

  const [usuariosSoporte, setUsuariosSoporte] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchSupportUsers = async () => {
      try {
        const currentUserServId = localStorage.getItem("servId");
        const data = await getSupportUsers(currentUserServId);
        console.log("Usuarios de soporte:", data);
        setUsuariosSoporte(data);
      } catch (error) {
        console.error("Error al obtener usuarios de soporte:", error);
      } finally {
        setLoading(false); 
      }
    };

    if (isSupport) {
      fetchSupportUsers();
    } else {
      setLoading(false); 
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
        <button
          className="btn btn-geo"
          onClick={() => navigate("/adminGeo")}
        >
          🌐 Gestionar Localizaciones
        </button>

          <button
            className="btn btn-mail"
            onClick={() => navigate("/EnvioCorreos")}
          >
            📧 Envío de Correo
          </button>
        
          <button
            className="btn btn-mail"
            onClick={() => navigate("/EnvioSms")}
          >
            📧 Envío de SMS
          </button>

      </div>
      

      {isSupport && (
  <div style={{ marginTop: "2rem" }}>
    <h3>Ubicación de usuarios asignados</h3>
    {loading ? (
      <div
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: "#555",
        }}
      >
        Cargando usuarios...
      </div>
    ) : usuariosSoporte.length > 0 ? (
      <div className="mapa-container">
        <MapaUsuarios
          usuarios={usuariosSoporte}
          googleMapsApiKey="AIzaSyDPvDiZmC-o8dNMAAAQZdea9VqgKiYYqhQ"
        />
      </div>
    ) : (
      <p style={{ color: "#888", fontStyle: "italic" }}>
        No hay usuarios con ubicación disponible.
      </p>
    )}
  </div>
)}

    </div>
  );
};

export default AdminDashboard;
