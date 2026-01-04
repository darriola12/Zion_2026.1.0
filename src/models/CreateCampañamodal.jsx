import { useState } from "react";
import { supabase } from "../lib/superbase";
import "../styles/campañas.css";

const CreateCampañaModal = ({ onClose, onCreated }) => {
  const [campaña, setCampaña] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !country) {
      setError("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("campañas") // 👈 respeta mayúsculas si así está en Supabase
      .insert([
        {
          campaña: campaña.trim(),
          country: country.trim(),
        },
      ]);

    if (error) {
      setError(error.message);
    } else {
      onCreated(); // refresca tabla
      onClose();   // cierra modal
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button
          className="modal-close"
          onClick={onClose}
        >
          ✕
        </button>

        <h3>Crear Campaña</h3>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* NOMBRE */}
          <input
            type="text"
            placeholder="Nombre de la campaña"
            value={campaña}
            onChange={(e) => setName(e.target.value)}
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
