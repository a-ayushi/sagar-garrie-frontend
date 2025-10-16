# Sagar Garrie Frontend-Backend Integration Guide

This guide explains how the frontend React application integrates with the backend Spring Boot APIs.

## 🚀 Quick Start

1. **Start the Backend Server**
   ```bash
   # Navigate to your Spring Boot project
   cd your-spring-boot-project
   
   # Start the server (usually runs on port 8080)
   ./mvnw spring-boot:run
   ```

2. **Start the Frontend Development Server**
   ```bash
   # In the frontend project directory
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api

## 📁 Project Structure

```
src/
├── services/           # API service layer
│   ├── api.js         # Generic API request handler
│   ├── bookingService.js  # Booking-related API calls
│   ├── menuService.js     # Menu-related API calls
│   └── paymentService.js  # Payment-related API calls
├── component/         # React components
│   ├── BookingForm.jsx    # Table booking form
│   ├── Menu.jsx          # Menu display with API integration
│   ├── PaymentModal.jsx  # Payment processing modal
│   └── OrderCart.jsx     # Shopping cart functionality
└── config/
    └── api.js         # API configuration
```

## 🔌 API Integration Details

### 1. Booking System

**Backend Endpoints:**
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings?date=YYYY-MM-DD` - Get bookings for a date

**Frontend Integration:**
- `BookingForm.jsx` uses `BookingService.createBooking()`
- Validates form data before submission
- Shows success/error messages
- Integrates with payment for large parties (6+ guests)

**Data Flow:**
```javascript
// Frontend sends:
{
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+1234567890",
  bookingDate: "2024-01-15",
  bookingTime: "7:00 PM",
  numberOfGuests: 4,
  tableId: "table-1",
  specialRequests: "Window seat preferred"
}

// Backend responds:
{
  id: "booking-123",
  customerName: "John Doe",
  // ... other booking details
}
```

### 2. Menu System

**Backend Endpoints:**
- `GET /api/menu` - Get all menu items
- `GET /api/menu?category=appetizers` - Get items by category

**Frontend Integration:**
- `Menu.jsx` uses `MenuService.getAllMenuItems()`
- Dynamic category filtering
- Search functionality
- Shopping cart integration

**Data Flow:**
```javascript
// Backend sends:
[
  {
    id: 1,
    name: "Butter Chicken",
    description: "Tender chicken in rich, creamy sauce",
    price: 18.99,
    category: "mains",
    veg: false,
    imageUrl: "/images/butter-chicken.jpg"
  }
  // ... more items
]
```

### 3. Payment System

**Backend Endpoints:**
- `POST /api/payment/create-intent` - Create payment intent

**Frontend Integration:**
- `PaymentModal.jsx` handles payment processing
- `PaymentService.processBookingPayment()` for booking payments
- Credit card form with validation
- Success/error handling

**Data Flow:**
```javascript
// Frontend sends:
{
  amount: 5000, // in cents
  currency: "usd",
  description: "Table booking for John Doe - 2024-01-15",
  metadata: {
    bookingId: "booking-123",
    customerEmail: "john@example.com",
    tableId: "table-1"
  }
}
```

## 🛠 Configuration

### API Base URL Configuration

Update `src/config/api.js` for different environments:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api', // Development
  // BASE_URL: 'https://your-production-api.com/api', // Production
};
```

### CORS Configuration

Ensure your Spring Boot backend allows CORS from the frontend:

```java
@CrossOrigin(origins = "http://localhost:5173")
```

## 🔧 Key Features Implemented

### 1. Error Handling
- Form validation with real-time feedback
- API error handling with user-friendly messages
- Loading states for better UX

### 2. Payment Integration
- Secure payment processing
- Credit card validation
- Payment confirmation flow

### 3. Shopping Cart
- Local storage persistence
- Real-time cart updates
- Order management

### 4. Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-friendly interactions

## 🧪 Testing the Integration

### 1. Test Booking Flow
1. Navigate to "Book Table"
2. Fill out the booking form
3. Select a table
4. Submit the booking
5. Check backend logs for API calls

### 2. Test Menu Integration
1. Navigate to "Menu"
2. Verify menu items load from API
3. Test category filtering
4. Add items to cart
5. Test search functionality

### 3. Test Payment Flow
1. Book a table for 6+ guests (triggers payment)
2. Fill out payment form
3. Submit payment
4. Verify payment processing

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend has `@CrossOrigin` annotation
   - Check API base URL configuration

2. **API Connection Issues**
   - Verify backend server is running
   - Check API base URL in `src/config/api.js`
   - Check browser network tab for failed requests

3. **Form Validation Errors**
   - Check browser console for validation errors
   - Verify all required fields are filled

4. **Payment Issues**
   - Ensure payment service is properly configured
   - Check payment API endpoint

### Debug Mode

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## 📝 Next Steps

1. **Add Authentication**
   - Implement user login/registration
   - Add JWT token handling

2. **Enhanced Features**
   - Order history
   - Booking management
   - Admin dashboard

3. **Production Deployment**
   - Environment-specific configurations
   - SSL certificate setup
   - Performance optimization

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include loading states
4. Test all integrations
5. Update documentation

---

For more detailed API documentation, refer to your Spring Boot backend documentation.
