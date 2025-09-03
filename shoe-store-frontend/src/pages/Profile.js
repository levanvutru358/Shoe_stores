import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { toast } from "react-toastify";

function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
      });
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
      <p className="text-center text-gray-600 text-lg py-12">
        Please login to view your profile.{" "}
        <Link to="/login" className="text-blue-600 hover:underline transition-all duration-200">
          Sign in now
        </Link>
      </p>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Your Profile
      </h2>
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h3 className="text-xl font-semibold text-gray-700 mb-6">
          Personal Information
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;