import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

function TrainerDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { cartItems } = useCart();
  const [dietPlans, setDietPlans] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDietPlans: 0,
    totalWorkoutPlans: 0,
    activeClients: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch diet plans created by the trainer
      const dietResponse = await api.get('/diet-plans/trainer');
      setDietPlans(dietResponse.data.data || []);

      // Fetch workout plans created by the trainer
      const workoutResponse = await api.get('/workout-plans/trainer');
      setWorkoutPlans(workoutResponse.data.data || []);

      // Fetch trainer's orders
      const orderResponse = await api.get('/orders');
      setOrders(orderResponse.data.data || []);

      // Set stats
      setStats({
        totalDietPlans: dietPlans.length,
        totalWorkoutPlans: workoutPlans.length,
        activeClients: 0 // This would be calculated based on unique client IDs
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching trainer dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👋 Welcome, Trainer!</h2>
      <p style={styles.infoText}>
        Manage your clients' diet and workout plans from this dashboard.
      </p>

      {loading ? (
        <div style={styles.loadingMessage}>Loading dashboard data...</div>
      ) : error ? (
        <div style={styles.errorMessage}>{error}</div>
      ) : (
        <div style={styles.sectionGrid}>
          {/* Manage Diet Plans Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Manage Diet Plans</h3>
            <p style={styles.cardContent}>
              {dietPlans.length === 0
                ? "You haven't created any diet plans yet."
                : `You have created ${dietPlans.length} diet plans for your clients.`}
            </p>
            <div style={styles.buttonContainer}>
              <button
                onClick={() => navigate('/trainer/diet-plans/create')}
                style={styles.createButton}
              >
                Create New Diet Plan
              </button>
              <button
                onClick={() => navigate('/trainer/diet-plans')}
                style={styles.button}
              >
                Manage Diet Plans
              </button>
            </div>
          </div>

          {/* Manage Workouts Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Manage Workouts</h3>
            <p style={styles.cardContent}>
              {workoutPlans.length === 0
                ? "You haven't created any workout plans yet."
                : `You have created ${workoutPlans.length} workout plans for your clients.`}
            </p>
            <div style={styles.buttonContainer}>
              <button
                onClick={() => navigate('/trainer/workouts/create')}
                style={styles.createButton}
              >
                Create New Workout Plan
              </button>
              <button
                onClick={() => navigate('/trainer/workouts')}
                style={styles.button}
              >
                Manage Workouts
              </button>
            </div>
          </div>

          {/* Profile Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Profile</h3>
            <p style={styles.cardContent}>Update your personal information and preferences.</p>
            <button
              onClick={() => navigate('/profile')}
              style={styles.button}
            >
              Edit Profile
            </button>
          </div>

          {/* Shopping Cart Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Shopping Cart</h3>
            <p style={styles.cardContent}>
              {cartItems.length > 0
                ? `You have ${cartItems.length} item(s) in your cart.`
                : 'Your cart is empty.'}
            </p>
            <button
              onClick={() => navigate('/cart')}
              style={styles.button}
            >
              {cartItems.length > 0 ? 'View Cart' : 'Shop Now'}
            </button>
          </div>

          {/* Orders Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>My Orders</h3>
            <p style={styles.cardContent}>
              {orders.length > 0
                ? `You have ${orders.length} order(s). View your order history.`
                : 'You have no orders yet. Browse our products.'}
            </p>
            <button
              onClick={() => navigate('/orders')}
              style={styles.button}
            >
              {orders.length > 0 ? 'View Orders' : 'Shop Now'}
            </button>
          </div>

          {/* Clients Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Manage Clients</h3>
            <p style={styles.cardContent}>
              View and manage your clients and their plans.
            </p>
            <button
              onClick={() => navigate('/trainer/clients')}
              style={styles.button}
            >
              View Clients
            </button>
              </div>
              
          {/* BMI Calculator Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>BMI Calculator</h3>
            <p style={styles.cardContent}>Calculate and track your Body Mass Index.</p>
            <button
              onClick={() => navigate('/bmi-calculator')}
              style={styles.button}
            >
              Calculate BMI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#f0f0f0',
  },
  infoText: {
    fontSize: '16px',
    marginBottom: '30px',
    color: '#aaa',
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#f0f0f0',
  },
  cardContent: {
    fontSize: '14px',
    marginBottom: '15px',
    color: '#ccc',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#2980b9',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  createButton: {
    padding: '10px 15px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  loadingMessage: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#aaa',
  },
  errorMessage: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '4px',
  }
};

export default TrainerDashboard;