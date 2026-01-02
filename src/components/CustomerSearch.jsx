import React from "react";

const CustomerSearch = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Buscar customer..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="customer-search"
    />
  );
};

export default CustomerSearch;
