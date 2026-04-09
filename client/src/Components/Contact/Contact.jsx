import React, { useState } from 'react';
import './Contact.css';
import contactImg from '../../assets/contact.webp';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const Contact = () => {
  const { axios } = useAppContext();

  // 1. Form State exactly matching the backend requirements
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  // 2. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('/api/notification/add', formData);

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      {/* Div 1: Info Cards Section */}
      <div className="contact-info-section container section">
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <div className="contact-icon-wrapper">
              <FaMapMarkerAlt className="contact-icon" />
            </div>
            <h3 className="contact-card-title">Our Address</h3>
            <p className="contact-card-text">4517 Washington Ave. Manchester, Kentucky 39495</p>
          </div>
          <div className="contact-info-card">
            <div className="contact-icon-wrapper">
              <FaEnvelope className="contact-icon" />
            </div>
            <h3 className="contact-card-title">Info@Exmple.Com</h3>
            <p className="contact-card-text">Email us anytime for any kind of query.</p>
          </div>
          <div className="contact-info-card">
            <div className="contact-icon-wrapper">
              <FaPhoneAlt className="contact-icon" />
            </div>
            <h3 className="contact-card-title">Hot: +208-666-01112</h3>
            <p className="contact-card-text">24/7/365 priority Live Chat and ticketing support.</p>
          </div>
        </div>
      </div>

      {/* Div 2: Contact Form & Image Section */}
      <div className="contact-form-section container section">
        <div className="contact-form-wrapper">
          <div className="contact-image-container">
            <img src={contactImg} alt="Contact Roast" className="contact-image" />
          </div>

          <div className="contact-form-content">
            <h2 className="contact-form-title">Get In Touch</h2>
            <form className="contact-form" onSubmit={handleSubmit}>

              {/* Row 1: First Name & Last Name */}
              <div className="contact-input-row">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="First Name"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="Last Name"
                  required
                />
              </div>

              {/* Row 2: Phone & Subject (Both are standard text/tel inputs now) */}
              <div className="contact-input-row">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="Phone Number"
                  required
                />
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="contact-input"
                  placeholder="Subject"
                  required
                />
              </div>

              {/* Textarea: Message */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact-textarea"
                placeholder="Write your message here..."
                rows="6"
                required
              ></textarea>

              <button type="submit" className="contact-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="contact-btn-spinner"></span>
                ) : (
                  <>SUBMIT NOW <span>→</span></>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* Div 3: Google Map Section */}
      <div className="contact-map-section">
        <iframe
          className="contact-map-iframe"
          title="Nobabgonj National garden Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.39712711666!2d88.9482705!3d24.9185108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc9b44fc0c8b3d%3A0xcb1b7027c6dcbc7e!2sNawabganj%20National%20Park!5e0!3m2!1sen!2sbd!4v1689257218391!5m2!1sen!2sbd"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;