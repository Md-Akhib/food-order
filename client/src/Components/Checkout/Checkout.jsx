import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './Checkout.css';
import { useAppContext } from '../../Context/AppContext';

const Checkout = () => {
  const { user, axios, menuitem, cartAmount, clearCart, navigate } = useAppContext();

  const [paymentType, setPaymentType] = useState('cod');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Loader States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [zipcode, setZipcode] = useState("");

  const getAddress = async () => {
    try {
      const { data } = await axios.get('/api/address/get');
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]._id);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getAddress();
    }
  }, [user]);

  const handleForm = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true); // Start address loader

    try {
      const { data } = await axios.post("/api/address/add", {
        userId: user?._id, firstName, lastName, street, city, state, country, phone, zipcode,
      });

      if (data.success) {
        toast.success(data.message);
        setShowAddressForm(false);
        getAddress();
        setFirstName(""); setLastName(""); setStreet("");
        setCity(""); setState(""); setCountry("");
        setPhone(""); setZipcode("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSavingAddress(false); // Stop address loader
    }
  };

  const handleCOD = async () => {
    if (!selectedAddress) return toast.error("Please select a delivery address.");
    if (!user.cartItems || user.cartItems.length === 0) return toast.error("Your cart is empty.");

    setIsSubmitting(true);
    try {
      const { data } = await axios.post('/api/order/cod', {
        userId: user._id,
        items: user.cartItems.map(item => ({ menuitem: item.id, quantity: item.quantity })),
        price: cartAmount(),
        paymentType: "COD",
        address: selectedAddress,
        statusHistory: [{ status: "placed", date: Date.now() }],
      });
      if (data.success) {
        toast.success(data.message);
        navigate('/orders');
        await clearCart();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleOnline = async () => {
    if (!selectedAddress) return toast.error("Please select a delivery address.");
    if (!user.cartItems || user.cartItems.length === 0) return toast.error("Your cart is empty.");

    setIsSubmitting(true); 
    try {
      const { data } = await axios.post('/api/order/online', {
        userId: user._id,
        items: user.cartItems.map(item => ({ menuitem: item.id, quantity: item.quantity })),
        address: selectedAddress,
        statusHistory: [{ status: "placed", date: Date.now() }],
        paymentType: "Online"
      });
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='checkout-page container section'>
      <div className="checkout-layout">

        {/* --- LEFT COLUMN --- */}
        <div className="checkout-left">
          <div className="checkout-card">
            <h3 className="checkout-title">Select Payment Type</h3>
            <div className="radio-group">
              <label className={`radio-label ${paymentType === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentType === 'cod'}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                Cash on Delivery (COD)
              </label>
              <label className={`radio-label ${paymentType === 'online' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentType === 'online'}
                  onChange={(e) => setPaymentType(e.target.value)}
                />
                Online Payment
              </label>
            </div>
          </div>

          <div className="checkout-card">
            <div className="checkout-header-flex">
              <h3 className="checkout-title">Shipping Information</h3>
              <button
                className="toggle-btn"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? "- Cancel" : "+ Add New Address"}
              </button>
            </div>

            {/* Smooth Transition Wrapper */}
            <div className={`address-form-wrapper ${showAddressForm ? 'open' : ''}`}>
              <form className="address-form" onSubmit={handleForm}>
                <div className="form-row">
                  <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="form-row">
                  <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  <input type="text" placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} required />
                </div>
                <div className="form-row">
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                  <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
                </div>
                <div className="form-row">
                  <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                  <input type="text" placeholder="Zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />
                </div>

                {/* Save Address Button with Loader */}
                <button type="submit" className="save-btn" disabled={isSavingAddress}>
                  {isSavingAddress ? (
                    <div className="btn-loader btn-loader-small"></div>
                  ) : (
                    "Save Address"
                  )}
                </button>
              </form>
            </div>

            <div className="saved-addresses">
              {addresses.length === 0 && !showAddressForm && (
                <p className="empty-text">No saved addresses found. Please add one.</p>
              )}
              {addresses.map((address) => (
                <label
                  key={address._id}
                  className={`saved-address-card ${selectedAddress === address._id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={address._id}
                    checked={selectedAddress === address._id}
                    onChange={() => setSelectedAddress(address._id)}
                  />
                  <div className="address-info">
                    <h4>{address.firstName} {address.lastName} <span className="phone-badge">{address.phone}</span></h4>
                    <p>{address.street}, {address.city}, {address.state}</p>
                    <p>{address.zipcode}, {address.country}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="checkout-right">
          <div className="order-summary-card">
            <h3 className="checkout-title">Your Order</h3>

            <div className="cart-items-preview">
              {user?.cartItems?.map((item) => {
                const currentItem = menuitem?.find(b => b._id === item.id);
                if (!currentItem) return null;

                return (
                  <div className="preview-item" key={item.id}>
                    <div className="img-container">
                      <img src={currentItem.image} alt={currentItem.title} className="preview-img" />
                    </div>
                    <div className="preview-details">
                      <h4>{currentItem.title}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="preview-price">
                      ₹{(currentItem.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="summary-calculations">
              <div className="calc-row">
                <span>Subtotal</span>
                <span>₹{cartAmount().toFixed(2)}</span>
              </div>
              <div className="calc-row">
                <span>Delivery</span>
                <span className="free-text">Free</span>
              </div>
              <div className="calc-row total-row">
                <span>Total</span>
                <span>₹{cartAmount().toFixed(2)}</span>
              </div>
            </div>

            {/* Primary Checkout Button with Loader */}
            <button
              className="primary-checkout-btn"
              onClick={paymentType === 'cod' ? handleCOD : handleOnline}
              disabled={isSubmitting || user?.cartItems?.length === 0}
            >
              {isSubmitting ? (
                <div className="btn-loader"></div>
              ) : (
                paymentType === 'cod' ? 'Place Order (COD)' : 'Proceed To Pay'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;