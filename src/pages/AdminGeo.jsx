import React, { useEffect, useState } from "react";
import {
  getDepartamentos, getAreas, getCiudades,
  getVeredas, getLocalidades
} from "../api/locations";
import CreateModal from "../components/CreateLocationModal";
import "../assets/css/adminGeo.css";



const AdminGeo = () => {
const currentUserRole = localStorage.getItem("role");
const isSupport = currentUserRole === "support";
    
  /* ─── datos del soporte ─────────────────────────────── */
  const serv_id = Number(localStorage.getItem("serv_id"));   // 1-5
  const dpto_id = Number(localStorage.getItem("Dpto_ID"));
  const area_id = Number(localStorage.getItem("Area_ID"));
  const ciud_id = Number(localStorage.getItem("Ciud_ID"));
  const vere_id = Number(localStorage.getItem("Vere_ID"));

  /* ─── selects state ─────────────────────────────────── */
  const [sel, setSel] = useState({
    dpto: dpto_id || "",
    area: area_id || "",
    ciud: ciud_id || "",
    vere: vere_id || "",
    loca: ""
  });
  const [feedback, setFeedback] = useState(null);
  const [dptos, setDptos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ciuds, setCiuds] = useState([]);
  const [veres, setVeres] = useState([]);
  const [locas, setLocas] = useState([]);

  const [modal, setModal] = useState(null);          

  /* ─── permisos ──────────────────────────────────────── */
  const canCreate = isSupport
  ? {                      // reglas de soporte (basadas en serv_id)
      departamento: serv_id >= 5,
      area:         serv_id >= 4,
      ciudad:       serv_id >= 3,
      vereda:       serv_id >= 2,
      localidad:    serv_id >= 1,
    }
  : {                      // administrador: todo habilitado
      departamento: true,
      area:         true,
      ciudad:       true,
      vereda:       true,
      localidad:    true,
    };


  const alias = { dpto:"departamento", area:"area", ciud:"ciudad", vere:"vereda", loca:"localidad" };
  const rank  = { dpto:5, area:4, ciud:3, vere:2, loca:1 };   // jerarquía

  /* ─── carga inicial / cascada ───────────────────────── */
  useEffect(() => {
    (async () => {
      setDptos(await getDepartamentos());

      if (sel.dpto)  setAreas(await getAreas(sel.dpto));
      if (sel.area)  setCiuds(await getCiudades(sel.area));
      if (sel.ciud)  setVeres(await getVeredas(sel.ciud));
      if (sel.vere)  setLocas(await getLocalidades(sel.vere));
    })();
  }, [sel.dpto, sel.area, sel.ciud, sel.vere]);

  /* ─── handler de cambio ─────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSel(prev => {
      const next = { ...prev, [name]: value };
      if (name === "dpto") { next.area = next.ciud = next.vere = next.loca = ""; }
      else if (name === "area") { next.ciud = next.vere = next.loca = ""; }
      else if (name === "ciud") { next.vere = next.loca = ""; }
      else if (name === "vere") { next.loca = ""; }
      return next;
    });
  };

  /* ─── componente Select reutilizable ────────────────── */
  const Select = ({ label, name, list, disabledBase }) => {
    const level      = alias[name];         
    const readOnly = isSupport && rank[name] >= serv_id;
    const disabled   = disabledBase || readOnly;

    return (
      <div className="form-group">
        <label>{label}</label>

        <select
          name={name}
          value={sel[name]}
          onChange={handleChange}
          disabled={disabled}
        >
          <option value="">
            {sel[name]
                ? `Sin ${label.toLowerCase()} `
                : `Seleccionar ${label.toLowerCase()} `}
            </option>

          {list.map(o => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>

        {canCreate[level] && !readOnly && (
          <div className="tooltip-wrapper">
            <button onClick={() => setModal({ level })}>+ Añadir</button>
            <span className="tooltip-text"> Añadir un {level}</span>
          </div>

        )}
      </div>
    );
  };

 
  return (
    <div className="geo-page">
       <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {isSupport
            ? "Gestión de Estructura Geográfica (Soporte)"
            : "Gestión de Estructura Geográfica"}

        {/* Tooltip */}
        <span className="tooltip-wrapper">
            ℹ️
            <span className="tooltip-text">
            La nueva ubicación se agregará dentro de la ubicación seleccionada.
            </span>
        </span>
        </h2>

      
      {feedback && (
  <div
    className={`feedback ${feedback.type}`}
    style={{
      marginBottom: "1rem",
      padding: "10px",
      backgroundColor: feedback.type === "success" ? "#d4edda" : "#f8d7da",
      color: feedback.type === "success" ? "#155724" : "#721c24",
      border: `1px solid ${feedback.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
      borderRadius: "4px",
      textAlign: "center",
    }}
  >
    {feedback.message}
  </div>
)}


      {/* Departamento (visible si existe) */}
      {dptos.length > 0 && (
        <Select
          label="Departamento"
          name="dpto"
          list={dptos.map(d => ({ id: d.Dpto_ID, name: d.Dpto_Name }))}
          disabledBase={isSupport && serv_id !== 5}
        />
      )}

      {/* Área */}
      <Select
        label="Área"
        name="area"
        list={areas.map(a => ({ id: a.Area_ID, name: a.Area_Name }))}
        disabledBase={!sel.dpto}
      />

      {/* Ciudad */}
      <Select
        label="Ciudad"
        name="ciud"
        list={ciuds.map(c => ({ id: c.Ciud_ID, name: c.Ciud_Name }))}
        disabledBase={!sel.area}
      />

      {/* Vereda */}
      <Select
        label="Vereda"
        name="vere"
        list={veres.map(v => ({ id: v.Vere_ID, name: v.Vere_Name }))}
        disabledBase={!sel.ciud}
      />

      {/* Localidad */}
      <Select
        label="Localidad"
        name="loca"
        list={locas.map(l => ({ id: l.Loca_ID, name: l.Loca_Name }))}
        disabledBase={!sel.vere}
      />

      

      {/* Modal de creación */}
     {modal && (console.log("⏫ Renderizando modal:", modal), 
        <CreateModal
            level={modal.level}
            sel={sel}  
            close={() => setModal(null)}
            onSuccess={async () => {
                try {
                if (modal.level === "area")   setAreas(await getAreas(sel.dpto));
                if (modal.level === "ciudad") setCiuds(await getCiudades(sel.area));
                if (modal.level === "vereda") setVeres(await getVeredas(sel.ciud));
                if (modal.level === "localidad") setLocas(await getLocalidades(sel.vere));
                if (modal.level === "departamento") setDptos(await getDepartamentos());

                setFeedback({ type: "success", message: `✅ ${modal.level} creada exitosamente.` });
                } catch (e) {
                setFeedback({ type: "error", message: `❌ Error al crear ${modal.level}.` });
                } finally {
                setModal(null);
                setTimeout(() => setFeedback(null), 3000); // limpiar mensaje
                }
            }}
            />

      )}
    </div>
  );
};

export default AdminGeo;
