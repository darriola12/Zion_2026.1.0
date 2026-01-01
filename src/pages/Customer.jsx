import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomer from "../hooks/useCustomer";
import CreateCustomerModal from "../models/UseCreateCustomer";
import CreateOrderModal from "../models/CreateOrderModal";
import "../styles/customer.css";
import { softDeleteCustomer } from "../models/deleteCustomer";

const Customer = () => {
  const { customer, error, loading, refetch } = useCustomer();

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const navigate = useNavigate();

  if (loading) return <p className="status">Cargando clientes...</p>;
  if (error) return <p className="status error">Error: {error}</p>;

const handleDeleteCustomer = async (id) => {
  const confirmDelete = window.confirm(
    "¿Estás seguro de eliminar este customer?"
  );

  if (!confirmDelete) return;

  try {
    await softDeleteCustomer(id);
    refetch();
  } catch (err) {
    alert(err.message);
  }
};




  return (
    <div className="customer-container">
      {/* HEADER */}
      <div className="customer-header">
        <h2>Clientes</h2>
        <button
          className="btn-primary"
          onClick={() => setShowCustomerModal(true)}
        >
          + Crear Customer
        </button>
      </div>

      {/* TABLE */}
      {customer.length === 0 ? (
        <p className="empty">No hay clientes registrados</p>
      ) : (
        <div className="table-wrapper">
          <table className="customer-table">
<thead>
  <tr>
    <th>Last Name</th>
    <th>Misión</th>
    <th>Creado</th>
    <th>Acciones</th>
  </tr>
</thead>

<tbody>
  {customer.map((c) => (
    <tr key={c.id}>
      <td
        className="bold"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/data/customers/detail/${c.id}`)}
      >
        {c.Last_name}
      </td>
      <td>{c.Mission?.name || "—"}</td>
      <td>{new Date(c.created_at).toLocaleDateString()}</td>

      {/* 🗑️ DELETE */}
      <td>
        <button
          className="btn-danger"
          onClick={(e) => {
            e.stopPropagation(); // ⛔ evita navegar
            handleDeleteCustomer(c.id);
          }}
        >
          🗑️
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}

      {/* MODAL CREATE CUSTOMER */}
      {showCustomerModal && (
        <CreateCustomerModal
          onClose={() => setShowCustomerModal(false)}
          onCreated={(customerId) => {
            refetch(); // refresca lista
            setSelectedCustomerId(customerId); // 👈 guardamos el ID
            setShowCustomerModal(false);
            setShowOrderModal(true); // 👈 abrimos CreateOrder
          }}
        />
      )}

      {/* MODAL CREATE ORDER */}
      {showOrderModal && selectedCustomerId && (
        <CreateOrderModal
          customerId={selectedCustomerId}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedCustomerId(null);
          }}
          onCreated={() => {
            setShowOrderModal(false);
            setSelectedCustomerId(null);
          }}
        />
      )}
    </div>
  );
};

export default Customer;
