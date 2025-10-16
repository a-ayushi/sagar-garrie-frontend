import React, { useEffect, useState } from "react";
import { getNotificationUrl } from "../services/customerService";

const BookingStatusModal = ({ initialBooking, phone, onClose }) => {
  const [booking, setBooking] = useState(initialBooking);

  useEffect(() => {
    // open SSE connection
    const url = getNotificationUrl(phone);
    const evt = new EventSource(url);

    evt.addEventListener("booking-status", (e) => {
      try {
        const updated = JSON.parse(e.data);
        // If the update corresponds to our booking id, update state and optionally show alert
        if (updated.id === booking.id) {
          setBooking(updated);
          // simple popup
          alert(`Booking ${updated.status}: booking id ${updated.id}`);
        }
      } catch (err) {
        console.error("Invalid SSE data", err);
      }
    });

    evt.onerror = (err) => {
      console.error("SSE error", err);
      // optionally close connection: evt.close();
    };

    return () => evt.close();
  }, [phone, booking.id]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Booking Status</h3>
        <p>Booking id: {booking.id}</p>
        <p>Status: {booking.status}</p>
        <p>Date: {booking.bookingDate} Time: {booking.bookingTime}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BookingStatusModal;
