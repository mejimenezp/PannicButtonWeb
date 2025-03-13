import React, { useState, useEffect } from "react";
import { createContact, updateContact, getRoles } from "../api/contacts";
import { getDepartamentos, getAreas, getCiudades, getVeredas, getLocalidades } from "../api/locations";
import "../assets/css/forms.css";

const ContactForm = ({ loadContacts, editingContact, setEditingContact }) => {
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    tyco_id: "",
    dpto_id: "",
    area_id: "",
    ciud_id: "",
    vere_id: "",
    loca_id: "",
  });

  const [departamentos, setDepartamentos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [veredas, setVeredas] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [roles, setRoles] = useState([]);

 useEffect(() => {
  if (editingContact) {
    // Si hay contacto en edición, carga los datos
    setContact({
      name: editingContact.Cont_Name || "",
      phone: editingContact.Cont_Phone || "",
      email: editingContact.Cont_Email || "",
      tyco_id: editingContact.Cont_TyCo_ID || "",
      dpto_id: editingContact.Cont_Dpto_ID || "",
      area_id: editingContact.Cont_Area_ID || "",
      ciud_id: editingContact.Cont_Ciud_ID || "",
      vere_id: editingContact.Cont_Vere_ID || "",
      loca_id: editingContact.Cont_Loca_ID || "",
    });
  } else {
    // Si no hay contacto en edición, resetea los campos
    setContact({
      name: "",
      phone: "",
      email: "",
      tyco_id: "",
      dpto_id: "",
      area_id: "",
      ciud_id: "",
      vere_id: "",
      loca_id: "",
    });
  }
}, [editingContact]);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const data = await getDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        console.error("Error cargando departamentos:", error);
      }
    };
    const fetchRoles = async () => {
          try {
            const data = await getRoles();
            setRoles(data);
          } catch (error) {
            console.error("Error cargando roles:", error);
          }
        };
    
  
    fetchRoles();
    fetchDepartamentos();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });

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
      if (editingContact) {
        await updateContact(editingContact.Cont_ID, contact);
        alert("Contacto actualizado exitosamente");
        setEditingContact(null);
      } else {
        await createContact(contact);
        alert("Contacto creado exitosamente");
      }

      setContact({
        name: "",
        phone: "",
        email: "",
        tyco_id: "",
        dpto_id: "",
        area_id: "",
        ciud_id: "",
        vere_id: "",
        loca_id: "",
      });

      loadContacts();
    } catch (error) {
      alert("Error al guardar contacto");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={contact.name} onChange={handleChange} placeholder="Nombre" required />
      <input type="text" name="email" value={contact.email} onChange={handleChange} placeholder="Email" required />
      <input type="text" name="phone" value={contact.phone} onChange={handleChange} placeholder="Teléfono" required />
      <select name="tyco_id" value={contact.tyco_id} onChange={handleChange} required>
        <option value="">Seleccione un Tipo de Contacto</option>
        {roles.map((role) => (
          <option key={role.TyCo_ID} value={role.TyCo_ID}>
            {role.TyCo_Name}
          </option>
        ))}
      </select>

      <select name="dpto_id" value={contact.dpto_id} onChange={handleChange} required>
        <option value="">Seleccione un Departamento</option>
        {departamentos.map((d) => (
          <option key={d.Dpto_ID} value={d.Dpto_ID}>{d.Dpto_Name}</option>
        ))}
      </select>

      <select name="area_id" value={contact.area_id} onChange={handleChange} required disabled={!areas.length}>
        <option value="">Seleccione un Área</option>
        {areas.map((a) => (
          <option key={a.Area_ID} value={a.Area_ID}>{a.Area_Name}</option>
        ))}
      </select>

      <select name="ciud_id" value={contact.ciud_id} onChange={handleChange} required disabled={!ciudades.length}>
        <option value="">Seleccione una Ciudad</option>
        {ciudades.map((c) => (
          <option key={c.Ciud_ID} value={c.Ciud_ID}>{c.Ciud_Name}</option>
        ))}
      </select>

      <select name="vere_id" value={contact.vere_id} onChange={handleChange} required disabled={!veredas.length}>
        <option value="">Seleccione una Vereda</option>
        {veredas.map((v) => (
          <option key={v.Vere_ID} value={v.Vere_ID}>{v.Vere_Name}</option>
        ))}
      </select>

      <select name="loca_id" value={contact.loca_id} onChange={handleChange} required disabled={!localidades.length}>
        <option value="">Seleccione una Localidad</option>
        {localidades.map((l) => (
          <option key={l.Loca_ID} value={l.Loca_ID}>{l.Loca_Name}</option>
        ))}
      </select>

      <button type="submit">{editingContact ? "Actualizar Contacto" : "Crear Contacto"}</button>
    </form>
  );
};

export default ContactForm;
