import { useEffect, useState } from "react";
import { supabase } from "../lib/superbase";

const useCampañas = () => {
  const [campañas, setCampañas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampañas = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("campañas")
      .select(`*
      `)

    if (error) {
      setError(error.message);
    } else {
      setCampañas(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCampañas();
  }, []);

  return {
    campañas,
    loading,
    error,
    refetch: fetchCampañas,
  };
};

export default useCampañas;