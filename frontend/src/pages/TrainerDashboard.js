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

        {/* Progress Tracking Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Progress Tracking</h3>
          <p style={styles.cardContent}>Track your clients' progress over time.</p>
          <button
            onClick={() => navigate('/trainer/progress')}
            style={styles.button}
          >
            View Progress
          </button>
        </div>

        {/* Nutrition Plan Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Nutrition Plan</h3>
          <p style={styles.cardContent}>Create personalized nutrition plans for clients.</p>
          <button
            onClick={() => navigate('/trainer/nutrition')}
            style={styles.button}
          >
            View Nutrition Plan
          </button>
        </div>

        {/* Feedback and Reports Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Feedback & Reports</h3>
          <p style={styles.cardContent}>Review feedback and reports from clients.</p>
          <button
            onClick={() => navigate('/trainer/feedback')}
            style={styles.button}
          >
            View Feedback
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
    backgroundColor: '#f5f8fa',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
  },
  infoText: {
    fontSize: '18px',
    color: '#555',
    textAlign: 'center',
    marginBottom: '30px',
  },
  roleText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  cardContent: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '15px',
  },
  button: {
    backgroundColor: '#2196F3',
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
