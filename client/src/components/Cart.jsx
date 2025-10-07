import React, { useState } from 'react';

const Cart = ({ cart, onRemoveFromCart, onUpdateQuantity, onSubmitCart }) => {
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const totalAmount = cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    await onSubmitCart(customerInfo);
    setCustomerInfo({ name: '', email: '' });
    setShowSubmitForm(false);
  };

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.productId} className="cart-item">
                <img src={item.product.image} alt={item.product.name} />
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p>${item.product.price}</p>
                </div>
                <div className="quantity-controls">
                  <button 
                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => onRemoveFromCart(item.productId)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Total: ${totalAmount.toFixed(2)}</h3>
            <button 
              onClick={() => setShowSubmitForm(true)}
              className="submit-cart-btn"
            >
              Submit Cart for Approval
            </button>
          </div>

          {showSubmitForm && (
            <div className="submit-form-overlay">
              <form onSubmit={handleSubmit} className="submit-form">
                <h3>Submit Cart</h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  required
                />
                <div className="form-buttons">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowSubmitForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;