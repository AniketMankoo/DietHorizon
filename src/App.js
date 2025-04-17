import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useUser } from './context/UserContext'; // Ensure this path is correct
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import BMICalculator from './pages/BMICalculator';
import DietCreator from './pages/DietCreator';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';

// Wrapper component to use `useNavigate` within App
function AppWrapper() {
  const { loginAsAdmin, loginAsUser, loginAsTrainer, logout, user } = useUser();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === 'user') {
      loginAsUser();
      navigate('/dashboard');
    } else if (role === 'trainer') {
      loginAsTrainer();
      navigate('/trainer');
    } else if (role === 'admin') {
      loginAsAdmin();
      navigate('/admin');
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.buttonGroup}>
        <button onClick={() => handleLogin("user")} style={{ ...styles.button, ...styles.userButton }}>Login as User</button>
        <button onClick={() => handleLogin("trainer")} style={{ ...styles.button, ...styles.trainerButton }}>Login as Trainer</button>
        <button onClick={() => handleLogin("admin")} style={{ ...styles.button, ...styles.adminButton }}>Login as Admin</button>
        <button onClick={logout} style={{ ...styles.button, ...styles.logoutButton }}>Logout</button>
        <div style={styles.roleInfo}>Current Role: {user ? user.role : "None"}</div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bmi-calculator" element={<BMICalculator />} />
        <Route path="/diet-creator" element={<DietCreator />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/progress" element={<Progress />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer"
          element={
            <ProtectedRoute roles={["trainer"]}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

const styles = {
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '30px',
    padding: '20px',
  },
  button: {
    padding: '15px 35px',
    fontSize: '18px',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    textAlign: 'center',
    fontWeight: '600',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
    outline: 'none',
    transform: 'scale(1)',
    backgroundColor: '#333',  // Base button color for dark mode
  },
  userButton: {
    backgroundColor: '#4CAF50',
  },
  trainerButton: {
    backgroundColor: '#FF9800',
  },
  adminButton: {
    backgroundColor: '#9C27B0',
  },
  logoutButton: {
    backgroundColor: '#f44336',
  },
  buttonHover: {
    transform: 'scale(1.05)', // Slight grow effect
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.4)',
  },
  roleInfo: {
    marginTop: '15px',
    color: '#ddd',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  background: {
    backgroundColor: '#121212', // Dark background color for the whole page
    color: '#fff',  // White text for contrast
    minHeight: '100vh',
    paddingTop: '50px',
  }
};

export default App;
