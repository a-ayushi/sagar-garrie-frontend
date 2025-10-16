// src/components/admin/BookingFilters.jsx
import React from "react";
import './admin.css';

const BookingFilters = ({ selected, onChange }) => {
  return (
    <div className="booking-filters">
      <label>Filter by Status: </label>
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="INCOMING">Incoming</option>
      </select>
    </div>
  );
};

export default BookingFilters;
