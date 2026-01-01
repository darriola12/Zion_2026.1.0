import { useState, useEffect } from "react";
import { supabase } from "../lib/superbase";
import "../styles/order.css";

const OrderDetailsModal = ({ orderId, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("order_details")
          .select(`*`)
          .eq("order_id", orderId)

        if (error) throw error;

        setItems(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [orderId]);

  return (
    <div className="modal-overlay">
      <div className="modal-box small">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2>Detalles de la Orden</h2>

        {loading && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p>No hay productos en esta orden.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="modal-table-wrapper">
            <table className="details-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Imagen</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => 
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description || "-"}</td>
                    <td>${item.price}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price * item.quantity}</td>
                    <td>
                       {item.image ? (
                         <a
                           href={item.image}
                           target="_blank"
                           rel="noopener noreferrer"
                           title="Ver imagen en tamaño completo"
                         >
                           <img
                             src={item.image}
                             alt={item.name}
                             style={{
                               width: 120,
                               height: 120,
                               objectFit: "cover",
                               borderRadius: 10,
                               cursor: "pointer",
                             }}
                           />
                         </a>
                       ) : (
                         <span>Sin imagen</span>
                       )}
                    </td>

                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
