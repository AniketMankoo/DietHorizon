import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to Diet Horizon</h1>
        <p style={styles.subtitle}>
          Your personal guide to healthier living through smart nutrition and fitness.
        </p>
        <div style={styles.buttonGroup}>
          <Link to="/register" style={styles.button}>Get Started</Link>
          <Link to="/bmi-calculator" style={{ ...styles.button, ...styles.secondary }}>
            Try BMI Calculator
          </Link>
        </div>
      </div>
      <div style={styles.footer}>
        <p style={styles.footerText}>Start your journey today and take control of your health!</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url(/img1.jpg)', // Add your image here
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    position: 'relative',
  },
  hero: {
    textAlign: 'center',
    maxWidth: '600px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '50px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '36px',
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '30px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 25px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  secondary: {
    backgroundColor: '#2196F3',
  },
  buttonHover: {
    backgroundColor: '#388E3C',
  },
  footer: {
    position: 'absolute',
    bottom: '20px',
    textAlign: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: '16px',
    color: '#fff',
  },
};

// Hover effect for buttons
styles.buttonHover = {
  backgroundColor: '#388E3C', // Darker green on hover
};

export default Home;
