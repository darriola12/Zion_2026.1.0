import { useParams } from "react-router-dom";
import useOrdersCampana from "../hooks/Campanas/userOrderCampana";
import "../styles/campañas.css";

const CampanaOrders = () => {
  const { id: campanaId } = useParams();

  const { orders, loading, error } = useOrdersCampana({
    campaignId: campanaId,
  });

  if (loading) return <p className="status">Cargando órdenes...</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  return (
    <div className="campañas-container">
      <div className="campañas-header">
        <h2>Órdenes de la Campaña</h2>
      </div>

      {orders.length === 0 ? (
        <p className="empty">
          No hay órdenes registradas para esta campaña
        </p>
      ) : (
        <div className="table-wrapper">
          <table className="campañas-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Subtotal</th>
                <th>Descuento</th>
                <th>Total</th>
                <th>Pagado</th>
                <th>Creado</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.Customer?.Last_name || "—"}</td>
                  <td>{order.Subtotal}</td>
                  <td>{order.Discount}</td>
                  <td>{order.Total}</td>
                  <td className={order.Pagado ? "paid-text" : "unpaid-text"}>
                    {order.Pagado ? "Sí" : "No"}
                  </td>
                  <td>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CampanaOrders;


