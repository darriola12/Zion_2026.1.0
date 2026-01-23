import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaFilter } from "react-icons/fa";

import useCustomer from "../hooks/useCustomer";
import CreateCustomerModal from "../models/UseCreateCustomer";
import CreateOrderModal from "../models/CreateOrderModal";
import CustomerSearch from "../components/CustomerSearch";
import { softDeleteCustomer } from "../models/deleteCustomer";
import {} from "../styles/customer.css";

import "../styles/customer.css";

const Customer = () => {
  const { customer, error, loading, refetch } = useCustomer();

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [search, setSearch] = useState(""); 
  const [paymentFilter, setPaymentFilter] = useState("all"); 
  // all | paid | unpaid
  const [showFilterMenu, setShowFilterMenu] = useState(false);


  const navigate = useNavigate();



  if (loading) return <p className="status">Cargando clientes...</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este customer?")) return;
    await softDeleteCustomer(id);
    refetch();
  };

  // 🔍 FILTROS (search + estado de pago)
  const filteredCustomers = customer
    .filter((c) =>
      c.Last_name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => {
      const isPaid = c.Order?.every(o => o.Pagado);
      if (paymentFilter === "paid") return isPaid;
      if (paymentFilter === "unpaid") return !isPaid;
      return true;
    });

  return (
    <div className="customer-container">
      {/* HEADER */}
      <div className="customer-header">
        <h2>Clientes</h2>

        <div className="customer-header-actions">
          <CustomerSearch value={search} onChange={setSearch} />

          {/* FILTRO DE PAGOS */}
          <div className="payment-filters">
            <button
              className={paymentFilter === "all" ? "active" : ""}
              onClick={() => setPaymentFilter("all")}
              title="Todos"
            >
              <FaFilter /> Todos
            </button>

            <button
              className={paymentFilter === "paid" ? "active paid" : ""}
              onClick={() => setPaymentFilter("paid")}
              title="Pagados"
            >
              <FaCheckCircle /> Pagados
            </button>

            <button
              className={paymentFilter === "unpaid" ? "active unpaid" : ""}
              onClick={() => setPaymentFilter("unpaid")}
              title="No pagados"
            >
              <FaTimesCircle /> No pagados
            </button>
          </div>

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
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((c) => {
                const isPaid = c.Order?.every(o => o.Pagado);

                return (
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

                    <td>
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>

                    <td className={isPaid ? "paid-text" : "unpaid-text"}>
                      {isPaid ? "Pagado" : "No pagado"}
                    </td>

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
                );
              })}
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
