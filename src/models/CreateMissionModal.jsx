import { useState } from "react";
import { supabase } from "../lib/superbase";
import "../styles/mission.css";

const CreateMissionModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [transferDay, setTransferDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("Mission").insert([
        {
          name,
          country,
          transfer_day: transferDay || null,
        },
      ]);

      if (error) throw error;

      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* CLOSE */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h3>Crear Mission</h3>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />

          <input
            placeholder="Transfer day"
            value={transferDay}
            onChange={(e) => setTransferDay(e.target.value)}
          />

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

export default CreateMissionModal;
