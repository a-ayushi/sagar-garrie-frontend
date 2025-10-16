// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  getIncomingBookings,
  filterBookingHistory,
  getBookingHistory,
  updateBookingStatus,
  confirmBooking,
  rejectBooking

} from "../../services/adminService";

import "./admin.css";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      let data;
  
      if (filter === "pending") {
        data = await getIncomingBookings();
      } 
      else if (filter === "confirmed") {
        data = await filterBookingHistory("confirmed");
      } 
      else if (filter === "cancelled") {
        data = await filterBookingHistory("cancelled");
      } 
      else {
        data = await getBookingHistory(); // All bookings
      }
  
      setBookings(data);
    } catch (err) {
      setError("Failed to load bookings");
    }
  };
  


  const handleStatusChange = async (id, action) => {
    try {
      if (action === "confirmed") {
        await confirmBooking(id);
        alert("Booking Confirmed!");
      } else if (action === "cancelled") {
        await rejectBooking(id);
        alert("Booking Cancelled!");
      }
      fetchData(); // Refresh after update
    } catch (error) {
      alert("Failed to update booking");
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Booking Management</h2>
        <div className="admin-controls">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="refresh-btn" onClick={fetchData}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Notes</th>
              <th>Status</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="center">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{booking.guests}</td>
                  <td className="notes-cell">{booking.notes}</td>
                  <td>
                    <span className={`status-cell status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    {booking.status === "pending" && (
                      <>
                        <button
                          className="btn-confirm"
                          onClick={() => handleStatusChange(booking.id, "confirmed")}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => handleStatusChange(booking.id, "cancelled")}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
