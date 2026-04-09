import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const Navbar = () => {

  const { user, setUser, navigate, axios } = useAppContext();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  let cartCount = 0;
  if (user && user.cartItems) {
    for (let i = 0; i < user.cartItems.length; i++) {
      cartCount += user.cartItems[i].quantity;
    }
  }

  const profileRef = useRef();

  // logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout')
      if (data.success) {
        toast.success("logged out successfully")
        setUser(null);
        navigate('/');
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="nav-header">
      <div className='nav-container container'>
        <div className='nav-logo'>
          <Link to="/" onClick={closeMobileMenu}>
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <nav className={`nav-links ${isMobileMenuOpen ? 'nav-active' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item"><Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link></li>
            <li className="nav-item"><Link to="/menu" className="nav-link" onClick={closeMobileMenu}>Menu</Link></li>
            <li className="nav-item"><Link to="/about" className="nav-link" onClick={closeMobileMenu}>About</Link></li>
            <li className="nav-item"><Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact</Link></li>
          </ul>
        </nav>

        <div className='nav-actions'>
          <Link to="/search" className="nav-icon-link">
            <FaSearch className="nav-icon" />
          </Link>
          <Link to="/cart" className="nav-icon-link nav-cart-wrapper">
            <FaShoppingCart className="nav-icon" />
            <span className="nav-cart-badge">{cartCount}</span>
          </Link>

          {user ? (
            <div className="nav-profile" ref={profileRef} onClick={handleProfileToggle}>
              {user.image ? (
                <img src={user.image} alt="profile" className='nav-profile-img' />
              ) : (
                <h4>{user.name ? user.name.charAt(0).toUpperCase() : 'A'}</h4>
              )}
              {showDropdown && (
                <div className="profile-dropdown">
                  <Link to="/orders">My Orders</Link>
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-login-btn" onClick={() => navigate('/register')}>Login</button>
          )}

          <div className="nav-mobile-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
