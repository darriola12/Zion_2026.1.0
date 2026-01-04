import { useState, useEffect } from "react";
import { supabase } from "../lib/superbase";
import useCampañas from "../hooks/useCampanas";
import "../styles/order.css";

/* =============================
   OPCIONES DE PRODUCTOS
============================= */
const PRODUCT_OPTIONS = [
  "Corbata Típica",
  "Corbata Flores",
  "Corbata Media",
  "Corbata Típica Huipil",
  "Cobertor Biblia Tela",
  "Cobertor Triple Tela",
  "Cobertor LDM Tela",
  "Cobertor Cuádruple Tela",
  "Cobertor Mini Cuádruple Tela",
  "Cobertor Biblia Cuero",
  "Cobertor Triple Cuero",
  "Cobertor LDM Cuero",
  "Cobertor Cuádruple Cuero",
  "Cobertor Libro de Mormón Pequeño",
  "Pisa Corbata",
  "Mochila",
];

/* =============================
   COMPONENTE
============================= */
const CreateOrderModal = ({ customerId, orderData, onClose, onCreated }) => {
  /* =============================
     HOOKS
  ============================== */

  // 🔹 campañas desde Supabase
  const { campañas, loading: loadingCampañas } = useCampañas();

  // 🔹 estados principales
  const [discount, setDiscount] = useState("0");
  const [campañaId, setCampañaId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 items de la orden
  const [items, setItems] = useState([
    { name: "", description: "", price: "", quantity: 1, image: "", file: null },
  ]);

  /* =============================
     CARGAR DATOS (EDICIÓN)
  ============================== */
  useEffect(() => {
    if (!orderData) return;

    setDiscount(orderData.Discount ?? "0");
    setCampañaId(orderData.Campaña_order_id ?? "");

    if (orderData.details?.length) {
      setItems(
        orderData.details.map((d) => ({
          name: d.name,
          description: d.description,
          price: d.price,
          quantity: d.quantity,
          image: d.image || "",
          file: null,
        }))
      );
    }
  }, [orderData]);

  /* =============================
     CÁLCULOS
  ============================== */
  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const total = subtotal - Number(discount || 0);

  /* =============================
     MANEJO DE ITEMS
  ============================== */
  const updateItem = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const addItem = () =>
    setItems([
      ...items,
      { name: "", description: "", price: "", quantity: 1, image: "", file: null },
    ]);

  const removeItem = (index) =>
    setItems(items.filter((_, i) => i !== index));

  /* =============================
     SUBIR IMAGEN A SUPABASE
  ============================== */
  const uploadImage = async (file) => {
    if (!file) return null;

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `${Date.now()}_${safeName}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  /* =============================
     GUARDAR ORDEN
  ============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!customerId) throw new Error("Customer inválido");

      let order;

      // ✏️ EDITAR
      if (orderData?.id) {
        const { data, error } = await supabase
          .from("Order")
          .update({
            Subtotal: subtotal,
            Discount: Number(discount),
            Total: total,
            Campaña_order_id: Number(campañaId),
          })
          .eq("id", orderData.id)
          .select()
          .single();

        if (error) throw error;
        order = data;

        // eliminar detalles anteriores
        await supabase
          .from("order_details")
          .delete()
          .eq("order_id", order.id);
      }
      // ➕ CREAR
      else {
        const { data, error } = await supabase
          .from("Order")
          .insert({
            Order_customer_id: Number(customerId),
            Subtotal: subtotal,
            Discount: Number(discount),
            Total: total,
            Campaña_order_id: Number(campañaId),
          })
          .select()
          .single();

        if (error) throw error;
        order = data;
      }

      // 🔹 insertar detalles
      const details = [];

      for (const item of items) {
        let imageUrl = item.image || null;

        if (item.file) {
          imageUrl = await uploadImage(item.file);
        }

        details.push({
          order_id: order.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: imageUrl,
        });
      }

      const { error } = await supabase
        .from("order_details")
        .insert(details);

      if (error) throw error;

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }

    setLoading(false);
  };

  /* =============================
     UI
  ============================== */
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2>{orderData ? "Editar Orden" : "Crear Orden"}</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* CAMPAÑA */}
          <select
            value={campañaId}
            onChange={(e) => setCampañaId(e.target.value)}
            required
          >
            <option value="">
              {loadingCampañas
                ? "Cargando campañas..."
                : "Seleccionar campaña"}
            </option>
            {campañas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.campaña}
              </option>
            ))}
          </select>

          {/* TOTALES */}
          <input readOnly value={subtotal.toFixed(2)} placeholder="Subtotal" />
          <input
            type="number"
            placeholder="Descuento"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
          <input readOnly value={total.toFixed(2)} placeholder="Total" />

          <hr />
          <h3>Productos</h3>

          {items.map((item, i) => (
            <div key={i} className="order-item">
              <select
                value={item.name}
                onChange={(e) => updateItem(i, "name", e.target.value)}
                required
              >
                <option value="">Seleccionar producto</option>
                {PRODUCT_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <input
                placeholder="Descripción"
                value={item.description}
                onChange={(e) => updateItem(i, "description", e.target.value)}
              />

              <input
                type="number"
                placeholder="Precio"
                value={item.price}
                onChange={(e) => updateItem(i, "price", e.target.value)}
                required
              />

              <input
                type="number"
                min="1"
                placeholder="Cantidad"
                value={item.quantity}
                onChange={(e) => updateItem(i, "quantity", e.target.value)}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  updateItem(i, "file", file);
                  updateItem(i, "image", URL.createObjectURL(file));
                }}
              />

              {item.image && <img src={item.image} alt="" width={80} />}

              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)}>
                  Eliminar
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addItem}>
            + Agregar producto
          </button>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
