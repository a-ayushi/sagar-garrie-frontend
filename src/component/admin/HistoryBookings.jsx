// src/component/admin/HistoryBookings.jsx
import React, { useEffect, useState } from "react";
import { getBookingHistory } from "../../services/adminService";
import BookingFilters from "./BookingFilters";
import BookingRow from "./BookingRow";

const HistoryBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchHistory = async (status = "") => {
    const data = await getBookingHistory(status);
    setBookings(data);
  };

  useEffect(() => {
    fetchHistory(statusFilter);
  }, [statusFilter]);

  return (
    <>
      <BookingFilters status={statusFilter} setStatus={setStatusFilter} />
      <table className="admin-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Pax</th>
            <th>Notes</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default HistoryBookings;
