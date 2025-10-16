import { paymentAPI } from './api';

// Payment service with business logic
export class PaymentService {
  // Create payment intent
  static async createPaymentIntent(paymentData) {
    try {
      // Validate payment data
      const validation = this.validatePaymentData(paymentData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const response = await paymentAPI.createPaymentIntent(paymentData);
      return {
        success: true,
        data: response,
        message: 'Payment intent created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create payment intent. Please try again.'
      };
    }
  }

  // Validate payment data
  static validatePaymentData(data) {
    const errors = [];

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!data.currency) {
      errors.push('Currency is required');
    }

    if (!data.description) {
      errors.push('Description is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Format amount for display
  static formatAmount(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Calculate total amount from order items
  static calculateTotal(orderItems) {
    return orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Process payment for booking
  static async processBookingPayment(bookingData, orderItems) {
    try {
      const totalAmount = this.calculateTotal(orderItems);
      
      const paymentData = {
        amount: totalAmount * 100, // Convert to cents
        currency: 'usd',
        description: `Table booking for ${bookingData.name} - ${bookingData.date}`,
        metadata: {
          bookingId: bookingData.id,
          customerEmail: bookingData.email,
          tableId: bookingData.table,
        },
      };

      return await this.createPaymentIntent(paymentData);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to process payment'
      };
    }
  }
}

export default PaymentService;
