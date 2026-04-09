import React, { useState, useEffect } from 'react';
import './AdminCategory.css';
import { FaImage, FaTrash } from 'react-icons/fa';
import { useAppContext } from '../../../Context/AppContext';
import toast from 'react-hot-toast'

const AdminCategory = () => {
    const { axios, fetchCategories, categories } = useAppContext();

    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleCategorySubmit = async (e) => {
        e.preventDefault();

        if (!title || !image) {
            alert("Please provide both a title and an image.");
            return;
        }

        setLoading(true);

        // MUST use FormData to send files to Multer backend
        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);

        try {
            const { data } = await axios.post('/api/category/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                toast.success(data.message);
                setTitle("");
                setImage(null);
                fetchCategories();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    };

    // Handle deleting a category
    const handleDeleteCategory = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");
        if (!confirmDelete) return;
        try {
            const { data } = await axios.post('/api/category/delete', { id });
            if (data.success) {
                fetchCategories();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    return (
        <div className="admin-cat-wrapper">

            {/* --- ADD CATEGORY SECTION --- */}
            <div className="admin-cat-add-section">
                <h2 className="admin-cat-heading">Add Category</h2>

                <form className="admin-cat-form" onSubmit={handleCategorySubmit}>
                    <div className="admin-cat-input-group">
                        <label htmlFor="admin-cat-title">Title:</label>
                        <input
                            type="text"
                            id="admin-cat-title"
                            placeholder="e.g., Fast Food"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="admin-cat-input-group">
                        <label>Image:</label>
                        {/* The label wraps the box so clicking anywhere inside triggers the file input */}
                        <label htmlFor="admin-cat-image-upload" className="admin-cat-upload-box">
                            <input
                                accept="image/*"
                                type="file"
                                id="admin-cat-image-upload"
                                hidden
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            {image ? (
                                <img
                                    className="admin-cat-preview-img"
                                    src={URL.createObjectURL(image)}
                                    alt="upload-preview"
                                />
                            ) : (
                                <div className="admin-cat-upload-placeholder">
                                    <FaImage className="admin-cat-image-icon" />
                                    <p>Click to upload image</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <button className="admin-cat-submit-btn" type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Category"}
                    </button>
                </form>
            </div>

            {/* --- ALL CATEGORIES SECTION --- */}
            <div className="admin-cat-list-section">
                <h2 className="admin-cat-heading">All Categories</h2>

                <div className="admin-cat-grid">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div className="admin-cat-card" key={category._id}>
                                <div className="admin-cat-card-img-wrapper">
                                    <img src={category.image} alt={category.title} />
                                </div>
                                <div className="admin-cat-card-info">
                                    <h3>{category.title}</h3>
                                    <button
                                        onClick={() => handleDeleteCategory(category._id)}
                                        className="admin-cat-delete-btn"
                                        title="Delete Category"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="admin-cat-empty">No categories found. Add one above!</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AdminCategory;