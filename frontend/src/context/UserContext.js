import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token and load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        // Set axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
          const response = await axios.get('http://localhost:3300/api/auth/me');
          setUser(response.data.data);
        } catch (error) {
          // If token is invalid, clear it
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Login functions (you can remove these if you're using the backend login now)
  const loginAsUser = () => setUser({ name: "Regular User", role: "user" });
  const loginAsTrainer = () => setUser({ name: "Trainer", role: "trainer" });
  const loginAsAdmin = () => setUser({ name: "Admin", role: "admin" });

  const logout = async () => {
    try {
      // Call logout endpoint
      await axios.get('http://localhost:3300/api/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Remove token regardless of API success
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      logout,
      loading,
      // Keep these for development/testing if needed
      loginAsUser,
      loginAsTrainer,
      loginAsAdmin
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
