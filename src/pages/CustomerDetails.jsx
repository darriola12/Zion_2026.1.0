import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/superbase";
import useOrdersResume from "../hooks/useOrder";
import CreateOrderModal from "../models/CreateOrderModal";
import OrderDetailsModal from "../models/CreateOrderDetailModal";
import CreateOrderDetailsModal from "../models/CreateUpdateOrderModal";
import "../styles/customer.css";

const Orders = () => {
  // 👇 customerId desde URL
  const { id: customerId } = useParams();

  // 👇 hook de órdenes
  const { orders, loading, error, refetch } = useOrdersResume(customerId);

  // 👇 estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderToEdit, setOrderToEdit] = useState(null);

  // ✏️ editar orden
  const handleEditOrder = (order) => {
    setOrderToEdit(order);
  };

  // ✅ actualizar Pagado / Reportado
  const updateOrderStatus = async (orderId, field, value) => {
    const { error } = await supabase
      .from("Order")
      .update({ [field]: value })
      .eq("id", orderId);

    if (error) {
      alert("Error actualizando el estado");
      console.error(error);
    } else {
      refetch();
    }
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
        <p className="empty">Este customer no tiene órdenes registradas</p>
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
                <th>Pagado</th>
                <th>Reportado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td onClick={() => setSelectedOrderId(order.id)}>
                    {order.Customer?.Mission?.name || "—"}
                  </td>

                  <td onClick={() => setSelectedOrderId(order.id)}>
                    ${Number(order.Subtotal).toFixed(2)}
                  </td>

                  <td onClick={() => setSelectedOrderId(order.id)}>
                    ${Number(order.Discount).toFixed(2)}
                  </td>

                  <td
                    className="bold"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
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

                  {/* ✅ PAGADO */}
                  <td>
                    <input
                      type="checkbox"
                      checked={order.Pagado}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          "Pagado",
                          e.target.checked
                        )
                      }
                    />
                  </td>

                  {/* ✅ REPORTADO */}
                  <td>
                    <input
                      type="checkbox"
                      checked={order.Reportado}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          "Reportado",
                          e.target.checked
                        )
                      }
                    />
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
          orderData={orderToEdit}
          onClose={() => setOrderToEdit(null)}
          onCreated={refetch}
        />
      )}
    </div>
  );
};

export default Orders;
