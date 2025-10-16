import React, { useEffect, useState } from "react";
import { getIncomingBookings } from "../../services/adminService";
import "./admin.css";

const IncomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await getIncomingBookings();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000); // auto-refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = async (id) => {
    await confirmBooking(id);
    fetchBookings();
  };

  const handleReject = async (id) => {
    await rejectBooking(id);
    fetchBookings();
  };

  if (loading) return <p>Loading incoming bookings...</p>;

  return (
    <div className="admin-table-container">
      <h2>Incoming Bookings</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>Pax</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.customerName}</td>
              <td>{b.phone}</td>
              <td>{b.bookingDate}</td>
              <td>{b.bookingTime}</td>
              <td>{b.pax}</td>
              <td>{b.notes || "-"}</td>
              <td>
                <button className="btn-confirm" onClick={() => handleConfirm(b.id)}>Confirm</button>
                <button className="btn-reject" onClick={() => handleReject(b.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomingBookings;
