import useFinancialSummary from "../../hooks/Home/useFinancialSummary";
import DashboardCard from "../ui/DashboardCard";

const FinancialSummary = () => {
  const {
    total_sold = 0,
    total_paid = 0,
    total_pending = 0,
    loading,
    error,
  } = useFinancialSummary();

  if (loading) return null;
  if (error) return null;

  return (
    <DashboardCard title="Resumen Financiero" icon="💰">
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
