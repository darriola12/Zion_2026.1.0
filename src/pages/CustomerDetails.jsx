import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/superbase";

// Hooks y modales
import useOrdersResume from "../hooks/useOrder";
import CreateOrderModal from "../models/CreateOrderModal";
import OrderDetailsModal from "../models/CreateOrderDetailModal";
import CreateOrderDetailsModal from "../models/CreateUpdateOrderModal";

// Estilos
import "../styles/customer.css";

const Orders = () => {
  /* =========================
     📌 PARAMS
     ========================= */
  // customerId viene desde la URL (/customers/:id/orders)
  const { id: customerId } = useParams();

  /* =========================
     📦 DATA (HOOK)
     ========================= */
  // Hook que trae las órdenes del customer
  const { orders, loading, error, refetch } = useOrdersResume(customerId);

  /* =========================
     🧠 STATES (UI)
     ========================= */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderToEdit, setOrderToEdit] = useState(null);

  /* =========================
     ✏️ EDITAR ORDEN
     ========================= */
  const handleEditOrder = (order) => {
    setOrderToEdit(order);
  };

  /* =========================
     ✅ UPDATE CHECKBOX (Pagado / Reportado)
     ========================= */
  const updateOrderStatus = async (orderId, field, value) => {
    const { error } = await supabase
      .from("Order")
      .update({ [field]: value })
      .eq("id", orderId);

    if (error) {
      alert("Error actualizando el estado");
      console.error(error);
    } else {
      refetch(); // 🔄 refresca SOLO orders
    }
  };

  /* =========================
     🗑️ SOFT DELETE ORDEN
     ========================= */
  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta orden?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("Order")
      .update({
        soft_deleted: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      alert("Error eliminando la orden");
      console.error(error);
    } else {
      refetch(); // 🔄 refresca tabla
    }
  };

  /* =========================
     ⏳ STATES UI
     ========================= */
  if (loading) return <p className="status">Cargando órdenes...</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  /* =========================
     🧱 RENDER
     ========================= */
  return (
    <div className="customer-container">
      {/* ================= HEADER ================= */}
      <div className="customer-header">
        <h2>Orders</h2>

        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Crear Order
        </button>
      </div>

      {/* ================= TABLE ================= */}
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
                  {/* MISSION */}
                  <td onClick={() => setSelectedOrderId(order.id)}>
                    {order.Customer?.Mission?.name || "—"}
                  </td>

                  {/* SUBTOTAL */}
                  <td onClick={() => setSelectedOrderId(order.id)}>
                    ${Number(order.Subtotal).toFixed(2)}
                  </td>

                  {/* DISCOUNT */}
                  <td onClick={() => setSelectedOrderId(order.id)}>
                    ${Number(order.Discount).toFixed(2)}
                  </td>

                  {/* TOTAL */}
                  <td
                    className="bold"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    ${Number(order.Total).toFixed(2)}
                  </td>

                  {/* FECHA */}
                  <td onClick={() => setSelectedOrderId(order.id)}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  {/* ACCIONES */}
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {/* EDITAR */}
                      <button
                        className="btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOrder(order);
                        }}
                      >
                        ✏️
                      </button>

                      {/* ELIMINAR */}
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrder(order.id);
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>

                  {/* PAGADO */}
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

                  {/* REPORTADO */}
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

      {/* ================= MODALES ================= */}

      {/* CREAR ORDEN */}
      {showCreateModal && (
        <CreateOrderModal
          customerId={customerId}
          onClose={() => setShowCreateModal(false)}
          onCreated={refetch}
        />
      )}

      {/* VER DETALLES */}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      {/* EDITAR ORDEN */}
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
