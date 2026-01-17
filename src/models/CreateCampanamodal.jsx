import { useState } from "react";
import { supabase } from "../lib/superbase";
import useMissions from "../hooks/useMissions";
import "../styles/campañas.css";

const CreateCampañaModal = ({ onClose, onCreated }) => {
  const [campaña, setCampaña] = useState("");
  const [country, setCountry] = useState("");
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { missions } = useMissions("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!campaña || !country || !mission) {
      setError("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("campañas")
      .insert([
        {
          campaña: campaña.trim(),
          country: country.trim(),
          campana_mission_id: mission, // ✅ guarda el ID
        },
      ]);

    if (error) {
      setError(error.message);
    } else {
      onCreated();
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h3>Crear Campaña</h3>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* CAMPAÑA */}
          <input
            type="text"
            placeholder="Nombre de la campaña"
            value={campaña}
            onChange={(e) => setCampaña(e.target.value)}
            required
          />

          {/* PAÍS */}
          <input
            type="text"
            placeholder="País"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />

          {/* MISIÓN */}
          <select
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            required
          >
            <option value="">Seleccionar misión</option>
            {missions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampañaModal;
