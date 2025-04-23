import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
  });

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (
      name && email && password && role &&
      countryCode && phone &&
      address.street && address.city && address.state && address.postalCode
    ) {
      alert(`Registered ${role} successfully!`);
      navigate('/login');
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>Create Your Account</h2>

        <input type="text" placeholder="Full Name" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email Address" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />

        <select style={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Customer">Customer</option>
          <option value="Trainer">Trainer</option>
          <option value="Admin">Admin</option>
        </select>

        <div style={styles.flexRow}>
          <select style={{ ...styles.select, flex: '0.5' }} value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
            <option value="+91">+91 (India)</option>
            <option value="+1">+1 (USA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+971">+971 (UAE)</option>
          </select>
          <input type="tel" placeholder="Phone Number" style={{ ...styles.input, flex: '1' }} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <input type="text" placeholder="Street" style={styles.input} value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
        <input type="text" placeholder="City" style={styles.input} value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
        <input type="text" placeholder="State" style={styles.input} value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
        <input type="text" placeholder="Postal Code" style={styles.input} value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />

        <button type="submit" style={styles.button}>Register</button>

        <p style={styles.note}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={styles.link}>Login</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#121212',
    // backgroundImage: 'url(/register.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  form: {
    background: 'rgba(30, 30, 30, 0.95)',
    color: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  title: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  input: {
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #444',
    fontSize: '16px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    outline: 'none',
  },
  select: {
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #444',
    fontSize: '16px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    outline: 'none',
  },
  flexRow: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '17px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.3s ease-in-out',
  },
  note: {
    fontSize: '14px',
    color: '#bbb',
    textAlign: 'center',
  },
  link: {
    color: '#00bcd4',
    cursor: 'pointer',
    fontWeight: '500',
    textDecoration: 'underline',
  },
};

export default Register;
