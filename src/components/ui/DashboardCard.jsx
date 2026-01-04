import React from "react";
import "../../styles/dashboard.css";

const DashboardCard = ({ title, icon, children }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3>
          {icon && <span className="card-icon">{icon}</span>}
          {title}
        </h3>
      </div>

      <div className="dashboard-card-body">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
