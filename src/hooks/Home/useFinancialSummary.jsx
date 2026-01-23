// useFinancialSummary.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/superbase";

const useFinancialSummary = (campaignId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.rpc(
      "get_financial_summary",
      { p_campaign_id: campaignId }
    );

    if (error) {
      setError(error.message);
    } else {
      setData(data?.[0] ?? null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [campaignId]);

  return {
    total_sold: data?.total_sold ?? 0,
    total_paid: data?.total_paid ?? 0,
    total_pending: data?.total_pending ?? 0,
    loading,
    error,
  };
};

export default useFinancialSummary;
