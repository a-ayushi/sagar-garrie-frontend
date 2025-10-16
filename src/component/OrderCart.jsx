import { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';
import './OrderCart.css';

const OrderCart = ({ isOpen, onClose, onOrderComplete }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sagarGarrieCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('sagarGarrieCart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('sagarGarrieCart');
    }
  }, [cartItems]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    clearCart();
    onOrderComplete && onOrderComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="order-cart-overlay" onClick={onClose}>
        <div className="order-cart" onClick={(e) => e.stopPropagation()}>
          <div className="order-cart-header">
            <h2 className="order-cart-title">Your Order</h2>
            <button onClick={onClose} className="order-cart-close">×</button>
          </div>

          <div className="order-cart-content">
            {cartItems.length === 0 ? (
              <div className="order-cart-empty">
                <div className="order-cart-empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items from our menu to get started!</p>
              </div>
            ) : (
              <>
                <div className="order-cart-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="order-cart-item">
                      <div className="order-cart-item-info">
                        <h4 className="order-cart-item-name">{item.name}</h4>
                        <p className="order-cart-item-price">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="order-cart-item-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="order-cart-quantity-btn"
                        >
                          -
                        </button>
                        <span className="order-cart-quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="order-cart-quantity-btn"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="order-cart-remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-cart-summary">
                  <div className="order-cart-total">
                    <span className="order-cart-total-label">Total:</span>
                    <span className="order-cart-total-amount">${getTotalAmount().toFixed(2)}</span>
                  </div>
                  
                  <div className="order-cart-actions">
                    <button 
                      onClick={clearCart}
                      className="order-cart-clear-btn"
                    >
                      Clear Cart
                    </button>
                    <button 
                      onClick={handleCheckout}
                      className="order-cart-checkout-btn"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingData={customerInfo}
        orderItems={cartItems}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

// Utility functions for cart management
export const addToCart = (item) => {
  const savedCart = localStorage.getItem('sagarGarrieCart');
  const cartItems = savedCart ? JSON.parse(savedCart) : [];
  
  const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }
  
  localStorage.setItem('sagarGarrieCart', JSON.stringify(cartItems));
};

export const getCartItemCount = () => {
  const savedCart = localStorage.getItem('sagarGarrieCart');
  if (!savedCart) return 0;
  
  const cartItems = JSON.parse(savedCart);
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

export default OrderCart;
