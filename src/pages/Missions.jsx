import { useState } from "react";
import useMissions from "../hooks/useMissions";
import CreateMissionModal from "../models/CreateMissionModal";
import "../styles/mission.css";

const Missions = () => {
  const { missions, loading, error, refetch } = useMissions();
  const [open, setOpen] = useState(false);

  if (loading) return <p className="status">Cargando misiones...</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  return (
    <div className="missions-container">
      {/* HEADER */}
      <div className="missions-header">
        <h2>Missions</h2>

        <button
          className="btn-primary"
          onClick={() => setOpen(true)}
        >
          + Añadir Mission
        </button>
      </div>

      {/* TABLE */}
      {missions.length === 0 ? (
        <p className="empty">No hay misiones registradas</p>
      ) : (
        <div className="table-wrapper">
          <table className="missions-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Transfer Day</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m) => (
                <tr key={m.id}>
                  <td className="bold">{m.name}</td>
                  <td>{m.country}</td>
                  <td>{m.transfer_day || "-"}</td>
                  <td>
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <CreateMissionModal
          onClose={() => setOpen(false)}
          onCreated={refetch}
        />
      )}
    </div>
  );
};

export default Missions;
