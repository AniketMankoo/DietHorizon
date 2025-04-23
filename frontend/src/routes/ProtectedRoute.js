import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // Show loading state or spinner while checking authentication
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in, redirect to login page with return URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If roles are specified and user doesn't have required role, redirect to appropriate page
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect based on user's role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'trainer') {
      return <Navigate to="/dietician" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If authenticated and authorized, render the protected component
  return children;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #4CAF50',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
};

export default ProtectedRoute;