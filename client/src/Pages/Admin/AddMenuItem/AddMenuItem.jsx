import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';
import './AddMenuItem.css';
import toast from 'react-hot-toast';
import { useAppContext } from '../../../Context/AppContext';

const AddMenuItem = () => {
  const { axios, categories } = useAppContext();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select a menu item image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image);

      // Sending data to your backend endpoint
      const { data } = await axios.post('/api/menu/add', formData);

      if (data.success) {
        toast.success(data.message);

        // Reset Form
        setImage(null);
        setTitle('');
        setCategory('');
        setDescription('');
        setPrice('');
      } else {
        toast.error(data.message || "Failed to add menu item.");
      }

    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='add-menu-wrapper'>
      <div className="add-menu-header">
        <h2>Add Menu Item</h2>
      </div>

      <form className='add-menu-form' onSubmit={handleSubmit}>

        <div className="form-top-row">
          {/* Image Upload Area */}
          <div className="form-group image-group">
            <label className="input-label">Item Image</label>
            <label htmlFor="menuImage" className="single-image-upload">
              <input
                accept="image/*"
                type="file"
                id="menuImage"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
              {image ? (
                <img
                  className="preview-image"
                  src={URL.createObjectURL(image)}
                  alt="preview"
                />
              ) : (
                <div className="image-placeholder">
                  <FaImage className="placeholder-icon" />
                  <p>Click to upload image</p>
                </div>
              )}
            </label>
          </div>

          {/* Core Text Inputs */}
          <div className="core-info-group">
            <div className="form-group">
              <label className="input-label" htmlFor="title">Item Title</label>
              <input
                type="text"
                id="title"
                placeholder="e.g. Spicy Chicken Burger"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="input-label" htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.title}>{cat.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="input-label" htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  placeholder="e.g. 299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe the ingredients, taste, and preparation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-submit-area">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loader"></span>
            ) : (
              "Add Item to Menu"
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddMenuItem;