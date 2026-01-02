import React from "react";
import useOrdersResume from "../hooks/useOrder";
import "../styles/orderPage.css";

const OrdersPage = () => {
    const { orders, loading, error } = useOrdersResume();

    if (loading) return <p className="status">Cargando órdenes...</p>;
    if (error) return <p className="status error">Error: {error}</p>;
    if (orders.length === 0) return <p className="status">No hay órdenes disponibles.</p>;

    return (
        <div className="orders-container">
            <h2>Órdenes</h2>
            <div className="table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>    
                            <th>Cliente</th>
                            <th>Misión</th>
                            <th>Subtotal</th>
                            <th>Descuento</th>
                            <th>Total</th>
                            <th>Fecha de Creación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                               <td>{order.Customer ? order.Customer.Last_name : "N/A"}</td>
                                <td>{order.Customer && order.Customer.Mission ? order.Customer.Mission.name : "N/A"}</td>
                                <td>{order.Subtotal}</td>
                                <td>{order.Discount}</td>
                                <td>{order.Total}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrdersPage;




