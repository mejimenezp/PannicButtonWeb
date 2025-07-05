import React, { useEffect, useState } from "react";
import {
  getDepartamentos,
  getAreas,
  getCiudades,
  getVeredas,
  getLocalidades,
} from "../api/locations";
import { getUsers } from "../api/users";
import { getSupportUsers } from "../api/soporte";
import { sendMassEmail } from "../api/emails";
import "../assets/css/mass-email.css";  

const rank = { dpto: 5, area: 4, ciud: 3, vere: 2, loca: 1 };

export default function MassEmail() {
  const role = localStorage.getItem("role");
  const isSupport = role === "support";
  const servId = Number(localStorage.getItem("serv_id") || 0);

  const initSel = {
    dpto: localStorage.getItem("Dpto_ID") || "",
    area: localStorage.getItem("Area_ID") || "",
    ciud: localStorage.getItem("Ciud_ID") || "",
    vere: localStorage.getItem("Vere_ID") || "",
    loca: "",
  };

  const [sel, setSel] = useState(isSupport ? initSel : { dpto: "", area: "", ciud: "", vere: "", loca: "" });
  const [dptos, setDptos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ciuds, setCiuds] = useState([]);
  const [veres, setVeres] = useState([]);
  const [locas, setLocas] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [checked, setChecked] = useState(new Set());
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);


  const reset = (obj) => setSel((p) => ({ ...p, ...obj }));
  const match = (val, uVal) => !val || String(val) === String(uVal);

  /* carga inicial */
  useEffect(() => {
    (async () => {
      setDptos(await getDepartamentos());
      if (sel.dpto) setAreas(await getAreas(sel.dpto));
      if (sel.area) setCiuds(await getCiudades(sel.area));
      if (sel.ciud) setVeres(await getVeredas(sel.ciud));
      if (sel.vere) setLocas(await getLocalidades(sel.vere));
      if (isSupport) loadRecipients();
    })();
  }, []);

  /* cascada */
  useEffect(() => { sel.dpto && getAreas(sel.dpto).then(setAreas); }, [sel.dpto]);
  useEffect(() => { sel.area && getCiudades(sel.area).then(setCiuds); }, [sel.area]);
  useEffect(() => { sel.ciud && getVeredas(sel.ciud).then(setVeres); }, [sel.ciud]);
  useEffect(() => { sel.vere && getLocalidades(sel.vere).then(setLocas); }, [sel.vere]);

  /* buscar usuarios */
  const loadRecipients = async () => {
    const users = isSupport ? await getSupportUsers(servId) : await getUsers();

    const filtered = users.filter((u) => {
      const dpto = u.Dpto_ID ?? u.Departamento_ID;
      const area = u.Area_ID;
      const ciud = u.Ciud_ID ?? u.Ciudad_ID;
      const vere = u.Vere_ID ?? u.Vereda_ID;
      const loca = u.Loca_ID ?? u.Localidad_ID;
      return (
        match(sel.dpto, dpto) &&
        match(sel.area, area) &&
        match(sel.ciud, ciud) &&
        match(sel.vere, vere) &&
        match(sel.loca, loca)
      );
    });

    setRecipients(filtered);
    setChecked(new Set());
  };

  /* check individual / select-all */
  const toggle = (email) =>
    setChecked((p) => {
      const s = new Set(p);
      s.has(email) ? s.delete(email) : s.add(email);
      return s;
    });

  const toggleAll = () =>
    setChecked((p) =>
      p.size === recipients.length
        ? new Set()
        : new Set(recipients.map((u) => u.Usua_Email))
    );

    

  /* enviar */
 const send = async () => {
  if (!subject.trim() || !body.trim() || checked.size === 0) {
    return alert("Asunto, cuerpo y destinatarios requeridos");
  }
  setSending(true);
  try {
    await sendMassEmail({
      to: Array.from(checked),
      subject,
      message: body,
    });
    setStatus({ ok: true, msg: `Enviado a ${checked.size} usuario(s).` });
  } catch {
    setStatus({ ok: false, msg: "Error al enviar correos." });
  } finally {
    setSending(false);
    setTimeout(() => setStatus(null), 3500);
  }
};


  /* helper UI select condicional */
  const Select = ({ label, name, list, parentEmpty }) => {
    if (isSupport && rank[name] >= servId) return null; // escondido para soporte
    return (
      <select
        value={sel[name]}
        disabled={parentEmpty}
        onChange={(e) => {
          const v = e.target.value;
          const clean =
            name === "dpto"
              ? { dpto: v, area: "", ciud: "", vere: "", loca: "" }
              : name === "area"
              ? { area: v, ciud: "", vere: "", loca: "" }
              : name === "ciud"
              ? { ciud: v, vere: "", loca: "" }
              : name === "vere"
              ? { vere: v, loca: "" }
              : { loca: v };
          reset(clean);
        }}
      >
        <option value="">
          {sel[name] ? `Sin ${label.toLowerCase()}` : `Seleccionar ${label.toLowerCase()}`}
        </option>
        {list.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="mass-email">
      <h2> {isSupport
          ? "Envio de correos (Soporte)"
          : "Envio de correos"}</h2>

      {status && (
        <div
          style={{
            margin: "10px 0",
            padding: "8px",
            borderRadius: 6,
            color: status.ok ? "#155724" : "#721c24",
            background: status.ok ? "#d4edda" : "#f8d7da",
            border: `1px solid ${status.ok ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {status.msg}
        </div>
      )}

      <div className="filters">
        <Select
          label="Departamento"
          name="dpto"
          list={dptos.map((d) => ({ id: d.Dpto_ID, name: d.Dpto_Name }))}
        />
        <Select
          label="Área"
          name="area"
          list={areas.map((a) => ({ id: a.Area_ID, name: a.Area_Name }))}
          parentEmpty={!sel.dpto}
        />
        <Select
          label="Ciudad"
          name="ciud"
          list={ciuds.map((c) => ({ id: c.Ciud_ID, name: c.Ciud_Name }))}
          parentEmpty={!sel.area}
        />
        <Select
          label="Vereda"
          name="vere"
          list={veres.map((v) => ({ id: v.Vere_ID, name: v.Vere_Name }))}
          parentEmpty={!sel.ciud}
        />
        <Select
          label="Localidad"
          name="loca"
          list={locas.map((l) => ({ id: l.Loca_ID, name: l.Loca_Name }))}
          parentEmpty={!sel.vere}
        />
        <button onClick={loadRecipients}>🔍 Buscar usuarios</button>
      </div>

      <h4 style={{ marginTop: "20px" }}>
        Destinatarios ({checked.size}/{recipients.length})
      </h4>
    <div className="recipient-box">
    {recipients.length > 0 && (
        <label className="recipient-item">
        <input
            type="checkbox"
            checked={checked.size === recipients.length}
            onChange={toggleAll}
        />
        <span className="recipient-name">
            (Seleccionar / deseleccionar todos)
        </span>
        </label>
    )}

    {recipients.map((u) => (
        <label key={u.Usua_ID} className="recipient-item">
        <input
            type="checkbox"
            checked={checked.has(u.Usua_Email)}
            onChange={() => toggle(u.Usua_Email)}
        />
        <span className="recipient-name">
            <strong>{u.Usua_Name}</strong> — {u.Usua_Email}
        </span>
        </label>
    ))}

    {recipients.length === 0 && (
        <p className="empty">Sin usuarios.</p>
    )}
    </div>


      <div style={{ marginTop: "15px" }}>
        <input
          type="text"
          placeholder="Asunto"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <textarea
          rows="6"
          placeholder="Mensaje"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <button
        className="send-btn"
        onClick={send}
        disabled={sending}
        >
        {sending ? "Enviando..." : "📧 Enviar correo"}
        </button>

    </div>
  );
}
