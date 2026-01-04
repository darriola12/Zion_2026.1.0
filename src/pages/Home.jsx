import FinancialSummary from "../components/home/FinancialSummary";
import ActiveCampaigns from "../components/home/ActiveCampaigns";
import "../styles/dashboard.css";

const Home = () => {
  return (
    <div className="dashboard-grid">
      <FinancialSummary />
      <ActiveCampaigns />
      {/* futuras cards aquí */}
    </div>
  );
};

export default Home;
