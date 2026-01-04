import { useEffect, useState } from "react";
import { supabase } from "../lib/superbase";

const useOrdersResume = (customerId = null) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    let query = supabase
  .from("Order")
  .select(`
    id,
    Subtotal,
    Discount,
    Total,
    Pagado,
    Reportado,
    created_at,
    Customer:Order_customer_id (
      id,
      Last_name,
      Mission:customer_mission_id (
        id,
        name
      )
    )
  `)
  .is("soft_deleted", null);
;


    // ✅ filtro por customer
    if (customerId) {
      query = query.eq("Order_customer_id", customerId);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setOrders([]);
    } else {
      setOrders(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [customerId]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
};

export default useOrdersResume;
