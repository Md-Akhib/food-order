import React, { useState } from 'react';
import './AllMenuItems.css';
import { useAppContext } from '../../../Context/AppContext';
import { FaTrash, FaEdit, FaTimes, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AllMenuItems = () => {
  const { menuitem, fetchMenuItems, axios, categories } = useAppContext();

  // State for the Edit Modal
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // State to hold the data of the item being edited
  const [editData, setEditData] = useState({
    id: '',
    title: '',
    category: '',
    description: '',
    price: '',
    image: null,
  });
  const [newImage, setNewImage] = useState(null);

  // --- API Handlers ---

  const handleToggleStock = async (menuitemId) => {
    try {
      const { data } = await axios.post('/api/menu/stock', { menuitemId });
      if (data.success) {
        toast.success(data.message);
        await fetchMenuItems();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (menuitemId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post('/api/menu/delete', { menuitemId });
      if (data.success) {
        toast.success(data.message);
        await fetchMenuItems();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // --- Modal Handlers ---

  const openEditModal = (item) => {
    setEditData({
      id: item._id,
      title: item.title,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image,
    });
    setNewImage(null);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setNewImage(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("menuitemId", editData.id);
      formData.append("title", editData.title);
      formData.append("category", editData.category);
      formData.append("description", editData.description);
      formData.append("price", editData.price);

      // Only append the image if the user selected a new one
      if (newImage) {
        formData.append("image", newImage);
      }

      const { data } = await axios.post('/api/menu/update', formData);

      if (data.success) {
        toast.success(data.message);
        closeEditModal();
        await fetchMenuItems();
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
    <div className='all-menu-wrapper'>
      <div className='all-menu-header'>
        <h2>All Menu Items</h2>
      </div>

      {/* Responsive Table Container */}
      <div className='all-menu-table-container'>
        <table className='all-menu-table'>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th className="text-center">In Stock</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuitem && menuitem.length > 0 ? (
              menuitem.map((item, index) => (
                <tr key={index} className="all-menu-row">
                  <td className="all-menu-cell-product">
                    <img src={item.image} alt={item.title} className="all-menu-image" />
                    <div className="all-menu-info">
                      <h4 className="all-menu-title">{item.title}</h4>
                      <p className="all-menu-desc">{item.description?.substring(0, 35)}...</p>
                    </div>
                  </td>

                  <td className="all-menu-cell-category">
                    <span className="menu-tag">{item.category}</span>
                  </td>

                  <td className="all-menu-cell-price">
                    <p className="menu-price">₹{item.price}</p>
                  </td>

                  <td className="all-menu-cell-toggle">
                    <div className="toggle-wrapper">
                      <label className="menu-toggle">
                        <input
                          type="checkbox"
                          checked={item.inStock}
                          onChange={() => handleToggleStock(item._id)}
                          className="menu-toggle-input"
                        />
                        <span className="menu-toggle-slider stock-slider"></span>
                      </label>
                    </div>
                  </td>

                  <td className="all-menu-cell-actions">
                    <div className="actions-flex">
                      <button
                        onClick={() => openEditModal(item)}
                        className="action-btn edit-btn"
                        title="Edit Item"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="action-btn delete-btn"
                        title="Delete Item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-table-msg">No menu items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Edit Modal Popup --- */}
      {isEditing && (
        <div className="edit-modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="edit-modal-header">
              <h3>Edit Menu Item</h3>
              <button className="close-modal-btn" onClick={closeEditModal}><FaTimes /></button>
            </div>

            {/* Scrollable Form Area */}
            <form onSubmit={handleUpdateSubmit} className="edit-modal-form">

              <div className="edit-image-section">
                <input
                  type="file"
                  id="editMenuImage"
                  accept="image/*"
                  hidden
                  onChange={(e) => setNewImage(e.target.files[0])}
                />
                <label htmlFor="editMenuImage" className="edit-image-wrapper">
                  <img
                    src={newImage ? URL.createObjectURL(newImage) : editData.image}
                    alt="preview"
                  />
                  <div className="edit-image-overlay">
                    <FaCamera className="camera-icon" />
                  </div>
                </label>
                <p className="edit-image-hint">Click to change image</p>
              </div>

              <div className="edit-inputs-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories && categories.map((cat, i) => (
                      <option key={i} value={cat.title || cat}>{cat.title || cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    rows="4"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="edit-modal-actions">
                <button type="button" className="cancel-btn" onClick={closeEditModal} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? <span className="btn-loader-spinner"></span> : "Save Changes"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default AllMenuItems;