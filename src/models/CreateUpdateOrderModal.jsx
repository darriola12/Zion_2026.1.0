import { useState, useEffect } from "react";
import { supabase } from "../lib/superbase";
import "../styles/order.css";

const CreateOrderDetailsModal = ({
  customerId,
  orderId,      // 👈 si existe → editar
  onClose,
  onCreated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([
    { name: "", description: "", price: "", quantity: 1 }
  ]);

  /* =========================
     🔄 CARGAR ORDEN (EDITAR)
     ========================= */
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);

      const { data, error } = await supabase
  .from("Order")
  .select(`
    id,
    Discount,
    Subtotal,
    Total,
    order_details:order_details (
      id,
      name,
      description,
      price,
      quantity
    )
  `)
  
  .eq("id", orderId)
  .single();

      if (error) {
        setError(error.message);
      } else {
        setDiscount(data.Discount ?? 0);

        if (data.order_details?.length) {
          setItems(
            data.order_details.map(item => ({
              name: item.name,
              description: item.description,
              price: item.price,
              quantity: item.quantity
            }))
          );
        }
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  /* =========================
     💰 CALCULOS
     ========================= */
  const subtotal = items.reduce(
    (acc, item) =>
      acc + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const total = subtotal - Number(discount || 0);

  /* =========================
     🧩 MANEJO DE ITEMS
     ========================= */
  const addItem = () => {
    setItems([...items, { name: "", description: "", price: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  /* =========================
     💾 GUARDAR ORDEN
     ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let order;

      // ✏️ EDITAR
      if (orderId) {
        const { data, error } = await supabase
          .from("Order")
          .update({
            Discount: Number(discount),
            Subtotal: subtotal,
            Total: total
          })
          .eq("id", orderId)
          .select()
          .single();

        if (error) throw error;

        order = data;

        // eliminar detalles viejos
        await supabase
          .from("order_details")
          .delete()
          .eq("order_id", order.id);

      } else {
        // ➕ CREAR
        const { data, error } = await supabase
          .from("Order")
          .insert([
            {
              Order_customer_id: customerId,
              Subtotal: subtotal,
              Discount: discount,
              Total: total
            }
          ])
          .select()
          .single();

        if (error) throw error;

        order = data;
      }

      // insertar productos
      const details = items.map(item => ({
        order_id: order.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        quantity: Number(item.quantity)
      }));

      const { error: detailsError } = await supabase
        .from("order_details")
        .insert(details);

      if (detailsError) throw detailsError;

      onCreated();
      onClose();

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  /* =========================
     🧱 UI
     ========================= */
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2>{orderId ? "Editar Orden" : "Crear Orden"}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">

          <input
            type="number"
            placeholder="Descuento"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
          />

          <input type="number" value={subtotal} readOnly />
          <input type="number" value={total} readOnly />

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
                min="1"
                value={item.quantity}
                onChange={e => updateItem(index, "quantity", e.target.value)}
              />

              {items.length > 1 && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => removeItem(index)}
                >
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
              {loading ? "Guardando..." : orderId ? "Actualizar Orden" : "Crear Orden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderDetailsModal;
