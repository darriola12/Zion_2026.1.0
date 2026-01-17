import React, { useState } from "react";
import useCampañas from "../hooks/Campanas/useCampanas";
import CreateCampañaModal from "../models/CreateCampanamodal";
import "../styles/campañas.css";
import { useNavigate } from "react-router-dom";
  
const CampañasPage = () => {    
  const { campañas, loading, error, refetch } = useCampañas(); // ✅ refetch
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (loading) return <p className="status">Cargando campañas...</p>;
  if (error) return <p className="status error">Error: {error}</p>;
  return (
    <div className="campañas-container">
      {/* HEADER */}
      <div className="campañas-header">
        <h2>Campañas</h2>

        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Añadir campaña
        </button>
      </div>

      {/* TABLE */}
      {campañas.length === 0 ? (
        <p className="empty">No hay campañas registradas</p>
      ) : (
        <div className="table-wrapper">
          <table className="campañas-table">
            <thead>
              <tr>
                <th>Campaña</th>
                <th>País</th>
                <th>Creado</th>
              </tr>
            </thead>

            <tbody>
              {campañas.map((campaña) => (
                <tr key={campaña.id}>
                  <td className="bold"
                      style={{cursor: "pointer"}}
                      onClick={() => navigate(`/data/campañas/${campaña.id}`)}

                   
                   >{campaña.campaña}</td>
                  <td>{campaña.country || "—"}</td>
                  <td>
                    {new Date(campaña.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <CreateCampañaModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            refetch();        // ✅ vuelve a cargar campañas
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CampañasPage;
