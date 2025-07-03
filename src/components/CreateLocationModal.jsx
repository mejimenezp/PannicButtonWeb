import React, { useState } from "react";
import {
  createDepartamento,
  createArea,
  createCiudad,
  createVereda,
  createLocalidad,
} from "../api/locations";
import "../assets/css/modal.css";

const CreateLocationModal = ({ level, sel, onSuccess, close }) => {
  const [name, setName] = useState("");

  const save = async () => {
    try {
      switch (level) {
        case "departamento":
          await createDepartamento(name);                // { dpto_name }
          break;

        case "area":
          await createArea({
            dpto_id:  sel.dpto,
            area_name: name,
          });
          break;

        case "ciudad":
          await createCiudad({
            dpto_id:  sel.dpto,
            area_id:  sel.area,
            ciud_name: name,
          });
          break;

        case "vereda":
          await createVereda({
            dpto_id:  sel.dpto,
            area_id:  sel.area,
            ciud_id:  sel.ciud,
            vere_name: name,
          });
          break;

        case "localidad":
          await createLocalidad({
            dpto_id:  sel.dpto,
            area_id:  sel.area,
            ciud_id:  sel.ciud,
            vere_id:  sel.vere,
            loca_name: name,
          });
          break;

        default:
          return;
      }
      onSuccess();          // refresca la lista en AdminGeo
    } catch (err) {
      console.error("Error al crear:", err);
      alert("No se pudo guardar la localización");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={close}>×</button>
        <h3>Nueva {level}</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Nombre de la ${level}`}
        />

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button onClick={save}>Guardar</button>
          <button onClick={close}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateLocationModal;
