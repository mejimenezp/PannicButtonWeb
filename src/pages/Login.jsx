import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtp, verifyOtp } from "../api/admin";
import "../assets/css/login.css";

const Login = () => {
  const [phone, setPhone] = useState("+57");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");         // código OTP
  const [step, setStep] = useState(1);          // 1 = solicitar, 2 = verificar
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await requestOtp(phone, email);
      setStep(2);
    } catch (err) {
      console.error("❌ Error solicitando OTP:", err);
      setError("No se pudo enviar el código. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token, role } = await verifyOtp(email, code, phone);

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin" || role === "support") {
        navigate("/admin");
      } else {
        setError("Acceso no autorizado");
      }
    } catch (err) {
      console.error("❌ Error verificando código:", err);
      setError("Código incorrecto o expirado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>

      <form onSubmit={step === 1 ? handleRequest : handleVerify}>
        {step === 1 && (
          <>
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
          </>
        )}

        {step === 2 && (
          <>
            <p>Hemos enviado un código a tu correo.</p>
            <input
              type="text"
              placeholder="Código de verificación"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Procesando..."
            : step === 1
            ? "Enviar código"
            : "Verificar código"}
        </button>
      </form>

      {step === 2 && (
        <button
          className="resend-btn"
          type="button"
          onClick={() => {
            setStep(1);
            setCode("");
          }}
        >
          Cambiar correo/teléfono
        </button>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
