import { useEffect, useState } from "react";
import { supabase } from "../../lib/superbase";

const useSalesLast30Days = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);

      const { data, error } = await supabase.rpc(
        "get_sales_last_30_days"
      );

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setData(data || []);
      }

      setLoading(false);
    };

    fetchSales();
  }, []);

  return { data, loading, error };
};

export default useSalesLast30Days;
