import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      alert('Login successful!');
      navigate('/dashboard');
    } else {
      alert('Please enter email and password.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Login to Diet Horizon</h2>
        <input
          type="email"
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
        <p style={styles.note}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={styles.link}>Register</span>
        </p>
      </form>
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
  form: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #444',
    fontSize: '16px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    outline: 'none',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  note: {
    fontSize: '14px',
    color: '#aaa',
    textAlign: 'center',
  },
  link: {
    color: '#00bcd4',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Login;
