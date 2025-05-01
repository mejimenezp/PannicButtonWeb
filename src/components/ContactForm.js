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
      setContact({
        name: editingContact.Cont_Name || "",
        phone: editingContact.Cont_Phone || "",
        email: editingContact.Cont_Email || "",
        tyco_id: editingContact.TyCo_ID || "",
        dpto_id: editingContact.Dpto_ID || "",
        area_id: editingContact.Area_ID || "",
        ciud_id: editingContact.Ciud_ID || "",
        vere_id: editingContact.Vere_ID || "",
        loca_id: editingContact.Loca_ID || "",
      });
    } else {
      setContact({
        name: "",
        phone: "+57",
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
    const loadLocationDataForEditing = async () => {
      if (editingContact) {
        if (editingContact.Dpto_ID) {
          const fetchedAreas = await getAreas(editingContact.Dpto_ID);
          setAreas(fetchedAreas);
        }
        if (editingContact.Area_ID) {
          const fetchedCiudades = await getCiudades(editingContact.Area_ID);
          setCiudades(fetchedCiudades);
        }
        if (editingContact.Ciud_ID) {
          const fetchedVeredas = await getVeredas(editingContact.Ciud_ID);
          setVeredas(fetchedVeredas);
        }
        if (editingContact.Vere_ID) {
          const fetchedLocalidades = await getLocalidades(editingContact.Vere_ID);
          setLocalidades(fetchedLocalidades);
        }
      }
    };
  
    loadLocationDataForEditing();
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

    const cleanContact = { ...contact };
    if (!ciudades.length)cleanContact.ciud_id= "";
    if (!areas.length) cleanContact.area_id= "";
    if (!veredas.length) cleanContact.vere_id = "";
    if (!localidades.length) cleanContact.loca_id = "";

    try {
      if (editingContact) {
        await updateContact(editingContact.Cont_ID, cleanContact);
        alert("Contacto actualizado exitosamente");
        setEditingContact(null);
      } else {
        await createContact(cleanContact);
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
      <label>Tipo de Contacto Actual: {editingContact?.TipoContacto}</label>
      <select name="tyco_id" value={contact.tyco_id} onChange={handleChange} required>
        <option value="">Seleccione un Tipo de Contacto</option>
        {roles.map((role) => (
          <option key={role.TyCo_ID} value={role.TyCo_ID}>{role.TyCo_Name}</option>
        ))}
      </select>
      <label>Departamento Actual: {editingContact?.Departamento}</label>
      <select name="dpto_id" value={contact.dpto_id} onChange={handleChange} required>
        <option value="">Seleccione un Departamento</option>
        {departamentos.map((d) => (
          <option key={d.Dpto_ID} value={d.Dpto_ID}>{d.Dpto_Name}</option>
        ))}
      </select>
      <label>Área Actual: {editingContact?.Area}</label>
      <select name="area_id" value={contact.area_id} onChange={handleChange}  disabled={!areas.length}>
        <option value="">Seleccione un Área</option>
        {areas.map((a) => (
          <option key={a.Area_ID} value={a.Area_ID}>{a.Area_Name}</option>
        ))}
      </select>
      <label>Ciudad Actual: {editingContact?.Ciudad}</label>
      <select name="ciud_id" value={contact.ciud_id} onChange={handleChange}  disabled={!ciudades.length}>
        <option value="">Seleccione una Ciudad</option>
        {ciudades.map((c) => (
          <option key={c.Ciud_ID} value={c.Ciud_ID}>{c.Ciud_Name}</option>
        ))}
      </select>
      <label>Vereda Actual: {editingContact?.Vereda}</label>
      <select name="vere_id" value={contact.vere_id} onChange={handleChange}  disabled={!veredas.length}>
        <option value="">Seleccione una Vereda</option>
        {veredas.map((v) => (
          <option key={v.Vere_ID} value={v.Vere_ID}>{v.Vere_Name}</option>
        ))}
      </select>
      <label>Localidad Actual: {editingContact?.Localidad}</label>
      <select name="loca_id" value={contact.loca_id} onChange={handleChange}  disabled={!localidades.length}>
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
