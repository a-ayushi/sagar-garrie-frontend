// src/services/customerService.js
import axios from "axios";

const BASE = "http://localhost:8080/api/customer";



export const getCustomerBookings = async (phone) => {
  const resp = await axios.get(`${BASE}/bookings/${phone}`);
  return resp.data;
};

// SSE URL (EventSource) -> no axios
export const getNotificationUrl = (phone) => `${BASE}/notifications/${encodeURIComponent(phone)}`;
