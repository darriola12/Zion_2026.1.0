import { useEffect, useState } from "react";
import { supabase } from "../../lib/superbase";
import useFinancialSummary from "../../hooks/Home/useFinancialSummary";
import DashboardCard from "../ui/DashboardCard";

const FinancialSummary = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const {
    total_sold = 0,
    total_paid = 0,
    total_pending = 0,
    loading,
    error,
  } = useFinancialSummary(selectedCampaign);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await supabase
        .from("campañas")
        .select("id, campaña")
        .order("created_at", { ascending: false });

      setCampaigns(data ?? []);
    };

    fetchCampaigns();
  }, []);

  
  if (error) return null;

  return (
    <DashboardCard title="Resumen Financiero" icon="💰">
      {/* SELECT DE CAMPAÑAS */}
      <div style={{ marginBottom: 12 }}>
        <select
          value={selectedCampaign ?? ""}
          onChange={(e) =>
            setSelectedCampaign(
              e.target.value ? Number(e.target.value) : null
            )
          }
        >
          <option value="">Todas las campañas</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.campaña}
            </option>
          ))}
        </select>
      </div>

      <div className="summary-row">
        <span>Total vendido</span>
        <strong>${total_sold.toFixed(2)}</strong>
      </div>

      <div className="summary-row">
        <span>Total pagado</span>
        <strong className="text-success">
          ${total_paid.toFixed(2)}
        </strong>
      </div>

      <div className="summary-row">
        <span>Total pendiente</span>
        <strong className="text-danger">
          ${total_pending.toFixed(2)}
        </strong>
      </div>
    </DashboardCard>
  );
};

export default FinancialSummary;
