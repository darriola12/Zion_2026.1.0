import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCustomer from "../hooks/useCustomer";
import CreateCustomerModal from "../models/UseCreateCustomer";
import CreateOrderModal from "../models/CreateOrderModal";
import CustomerSearch from "../components/CustomerSearch"; // 👈 NUEVO
import "../styles/customer.css";
import { softDeleteCustomer } from "../models/deleteCustomer";

const Customer = () => {
  const { customer, error, loading, refetch } = useCustomer();

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [search, setSearch] = useState(""); // 👈 NUEVO

  const navigate = useNavigate();

  if (loading) return <p className="status">Cargando clientes...</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este customer?")) return;
    await softDeleteCustomer(id);
    refetch();
  };

  // 🔍 FILTRO
  const filteredCustomers = customer.filter((c) =>
    c.Last_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customer-container">
      {/* HEADER */}
      <div className="customer-header">
        <h2>Clientes</h2>

        <div className="customer-header-actions">
          <CustomerSearch
            value={search}
            onChange={setSearch}
          />

          <button
            className="btn-primary"
            onClick={() => setShowCustomerModal(true)}
          >
            + Crear Customer
          </button>
        </div>
      </div>

      {/* TABLE */}
      {filteredCustomers.length === 0 ? (
        <p className="empty">No hay clientes</p>
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
              {filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td
                    className="bold"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/data/customers/detail/${c.id}`)
                    }
                  >
                    {c.Last_name}
                  </td>
                  <td>{c.Mission?.name || "—"}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
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

      {/* MODALS */}
      {showCustomerModal && (
        <CreateCustomerModal
          onClose={() => setShowCustomerModal(false)}
          onCreated={(customerId) => {
            refetch();
            setSelectedCustomerId(customerId);
            setShowCustomerModal(false);
            setShowOrderModal(true);
          }}
        />
      )}

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
