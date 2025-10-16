import { useState } from 'react';
import PaymentService from '../services/paymentService';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, bookingData, orderItems = [] }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: bookingData?.email || ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState(''); // 'success', 'error', ''

  const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
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
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!paymentData.expiryDate || paymentData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!paymentData.cardholderName || paymentData.cardholderName.length < 2) {
      newErrors.cardholderName = 'Please enter the cardholder name';
    }

    if (!paymentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('');

    try {
      const result = await PaymentService.processBookingPayment(bookingData, orderItems);
      
      if (result.success) {
        setPaymentStatus('success');
        // In a real implementation, you would handle the payment intent response
        // and redirect to payment confirmation
        setTimeout(() => {
          onClose();
          // You might want to redirect to a success page or show a confirmation
        }, 2000);
      } else {
        setPaymentStatus('error');
        setErrors({ general: result.message || 'Payment processing failed' });
      }
    } catch (error) {
      setPaymentStatus('error');
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2 className="payment-modal-title">Complete Your Payment</h2>
          <button 
            onClick={onClose} 
            className="payment-modal-close"
            disabled={isProcessing}
          >
            ×
          </button>
        </div>

        <div className="payment-modal-content">
          {/* Order Summary */}
          <div className="payment-summary">
            <h3 className="payment-summary-title">Order Summary</h3>
            <div className="payment-summary-details">
              <div className="payment-summary-row">
                <span>Booking for:</span>
                <span>{bookingData?.name}</span>
              </div>
              <div className="payment-summary-row">
                <span>Date & Time:</span>
                <span>{bookingData?.date} at {bookingData?.time}</span>
              </div>
              <div className="payment-summary-row">
                <span>Guests:</span>
                <span>{bookingData?.guests}</span>
              </div>
              {orderItems.length > 0 && (
                <>
                  <div className="payment-summary-divider"></div>
                  {orderItems.map((item, index) => (
                    <div key={index} className="payment-summary-row">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </>
              )}
              <div className="payment-summary-divider"></div>
              <div className="payment-summary-row payment-summary-total">
                <span>Total Amount:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          {paymentStatus === 'success' ? (
            <div className="payment-success">
              <div className="payment-success-icon">✓</div>
              <h3>Payment Successful!</h3>
              <p>Your booking has been confirmed. You will receive a confirmation email shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="payment-form">
              {errors.general && (
                <div className="payment-error-general">
                  {errors.general}
                </div>
              )}

              <div className="payment-form-group">
                <label htmlFor="cardNumber" className="payment-form-label">
                  Card Number *
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={`payment-form-input ${errors.cardNumber ? 'error' : ''}`}
                  disabled={isProcessing}
                />
                {errors.cardNumber && <span className="payment-form-error">{errors.cardNumber}</span>}
              </div>

              <div className="payment-form-row">
                <div className="payment-form-group">
                  <label htmlFor="expiryDate" className="payment-form-label">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
                    }}
                    placeholder="MM/YY"
                    maxLength="5"
                    className={`payment-form-input ${errors.expiryDate ? 'error' : ''}`}
                    disabled={isProcessing}
                  />
                  {errors.expiryDate && <span className="payment-form-error">{errors.expiryDate}</span>}
                </div>

                <div className="payment-form-group">
                  <label htmlFor="cvv" className="payment-form-label">
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="4"
                    className={`payment-form-input ${errors.cvv ? 'error' : ''}`}
                    disabled={isProcessing}
                  />
                  {errors.cvv && <span className="payment-form-error">{errors.cvv}</span>}
                </div>
              </div>

              <div className="payment-form-group">
                <label htmlFor="cardholderName" className="payment-form-label">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={paymentData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`payment-form-input ${errors.cardholderName ? 'error' : ''}`}
                  disabled={isProcessing}
                />
                {errors.cardholderName && <span className="payment-form-error">{errors.cardholderName}</span>}
              </div>

              <div className="payment-form-group">
                <label htmlFor="email" className="payment-form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={paymentData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`payment-form-input ${errors.email ? 'error' : ''}`}
                  disabled={isProcessing}
                />
                {errors.email && <span className="payment-form-error">{errors.email}</span>}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="payment-submit-btn"
              >
                {isProcessing ? (
                  <>
                    <div className="payment-spinner"></div>
                    Processing Payment...
                  </>
                ) : (
                  `Pay $${totalAmount.toFixed(2)}`
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
