import { useEffect, useState } from "react";
import { supabase } from "../../lib/superbase";

const useActiveCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);

const { data, error } = await supabase
  .from("campañas")
  .select(`
    id,
    campaña,
    Order!inner (
      id
    )
  `)
  .is("Order.soft_deleted", null);
// .eq("activa", true); // opcional
    
       // .eq("activa", true); // 👈 SOLO ACTIVAS

      if (error) {
        setError(error.message);
      } else {
        const formatted = data.map((c) => ({
          id: c.id,
          name: c.campaña,
          ordersCount: c.Order.length,
        }));

        setCampaigns(formatted);
      }

      setLoading(false);
    };

    fetchCampaigns();
  }, []);

  return { campaigns, loading, error };
};

export default useActiveCampaigns;
