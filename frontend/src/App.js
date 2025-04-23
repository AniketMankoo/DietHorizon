import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from './context/UserContext'; // Make sure this path is correct
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
import ProductDetails from './pages/ProductDetails';
import './App.css';

function AppWrapper() {
  return (
    <div style={styles.background}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Link to the extended pages like BMI Calculator and Diet Creator */}
        <Route path="/bmi-calculator" element={<BMICalculator />} />
        <Route path="/diet-creator" element={<DietCreator />} />

        <Route path="/workouts" element={<Workouts />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Role-based protected routes */}
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
    </div>
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
  background: {
    backgroundColor: '#121212', // Dark background color for the whole page
    color: '#fff',  // White text for contrast
    minHeight: '100vh',
    paddingTop: '0px',
  },
};

export default App;
