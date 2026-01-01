import { useState, useEffect } from "react";
import { supabase } from "../lib/superbase";
import "../styles/order.css";

const CreateOrderDetailsModal = ({ customerId, onClose, onCreated, orderData }) => {
  const [subtotal, setSubtotal] = useState("");
  const [discount, setDiscount] = useState("0");
  const [items, setItems] = useState([{ name: "", description: "", price: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos del pedido si es edición
  useEffect(() => {
    console.log("CreateOrderDetailsModal useEffect fired, orderData:", orderData);

    if (!orderData || !orderData.id) {
      console.log("No orderData o falta id:", orderData);
      return;
    }

    const loadOrderDetails = async () => {
      try {
        const { data: details, error: detailsError } = await supabase
          .from("order_details")
          .select("id, name, description, price, quantity, order_id")
          .eq("order_id", orderData.id);

        if (detailsError) {
          console.error("Supabase details error:", detailsError);
          setError("No se pudieron cargar los detalles del pedido");
          return;
        }

        setSubtotal(String(orderData.Subtotal ?? 0));
        setDiscount(String(orderData.Discount ?? 0));

        if (!details || details.length === 0) {
          setItems([{ name: "", description: "", price: "", quantity: 1 }]);
        } else {
          setItems(
            details.map(item => ({
              name: item.name ?? "",
              description: item.description ?? "",
              price: item.price != null ? String(item.price) : "",
              quantity: item.quantity != null ? Number(item.quantity) : 1,
            }))
          );
        }
      } catch (err) {
        console.error("Error cargando detalles:", err);
        setError("No se pudieron cargar los detalles del pedido");
      }
    };

    loadOrderDetails();
  }, [orderData]);

  // Calcular total automáticamente
  const total =
    items.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1), 0) -
    Number(discount || 0);

  // ➕ agregar producto
  const addItem = () => setItems([...items, { name: "", description: "", price: "", quantity: 1 }]);

  // ❌ eliminar producto
  const removeItem = index => setItems(items.filter((_, i) => i !== index));

  // ✏️ editar producto
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!customerId) {
      setError("Customer ID inválido");
      setLoading(false);
      return;
    }

    try {
      let order;

      if (orderData?.id) {
        // EDITAR ORDEN
        const { data: updatedOrder, error: updateError } = await supabase
          .from("Order")
          .update({
            Subtotal: Number(subtotal),
            Discount: Number(discount),
            Total: total,
          })
          .eq("id", orderData.id)
          .select()
          .single();

        if (updateError) throw updateError;
        order = updatedOrder;

        // Eliminar detalles anteriores
        await supabase.from("order_details").delete().eq("order_id", order.id);
      } else {
        // CREAR NUEVA ORDEN
        const { data: newOrder, error: orderError } = await supabase
          .from("Order")
          .insert([
            {
              Order_customer_id: Number(customerId),
              Subtotal: Number(subtotal),
              Discount: Number(discount),
              Total: total,
            },
          ])
          .select()
          .single();

        if (orderError) throw orderError;
        order = newOrder;
      }

      // Insertar detalles
      const details = items.map(item => ({
        order_id: order.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        quantity: Number(item.quantity),
      }));

      const { error: detailsError } = await supabase.from("order_details").insert(details);
      if (detailsError) throw detailsError;

      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2>{orderData ? "Editar Orden" : "Crear Orden"}</h2>

        {error && <p className="error">{error}</p>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Subtotal"
            value={subtotal}
            onChange={e => setSubtotal(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Discount"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
          />
          <input type="number" value={total.toFixed(2)} readOnly />

          <hr />

          <h3>Productos</h3>
          {items.map((item, index) => (
            <div key={index} className="order-item">
              <input
                placeholder="Nombre"
                value={item.name}
                onChange={e => updateItem(index, "name", e.target.value)}
                required
              />
              <input
                placeholder="Descripción"
                value={item.description}
                onChange={e => updateItem(index, "description", e.target.value)}
              />
              <input
                type="number"
                placeholder="Precio"
                value={item.price}
                onChange={e => updateItem(index, "price", e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={item.quantity}
                min="1"
                onChange={e => updateItem(index, "quantity", e.target.value)}
              />
              {items.length > 1 && (
                <button type="button" className="btn-secondary" onClick={() => removeItem(index)}>
                  Eliminar
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn-secondary" onClick={addItem}>
            + Agregar producto
          </button>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Guardando..." : orderData ? "Actualizar Orden" : "Crear Orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderDetailsModal;
