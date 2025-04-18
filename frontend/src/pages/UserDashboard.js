import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👋 Welcome back, User!</h2>

      <div style={styles.sectionGrid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your BMI</h3>
          <p style={styles.cardContent}>22.5 (Normal)</p>
          <button style={styles.button} onClick={() => navigate('/bmi-calculator')}>
            Update BMI
          </button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>AI Diet Plan</h3>
          <p style={styles.cardContent}>Personalized diet ready!</p>
          <button style={styles.button} onClick={() => navigate('/diet-creator')}>
            View Plan
          </button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Workout Suggestion</h3>
          <p style={styles.cardContent}>Strength training - 4 days/week</p>
          <button style={styles.button} onClick={() => navigate('/workouts')}>
            See Workouts
          </button>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Progress Summary</h3>
          <p style={styles.cardContent}>You’ve improved 12% in the last month!</p>
          <button style={styles.button} onClick={() => navigate('/progress')}>
            View Report
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
  },
};

export default UserDashboard;
