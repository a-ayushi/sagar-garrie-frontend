import axios from "axios";

const API_URL = "http://localhost:8080/api/admin";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all bookings (history)
export const getBookingHistory = async (status = "") => {
  try {
    const response = await axios.get(
      `${API_URL}/bookings/history`,
      {
        params: { status },
        ...getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching booking history:", error);
    throw error;
  }
};


// Filter booking history by status
export const filterBookingHistory = async (status) => {
  try {
    const response = await axios.post(
      `${API_URL}/bookings/history/filter`,
      [status], // Backend expects a LIST
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch incoming (pending) bookings
export const getIncomingBookings = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/bookings/pending`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    throw error;
  }
};



// Confirm Booking
export const confirmBooking = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/bookings/confirm/${id}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reject Booking
export const rejectBooking = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/bookings/reject/${id}`, {}, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Update booking status (Confirm / Cancel)
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/bookings/${bookingId}/status`,
      { status },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};
