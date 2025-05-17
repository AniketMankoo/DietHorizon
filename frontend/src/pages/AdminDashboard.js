import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👋 Welcome, Admin!</h2>

      <div style={styles.sectionGrid}>
        {/* Get All Users Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Get All Users</h3>
          <p style={styles.cardContent}>Manage all users in the platform.</p>
          <button
            onClick={() => navigate('/admin/users')}
            style={styles.button}
          >
            View Users
          </button>
        </div>

        {/* Manage Products Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Manage Products</h3>
          <p style={styles.cardContent}>Add, edit, or remove products.</p>
          <button
            onClick={() => navigate('/admin/products')}
            style={styles.button}
          >
            Manage Products
          </button>
        </div>

        {/* Manage Orders Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Manage Orders</h3>
          <p style={styles.cardContent}>View and process user orders.</p>
          <button
            onClick={() => navigate('/admin/orders')}
            style={styles.button}
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#fff',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '30px',
    textAlign: 'center',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.5)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '10px',
  },
  cardContent: {
    fontSize: '16px',
    color: '#cccccc',
    marginBottom: '15px',
  },
  button: {
    backgroundColor: '#1e88e5',
    color: '#fff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
};

export default AdminDashboard;
