import React, { useState, useEffect } from "react";
import { createContact, updateContact, getRoles } from "../api/contacts";
import { getDepartamentos, getAreas, getCiudades, getVeredas, getLocalidades } from "../api/locations";

const SupportContactForm = ({ loadContacts, editingContact, setEditingContact, closeForm }) => {
  const userData = {
    serv_id: parseInt(localStorage.getItem("serv_id")),
    dpto_id: parseInt(localStorage.getItem("Dpto_ID")),
    area_id: parseInt(localStorage.getItem("Area_ID")),
    ciud_id: parseInt(localStorage.getItem("Ciud_ID")),
    vere_id: parseInt(localStorage.getItem("Vere_ID")),
    loca_id: parseInt(localStorage.getItem("Loca_ID")),
  };

  const getEditableFields = () => {
    switch (userData.serv_id) {
      case 1: return ['serv_id', 'loca_id'];
      case 2: return ['serv_id', 'vere_id', 'loca_id'];
      case 3: return ['serv_id', 'ciud_id', 'vere_id', 'loca_id'];
      case 4: return ['serv_id', 'area_id', 'ciud_id', 'vere_id', 'loca_id'];
      case 5: return ['serv_id', 'dpto_id', 'area_id', 'ciud_id', 'vere_id', 'loca_id'];
      default: return ['serv_id'];
    }
  };

  const editableFields = getEditableFields();
  const isFieldEditable = (field) => editableFields.includes(field);

  const [contact, setContact] = useState({
    phone: "+57",
    tyco_id: "",
    dpto_id: userData.dpto_id || "",
    area_id: userData.area_id || "",
    ciud_id: userData.ciud_id || "",
    vere_id: userData.vere_id || "",
    loca_id: userData.loca_id || "",
    name: "",
    email: "",
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [veredas, setVeredas] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);

        if (isFieldEditable('dpto_id')) {
          const dptos = await getDepartamentos();
          console.log (dptos)
          setDepartamentos(dptos);
        }

        if (isFieldEditable('area_id') && userData.dpto_id) {
          const areas = await getAreas(userData.dpto_id);
          setAreas(areas);
        }

        if (isFieldEditable('ciud_id') && userData.area_id) {
          const ciudades = await getCiudades(userData.area_id);
          setCiudades(ciudades);
        }

        if (isFieldEditable('vere_id') && userData.ciud_id) {
          const veredas = await getVeredas(userData.ciud_id);
          setVeredas(veredas);
        }

        if (isFieldEditable('loca_id') && userData.loca_id) {
          const localidades = await getLocalidades(userData.loca_id);
          setLocalidades(localidades);
        }

        if (editingContact) {
          setContact({
            phone: editingContact.Cont_Phone || "",
            tyco_id: editingContact.TyCo_ID || "",
            dpto_id: editingContact.Dpto_ID ?? "",
            area_id: editingContact.Area_ID ?? "",
            ciud_id: editingContact.Ciud_ID === null ? "null" : editingContact.Ciud_ID ?? "",
            vere_id: editingContact.Vere_ID === null ? "null" : editingContact.Vere_ID ?? "",
            loca_id: editingContact.Loca_ID === null ? "null" : editingContact.Loca_ID ?? "",
            name: editingContact.Cont_Name || "",
            email: editingContact.Cont_Email || "",
          });

          if (isFieldEditable('area_id') && editingContact.Dpto_ID) {
            const areas = await getAreas(editingContact.Dpto_ID);
            setAreas(areas);
          }
          if (isFieldEditable('ciud_id') && editingContact.Area_ID) {
            const ciudades = await getCiudades(editingContact.Area_ID);
            setCiudades(ciudades);
          }
          if (isFieldEditable('vere_id') && editingContact.Ciudad_ID) {
            const veredas = await getVeredas(editingContact.Ciudad_ID);
            setVeredas(veredas);
          }
          if (isFieldEditable('loca_id') && editingContact.Vere_ID) {
            const localidades = await getLocalidades(editingContact.Vere_ID);
            setLocalidades(localidades);
          }
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    loadInitialData();
  }, [editingContact]);
  const handleCloseForm = () => {
    setEditingContact(null);
    setContact({
      phone: "",
      tyco_id: "",
      dpto_id: userData.dpto_id || "",
      area_id: userData.area_id || "",
      ciud_id: userData.ciud_id || "",
      vere_id: userData.vere_id || "",
      loca_id: userData.loca_id || "",
      name: "",
      email: "",
    });
    closeForm(); // esta es la prop original
  };
  
  const handleChange = async (e) => {
    const { name, value } = e.target;
    const newContact = { ...contact, [name]: value };

    if (name === "dpto_id") {
      newContact.area_id = "";
      newContact.ciud_id = "";
      newContact.vere_id = "";
      newContact.loca_id = "";
    } else if (name === "area_id") {
      newContact.ciud_id = "";
      newContact.vere_id = "";
      newContact.loca_id = "";
    } else if (name === "ciud_id") {
      newContact.vere_id = "";
      newContact.loca_id = "";
    } else if (name === "vere_id") {
      newContact.loca_id = "";
    }

    setContact(newContact);

    try {
      if (name === "dpto_id" && value && isFieldEditable('area_id')) {
        setAreas(await getAreas(value));
        setCiudades([]);
        setVeredas([]);
        setLocalidades([]);
      }
      if (name === "area_id" && value && isFieldEditable('ciud_id')) {
        setCiudades(await getCiudades(value));
        setVeredas([]);
        setLocalidades([]);
      }
      if (name === "ciud_id" && value && isFieldEditable('vere_id')) {
        setVeredas(await getVeredas(value));
        setLocalidades([]);
      }
      if (name === "vere_id" && value && isFieldEditable('loca_id')) {
        setLocalidades(await getLocalidades(value));
      }
    } catch (err) {
      console.error("Error en cascada de selects:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const normalizeNulls = (value) => value === "null" ? null : value;
      const contactToSend = {
        ...contact,
        dpto_id: normalizeNulls(contact.dpto_id),
        area_id: normalizeNulls(contact.area_id),
        ciud_id: normalizeNulls(contact.ciud_id),
        vere_id: normalizeNulls(contact.vere_id),
        loca_id: normalizeNulls(contact.loca_id),
        ...(!isFieldEditable('dpto_id') && { dpto_id: userData.dpto_id }),
        ...(!isFieldEditable('area_id') && { area_id: userData.area_id }),
        ...(!isFieldEditable('ciud_id') && { ciud_id: userData.ciud_id }),
        ...(!isFieldEditable('vere_id') && { vere_id: userData.vere_id }),
        ...(!isFieldEditable('loca_id') && { loca_id: userData.loca_id }),
      };

      if (editingContact) {
        await updateContact(editingContact.Cont_ID, contactToSend);
        alert("Contacto actualizado");
        setEditingContact(null);
      } else {
        await createContact(contactToSend);
        alert("Contacto creado");
      }

      loadContacts();
      closeForm();
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

 // Función para renderizar campos de ubicación
const renderLocationField = (field, label) => {
    const fieldName = `${field}_id`;
    const nameMap = { dpto:"Departamento", area:"Area", ciud:"Ciudad", vere:"Vereda", loca:"Localidad" };
    const currentValue = editingContact ? editingContact[nameMap[field]] ?? "No especificado" : "No especificado";
  
    return (
      <div className="form-group">
        <label>{label} actual: {currentValue}</label>
        <select
          name={fieldName}
          value={contact[fieldName]}
          onChange={handleChange}
          disabled={
            !isFieldEditable(fieldName) ||
            (field === 'area' && !contact.dpto_id) ||
            (field === 'ciud' && !contact.area_id) ||
            (field === 'vere' && !contact.ciud_id) ||
            (field === 'loca' && !contact.vere_id)
          }
        >
          <option value="">Seleccione {label.toLowerCase()}</option>
          <option value="null">Sin {label.toLowerCase()}</option>
  
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
  
          {/* Sin opciones disponibles */}
          {((field === 'area' && contact.dpto_id && areas.length === 0) ||
            (field === 'ciud' && contact.area_id && ciudades.length === 0) ||
            (field === 'vere' && contact.ciud_id && veredas.length === 0) ||
            (field === 'loca' && contact.vere_id && localidades.length === 0)) && (
            <option value="" disabled>No hay opciones disponibles</option>
          )}
        </select>
      </div>
    );
  };
  
  // Formulario completo
  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {/* Campos básicos */}
      <div className="form-group">
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={contact.name}
          onChange={handleChange}
          required
        />
      </div>
  
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={contact.email}
          onChange={handleChange}
          required
        />
      </div>
  
      <div className="form-group">
        <label>Teléfono:</label>
        <input
          type="text"
          name="phone"
          value={contact.phone}
          onChange={handleChange}
          required
        />
      </div>
  
      {/* Tipo de contacto */}
      <div className="form-group">
        <label>Tipo de Contacto actual: {editingContact?.TipoContacto || "Nuevo contacto"}</label>
        <select
          name="tyco_id"
          value={contact.tyco_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un Tipo de Contacto</option>
          {roles.map(role => (
            <option key={role.TyCo_ID} value={role.TyCo_ID}>
              {role.TyCo_Name}
            </option>
          ))}
        </select>
      </div>
  
      {/* Campos de ubicación según nivel */}
      {isFieldEditable('area_id') && renderLocationField('area', 'Área')}
      {isFieldEditable('ciud_id') && renderLocationField('ciud', 'Ciudad')}
      {isFieldEditable('vere_id') && renderLocationField('vere', 'Vereda')}
      {isFieldEditable('loca_id') && renderLocationField('loca', 'Localidad')}
  
      {/* Acciones */}
      <div className="form-actions">
        <button type="button" onClick={handleCloseForm}>
          Cancelar
        </button>
        <button type="submit">
          {editingContact ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
  
};

export default SupportContactForm;
