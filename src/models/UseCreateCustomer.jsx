import { useState } from "react";
import { supabase } from "../lib/superbase";
import useMissions from "../hooks/useMissions";
import "../styles/customer.css";

const CreateCustomerModal = ({ onClose, onCreated }) => {
  const [lastName, setLastName] = useState("");
  const [entityData, setEntityData] = useState("");
  const [missionId, setMissionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { missions, loading: loadingMissions } = useMissions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("Customer")
        .insert([
          {
            Last_name: lastName,
            Entity_data: entityData ? JSON.parse(entityData) : null,
            customer_mission_id: missionId,
          },
        ])
        .select()
        .single(); // 👈 MUY IMPORTANTE

      if (error) throw error;

      // 👇 DEVOLVEMOS EL ID AL PADRE
      onCreated(data.id);

      onClose();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h3>Crear Customer</h3>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <textarea
            placeholder="Entity data (JSON opcional)"
            value={entityData}
            onChange={(e) => setEntityData(e.target.value)}
            rows={3}
          />

          <select
            value={missionId}
            onChange={(e) => setMissionId(e.target.value)}
            required
          >
            <option value="">
              {loadingMissions ? "Cargando misiones..." : "Seleccionar misión"}
            </option>
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

export default CreateCustomerModal;
