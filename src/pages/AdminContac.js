import React, { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../api/contacts";
import { getSupportContacts } from "../api/soporte";
import ContactForm from "../components/ContactForm";
import SupportContactForm from "../components/SupportContactForm";
import useDynamicFilters from "../components/Hooks/useDynamicFilters";
import "../assets/css/admin.css";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [actionContact, setActionContact] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

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

  const { filters, filterOptions, filteredData, handleFilterChange, handleClearFilters } = useDynamicFilters(contacts);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = isSupport ? await getSupportContacts(currentUserServId) : await getContacts();
      setContacts(data);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
      alert("Error al cargar contactos");
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        return { key, direction: "asc" };
      }
    });
  };
  

  const sortedContacts = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key] || "";
    const valB = b[sortConfig.key] || "";

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const searchedContacts = sortedContacts.filter((contact) => {
    const term = searchTerm.toLowerCase();
    return (
      contact.Cont_Name?.toLowerCase().includes(term) ||
      contact.Cont_Phone?.toLowerCase().includes(term) ||
      contact.Cont_Email?.toLowerCase().includes(term)
    );
  });

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
  {/* Encabezado con título y botón en la misma fila */}
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <h2 style={{ margin: 0 }}>
      {isSupport
        ? "Administración de Contactos (Soporte)"
        : "Administración de Contactos"}
    </h2>

    <button className="btn btn-add" onClick={handleAddNew}>
      ➕ Agregar Contacto
    </button>
  </div>
  {/* Mostrar el nombre del servicio si existe */}
  {isSupport && localStorage.getItem("serv_name") && (
    <p style={{ marginTop: "5px", marginBottom: "15px", fontWeight: "500", color: "#444" }}>
      El usuario soporte tiene el tipo de servico: {localStorage.getItem("serv_name")}
    </p>
  )}

      {/* Filtros */}
      <div className="filter-container" style={{ margin: "20px 0", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {/* Solo para Admin */}
        {!isSupport && (
          <>
            <select name="departamento" value={filters.departamento} onChange={handleFilterChange}>
              <option value="">Todos los Departamentos</option>
              {filterOptions.departamentos.map((d, i) => <option key={i} value={d}>{d}</option>)}
            </select>

            <select name="area" value={filters.area} onChange={handleFilterChange}>
              <option value="">Todas las Áreas</option>
              {filterOptions.areas.map((a, i) => <option key={i} value={a}>{a}</option>)}
            </select>
          
            <select name="ciudad" value={filters.ciudad} onChange={handleFilterChange}>
              <option value="">Todas las Ciudades</option>
              {filterOptions.ciudades.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
          </>
        )}

        {/* Para Admin y Soporte */}
        <select name="vereda" value={filters.vereda} onChange={handleFilterChange}>
          <option value="">Todas las Veredas</option>
          {filterOptions.veredas.map((v, i) => <option key={i} value={v}>{v}</option>)}
        </select>

        <select name="localidad" value={filters.localidad} onChange={handleFilterChange}>
          <option value="">Todas las Localidades</option>
          {filterOptions.localidades.map((l, i) => <option key={i} value={l}>{l}</option>)}
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
            style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: "5px", color: "#333" }}
          >
            Cerrar <span style={{ color: "red" }}>❌</span>
          </button>
        )}

        {isSupport ? (
          <SupportContactForm loadContacts={loadContacts} editingContact={editingContact} setEditingContact={setEditingContact} closeForm={() => setIsSidebarOpen(false)} userLevels={currentUserLevels} />
        ) : (
          <ContactForm loadContacts={loadContacts} editingContact={editingContact} setEditingContact={setEditingContact} closeForm={() => setIsSidebarOpen(false)} />
        )}
      </div>

      {/* Contador de registros con input en el medio */}
        <div className="contador-registros">
          <p className="total">Total de Contactos: {contacts.length}</p>

          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <p className="filtrados">Contactos filtrados: {searchedContacts.length}</p>
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
                <>
                  <th onClick={() => handleSort("Departamento")}>
                    Departamento {sortConfig.key === "Departamento" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
                  </th>
                  <th onClick={() => handleSort("Area")}>
                    Área {sortConfig.key === "Area" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
                  </th>
                </>
              )}
              <th onClick={() => handleSort("Ciudad")}>
                Ciudad {sortConfig.key === "Ciudad" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
              </th>
              <th onClick={() => handleSort("Vereda")}>
                Vereda {sortConfig.key === "Vereda" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
              </th>
              <th onClick={() => handleSort("Localidad")}>
                Localidad {sortConfig.key === "Localidad" ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {searchedContacts.length > 0 ? (
            searchedContacts.map((contact) => (
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
