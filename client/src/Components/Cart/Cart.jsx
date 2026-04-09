import React from 'react';
import './Cart.css';
import { useAppContext } from '../../Context/AppContext';

const Cart = () => {
  const { user, addToCart, removeCart, cartAmount, menuitem, navigate } = useAppContext();
  const cartItems = user?.cartItems || [];

  // Check if any item currently in the cart is out of stock
  const hasOutOfStockItems = cartItems.some(item => {
    const menuItemObj = menuitem?.find((m) => m._id === item.id);
    return menuItemObj && !menuItemObj.inStock;
  });

  if (cartItems.length === 0) {
    return (
      <div className="container section empty-cart-container">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is currently empty.</h2>
        <p>Looks like you haven't added any delicious items yet!</p>
        <button className="continue-shopping-btn" onClick={() => navigate('/menu')}>
          Explore Our Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container section cart-container">
      <h1 className="cart-page-title">Shopping Cart</h1>

      <div className="cart-content-wrapper">
        {/* Left Side: Cart Items List */}
        <div className="cart-left">
          <div className="cart-header">
            <div className="col-product">Product</div>
            <div className="col-price">Price</div>
            <div className="col-quantity">Quantity</div>
            <div className="col-subtotal">Subtotal</div>
          </div>

          <div className="cart-items-wrapper">
            {cartItems.map((item) => {
              const menuItemObj = menuitem?.find((m) => m._id === item.id);
              if (!menuItemObj) return null;

              const isOutOfStock = !menuItemObj.inStock;

              return (
                <div
                  className={`cart-row ${isOutOfStock ? 'out-of-stock-row' : ''}`}
                  key={item.id}
                >
                  <div className="col-product">
                    <div className="cart-img-wrapper">
                      <img src={menuItemObj.image} alt={menuItemObj.title} className="cart-img" />
                    </div>
                    <div className="cart-item-info">
                      <span className="cart-item-title">{menuItemObj.title}</span>
                      <span className="cart-item-category">{menuItemObj.category}</span>

                      {isOutOfStock && (
                        <span className="out-of-stock-warning">
                          Out of Stock - Please remove
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-price">
                    <span className="mobile-label">Price:</span>
                    <span className="cart-price-text">₹{menuItemObj.price.toFixed(2)}</span>
                  </div>

                  <div className="col-quantity">
                    <span className="mobile-label">Quantity:</span>
                    <div className="qty-selector">
                      <button
                        className="qty-btn"
                        onClick={() => removeCart(item.id)}
                      >
                        −
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => addToCart(item.id)}
                        disabled={isOutOfStock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-subtotal">
                    <span className="mobile-label">Subtotal:</span>
                    <span className="cart-subtotal-text">₹{(menuItemObj.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Cart Totals & Checkout */}
        <div className="cart-right">
          <div className="cart-total-box">
            <h3 className="total-heading">Order Summary</h3>

            <div className="total-row">
              <span className="total-label">Subtotal:</span>
              <span className="total-value">₹{cartAmount().toFixed(2)}</span>
            </div>

            <div className="total-row">
              <span className="total-label">Taxes & Fees:</span>
              <span className="total-value">₹0.00</span>
            </div>

            <div className="total-row final-total">
              <span className="total-label">Total:</span>
              <span className="final-value">₹{cartAmount().toFixed(2)}</span>
            </div>

            <button
              className={`checkout-btn ${hasOutOfStockItems ? 'btn-disabled' : ''}`}
              onClick={() => navigate('/checkout')}
              disabled={hasOutOfStockItems}
            >
              {hasOutOfStockItems ? 'Remove Out of Stock Items' : 'Proceed To Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;