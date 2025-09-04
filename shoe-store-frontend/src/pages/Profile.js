import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import AuthContext from '../contexts/AuthContext';
import { toast } from 'react-toastify';

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
    <div className="container py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Profile</h2>
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-6">Personal Information</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field pl-12"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-12"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;