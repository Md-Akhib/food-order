import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './AdminLogin.css';
import { useAppContext } from '../../../Context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminLogin = () => {

  const { isAdmin, setIsAdmin, navigate } = useAppContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post('/api/admin/login', {
        email, password
      })
      if (data.success) {
        toast.success(data.message);
        setIsAdmin(true);
      } else {
        toast.error(data.message);
        setIsAdmin(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2 className="admin-login-title">Admin Login</h2>

        <div className="admin-login-input-box">
          <MdEmail className="admin-login-icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="admin-login-input-box">
          <RiLockPasswordLine className="admin-login-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="admin-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button type="submit" className="admin-login-button">Log In</button>

        <p className="admin-login-signup-text">
          If you are not a admin? <Link to="/">Home</Link>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;