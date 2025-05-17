import React from 'react';
import { useNavigate } from 'react-router-dom';

function TrainerDashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👋 Welcome, Trainer!</h2>
      <p style={styles.infoText}>
        Only logged-in users with the <span style={styles.roleText}>trainer</span> role can view this dashboard.
      </p>

      <div style={styles.sectionGrid}>
        {/* Manage Diet Plans Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Manage Diet Plans</h3>
          <p style={styles.cardContent}>Create, update, and assign diet plans to your clients.</p>
          <button
            onClick={() => navigate('/trainer/diet-plans')}
            style={styles.button}
          >
            Manage Diet Plans
          </button>
        </div>

        {/* Manage Workouts Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Manage Workouts</h3>
          <p style={styles.cardContent}>Create, update, and assign workouts to your clients.</p>
          <button
            onClick={() => navigate('/trainer/workouts')}
            style={styles.button}
          >
            Manage Workouts
          </button>
        </div>

        {/* View Clients Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>View Clients</h3>
          <p style={styles.cardContent}>See your assigned clients and their progress.</p>
          <button
            onClick={() => navigate('/trainer/clients')}
            style={styles.button}
          >
            View Clients
          </button>
        </div>

        {/* Schedule Sessions Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Schedule Sessions</h3>
          <p style={styles.cardContent}>Schedule training sessions with clients.</p>
          <button
            onClick={() => navigate('/trainer/schedule')}
            style={styles.button}
          >
            Schedule Sessions
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
    color: '#f0f0f0',
    marginBottom: '15px',
    textAlign: 'center',
  },
  infoText: {
    fontSize: '16px',
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: '40px',
  },
  roleText: {
    color: '#00c896',
    fontWeight: 'bold',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.5)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    color: '#e0e0e0',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#ffffff',
  },
  cardContent: {
    fontSize: '16px',
    color: '#bbbbbb',
    marginBottom: '15px',
  },
  button: {
    backgroundColor: '#00c896',
    color: '#fff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
};

export default TrainerDashboard;
