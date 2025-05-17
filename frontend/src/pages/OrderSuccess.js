import React from 'react';
import { useNavigate } from 'react-router-dom';

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <span style={styles.checkmark}>✓</span>
        </div>
        
        <h1 style={styles.title}>Order Placed Successfully!</h1>
        <p style={styles.message}>
          Thank you for your order. We'll start processing it right away.
        </p>

        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate('/orders')}
            style={styles.trackButton}
          >
            Track Your Orders
          </button>
          
          <button
            onClick={() => navigate('/products')}
            style={styles.shopButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 20px',
  },
  checkmark: {
    color: 'white',
    fontSize: '40px',
  },
  title: {
    color: 'white',
    fontSize: '24px',
    marginBottom: '16px',
  },
  message: {
    color: '#aaa',
    fontSize: '16px',
    marginBottom: '32px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px',
    flexDirection: 'column',
  },
  trackButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
  shopButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#4CAF50',
    border: '2px solid #4CAF50',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
};

export default OrderSuccess; 