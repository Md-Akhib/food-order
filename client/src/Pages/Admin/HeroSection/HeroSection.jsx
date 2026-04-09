import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaImage } from 'react-icons/fa';
import './HeroSection.css';
import { useAppContext } from '../../../Context/AppContext';

const HeroSection = () => {

  const { axios, currentHero, fetchHero } = useAppContext();

  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHero();
  }, [])

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !paragraph || !image) {
      return toast.error("All fields (Title, Paragraph, Image) are required");
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("paragraph", paragraph);
    formData.append("image", image);

    try {
      setLoading(true);
      const { data } = await axios.post('/api/hero/add', formData);
      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setParagraph("");
        setImage(null);
        fetchHero();
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
    <div className="herosec-wrapper">
      <h2 className="herosec-main-title">Manage Hero Section</h2>
      <div className="herosec-container">
        {/* LEFT/TOP: Form Section */}
        <div className="herosec-form-card">
          <h3 className="herosec-card-title">Add New Hero</h3>
          <form className="herosec-form" onSubmit={handleSubmit}>
            {/* Image Upload Area */}
            <div className="herosec-form-group">
              <label className="herosec-label">Hero Image</label>
              <div className="herosec-image-upload-area">
                <label htmlFor="heroImage" className="herosec-image-label">
                  <input
                    accept="image/*"
                    type="file"
                    id="heroImage"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  {image ? (
                    <img
                      className="herosec-upload-preview"
                      src={URL.createObjectURL(image)}
                      alt="upload-preview"
                    />
                  ) : (
                    <div className="herosec-image-placeholder">
                      <FaImage className="herosec-image-icon" />
                      <p>Click to upload</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            {/* Text Inputs */}
            <div className="herosec-form-group">
              <label htmlFor="title" className="herosec-label">Title</label>
              <input
                type="text"
                id="title"
                className="herosec-input"
                placeholder="Enter Hero Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="herosec-form-group">
              <label htmlFor="paragraph" className="herosec-label">Paragraph</label>
              <textarea
                id="paragraph"
                className="herosec-input herosec-textarea"
                rows="4"
                placeholder="Enter Hero Paragraph"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
              ></textarea>
            </div>
            {/* Submit Button with Loader */}
            {loading ? (
              <button type="button" className="herosec-btn herosec-btn-loading" disabled>
                <span className="herosec-spinner"></span> Adding...
              </button>
            ) : (
              <button type="submit" className="herosec-btn">Add Hero Section</button>
            )}
          </form>
        </div>

        {/* RIGHT/BOTTOM: Live Preview Section */}
        <div className="herosec-preview-card">
          <h3 className="herosec-card-title">Current Live Hero</h3>
          {currentHero ? (
            <div className="herosec-live-preview">
              <div className="herosec-live-image-wrapper">
                <img src={currentHero.image} alt={currentHero.title} className="herosec-live-image" />
              </div>
              <div className="herosec-live-content">
                <h2 className="herosec-live-title">{currentHero.title}</h2>
                <p className="herosec-live-paragraph">{currentHero.paragraph}</p>
              </div>
            </div>
          ) : (
            <div className="herosec-empty-state">
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;