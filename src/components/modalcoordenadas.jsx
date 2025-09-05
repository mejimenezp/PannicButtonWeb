import React, { useState, useEffect } from "react";
import Modal from "./Modal"; // tu modal genérico

const CoordinateModal = ({ isOpen, onClose, onSave, fetchUserData }) => {
  const [phoneInput, setPhoneInput] = useState("");
  const [userData, setUserData] = useState(null);
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 Reiniciar estados cada vez que se abre/cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setPhoneInput("");
      setUserData(null);
      setLatitud("");
      setLongitud("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!phoneInput.trim()) {
      alert("Por favor ingresa un número de teléfono");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchUserData(phoneInput);
      const user = Array.isArray(data) ? data[0] : data;

      if (user) {
        setUserData(user);
        setLatitud(user.Latitud || "");
        setLongitud(user.Longitud || "");
      } else {
        alert("No se encontró ningún usuario con ese número");
        setUserData(null);
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
      alert("Error al buscar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!userData) return;
    onSave(userData.Usua_Phone, { latitud, longitud });

    // 🟢 Después de guardar, reiniciar el modal
    setPhoneInput("");
    setUserData(null);
    setLatitud("");
    setLongitud("");
    onClose(); // cerrar el modal automáticamente si quieres
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <h3>Actualizar coordenadas</h3>

      {/* Paso 1: ingresar número */}
      {!userData && (
        <>
          <label>Teléfono del usuario</label>
          <input
            type="text"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="Ej: +573001234567"
          />
          <button onClick={handleSearch} className="btn btn-search" disabled={loading}>
            {loading ? "Buscando..." : "🔍 Buscar"}
          </button>
        </>
      )}

      {/* Paso 2: mostrar datos si encontró */}
      {userData && (
        <>
          <p><strong>Nombre:</strong> {userData.Usua_Name}</p>
          <p><strong>Teléfono:</strong> {userData.Usua_Phone}</p>

          <label>Latitud</label>
          <input
            type="text"
            value={latitud}
            onChange={(e) => setLatitud(e.target.value)}
          />

          <label>Longitud</label>
          <input
            type="text"
            value={longitud}
            onChange={(e) => setLongitud(e.target.value)}
          />

          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button onClick={handleSave} className="btn btn-save">💾 Guardar</button>
            <button onClick={() => setUserData(null)} className="btn btn-reset">↩️ Nueva búsqueda</button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default CoordinateModal;
