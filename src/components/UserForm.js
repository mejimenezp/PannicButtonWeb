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

  // Cargar datos iniciales del usuario en edición
  useEffect(() => {
    if (editingUser) {
      setUser({
        phone: editingUser.Usua_Phone || "",
        serv_id: editingUser.Servicio_ID || "",
        dpto_id: editingUser.Dpto_ID || "",
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

  useEffect(() => {
    const loadLocationData = async () => {
      if (!editingUser) return;
  
      try {
        // 1️⃣ Cargar todos los departamentos
        const departamentosData = await getDepartamentos();
        setDepartamentos(departamentosData);
  
        // 2️⃣ Buscar el departamento del usuario y cargar sus áreas
        if (editingUser.Departamento_ID) {
          const areasData = await getAreas(editingUser.Departamento_ID);
          setAreas(areasData);
        }
  
        // 3️⃣ Buscar el área del usuario y cargar ciudades
        if (editingUser.Area_ID) {
          const ciudadesData = await getCiudades(editingUser.Area_ID);
          setCiudades(ciudadesData);
        }
  
        // 4️⃣ Buscar la ciudad del usuario y cargar veredas
        if (editingUser.Ciudad_ID) {
          const veredasData = await getVeredas(editingUser.Ciudad_ID);
          setVeredas(veredasData);
        }
  
        // 5️⃣ Buscar la vereda del usuario y cargar localidades
        if (editingUser.Vereda_ID) {
          const localidadesData = await getLocalidades(editingUser.Vereda_ID);
          setLocalidades(localidadesData);
        }
      } catch (error) {
        console.error("❌ Error cargando datos de ubicación:", error);
      }
    };
  
    loadLocationData();
  }, [editingUser]);  // ⚠️ Esto asegura que se recargue cuando editingUser cambie
  

  // Cargar opciones de selects (servicios, departamentos)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [departamentosData, servicesData] = await Promise.all([
          getDepartamentos(),
          getServices()
        ]);
        console.log("Departamentos cargados:", departamentosData);
        setDepartamentos(departamentosData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const newUser = {
      ...user,
      [name]: value,
      // Resetear dependientes cuando cambia un padre
      ...(name === "dpto_id" && {
        area_id: "",
        ciud_id: "",
        vere_id: "",
        loca_id: "",
      }),
      ...(name === "area_id" && { ciud_id: "", vere_id: "", loca_id: "" }),
      ...(name === "ciud_id" && { vere_id: "", loca_id: "" }),
      ...(name === "vere_id" && { loca_id: "" }),
    };

    setUser(newUser);

    // Cargar datos dependientes
    try {
      if (name === "dpto_id" && value) {
        const areasData = await getAreas(value);
        setAreas(areasData);
        setCiudades([]);
        setVeredas([]);
        setLocalidades([]);
      }

      if (name === "area_id" && value) {
        const ciudadesData = await getCiudades(value);
        setCiudades(ciudadesData);
        setVeredas([]);
        setLocalidades([]);
      }

      if (name === "ciud_id" && value) {
        const veredasData = await getVeredas(value);
        setVeredas(veredasData);
        setLocalidades([]);
      }

      if (name === "vere_id" && value) {
        const localidadesData = await getLocalidades(value);
        setLocalidades(localidadesData);
      }
    } catch (error) {
      console.error(`Error cargando ${name}:`, error);
      // Si falla la carga, mantener los arrays vacíos
      if (name === "dpto_id") {
        setAreas([]);
        setCiudades([]);
        setVeredas([]);
        setLocalidades([]);
      }
      if (name === "area_id") {
        setCiudades([]);
        setVeredas([]);
        setLocalidades([]);
      }
      if (name === "ciud_id") {
        setVeredas([]);
        setLocalidades([]);
      }
      if (name === "vere_id") {
        setLocalidades([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Objeto final a enviar
    const userToSend = {
      ...user,
      // Mantener valores existentes si no se modificaron
      dpto_id: user.dpto_id !== "" ? user.dpto_id : editingUser?.Departamento_ID || null,
      area_id: user.area_id !== "" ? user.area_id : editingUser?.Area_ID || null,
      ciud_id: user.ciud_id !== "" ? user.ciud_id : editingUser?.Ciudad_ID || null,
      vere_id: user.vere_id !== "" ? user.vere_id : editingUser?.Vereda_ID || null,
      loca_id: user.loca_id !== "" ? user.loca_id : editingUser?.Localidad_ID || null,
    };

    try {
      if (editingUser) {
        await updateUser(editingUser.Usua_ID, userToSend);
        alert("Usuario actualizado exitosamente");
        setEditingUser(null);
      } else {
        await createUser(userToSend);
        alert("Usuario creado exitosamente");
      }

      // Resetear formulario
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
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input 
          type="text" 
          name="nombre" 
          value={user.nombre} 
          onChange={handleChange} 
          placeholder="Nombre" 
          required 
        />
      </div>

      <div>
        <label>Email:</label>
        <input 
          type="email" 
          name="mail" 
          value={user.mail} 
          onChange={handleChange} 
          placeholder="Email" 
          required 
        />
      </div>

      <div>
        <label>Teléfono:</label>
        <input 
          type="text" 
          name="phone" 
          value={user.phone} 
          onChange={handleChange} 
          placeholder="Teléfono" 
          required 
        />
      </div>

      <div>
        <label>Servicio actual: {editingUser?.Servicio || "Nuevo usuario"}</label>
        <select name="serv_id" value={user.serv_id} onChange={handleChange} required>
          <option value="">Seleccione un Servicio</option>
          {services.map((s) => (
            <option key={s.Serv_ID} value={s.Serv_ID}>
              {s.Serv_Name}
            </option>
          ))}
        </select>
      </div>

      {/* Departamento */}
      <div>
        <label>Departamento actual: {editingUser?.Departamento || "No especificado"}</label>
        <select
          name="dpto_id"
          value={user.dpto_id}
          onChange={handleChange}
        >
          <option value="">Seleccione un Departamento</option>
          {departamentos.map((d) => (
            <option key={d.Dpto_ID} value={d.Dpto_ID}>
              {d.Dpto_Name}
            </option>
          ))}
        </select>
      </div>

      {/* Área */}
      <div>
        <label>Área actual: {editingUser?.Area || "No especificada"}</label>
        <select
          name="area_id"
          value={user.area_id}
          onChange={handleChange}
          
        >
          <option value="">Seleccione un Área</option>
          {areas.length > 0 ? (
            areas.map((a) => (
              <option key={a.Area_ID} value={a.Area_ID}>
                {a.Area_Name}
              </option>
            ))
          ) : user.dpto_id && (
            <option value="" disabled>No hay áreas disponibles</option>
          )}
        </select>
      </div>

      {/* Ciudad */}
      <div>
        <label>Ciudad actual: {editingUser?.Ciudad || "No especificada"}</label>
        <select
          name="ciud_id"
          value={user.ciud_id}
          onChange={handleChange}
          disabled={!user.area_id}
        >
          <option value="">Seleccione una Ciudad</option>
          {ciudades.length > 0 ? (
            ciudades.map((c) => (
              <option key={c.Ciud_ID} value={c.Ciud_ID}>
                {c.Ciud_Name}
              </option>
            ))
          ) : user.area_id && (
            <option value="" disabled>No hay ciudades disponibles</option>
          )}
        </select>
      </div>

      {/* Vereda */}
      <div>
        <label>Vereda actual: {editingUser?.Vereda || "No especificada"}</label>
        <select
          name="vere_id"
          value={user.vere_id}
          onChange={handleChange}
          disabled={!user.ciud_id}
        >
          <option value="">Seleccione una Vereda</option>
          {veredas.length > 0 ? (
            veredas.map((v) => (
              <option key={v.Vere_ID} value={v.Vere_ID}>
                {v.Vere_Name}
              </option>
            ))
          ) : user.ciud_id && (
            <option value="" disabled>No hay veredas disponibles</option>
          )}
        </select>
      </div>

      {/* Localidad */}
      <div>
        <label>Localidad actual: {editingUser?.Localidad || "No especificada"}</label>
        <select
          name="loca_id"
          value={user.loca_id}
          onChange={handleChange}
          disabled={!user.vere_id}
        >
          <option value="">Seleccione una Localidad</option>
          {localidades.length > 0 ? (
            localidades.map((l) => (
              <option key={l.Loca_ID} value={l.Loca_ID}>
                {l.Loca_Name}
              </option>
            ))
          ) : user.vere_id && (
            <option value="" disabled>No hay localidades disponibles</option>
          )}
        </select>
      </div>

      <button type="submit">
        {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
      </button>
    </form>
  );
};

export default UserForm;