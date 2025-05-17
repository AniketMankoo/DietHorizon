import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import productsData from '../data/products.json';

function ProductList() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
    alert('Product added to cart!');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Our Products</h2>
      <div style={styles.grid}>
        {productsData.map(product => (
          <div key={product.id} style={styles.card}>
            <img 
              src={product.img} 
              alt={product.name}
              style={styles.image}
            />
            <div style={styles.content}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.description}>{product.description}</p>
              <div style={styles.priceRow}>
                <span style={styles.price}>{product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  style={styles.addButton}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '1.5rem',
  },
  productName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  description: {
    color: '#ccc',
    marginBottom: '1rem',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  },
};

export default ProductList; 