import FinancialSummary from "../components/home/FinancialSummary";
import ActiveCampaigns from "../components/home/ActiveCampaigns";
import SalesLast30Days from "../components/home/SalesLast30Days";

import "../styles/dashboard.css";

const Home = () => {
  return (
    <div className="dashboard-grid">
      <FinancialSummary />
      <ActiveCampaigns />
      <SalesLast30Days />
      {/* futuras cards aquí */}
    </div>
  );
};

export default Home;
