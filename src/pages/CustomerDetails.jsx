import { useState } from "react";
import { useParams } from "react-router-dom";
import useOrdersResume from "../hooks/useOrder";
import CreateOrderModal from "../models/CreateOrderModal";
import OrderDetailsModal from "../models/CreateOrderDetailModal";
import CreateOrderDetailsModal from "../models/CreateUpdateOrderModal";
import "../styles/customer.css";

const Orders = () => {
  // 👇 customerId viene desde la URL
  const { id: customerId } = useParams();

  // 👇 el hook filtra por customerId
  const { orders, loading, error, refetch } = useOrdersResume(customerId);

  // 👇 modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderToEdit, setOrderToEdit] = useState(null);

  // 👇 función para abrir modal de edición
  const handleEditOrder = (order) => {
    setOrderToEdit(order);
  };

  if (loading) return <p className="status">Cargando órdenes...</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  return (
    <div className="customer-container">
      {/* HEADER */}
      <div className="customer-header">
        <h2>Orders</h2>
        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Order
        </button>
      </div>

      {/* TABLE */}
      {orders.length === 0 ? (
        <p className="empty">
          Este customer no tiene órdenes registradas
        </p>
      ) : (
        <div className="table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Mission</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ cursor: "pointer" }}>

                  <td onClick={() => setSelectedOrderId(order.id)}>
                    {order.Customer?.Mission?.name || "—"}
                  </td>
                  <td onClick={() => setSelectedOrderId(order.id)}>
                    ${Number(order.Subtotal).toFixed(2)}
                  </td>
                  <td onClick={() => setSelectedOrderId(order.id)}>
                    ${Number(order.Discount).toFixed(2)}
                  </td>
                  <td className="bold" onClick={() => setSelectedOrderId(order.id)}>
                    ${Number(order.Total).toFixed(2)}
                  </td>
                  <td onClick={() => setSelectedOrderId(order.id)}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditOrder(order)}
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CREAR ORDEN */}
      {showCreateModal && (
        <CreateOrderModal
          customerId={customerId}
          onClose={() => setShowCreateModal(false)}
          onCreated={refetch}
        />
      )}

      {/* MODAL VER DETALLES */}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      {/* MODAL EDITAR ORDEN */}
      {orderToEdit && (
        <CreateOrderDetailsModal 
          customerId={customerId}
          orderData={orderToEdit} // datos iniciales para editar
          onClose={() => setOrderToEdit(null)}
          onCreated={refetch}
        />
      )}
    </div>
  );
};

export default Orders;
