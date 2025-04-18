import React, { useState } from 'react';

function DietCreator() {
  const [goal, setGoal] = useState('');
  const [diet, setDiet] = useState('');
  const [plan, setPlan] = useState(null);

  const generatePlan = () => {
    // Dummy plan generation – replace with AI logic or backend later
    setPlan({
      calories: 2200,
      meals: [
        { time: 'Breakfast', item: 'Oatmeal with fruits' },
        { time: 'Lunch', item: 'Grilled chicken with quinoa & veggies' },
        { time: 'Snack', item: 'Greek yogurt and almonds' },
        { time: 'Dinner', item: 'Salmon with sweet potato & greens' }
      ]
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div> {/* Overlay element to dull the background */}
      <div style={styles.content}>
        <h2 style={styles.heading}>🍽️ AI Diet Creator</h2>
        <p style={styles.subheading}>Get a personalized diet plan based on your goals</p>

        <div style={styles.form}>
          <label style={styles.label}>Your Goal</label>
          <select
            style={styles.select}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="">Select goal</option>
            <option value="lose">Lose Weight</option>
            <option value="gain">Gain Muscle</option>
            <option value="maintain">Maintain Weight</option>
          </select>

          <label style={styles.label}>Preferred Diet Type</label>
          <select
            style={styles.select}
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          >
            <option value="">Select diet type</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="keto">Keto</option>
            <option value="balanced">Balanced</option>
          </select>

          <button style={styles.button} onClick={generatePlan}>
            Generate Diet Plan
          </button>
        </div>

        {plan && (
          <div style={styles.plan}>
            <h3 style={styles.planTitle}>Your AI-Generated Plan</h3>
            <p style={styles.planSubtitle}>Daily Calories: {plan.calories}</p>
            <ul style={styles.mealList}>
              {plan.meals.map((meal, index) => (
                <li key={index} style={styles.mealItem}>
                  <strong>{meal.time}:</strong> {meal.item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    padding: '40px',
    backgroundImage: 'url(/ai_diet.jpg)', // Ensure the image is in the public folder or imported properly
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay to dull the background
    zIndex: 1, // Ensure it's behind the content
  },
  content: {
    zIndex: 2, // Ensure content appears above the overlay
    position: 'relative',
  },
  heading: {
    fontSize: '36px', // Increased font size
    marginBottom: '15px',
    color: 'white',
  },
  subheading: {
    color: 'white',
    marginBottom: '35px', // Increased margin for better spacing
    fontSize: '20px', // Increased font size
  },
  form: {
    maxWidth: '420px', // Adjusted form width for balance with bigger text
    marginBottom: '45px',
  },
  label: {
    display: 'block',
    marginBottom: '8px', // Increased margin for better spacing
    fontWeight: 'bold',
    color: 'white',
    fontSize: '18px', // Increased font size
  },
  select: {
    width: '100%',
    padding: '12px', // Increased padding for a better feel
    marginBottom: '25px', // Increased margin
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px', // Increased font size
  },
  button: {
    padding: '14px 22px', // Increased padding for a better look
    backgroundColor: '#007BFF',  // Soft blue background
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Light shadow for depth
    transition: 'all 0.3s ease', // Smooth transition for any effects
    fontSize: '18px', // Increased font size
  },
  plan: {
    backgroundColor: '#fff',
    padding: '25px', // Increased padding
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    maxWidth: '550px', // Adjusted max width for better spacing
  },
  planTitle: {
    fontSize: '26px', // Increased font size
    marginBottom: '15px',
  },
  planSubtitle: {
    marginBottom: '25px', // Increased margin for better spacing
    color: '#444',
    fontSize: '18px', // Increased font size
  },
  mealList: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  mealItem: {
    marginBottom: '12px', // Increased margin
    fontSize: '18px', // Increased font size
    color: '#333',
  },
};

export default DietCreator;
