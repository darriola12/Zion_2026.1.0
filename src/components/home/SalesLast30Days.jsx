import React from "react";
import DashboardCard from "../ui/DashboardCard";
import useSalesLast30Days from "../../hooks/Home/useSalesLast30Days";

const SalesLast30Days = () => {
  const { data, loading, error } = useSalesLast30Days();

  return (
    <DashboardCard title="📈 Ventas últimos 30 días">
      {loading && <p>Cargando ventas...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <ul style={{ fontSize: "0.9rem" }}>
          {data.map((d) => (
            <li key={d.day}>
              {new Date(d.day).toLocaleDateString()} —{" "}
              <strong>${Number(d.total).toFixed(2)}</strong>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
};

export default SalesLast30Days;

