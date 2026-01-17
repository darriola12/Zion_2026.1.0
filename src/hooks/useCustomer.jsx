import { useEffect, useState } from "react";
import { supabase } from "../lib/superbase";

const useCustomer = () => {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerFetching = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
  .from("Customer")
  .select(`
    id,
    Last_name,
    Entity_data,
    created_at,
    customer_mission_id,
    Mission (
      id,
      name
    ),
    Order (
      id,
      Pagado
    )
  `)
  .is("soft_deleted", null);

    if (error) {
      setError(error.message);
      setCustomer([]);
    } else {
      setCustomer(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    customerFetching();
  }, []);

  return {
    customer,
    error,
    loading,
    refetch: customerFetching,
  };
};

export default useCustomer;
