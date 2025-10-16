import { useState } from 'react';
import TableSelector from './TableSelector';
import PaymentModal from './PaymentModal';
import BookingService from '../services/bookingService';
import './BookingForm.css';


// Converts "2:30 PM" -> "14:30"
const convertTo24Hour = (time12h) => {
  if (!time12h) return '';
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    table: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingRequiresPayment, setBookingRequiresPayment] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleTableSelect = (tableId) => {
    setFormData(prev => ({
      ...prev,
      table: tableId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setErrors({});
  
    // Frontend validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.guests) newErrors.guests = 'Number of guests is required';
    if (!formData.table) newErrors.table = 'Please select a table';
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
  
    const bookingPayload = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      numberOfGuests: parseInt(formData.guests),
      tableId: formData.table,
      bookingDate: formData.date,
      bookingTime: convertTo24Hour(formData.time),
      specialRequests: formData.specialRequests || ''
    };
  
    try {
      const result = await BookingService.createBooking(bookingPayload);
    
      // Adjust response condition based on actual API return
      if (result?.success || result?.status === "success") {
        const requiresPayment = parseInt(formData.guests) >= 6;
    
        if (requiresPayment) {
          setBookingRequiresPayment(true);
          setShowPaymentModal(true);
        } else {
          setIsSubmitted(true);
          setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              date: '',
              time: '',
              guests: '2',
              table: '',
              specialRequests: ''
            });
          }, 3000);
        }
      } else {
        setSubmitError(result?.message || 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
    
  };
  
  

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        table: '',
        specialRequests: ''
      });
    }, 3000);
  };

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  if (isSubmitted) {
    return (
      <div className="booking-success">
        <div className="booking-success-card">
          <div className="booking-success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="booking-success-title">Booking Confirmed!</h2>
          <p className="booking-success-message">
            Thank you for your reservation. We'll send you a confirmation email shortly.
          </p>
          <p className="booking-success-note">
            We look forward to serving you at Sagar Garrie!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <div className="booking-container">
        <div className="booking-card">
          <div className="booking-header">
            <h1 className="booking-title">Book Your Table</h1>
            <p className="booking-subtitle">Reserve your dining experience at Sagar Garrie</p>
          </div>

          <form onSubmit={handleSubmit} className="booking-form-grid">
            {/* Personal Information */}
            <div className="booking-form-row">
              <div className="booking-form-group">
                <label htmlFor="name" className="booking-form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`booking-form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="booking-form-error">{errors.name}</span>}
              </div>

              <div className="booking-form-group">
                <label htmlFor="email" className="booking-form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`booking-form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="booking-form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="booking-form-group">
              <label htmlFor="phone" className="booking-form-label">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`booking-form-input ${errors.phone ? 'error' : ''}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <span className="booking-form-error">{errors.phone}</span>}
            </div>

            {/* Reservation Details */}
            <div className="booking-form-row booking-form-row-3">
              <div className="booking-form-group">
                <label htmlFor="date" className="booking-form-label">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`booking-form-input ${errors.date ? 'error' : ''}`}
                />
                {errors.date && <span className="booking-form-error">{errors.date}</span>}
              </div>

              <div className="booking-form-group">
                <label htmlFor="time" className="booking-form-label">
                  Time *
                </label>
                <select
                  id="time"
                  name="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className={`booking-form-select ${errors.time ? 'error' : ''}`}
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.time && <span className="booking-form-error">{errors.time}</span>}
              </div>

              <div className="booking-form-group">
                <label htmlFor="guests" className="booking-form-label">
                  Number of Guests *
                </label>
                <select
                  id="guests"
                  name="guests"
                  required
                  value={formData.guests}
                  onChange={handleChange}
                  className={`booking-form-select ${errors.guests ? 'error' : ''}`}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
                {errors.guests && <span className="booking-form-error">{errors.guests}</span>}
              </div>
            </div>

            {/* Table Selection */}
            {(formData.date && formData.time) && (
              <TableSelector
                selectedTable={formData.table}
                onTableSelect={handleTableSelect}
                selectedDate={formData.date}
                selectedTime={formData.time}
              />
            )}
            {errors.table && <span className="booking-form-error">{errors.table}</span>}

            <div className="booking-form-group">
              <label htmlFor="specialRequests" className="booking-form-label">
                Special Requests
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows={4}
                value={formData.specialRequests}
                onChange={handleChange}
                className="booking-form-textarea"
                placeholder="Any dietary restrictions, special occasions, or other requests..."
              />
            </div>

            {/* Submit Error Display */}
            {submitError && (
              <div className="booking-form-error-container">
                <span className="booking-form-error">{submitError}</span>
              </div>
            )}

            <div className="booking-policy">
              <h3 className="booking-policy-title">Reservation Policy</h3>
              <ul className="booking-policy-list">
                <li>• Reservations are held for 15 minutes past the scheduled time</li>
                <li>• Cancellations must be made at least 2 hours in advance</li>
                <li>• Large parties (8+) may require a deposit</li>
                <li>• We accommodate dietary restrictions with advance notice</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="booking-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <svg className="booking-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Confirm Reservation'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingData={formData}
        orderItems={[]} // You can add order items here if needed
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default BookingForm;
