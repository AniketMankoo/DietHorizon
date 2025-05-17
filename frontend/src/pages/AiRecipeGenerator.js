// frontend/src/pages/AiRecipeGenerator.js
import React, { useState } from 'react';
import api from '../services/api'; // Add this import


function AiRecipeGenerator() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // In AiRecipeGenerator.js
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Using a server-side proxy approach
    try {
      const response = await api.post('/recipes', { ingredients });

      setRecipes(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>AI Recipe Generator</h2>
      <p style={styles.infoText}>
        Enter ingredients you have on hand, separated by commas (e.g., chicken, rice, onions),
        and we'll find recipes you can make!
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="ingredients" style={styles.label}>Ingredients:</label>
          <input
            type="text"
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients separated by commas"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Finding Recipes...' : 'Generate Recipes'}
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      {loading && <div style={styles.loader}>Finding the perfect recipes for you...</div>}

      {!loading && recipes.length > 0 && (
        <div style={styles.recipesContainer}>
          <h3 style={styles.resultsTitle}>Found {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}</h3>
          <div style={styles.recipeGrid}>
            {recipes.map(recipe => (
              <div key={recipe.id} style={styles.recipeCard}>
                {recipe.image && (
                  <img src={recipe.image} alt={recipe.title} style={styles.recipeImage} />
                )}
                <h4 style={styles.recipeTitle}>{recipe.title}</h4>
                <p style={styles.usedIngredients}>
                  <strong>Used:</strong> {recipe.usedIngredients.map(i => i.name).join(', ')}
                </p>
                <p style={styles.missedIngredients}>
                  <strong>Missing:</strong> {recipe.missedIngredients.map(i => i.name).join(', ')}
                </p>
                <a
                  href={`https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.viewButton}
                >
                  View Full Recipe
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && ingredients && recipes.length === 0 && (
        <div style={styles.emptyState}>
          <p>No recipes found with those ingredients. Try adding more ingredients or different combinations.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: 'white',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '15px',
  },
  infoText: {
    fontSize: '16px',
    color: '#cccccc',
    marginBottom: '30px',
  },
  form: {
    backgroundColor: '#1e1e1e',
    padding: '25px',
    borderRadius: '10px',
    marginBottom: '30px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#2c2c2c',
    color: 'white',
    border: '1px solid #444',
    borderRadius: '4px',
  },
  button: {
    backgroundColor: '#00c896',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '16px',
  },
  loader: {
    textAlign: 'center',
    padding: '30px',
    fontSize: '18px',
  },
  error: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '15px',
    color: '#ff6b6b',
    marginBottom: '20px',
    textAlign: 'center',
  },
  recipesContainer: {
    marginTop: '30px',
  },
  resultsTitle: {
    fontSize: '22px',
    marginBottom: '20px',
  },
  recipeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  recipeCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
  },
  recipeImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  recipeTitle: {
    padding: '15px 15px 5px',
    fontSize: '18px',
    fontWeight: '600',
  },
  usedIngredients: {
    padding: '0 15px',
    color: '#90ee90',
    fontSize: '14px',
  },
  missedIngredients: {
    padding: '0 15px 15px',
    color: '#ff9999',
    fontSize: '14px',
  },
  viewButton: {
    display: 'block',
    margin: '15px',
    padding: '8px 16px',
    backgroundColor: '#4dabf7',
    color: 'white',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: '500',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#1e1e1e',
    borderRadius: '12px',
    color: '#bbbbbb',
  },
};

export default AiRecipeGenerator;
