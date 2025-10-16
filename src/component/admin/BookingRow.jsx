// src/components/admin/BookingRow.jsx
import React from "react";
import './admin.css';

const BookingRow = ({ booking, onStatusChange }) => {
  const { id, customerName, bookingDate, bookingTime, numberOfGuests, tableId, status } = booking;

  return (
    <tr>
      <td>{customerName}</td>
      <td>{bookingDate}</td>
      <td>{bookingTime}</td>
      <td>{numberOfGuests}</td>
      <td>{tableId}</td>
      <td>{status}</td>
      <td>
        {status === "PENDING" && (
          <>
            <button
              className="btn-confirm"
              onClick={() => onStatusChange(id, "CONFIRMED")}
            >
              Confirm
            </button>
            <button
              className="btn-cancel"
              onClick={() => onStatusChange(id, "CANCELLED")}
            >
              Cancel
            </button>
          </>
        )}
        {status !== "PENDING" && <span>No actions</span>}
      </td>
    </tr>
  );
};

export default BookingRow;
