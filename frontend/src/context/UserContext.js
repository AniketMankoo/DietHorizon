// src/context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Create context
const UserContext = createContext();

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from token on initial render
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        setUser(response.data.data);
      } catch (err) {
        console.error('Error loading user:', err);
        // If token is invalid or expired, clear it
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear user data regardless of API success
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await authService.updateDetails(userData);
      setUser(response.data.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      setError(null);
      const response = await authService.updatePassword(passwordData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      throw err;
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole('admin');

  // Check if user is trainer
  const isDietician = () => hasRole('dietician');

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        updateProfile,
        updatePassword,
        isAdmin,
        isDietician,
        hasRole
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
