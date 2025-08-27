import React, { useState } from 'react';
import { login, register } from '../services/authService';

const AuthForm = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setShowLogin(!showLogin);
    setError('');
    setCredentials({ email: '', password: '' });
    setUserData({ username: '', email: '', password: '' });
  };

  const handleLoginChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(credentials);
      alert('Đăng nhập thành công!');
      window.location.href = '/home'; // Thay bằng route mong muốn
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(userData);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      toggleForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {showLogin ? (
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleLoginChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleLoginChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <button
              onClick={handleLoginSubmit}
              disabled={loading}
              className={`w-full p-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
            <p className="text-center text-sm">
              Chưa có tài khoản?{' '}
              <span
                onClick={toggleForm}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Đăng ký
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Tên người dùng</label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleRegisterChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên người dùng"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleRegisterChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleRegisterChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <button
              onClick={handleRegisterSubmit}
              disabled={loading}
              className={`w-full p-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
            <p className="text-center text-sm">
              Đã có tài khoản?{' '}
              <span
                onClick={toggleForm}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Đăng nhập
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;