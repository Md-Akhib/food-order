import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png';
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaAngleDoubleRight,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      {/* footer */}
      <footer className="footer-area section">
        {/* Top orange info banner */}
        <div className="footer-info-banner container ">
          <div className="info-item">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="info-content">
              <h4>Address</h4>
              <p>4648 Rocky Road Philadelphia</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <h4>Send Email</h4>
              <p>info@example.com</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">
              <FaPhoneAlt />
            </div>
            <div className="info-content">
              <h4>Call Emergency</h4>
              <p>+88 0123 654 99</p>
            </div>
          </div>
        </div>

        {/* Main Footer Section */}
        <div className="footer-main">
          <div className="container footer-grid">
            {/* Brand Column */}
            <div className="footer-col brand-col">
              <img src={logo} alt="Logo" className="footer-logo" />
              <p className="footer-desc">
                Phasellus ultricies aliquam volutpat ullamcorper laoreet neque, a lacinia curabitur lacinia mollis
              </p>
              <div className="footer-socials">
                <Link to="#"><FaFacebookF /></Link>
                <Link to="#"><FaTwitter /></Link>
                <Link to="#"><FaLinkedinIn /></Link>
                <Link to="#"><FaYoutube /></Link>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="footer-col">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/about"><FaAngleDoubleRight className="link-icon" /> About Us</Link></li>
                <li><Link to="/gallery"><FaAngleDoubleRight className="link-icon" /> Our Gallery</Link></li>
                <li><Link to="/blogs"><FaAngleDoubleRight className="link-icon" /> Our Blogs</Link></li>
                <li><Link to="/faq"><FaAngleDoubleRight className="link-icon" /> FAQ'S</Link></li>
                <li><Link to="/contact"><FaAngleDoubleRight className="link-icon" /> Contact Us</Link></li>
              </ul>
            </div>

            {/* Our Menu Column */}
            <div className="footer-col">
              <h3 className="footer-title">Our Menu</h3>
              <ul className="footer-links">
                <li><Link to="/menu"><FaAngleDoubleRight className="link-icon" /> Burger King</Link></li>
                <li><Link to="/menu"><FaAngleDoubleRight className="link-icon" /> Pizza king</Link></li>
                <li><Link to="/menu"><FaAngleDoubleRight className="link-icon" /> Fresh Food</Link></li>
                <li><Link to="/menu"><FaAngleDoubleRight className="link-icon" /> Vegetable</Link></li>
                <li><Link to="/menu"><FaAngleDoubleRight className="link-icon" /> Desserts</Link></li>
              </ul>
            </div>

            {/* Contact Us Column */}
            <div className="footer-col">
              <h3 className="footer-title">Contact Us</h3>
              <div className="footer-contact-info">
                <p>Monday - Friday:  <span>8am - 4pm</span></p>
                <p>Saturday:  <span>8am - 12am</span></p>
              </div>
              <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
                <div className="footer-input-group">
                  <input type="email" placeholder="Your email address" required />
                  <button type="submit"><FaArrowRight /></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>&copy; All Copyright 2024 by FreshEat</p>
          <div className="footer-bottom-links">
            <Link to="/terms">Terms & Condition</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
