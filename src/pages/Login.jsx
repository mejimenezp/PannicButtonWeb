import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/admin";
import "../assets/css/login.css";

const Login = () => {
  const [phone, setPhone] = useState("+57");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token, role } = await login(phone, email);

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin" || role === "support") {
        navigate("/admin");
      } else {
        setError("Acceso no autorizado");
      }
    } catch (error) {
      console.error("❌ Error de inicio de sesión:", error);
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
