import React, { useState } from 'react';
import axios from 'axios';

function AIDietCreator() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    goal: '',
    allergies: '',
  });
  const [dietPlan, setDietPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDietPlan('');

    const { age, gender, goal, allergies } = formData;
    const prompt = `Create a healthy diet plan for a ${age}-year-old ${gender} who wants to ${goal}. ${
      allergies ? `Avoid ${allergies}.` : ''
    } Format it as breakfast, lunch, snacks, and dinner in bullet points.`;

    try {
      const response = await axios.post('http://localhost:5000/api/generate', { prompt });
      setDietPlan(response.data.dietPlan);
    } catch (err) {
      alert('Failed to generate diet plan');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => setDarkMode(!darkMode);

  const themeStyles = {
    backgroundColor: darkMode ? '#121212' : '#f2f2f2',
    color: darkMode ? '#ffffff' : '#000000',
    transition: '0.3s ease',
    minHeight: '100vh',
    padding: '2rem',
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: darkMode
      ? '0 0 10px rgba(255,255,255,0.1)'
      : '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: 'auto',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: darkMode ? '#2c2c2c' : '#fff',
    color: darkMode ? '#fff' : '#000',
  };

  return (
    <div style={themeStyles}>
      <button
        onClick={toggleMode}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: darkMode ? '#00c896' : '#007bff',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Switch to {darkMode ? 'Light' : 'Dark'} Mode
      </button>

      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🥗 AI Diet Plan Generator</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="text"
            name="goal"
            placeholder="Goal (e.g., lose weight)"
            value={formData.goal}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="allergies"
            placeholder="Allergies (optional)"
            value={formData.allergies}
            onChange={handleChange}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              ...inputStyle,
              backgroundColor: '#00c896',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: 'none',
              marginTop: '1rem',
            }}
          >
            {loading ? 'Generating...' : 'Generate Diet Plan'}
          </button>
        </form>
      </div>

      {dietPlan && (
        <div
          style={{
            ...cardStyle,
            marginTop: '2rem',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '1rem',
          }}
        >
          {dietPlan}
        </div>
      )}
    </div>
  );
}

export default AIDietCreator;
