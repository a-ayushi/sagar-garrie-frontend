import { bookingAPI } from './api';

// Booking service with business logic
export class BookingService {
  // Create a booking with validation
  static async createBooking(bookingData) {
    try {
      // Normalize incoming fields (accept both forms: { name, email } or { customerName, customerEmail })
      const normalized = {
        name: bookingData.name || bookingData.customerName || '',
        email: bookingData.email || bookingData.customerEmail || '',
        phone: bookingData.phone || bookingData.customerPhone || '',
        date: bookingData.date || bookingData.bookingDate || '',
        time: bookingData.time || bookingData.bookingTime || '',
        guests: bookingData.guests || bookingData.numberOfGuests || bookingData.pax || '',
        table: bookingData.table || bookingData.tableId || '',
        specialRequests: bookingData.specialRequests || bookingData.notes || ''
      };

      // Frontend basic validation (you can keep/extend)
      const required = ['name', 'phone', 'date', 'time', 'guests', 'table'];
      const missing = required.filter(f => !normalized[f]);
      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }

      // Format for backend DTO (match BookingRequestDTO expected names)
      const formattedData = {
        customerName: normalized.name,
        customerEmail: normalized.email || null,
        phone: normalized.phone,
        bookingDate: normalized.date,
        bookingTime: normalized.time,         // ensure BookingForm sends 24h "HH:mm" (see Form changes)
        pax: parseInt(normalized.guests, 10),
        tableId: normalized.table,
        notes: normalized.specialRequests || null,
        payNow: false
      };

      // Call backend API (bookingAPI.createBooking should return response.json())
      const response = await bookingAPI.createBooking(formattedData);

      // Backend now returns ApiResponse<T>
      if (response && response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Booking created successfully!'
        };
      } else {
        // backend returned failure or unexpected shape
        return {
          success: false,
          error: response?.message || 'Booking failed on server',
          message: response?.message || 'Failed to create booking. Please try again.'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: error.message || 'Failed to create booking. Please try again.'
      };
    }
  }


  

  // Get bookings for a specific date
  static async getBookingsForDate(date) {
    try {
      const bookings = await bookingAPI.getBookings(date);
      return {
        success: true,
        data: bookings,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Validate booking form data
  static validateBookingData(data) {
    const errors = {};

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Date validation
    if (!data.date) {
      errors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Please select a future date';
      }
    }

    // Time validation
    if (!data.time) {
      errors.time = 'Please select a time';
    }

    // Guests validation
    if (!data.guests || parseInt(data.guests) < 1 || parseInt(data.guests) > 20) {
      errors.guests = 'Number of guests must be between 1 and 20';
    }

    // Table validation
    if (!data.table) {
      errors.table = 'Please select a table';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default BookingService;
