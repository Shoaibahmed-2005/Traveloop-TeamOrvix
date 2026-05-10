import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/authAPI.js';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('traveloop_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const { data } = await authAPI.getMe();
          setUser(data.data);
        } catch {
          localStorage.removeItem('traveloop_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('traveloop_token', data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
    return data.data;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    localStorage.setItem('traveloop_token', data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
    return data.data;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('traveloop_token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
