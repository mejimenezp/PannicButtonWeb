import React, { useState, useEffect } from "react";
import { createUser, updateUser, getServices } from "../api/users";
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
  const [services, setServices] = useState([]);

  // 🔧 Cargar datos iniciales del usuario en edición
  useEffect(() => {
    if (editingUser) {
      setUser({
        phone: editingUser.Usua_Phone || "",
        serv_id: editingUser.Servicio_ID || "",
        dpto_id: editingUser.Departamento_ID || "",
        area_id: editingUser.Area_ID || "",
        ciud_id: editingUser.Ciudad_ID || "",
        vere_id: editingUser.Vereda_ID || "",
        loca_id: editingUser.Localidad_ID || "",
        cont_id: editingUser.Cont_ID || "",
        nombre: editingUser.Usua_Name || "",
        mail: editingUser.Usua_Email || "",
      });
    } else {
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
    }
  }, [editingUser]);

  // 🔹 Cargar opciones de selects (servicios, departamentos, etc.)
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const data = await getDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        console.error("Error cargando departamentos:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error cargando servicios:", error);
      }
    };

    fetchDepartamentos();
    fetchServices();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    // 🚀 Manejo dinámico de selects encadenados
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
  
    const cleanuser = { ...user };
  
    // Si no hay opciones en los selects, limpiamos esos campos antes de enviar
    if (!ciudades.length) cleanuser.ciud_id = "";
    if (!areas.length) cleanuser.area_id = "";
    if (!veredas.length || !cleanuser.ciud_id) cleanuser.vere_id = "";
    if (!localidades.length || !cleanuser.ciud_id) cleanuser.loca_id = "";
  
    try {
      if (editingUser) {
        await updateUser(editingUser.Usua_ID, cleanuser);
        alert("Usuario actualizado exitosamente");
        setEditingUser(null);
      } else {
        await createUser(cleanuser);
        alert("Usuario creado exitosamente");
      }
  
      // 🧹 Resetear formulario y recargar lista
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

      {/* 🔥 Mostrar texto actual encima del select */}
      <label>Servicio actual: {editingUser?.Servicio}</label>
      <select name="serv_id" value={user.serv_id} onChange={handleChange} required>
        <option value="">Seleccione un Servicio</option>
        {services.map((s) => (
          <option key={s.Serv_ID} value={s.Serv_ID}>
            {s.Serv_Name}
          </option>
        ))}
      </select>

      <label>Departamento actual: {editingUser?.Departamento}</label>
      <select name="dpto_id" value={user.dpto_id} onChange={handleChange} required>
        <option value="">Seleccione un Departamento</option>
        {departamentos.map((d) => (
          <option key={d.Dpto_ID} value={d.Dpto_ID}>
            {d.Dpto_Name}
          </option>
        ))}
      </select>

      {/* Área */}
{editingUser && <p><strong>Área actual:</strong> {editingUser.Area || "No especificada"}</p>}
<select
  name="area_id"
  value={user.area_id}
  onChange={handleChange}
  required
  disabled={!areas.length}
>
  <option value="">{editingUser?.Area || "Seleccione un Área"}</option>
  {areas.map((a) => (
    <option key={a.Area_ID} value={a.Area_ID}>
      {a.Area_Name}
    </option>
  ))}
</select>

{/* Ciudad */}
{editingUser && <p><strong>Ciudad actual:</strong> {editingUser.Ciudad || "No especificada"}</p>}
<select
  name="ciud_id"
  value={user.ciud_id}
  onChange={handleChange}
  required
  disabled={!ciudades.length}
>
  <option value="">{editingUser?.Ciudad || "Seleccione una Ciudad"}</option>
  {ciudades.map((c) => (
    <option key={c.Ciud_ID} value={c.Ciud_ID}>
      {c.Ciud_Name}
    </option>
  ))}
</select>

{/* Vereda */}
{editingUser && <p><strong>Vereda actual:</strong> {editingUser.Vereda || "No especificada"}</p>}
<select
  name="vere_id"
  value={user.vere_id}
  onChange={handleChange}
  required
  disabled={!veredas.length}
>
  <option value="">{editingUser?.Vereda || "Seleccione una Vereda"}</option>
  {veredas.map((v) => (
    <option key={v.Vere_ID} value={v.Vere_ID}>
      {v.Vere_Name}
    </option>
  ))}
</select>

{/* Localidad */}
{editingUser && <p><strong>Localidad actual:</strong> {editingUser.Localidad || "No especificada"}</p>}
<select
  name="loca_id"
  value={user.loca_id}
  onChange={handleChange}
  required
  disabled={!localidades.length}
>
  <option value="">{editingUser?.Localidad || "Seleccione una Localidad"}</option>
  {localidades.map((l) => (
    <option key={l.Loca_ID} value={l.Loca_ID}>
      {l.Loca_Name}
    </option>
  ))}
</select>

      <button type="submit">{editingUser ? "Actualizar Usuario" : "Crear Usuario"}</button>
    </form>
  );
};

export default UserForm;