// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder: Add real logout logic when backend is connected
    alert('Logged out!');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoText}>Diet Horizon</Link>
      </div>
      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/bmi-calculator" style={styles.link}>BMI Calculator</Link></li>
        <li><Link to="/diet-creator" style={styles.link}>AI Diet Creator</Link></li>
        <li><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    padding: '15px 30px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  logoText: {
    textDecoration: 'none',
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: '22px',
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: '20px',
    alignItems: 'center',
    margin: 0,
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: '0.2s ease-in-out',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: '0.2s ease-in-out',
  }
};

export default Navbar;
