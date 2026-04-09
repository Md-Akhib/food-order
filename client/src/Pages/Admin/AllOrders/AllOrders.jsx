import React, { useState, useEffect } from 'react';
import './AllOrders.css';
import { useAppContext } from '../../../Context/AppContext';
import toast from 'react-hot-toast';

const AllOrders = () => {
  const { axios } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 50;

  const fetchAllOrders = async (showToast = false) => {
    try {
      const { data } = await axios.get('/api/order/all');
      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      if (showToast) toast.error(error.message);
    }
  };

  // Setup Polling for "Instant" Updates
  useEffect(() => {
    fetchAllOrders(true);
    const intervalId = setInterval(() => {
      fetchAllOrders(false);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDate]);

  const handleChange = async (e, order_id) => {
    try {
      const { data } = await axios.post('/api/order/status', {
        order_id: order_id,
        status: e.target.value
      });
      if (data.success) {
        toast.success(data.message);
        await fetchAllOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = async (order_id) => {
    try {
      const { data } = await axios.post('/api/order/cancel', { order_id });
      if (data.success) {
        toast.success("Order cancelled successfully");
        await fetchAllOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // NEW: Handle Rejecting Cancellation
  const handleRejectCancel = async (order_id) => {
    try {
      const { data } = await axios.post('/api/order/rejectCancel', { order_id });
      if (data.success) {
        toast.success("Cancellation request rejected");
        await fetchAllOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = search ? order.orderId.toLowerCase().includes(search.toLowerCase()) : true;
    let matchesDate = true;
    if (selectedDate) {
      const d = new Date(order.createdAt);
      const orderDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      matchesDate = orderDateStr === selectedDate;
    }
    return matchesSearch && matchesDate;
  });

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="ao-main-container">
      <div className="ao-top-bar">
        <div>
          <h2 className="ao-page-title">Order Management</h2>
          <p className="ao-page-subtitle">Manage, track, and update customer orders in real-time</p>
        </div>
        <div className="ao-filters-wrap">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ao-input-box ao-search-box"
          />
          <div className="ao-date-wrap">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="ao-input-box ao-date-box"
            />
          </div>
        </div>
      </div>

      <div className="ao-table-scroll-wrapper">
        <table className="ao-data-table">
          <thead>
            <tr>
              <th className="ao-th">Order ID</th>
              <th className="ao-th">Items</th>
              <th className="ao-th">Customer</th>
              <th className="ao-th">Total & Payment</th>
              <th className="ao-th">Status</th>
              <th className="ao-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order._id} className="ao-table-row">
                  <td className="ao-td ao-fw-bold">
                    {order.orderId}
                    <br />
                    <span className="ao-date-small">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </td>

                  <td className="ao-td">
                    <div className="ao-item-list">
                      {order.items.map((item, idx) => {
                        if (!item.menuitem) return <div key={idx} className="ao-item-error">Item Removed</div>;

                        return (
                          <div key={idx} className="ao-single-item">
                            <div className="ao-item-img-container">
                              <img src={item.menuitem.image} alt={item.menuitem.title} className="ao-item-image" />
                            </div>
                            <div className="ao-item-info">
                              <p className="ao-item-name">{item.menuitem.title}</p>
                              <p className="ao-item-qty">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  <td className="ao-td">
                    {order.address ? (
                      <>
                        <p className="ao-cust-name">{order.address.firstName} {order.address.lastName}</p>
                        <p className="ao-cust-details">{order.address.street}, {order.address.city}</p>
                        <p className="ao-cust-details">Ph: {order.address.phone}</p>
                      </>
                    ) : (
                      <p className="ao-item-error">Address Unavailable</p>
                    )}
                  </td>

                  <td className="ao-td">
                    <p className="ao-price-text">₹{order.price.toFixed(2)}</p>
                    {/* FIXED: Dynamic Payment Badge Display */}
                    <span className={`ao-pay-badge ${order.status === 'refunded' ? 'ao-refunded' : order.isPaid ? 'ao-paid' : 'ao-unpaid'}`}>
                      {order.paymentType} - {order.status === 'refunded' ? 'Refunded' : order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>

                  <td className="ao-td">
                    <div className="ao-status-box">
                      <span className={`ao-stat-badge ao-stat-${order.status.replace(/\s+/g, '-')}`}>
                        {order.status === 'confirmed' ? 'Preparing' : order.status}
                      </span>
                      {order.isCancel && <span className="ao-alert-tag">Cancel Requested</span>}
                    </div>
                  </td>

                  <td className="ao-td">
                    <div className="ao-actions-col">
                      {/* Dropdown for Active Orders */}
                      {order.status !== "delivered" && order.status !== "cancelled" && order.status !== "refunded" && !order.isCancel && (
                        <select onChange={(e) => handleChange(e, order._id)} className="ao-select-drop" value={order.status}>
                          <option value="placed" disabled={order.status !== "placed"}>Placed</option>
                          <option value="confirmed" disabled={order.status !== "placed" && order.status !== "confirmed"}>Preparing</option>
                          <option value="out for delivery" disabled={order.status !== "confirmed" && order.status !== "out for delivery"}>Out For Delivery</option>
                          <option value="delivered" disabled={order.status !== "out for delivery"}>Delivered</option>
                        </select>
                      )}

                      {/* Dropdown for Cancelled/Refunded Orders */}
                      {(order.status === "cancelled" || !order.status === "refunded") && (
                        <select onChange={(e) => handleChange(e, order._id)} className="ao-select-drop ao-select-cancelled" value={order.status}>
                          <option value="cancelled" disabled>Cancelled</option>
                          <option value="refunded" disabled={order.status === "refunded"}>Refunded</option>
                        </select>
                      )}

                      {/* Action Buttons */}
                      {order.isCancel && order.status !== 'cancelled' && order.status !== 'refunded' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button className="ao-btn ao-btn-red" onClick={() => handleCancel(order._id)}>Confirm Cancel</button>
                          <button className="ao-btn ao-btn-gray" onClick={() => handleRejectCancel(order._id)}>Reject Cancel</button>
                        </div>
                      )}

                      {!order.isCancel && order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'refunded' && (
                        <button className="ao-btn ao-btn-outline" onClick={() => handleCancel(order._id)}>Force Cancel</button>
                      )}
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="ao-empty-msg">
                  No orders found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="ao-paginate-wrap">
          <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="ao-page-btn">Previous</button>
          <span className="ao-page-text">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} className="ao-page-btn">Next</button>
        </div>
      )}
    </div>
  );
};

export default AllOrders;