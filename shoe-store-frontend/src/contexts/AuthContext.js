import { createContext, useState, useEffect } from 'react';
import { login, register, getCurrentUser, setToken, getToken } from '../services/authService';
import { updateUser } from '../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      getCurrentUser()
        .then((data) => {
          setUser(data);
          setIsAdmin(data.role === 'Admin');
        })
        .catch(() => {
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (credentials) => {
    const data = await login(credentials);
    if (data.token) {
      setToken(data.token); // Lưu token
      const userData = await getCurrentUser(); // Lấy thông tin user
      setUser(userData);
      setIsAdmin(userData.role === 'Admin');
      return userData; // Trả về userData để component con xử lý điều hướng
    }
    throw new Error('Đăng nhập thất bại');
  };

  const signUp = async (userData) => {
    const data = await register(userData);
    return data;
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  const updateProfile = async (updatedData) => {
    const data = await updateUser(user.id, updatedData);
    setUser(data);
    setIsAdmin(data.role === 'Admin');
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;