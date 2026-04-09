import React, { useState } from 'react';
import './Register.css';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  // Removed setShowLogin since this is now a page component, not a popup
  const { axios, navigate, fetchUser } = useAppContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // New loading state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader

    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password
      });

      if (data.success) {
        toast.success(`${state === 'login' ? 'Login' : 'Registration'} successful`);
        await fetchUser();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setLoading(false); // Stop loader whether successful or not
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-content">

        {/* Form Card Section */}
        <div className="register-card">
          <h1>{state === "login" ? "Login" : "Sign Up"}</h1>
          <form onSubmit={handleSubmit}>

            {state === "register" && (
              <div className="input-group">
                <FiUser className="input-icon" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Enter Your Name"
                  type="text"
                  required
                  className="auth-input"
                />
              </div>
            )}

            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter Email Address"
                type="email"
                required
                className="auth-input"
              />
            </div>

            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                required
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            {/* Submit Button with Loader */}
            <button
              className="auth-submit-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loader-spinner"></span>
              ) : (
                state === "register" ? "CREATE ACCOUNT" : "LOGIN"
              )}
            </button>

            <div className="auth-switch-text">
              {state === "register" ? (
                <>Already have an account? <span onClick={() => setState("login")}>Login here</span></>
              ) : (
                <>Don't have an account? <span onClick={() => setState("register")}>Register here</span></>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;