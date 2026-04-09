import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useAppContext } from '../../Context/AppContext';
import { FaCamera, FaUser, FaEnvelope, FaPhoneAlt, FaBirthdayCake, FaVenusMars } from "react-icons/fa";
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, fetchUser, axios } = useAppContext();

  const [editProfile, setEditProfile] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setImage(user?.image || null);
    setPhone(user?.phone || '');
    setGender(user?.gender || '');
    setBirthday(user?.birthday ? user.birthday.split('T')[0] : '');
  }, [user]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone || '');
      formData.append('gender', gender || '');
      formData.append('birthday', birthday || '');
      if (image && typeof image !== 'string') {
        formData.append('image', image);
      }

      const { data } = await axios.post('/api/user/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success(data.message || "Profile updated successfully!");
        setEditProfile(false);
        await fetchUser();
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
    <div className="profile-page-wrapper">
      <div className="profile-card">

        {/* Top Cover Banner */}
        <div className="profile-cover"></div>

        <div className="profile-content">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            {editProfile ? (
              <>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label htmlFor="profileImage" className="profile-avatar edit-mode">
                  {/* Inline Logic for Edit Mode Avatar */}
                  {image ? (
                    <img src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt="profile" />
                  ) : (
                    <div className="avatar-placeholder">{name ? name.charAt(0).toUpperCase() : 'U'}</div>
                  )}

                  <div className="avatar-overlay">
                    <FaCamera className="camera-icon" />
                  </div>
                </label>
              </>
            ) : (
              <div className="profile-avatar view-mode">
                {/* Inline Logic for View Mode Avatar */}
                {image ? (
                  <img src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt="profile" />
                ) : (
                  <div className="avatar-placeholder">{name ? name.charAt(0).toUpperCase() : 'U'}</div>
                )}
              </div>
            )}

            <div className="profile-header-info">
              <h2>{user?.name || 'User'}</h2>
              <p>{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleEdit} className="profile-details-form">
            <div className="profile-grid">

              {/* Name */}
              <div className="profile-field">
                <label><FaUser className="field-icon" /> Name</label>
                {editProfile ? (
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                ) : (
                  <div className="field-value">{name}</div>
                )}
              </div>

              {/* Email (Always read-only) */}
              <div className="profile-field">
                <label><FaEnvelope className="field-icon" /> Email</label>
                <div className="field-value read-only">{user?.email}</div>
              </div>

              {/* Phone */}
              <div className="profile-field">
                <label><FaPhoneAlt className="field-icon" /> Phone Number</label>
                {editProfile ? (
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Add Phone Number" />
                ) : (
                  <div className="field-value">{phone || <span className="empty-text">Not provided</span>}</div>
                )}
              </div>

              {/* Gender */}
              <div className="profile-field">
                <label><FaVenusMars className="field-icon" /> Gender</label>
                {editProfile ? (
                  <select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="field-value capitalize">{gender || <span className="empty-text">Not provided</span>}</div>
                )}
              </div>

              {/* Birthday */}
              <div className="profile-field">
                <label><FaBirthdayCake className="field-icon" /> Date of Birth</label>
                {editProfile ? (
                  <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                ) : (
                  <div className="field-value">{birthday || <span className="empty-text">Not provided</span>}</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              {editProfile ? (
                <>
                  <button type="button" className="btn-cancel" onClick={() => setEditProfile(false)}>Cancel</button>
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button type="button" className="btn-edit" onClick={() => setEditProfile(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Profile;