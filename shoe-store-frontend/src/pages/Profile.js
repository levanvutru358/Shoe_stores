import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import AuthContext from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './index.css'; // Import CSS

function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', email: '' });

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || '', email: user.email || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <p className="text-gray-600 text-lg">
          Please sign in to view your profile.{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
            Sign In
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="profile-header">Your Profile</h2>
      <div className="profile-card">
        <h3 className="profile-section">Personal Information</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">
              <FaUser />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <FaEnvelope />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="btn-update">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;