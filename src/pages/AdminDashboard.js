import { useNavigate } from "react-router-dom";
import "../assets/css/admin.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h2>Panel de Administración</h2>
      <div className="admin-options">
        <button className="btn btn-users" onClick={() => navigate("/adminUsers")}>
          👥 Gestionar Usuarios
        </button>
        <button className="btn btn-contacts" onClick={() => navigate("/adminContacts")}>
          📞 Gestionar Contactos
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
