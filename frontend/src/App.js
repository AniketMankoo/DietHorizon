import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminUsers from './pages/AdminUsers';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BMICalculator from './pages/BMICalculator';
import ProfileSettings from './pages/ProfileSettings';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';
import ProductDetails from './pages/ProductDetails';
import ProtectedRoute from './routes/ProtectedRoute';
import AIDietCreator from './pages/AiDietCreator';
import DietPlans from './pages/DietPlans';
import './App.css';

function AppWrapper() {
  return (
    <div style={styles.background}>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bmi-calculator" element={<BMICalculator />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Protected Routes - Role-based */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diet-plans"
          element={
            <ProtectedRoute roles={['user']}>
              <DietPlans />
            </ProtectedRoute>
          }
        />
   <Route path="/admin/users" element={<AdminUsers />} />

<Route path="/diet-creator" element={<AIDietCreator />} />

        <Route
          path="/trainer"
          element={
            <ProtectedRoute roles={['trainer']}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
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
    backgroundColor: '#121212',
    color: '#fff',
    minHeight: '100vh',
    paddingTop: '0px',
  },
};

export default App;
