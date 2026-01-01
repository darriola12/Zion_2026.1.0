import { useEffect, useState } from "react";
import { supabase } from "../lib/superbase";

const useMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMissions = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("Mission")
      .select(`
        id,
        name,
        country,
        transfer_day,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setMissions(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  return {
    missions,
    loading,
    error,
    refetch: fetchMissions,
  };
};

export default useMissions;
