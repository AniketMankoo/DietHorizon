import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // Import the API service

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Use the API service instead of axios directly
        const response = await api.get('/auth/me');
        setUser(response.data.data);
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    try {
      // Use the API service instead of axios directly
      await api.get('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      logout,
      loading,
    }}>
      {children}
    </UserContext.Provider>
  );
};