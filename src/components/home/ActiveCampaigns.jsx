import DashboardCard from "../ui/DashboardCard";
import useActiveCampaigns from "../../hooks/Home/useActiveCampaigns";

const ActiveCampaigns = () => {
  const { campaigns, loading, error } = useActiveCampaigns();

  if (loading) return null;
  if (error) return null;

  return (
    <DashboardCard title="Campañas Activas" icon="📣">
      <ul className="card-list">
        {campaigns.map((c) => (
          <li key={c.id} className="card-list-item">
            <span>{c.name}</span>
            <strong className="text-primary">
              {c.ordersCount} órdenes
            </strong>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
};

export default ActiveCampaigns;
