import React, { useState, useEffect } from 'react';
import './Notification.css';
import { useAppContext } from '../../../Context/AppContext';
import toast from 'react-hot-toast';
import Loader from '../../../Components/Loader/Loader'; // Adjust path if needed
import { FaPhoneAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdOutlineSubject, MdAccessTime } from 'react-icons/md';

const Notification = () => {
  const { axios } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to track which notification card is expanded
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notification/get-all');
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    // If clicking the currently expanded card, close it. Otherwise, open the new one.
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (loading) return <Loader />;

  return (
    <div className="notif-container">
      <div className="notif-header">
        <div>
          <h2 className="notif-title">Customer Messages</h2>
          <p className="notif-subtitle">Review inquiries and support requests from your contact form.</p>
        </div>
        <div className="notif-badge">
          {notifications.length} Total
        </div>
      </div>

      <div className="notif-list">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`notif-card ${expandedId === notif._id ? 'expanded' : ''}`}
            >
              {/* Card Header (Always Visible) */}
              <div
                className="notif-card-header"
                onClick={() => toggleExpand(notif._id)}
              >
                <div className="notif-avatar">
                  {notif.firstName.charAt(0).toUpperCase()}
                </div>

                <div className="notif-summary">
                  <div className="notif-summary-top">
                    <h4 className="notif-sender">
                      {notif.firstName} {notif.lastName}
                    </h4>
                    <span className="notif-date">
                      <MdAccessTime className="icon-sm" />
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                  <div className="notif-subject">
                    <MdOutlineSubject className="icon-sm text-gray" />
                    <span>{notif.subject}</span>
                  </div>
                </div>

                <button className="notif-expand-btn">
                  {expandedId === notif._id ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {/* Card Body (Collapsible) */}
              {expandedId === notif._id && (
                <div className="notif-card-body">
                  <div className="notif-contact-info">
                    <span className="notif-phone">
                      <FaPhoneAlt className="icon-sm" />
                      <a href={`tel:${notif.phone}`}>{notif.phone}</a>
                    </span>
                  </div>
                  <div className="notif-message-box">
                    <p className="notif-message-text">{notif.message}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="notif-empty-state">
            <div className="empty-icon">📭</div>
            <h3>No messages yet</h3>
            <p>You're all caught up! When customers use the contact form, their messages will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;