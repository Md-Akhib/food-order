import React, { useState } from 'react';
import './Orders.css';
import { FaRegCircle } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import toast from 'react-hot-toast';
import { useAppContext } from '../../Context/AppContext';

const Orders = () => {
  const { orders, axios, fetchOrders } = useAppContext();
  const [loadingAction, setLoadingAction] = useState(null);

  const normalStatusData = [
    { id: "placed", title: "Order Placed" },
    { id: "confirmed", title: "Your order is being prepared" },
    { id: "out for delivery", title: "Out For Delivery" },
    { id: "delivered", title: "Delivered" },
  ];

  const cancelledStatus = [{ id: "cancelled", title: "Cancelled" }];

  const refundedStatus = [
    { id: "cancelled", title: "Cancelled" },
    { id: "refunded", title: "Refund Processed" }
  ];

  const handleCancel = async (order_id) => {
    setLoadingAction(order_id);
    try {
      const { data } = await axios.post('/api/order/reqCancel', { order_id });
      if (data.success) {
        toast.success(data.message);
        await fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="empty-orders-container">
        <h2>No orders found</h2>
        <p>Looks like you haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className='orders-container section container'>
      <h2 className="orders-page-title">Order History</h2>

      <div className="orders-list">
        {orders.map((order) => {
          let statusesToShow = normalStatusData;
          if (order.status === 'refunded') {
            statusesToShow = refundedStatus;
          } else if (order.status === 'cancelled') {
            statusesToShow = cancelledStatus;
          }

          return (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <div className="order-id-block">
                  <span className="label">Order ID</span>
                  <span className="value">{order.orderId}</span>
                </div>
                <div className="order-date-block">
                  <span className="label">Placed on</span>
                  <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="order-body">
                <div className="order-items-section">
                  {order.items.map((item, itemIndex) => {
                    if (!item.menuitem) {
                      return (
                        <div key={itemIndex} className="order-item error-item">
                          <p>Item no longer available</p>
                        </div>
                      );
                    }

                    return (
                      <div className="order-item" key={itemIndex}>
                        <div className="item-img-wrapper">
                          <img src={item.menuitem.image} alt={item.menuitem.title} loading="lazy" />
                        </div>
                        <div className="item-details">
                          <h5>{item.menuitem.title}</h5>
                          <p className="item-qty">Qty: {item.quantity}</p>
                          {item.menuitem.category && <p className="item-category">{item.menuitem.category}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="order-summary-section">
                  <div className="summary-block">
                    <h4>₹{order.price.toFixed(2)}</h4>
                    {/* FIXED: Dynamic Payment Badge Display for Refunded */}
                    <span className={`payment-badge ${order.status === 'refunded' ? 'refunded' : order.isPaid ? 'paid' : 'unpaid'}`}>
                      {order.paymentType} {order.status === 'refunded' ? '(Refunded)' : order.isPaid ? '(Paid)' : ''}
                    </span>
                  </div>

                  <div className="address-block">
                    <span className="address-label">Delivery Address:</span>
                    {order.address ? (
                      <div className="address-content">
                        <p className="name">{order.address.firstName} {order.address.lastName}</p>
                        <p className="text">{order.address.street}, {order.address.city}, {order.address.zipcode}</p>
                        <p className="phone">{order.address.phone}</p>
                      </div>
                    ) : (
                      <p className="error-text">Address unavailable</p>
                    )}
                  </div>
                </div>

                <div className="order-status-section">
                  <div className="status-timeline">
                    {statusesToShow.map((status, statusIndex) => {
                      const historyEntry = order.statusHistory.find(s => s.status === status.id);
                      const isActive = !!historyEntry;

                      return (
                        <div className={`status-step ${isActive ? 'active' : ''}`} key={statusIndex}>
                          <div className="status-icon">
                            {isActive ? <FaRegCircleCheck /> : <FaRegCircle />}
                          </div>
                          <div className="status-info">
                            <p className="status-title">{status.title}</p>
                            {isActive && <span className="status-date">{new Date(historyEntry.date).toLocaleDateString()}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="order-actions">
                    {order.status === 'refunded' && (
                      <div className="action-alert alert-refunded">
                        <GoDotFill /> Refunded Successfully
                      </div>
                    )}

                    {order.status === 'cancelled' && (
                      <div className="action-alert alert-cancelled">
                        <GoDotFill /> Cancelled Successfully
                      </div>
                    )}

                    {/* FIXED: Replaced 'out for delivery' to hide cancel button when shipped/out */}
                    {order.status !== 'cancelled' && order.status !== 'refunded' && order.status !== 'delivered' && order.status !== 'out for delivery' && (
                      order.isCancel ? (
                        <div className="action-alert alert-pending">
                          Cancellation Pending
                        </div>
                      ) : (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancel(order._id)}
                          disabled={loadingAction === order._id}
                        >
                          {loadingAction === order._id ? (
                            <span className="btn-spinner"></span>
                          ) : (
                            "Cancel Order"
                          )}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;