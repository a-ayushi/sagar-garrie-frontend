// API Base Configuration
import { getApiConfig } from '../config/api.js';
const API_CONFIG = getApiConfig();
const API_BASE_URL = API_CONFIG.BASE_URL;

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Booking API
export const bookingAPI = {
  // Create a new booking
  createBooking: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Get bookings for a specific date
  getBookings: async (date = null) => {
    const params = date ? `?date=${date}` : '';
    return apiRequest(`/bookings${params}`);
  },
};

// Menu API
export const menuAPI = {
  // Get all menu items or filter by category
  getMenuItems: async (category = null) => {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest(`/menu${params}`);
  },
};

// Payment API
export const paymentAPI = {
  // Create payment intent
  createPaymentIntent: async (paymentData) => {
    return apiRequest('/payment/create-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

export default {
  bookingAPI,
  menuAPI,
  paymentAPI,
};
