import React, { useState, useEffect } from "react";
import { createUser, updateUser, getServices } from "../api/users";
import { getDepartamentos, getAreas, getCiudades, getVeredas, getLocalidades } from "../api/locations";

const SupportUserForm = ({ loadUsers, editingUser, setEditingUser, closeForm }) => {
  // Datos del usuario de soporte (ejemplo serv_id=5)
  const userData = {
    serv_id: parseInt(localStorage.getItem("serv_id")),
    dpto_id: parseInt(localStorage.getItem("Dpto_ID")),
    area_id: parseInt(localStorage.getItem("Area_ID")),
    ciud_id: parseInt(localStorage.getItem("Ciud_ID")),
    vere_id: parseInt(localStorage.getItem("Vere_ID")),
    loca_id: parseInt(localStorage.getItem("Loca_ID")),
    
  };

  // Determinar campos editables según serv_id (1-5)
  const getEditableFields = () => {
    switch(userData.serv_id) {
      case 1: return ['serv_id', 'loca_id']; // Solo localidad
      case 2: return ['serv_id', 'vere_id', 'loca_id']; // Vereda + localidad
      case 3: return ['serv_id', 'ciud_id', 'vere_id', 'loca_id']; // Ciudad + niveles inferiores
      case 4: return ['serv_id', 'area_id', 'ciud_id', 'vere_id', 'loca_id']; // Área + niveles inferiores
      case 5: return ['serv_id', 'dpto_id', 'area_id', 'ciud_id', 'vere_id', 'loca_id']; // Todos los niveles
      default: return ['serv_id']; // Por defecto solo servicio
    }
  };

  const editableFields = getEditableFields();
  const isFieldEditable = (field) => editableFields.includes(field);

  // Estado inicial del formulario
  const [user, setUser] = useState({
    phone: "+57",
    serv_id: userData.serv_id.toString(),
    dpto_id: userData.dpto_id || "",
    area_id: userData.area_id || "",
    ciud_id: userData.ciud_id || "",
    vere_id: userData.vere_id || "",
    loca_id: userData.loca_id || "",
    nombre: "",
    mail: "",
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [veredas, setVeredas] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [services, setServices] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 1. Cargar servicios disponibles
        const servicesData = await getServices();
        setServices(servicesData);

        // 2. Precargar datos según nivel de acceso
        if (isFieldEditable('dpto_id')) {
          const dptosData = await getDepartamentos();
          setDepartamentos(dptosData);
        }

        if (isFieldEditable('area_id') && userData.dpto_id) {
          const areasData = await getAreas(userData.dpto_id);
          setAreas(areasData);
        }

        if (isFieldEditable('ciud_id') && userData.area_id) {
          const ciudadesData = await getCiudades(userData.area_id);
          setCiudades(ciudadesData);
        }

        if (isFieldEditable('vere_id') && userData.ciud_id) {
          const veredasData = await getVeredas(userData.ciud_id);
          setVeredas(veredasData);
        }

        // 3. Si estamos editando, cargar datos del usuario
        if (editingUser) {
          setUser({
            phone: editingUser.Usua_Phone || "",
            serv_id: editingUser.Servicio_ID || userData.serv_id.toString(),
            dpto_id: editingUser.Dpto_ID || userData.dpto_id || "",
            area_id: editingUser.Area_ID || userData.area_id || "",
            ciud_id: editingUser.Ciudad_ID || userData.ciud_id || "",
            vere_id: editingUser.Vereda_ID || userData.vere_id || "",
            loca_id: editingUser.Localidad_ID || userData.loca_id || "",
            nombre: editingUser.Usua_Name || "",
            mail: editingUser.Usua_Email || "",
          });

          // Cargar jerarquía completa para el usuario editado
          if (isFieldEditable('area_id') && editingUser.Dpto_ID) {
            const areasData = await getAreas(editingUser.Dpto_ID);
            setAreas(areasData);
          }
          if (isFieldEditable('ciud_id') && editingUser.Area_ID) {
            const ciudadesData = await getCiudades(editingUser.Area_ID);
            setCiudades(ciudadesData);
          }
          if (isFieldEditable('vere_id') && editingUser.Ciudad_ID) {
            const veredasData = await getVeredas(editingUser.Ciudad_ID);
            setVeredas(veredasData);
          }
          if (isFieldEditable('loca_id') && editingUser.Vereda_ID) {
            const localidadesData = await getLocalidades(editingUser.Vereda_ID);
            setLocalidades(localidadesData);
          }
        }
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };

    loadInitialData();
  }, [editingUser]);

  const handleCloseFormUser = () => {
    setEditingUser(null); 
  
    setUser({
      phone: "",
      serv_id: userData.serv_id.toString() || "",
      dpto_id: userData.dpto_id || "",
      area_id: userData.area_id || "",
      ciud_id: userData.ciud_id || "",
      vere_id: userData.vere_id || "",
      loca_id: userData.loca_id || "",
      nombre: "",
      mail: "",
    });
  
    closeForm(); 
  };
  

  // Manejar cambios en los selects
  const handleChange = async (e) => {
    const { name, value } = e.target;
    const newUser = { ...user, [name]: value };

    // Resetear niveles inferiores al cambiar uno superior
    if (name === "dpto_id") {
      newUser.area_id = "";
      newUser.ciud_id = "";
      newUser.vere_id = "";
      newUser.loca_id = "";
    } else if (name === "area_id") {
      newUser.ciud_id = "";
      newUser.vere_id = "";
      newUser.loca_id = "";
    } else if (name === "ciud_id") {
      newUser.vere_id = "";
      newUser.loca_id = "";
    } else if (name === "vere_id") {
      newUser.loca_id = "";
    }

    setUser(newUser);

    // Cargar datos dependientes si el campo es editable
    try {
      if (name === "dpto_id" && value && isFieldEditable('area_id')) {
        const areasData = await getAreas(value);
        setAreas(areasData);
        setCiudades([]);
        setVeredas([]);
        setLocalidades([]);
      }
      if (name === "area_id" && value && isFieldEditable('ciud_id')) {
        const ciudadesData = await getCiudades(value);
        setCiudades(ciudadesData);
        setVeredas([]);
        setLocalidades([]);
      }
      if (name === "ciud_id" && value && isFieldEditable('vere_id')) {
        const veredasData = await getVeredas(value);
        setVeredas(veredasData);
        setLocalidades([]);
      }
      if (name === "vere_id" && value && isFieldEditable('loca_id')) {
        const localidadesData = await getLocalidades(value);
        setLocalidades(localidadesData);
      }
    } catch (error) {
      console.error(`Error cargando ${name}:`, error);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Preparar datos para enviar (mantener valores no editables)
      const userToSend = {
        ...user,
        ...(!isFieldEditable('dpto_id') && { dpto_id: userData.dpto_id }),
        ...(!isFieldEditable('area_id') && { area_id: userData.area_id }),
        ...(!isFieldEditable('ciud_id') && { ciud_id: userData.ciud_id }),
        ...(!isFieldEditable('vere_id') && { vere_id: userData.vere_id }),
        ...(!isFieldEditable('loca_id') && { loca_id: userData.loca_id }),
      };

      if (editingUser) {
        await updateUser(editingUser.Usua_ID, userToSend);
        alert("Usuario actualizado exitosamente");
        setEditingUser(null);
      } else {
        await createUser(userToSend);
        alert("Usuario creado exitosamente");
      }

      loadUsers();
      closeForm();
    } catch (error) {
      alert(`Error al guardar: ${error.response?.data?.message || error.message}`);
    }
  };

  // Render condicional de campos
  const renderLocationField = (field, label) => {
    const fieldName = `${field}_id`;
    const currentValue = editingUser?.[field] || "No especificado";
    
    return (
      <div className="form-group">
        <label>{label} actual: {currentValue}</label>
        <select
          name={fieldName}
          value={user[fieldName]}
          onChange={handleChange}
          disabled={!isFieldEditable(fieldName) || 
                   (field === 'area' && !user.dpto_id) ||
                   (field === 'ciud' && !user.area_id) ||
                   (field === 'vere' && !user.ciud_id) ||
                   (field === 'loca' && !user.vere_id)}
          
        >
          <option value="">Seleccione {label.toLowerCase()}</option>
          {field === 'dpto' && departamentos.map(d => (
            <option key={d.Dpto_ID} value={d.Dpto_ID}>{d.Dpto_Name}</option>
          ))}
          {field === 'area' && areas.map(a => (
            <option key={a.Area_ID} value={a.Area_ID}>{a.Area_Name}</option>
          ))}
          {field === 'ciud' && ciudades.map(c => (
            <option key={c.Ciud_ID} value={c.Ciud_ID}>{c.Ciud_Name}</option>
          ))}
          {field === 'vere' && veredas.map(v => (
            <option key={v.Vere_ID} value={v.Vere_ID}>{v.Vere_Name}</option>
          ))}
          {field === 'loca' && localidades.map(l => (
            <option key={l.Loca_ID} value={l.Loca_ID}>{l.Loca_Name}</option>
          ))}
          {/* Mensaje cuando no hay opciones disponibles */}
          {((field === 'area' && user.dpto_id && areas.length === 0) ||
           (field === 'ciud' && user.area_id && ciudades.length === 0) ||
           (field === 'vere' && user.ciud_id && veredas.length === 0) ||
           (field === 'loca' && user.vere_id && localidades.length === 0)) && (
            <option value="" disabled>No hay opciones disponibles</option>
          )}
        </select>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      {/* Campos básicos */}
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={user.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="mail"
          value={user.mail}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Teléfono:</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          required
        />
      </div>

      {/* Servicio */}
      <div className="form-group">
        <label>Servicio actual: {editingUser?.Servicio || "Nuevo usuario"}</label>
        <select
          name="serv_id"
          value={user.serv_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione servicio</option>
          {services.map(s => (
            <option key={s.Serv_ID} value={s.Serv_ID}>{s.Serv_Name}</option>
          ))}
        </select>
      </div>

      {/* Campos de ubicación según permisos */}

      {isFieldEditable('area_id') && renderLocationField('area', 'Área')}
      {isFieldEditable('ciud_id') && renderLocationField('ciud', 'Ciudad')}
      {isFieldEditable('vere_id') && renderLocationField('vere', 'Vereda')}
      {isFieldEditable('loca_id') && renderLocationField('loca', 'Localidad')}

      <div className="form-actions">
        <button type="button" onClick={handleCloseFormUser}>
          Cancelar
        </button>
        <button type="submit">
          {editingUser ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default SupportUserForm;