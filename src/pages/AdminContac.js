import React, { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../api/contacts";
import { getSupportContacts } from "../api/soporte";
import ContactForm from "../components/ContactForm";
import SupportContactForm from "../components/SupportContactForm";
import "../assets/css/admin.css";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [actionContact, setActionContact] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });


  const [filters, setFilters] = useState({
    departamento: "",
    area: "",
    ciudad: "",
    vereda: "",
    localidad: ""
  });

  const [filterOptions, setFilterOptions] = useState({
    departamentos: [],
    areas: [],
    ciudades: [],
    veredas: [],
    localidades: []
  });

  const currentUserRole = localStorage.getItem("role");
  const isSupport = currentUserRole === "support";
  const currentUserServId = parseInt(localStorage.getItem("serv_id") || "0");
  const currentUserLevels = {
    serv_id: currentUserServId,
    serv_name: localStorage.getItem("serv_name"),
    dpto_id: localStorage.getItem("Dpto_ID"),
    area_id: localStorage.getItem("Area_ID"),
    ciud_id: localStorage.getItem("Ciud_ID"),
    vere_id: localStorage.getItem("Vere_ID"),
    loca_id: localStorage.getItem("Loca_ID")
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = isSupport ? await getSupportContacts(currentUserServId) : await getContacts();
      setContacts(data);
      extractFilterOptions(data);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
      alert("Error al cargar contactos");
    }
  };

  const extractFilterOptions = (data) => {
    const getUnique = (key) =>
      [...new Set(data.map((c) => c[key]).filter(Boolean))].sort();

    setFilterOptions({
      departamentos: getUnique("Departamento"),
      areas: getUnique("Area"),
      ciudades: getUnique("Ciudad"),
      veredas: getUnique("Vereda"),
      localidades: getUnique("Localidad")
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      departamento: "",
      area: "",
      ciudad: "",
      vereda: "",
      localidad: ""
    });
  };

  const filteredContacts = contacts.filter((contact) => {
    return (
      (filters.departamento === "" || contact.Departamento === filters.departamento) &&
      (filters.area === "" || contact.Area === filters.area) &&
      (filters.ciudad === "" || contact.Ciudad === filters.ciudad) &&
      (filters.vereda === "" || contact.Vereda === filters.vereda) &&
      (filters.localidad === "" || contact.Localidad === filters.localidad)
    );
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key] || "";
    const valB = b[sortConfig.key] || "";
  
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
    

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen) setEditingContact(null);
  };

  const handleCloseForm = () => {
    setEditingContact(null);
    setIsSidebarOpen(false);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setIsSidebarOpen(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsSidebarOpen(true);
    setActionContact(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este contacto?")) return;
    try {
      await deleteContact(id);
      loadContacts();
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      alert("No tienes permisos para esta acción");
    }
    setActionContact(null);
  };

  return (
    <div className="admin-container">
      <h2>
        {isSupport
          ? "Administración de Contactos (Soporte)"
          : "Administración de Contactos"}
      </h2>

      {isSupport && localStorage.getItem("serv_name") && (
        <p style={{ marginTop: "-10px", marginBottom: "15px", fontWeight: "500", color: "#444" }}>
          El usuario soporte tiene el tipo de servicio: {localStorage.getItem("serv_name")}
        </p>
      )}

      <button className="btn btn-add" onClick={handleAddNew}>
        ➕ Agregar Contacto
      </button>

      {/* Filtros para admin */}
      <div className="filter-container" style={{ margin: "20px 0", display: "flex", flexWrap: "wrap", gap: "10px" }}>
  
  {/* Solo para Admin */}
  {!isSupport && (
    <>
      <select name="departamento" value={filters.departamento} onChange={handleFilterChange}>
        <option value="">Todos los Departamentos</option>
        {filterOptions.departamentos.map((d, i) => (
          <option key={i} value={d}>{d}</option>
        ))}
      </select>

      <select name="area" value={filters.area} onChange={handleFilterChange}>
        <option value="">Todas las Áreas</option>
        {filterOptions.areas.map((a, i) => (
          <option key={i} value={a}>{a}</option>
        ))}
      </select>
      
      <select name="ciudad" value={filters.ciudad} onChange={handleFilterChange}>
        <option value="">Todas las Ciudades</option>
        {filterOptions.ciudades.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </select>
    </>
  )}

  {/* Para Admin y Soporte */}
  <select name="vereda" value={filters.vereda} onChange={handleFilterChange}>
    <option value="">Todas las Veredas</option>
    {filterOptions.veredas.map((v, i) => (
      <option key={i} value={v}>{v}</option>
    ))}
  </select>

  <select name="localidad" value={filters.localidad} onChange={handleFilterChange}>
    <option value="">Todas las Localidades</option>
    {filterOptions.localidades.map((l, i) => (
      <option key={i} value={l}>{l}</option>
    ))}
  </select>

  <button onClick={handleClearFilters} className="btn" style={{ backgroundColor: "#f0f0f0", border: "1px solid #ccc", color: "#333" }}>
    Limpiar Filtros ✖️
  </button>

</div>


      {/* Sidebar con formulario */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        {!isSupport && (
          <button
            onClick={handleCloseForm}
            className="btn btn-close"
            style={{
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#333"
            }}
          >
            Cerrar <span style={{ color: "red" }}>❌</span>
          </button>
        )}

        {isSupport ? (
          <SupportContactForm
            loadContacts={loadContacts}
            editingContact={editingContact}
            setEditingContact={setEditingContact}
            closeForm={() => setIsSidebarOpen(false)}
            userLevels={currentUserLevels}
          />
        ) : (
          <ContactForm
            loadContacts={loadContacts}
            editingContact={editingContact}
            setEditingContact={setEditingContact}
            closeForm={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* Contador de registros */}
      <div className="contador-registros">
        <p className="total">Total de contactos: {contacts.length}</p>
        <p className="filtrados">Contactos filtrados: {filteredContacts.length}</p>
      </div>



      {/* Tabla de contactos */}
      <div className="table-container">
        <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Tipo de Contacto</th>
            {!isSupport && (
              <th
                onClick={() => handleSort("Departamento")}
                className={sortConfig.key === "Departamento" ? (sortConfig.direction === "asc" ? "asc" : "desc") : ""}
              >
                Departamento {sortConfig.key === "Departamento" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
            )}
            {!isSupport && (
              <th
                onClick={() => handleSort("Area")}
                className={sortConfig.key === "Area" ? (sortConfig.direction === "asc" ? "asc" : "desc") : ""}
              >
                Área {sortConfig.key === "Area" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
            )}
            <th onClick={() => handleSort("Ciudad")}>
              Ciudad {sortConfig.key === "Ciudad" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("Vereda")}>
              Vereda {sortConfig.key === "Vereda" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("Localidad")}>
              Localidad {sortConfig.key === "Localidad" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>

          <tbody>
          {sortedContacts.length > 0 ? (
            sortedContacts.map((contact) => (
                <tr key={contact.Cont_ID}>
                  <td>{contact.Cont_Name}</td>
                  <td>{contact.Cont_Phone}</td>
                  <td>{contact.Cont_Email}</td>
                  <td>{contact.TipoContacto || "No especificado"}</td>
                  {!isSupport && <td>{contact.Departamento || "No especificado"}</td>}
                  {!isSupport && <td>{contact.Area || "No especificada"}</td>}
                  <td>{contact.Ciudad || "No especificada"}</td>
                  <td>{contact.Vereda || "No especificada"}</td>
                  <td>{contact.Localidad || "No especificada"}</td>
                  <td className="actions-cell">
                    <button className="btn btn-edit" onClick={() => handleEdit(contact)}>✏️</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(contact.Cont_ID)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isSupport ? 8 : 10} className="no-contacts">
                  No hay contactos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContacts;
  