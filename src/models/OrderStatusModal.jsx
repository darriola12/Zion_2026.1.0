import { supabase } from "../lib/superbase";
import "../styles/order.css";

const OrderStatusModal = ({ statusModal, onClose, refetch }) => {
  const { order, field } = statusModal;
  const newValue = !order[field];

  const handleSave = async () => {
    const { error } = await supabase
      .from("Orders")
      .update({ [field]: newValue })
      .eq("id", order.id);

    if (!error) {
      await refetch(); // 🔥 clave
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <h3>Confirmar cambio</h3>

        <p>
          ¿Deseas marcar <strong>{field}</strong> como{" "}
          <strong>{newValue ? "ACTIVO" : "INACTIVO"}</strong>?
        </p>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;
