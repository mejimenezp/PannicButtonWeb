import React, { useState, useEffect } from "react";
import { createUser, updateUser } from "../api/users";
import { getDepartamentos, getAreas, getCiudades, getVeredas, getLocalidades } from "../api/locations";

const UserForm = ({ loadUsers, editingUser, setEditingUser }) => {
  const [user, setUser] = useState({
    phone: "",
    serv_id: "",
    dpto_id: "",
    area_id: "",
    ciud_id: "",
    vere_id: "",
    loca_id: "",
    cont_id: "",
    nombre: "",
    mail: "",
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [veredas, setVeredas] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  // 🛠️ Cargar datos del usuario en edición
  useEffect(() => {
    if (editingUser) {
      setUser({
        phone: editingUser.Usua_Phone || "",
        serv_id: editingUser.Servicio || "",
        dpto_id: editingUser.Departamento || "",
        area_id: editingUser.Area || "",
        ciud_id: editingUser.Ciudad || "",
        vere_id: editingUser.Vereda || "",
        loca_id: editingUser.Localidad || "",
        cont_id: editingUser.Cont_ID || "",
        nombre: editingUser.Usua_Name || "",
        mail: editingUser.Usua_Email || "",
      });
    }
  }, [editingUser]);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const data = await getDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        console.error("Error cargando departamentos:", error);
      }
    };
    fetchDepartamentos();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (name === "dpto_id") {
      setAreas(await getAreas(value));
      setCiudades([]);
      setVeredas([]);
      setLocalidades([]);
    }

    if (name === "area_id") {
      setCiudades(await getCiudades(value));
      setVeredas([]);
      setLocalidades([]);
    }

    if (name === "ciud_id") {
      setVeredas(await getVeredas(value));
      setLocalidades([]);
    }

    if (name === "vere_id") {
      setLocalidades(await getLocalidades(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.Usua_ID, user);
        alert("Usuario actualizado exitosamente");
        setEditingUser(null);
      } else {
        await createUser(user);
        alert("Usuario creado exitosamente");
      }

      // 🔄 Resetear formulario y recargar lista
      setUser({
        phone: "",
        serv_id: "",
        dpto_id: "",
        area_id: "",
        ciud_id: "",
        vere_id: "",
        loca_id: "",
        cont_id: "",
        nombre: "",
        mail: "",
      });

      loadUsers();
    } catch (error) {
      alert("Error al guardar usuario");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nombre" value={user.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input type="text" name="mail" value={user.mail} onChange={handleChange} placeholder="Mail" required />
      <input type="text" name="phone" value={user.phone} onChange={handleChange} placeholder="Teléfono" required />
      <input type="number" name="serv_id" value={user.serv_id} onChange={handleChange} placeholder="Servicio ID" required />

      <select name="dpto_id" value={user.dpto_id} onChange={handleChange} required>
        <option value="">Seleccione un Departamento</option>
        {departamentos.map((d) => (
          <option key={d.Dpto_ID} value={d.Dpto_ID}>{d.Dpto_Name}</option>
        ))}
      </select>

      <select name="area_id" value={user.area_id} onChange={handleChange} required disabled={!areas.length}>
        <option value="">Seleccione un Área</option>
        {areas.map((a) => (
          <option key={a.Area_ID} value={a.Area_ID}>{a.Area_Name}</option>
        ))}
      </select>

      <select name="ciud_id" value={user.ciud_id} onChange={handleChange} required disabled={!ciudades.length}>
        <option value="">Seleccione una Ciudad</option>
        {ciudades.map((c) => (
          <option key={c.Ciud_ID} value={c.Ciud_ID}>{c.Ciud_Name}</option>
        ))}
      </select>

      <select name="vere_id" value={user.vere_id} onChange={handleChange} required disabled={!veredas.length}>
        <option value="">Seleccione una Vereda</option>
        {veredas.map((v) => (
          <option key={v.Vere_ID} value={v.Vere_ID}>{v.Vere_Name}</option>
        ))}
      </select>

      <select name="loca_id" value={user.loca_id} onChange={handleChange} required disabled={!localidades.length}>
        <option value="">Seleccione una Localidad</option>
        {localidades.map((l) => (
          <option key={l.Loca_ID} value={l.Loca_ID}>{l.Loca_Name}</option>
        ))}
      </select>

      <button type="submit">{editingUser ? "Actualizar Usuario" : "Crear Usuario"}</button>
    </form>
  );
};

export default UserForm;
