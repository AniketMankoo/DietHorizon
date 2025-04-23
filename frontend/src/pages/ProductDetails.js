import { useParams } from 'react-router-dom';
import products from '../data/products.json';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', padding: '50px' }}>
        Product not found.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={product.img} alt={product.name} style={styles.image} />
        <div style={styles.info}>
          <h2 style={styles.title}>{product.name}</h2>
          <p style={styles.price}>₹{product.price}</p>
          <p style={styles.description}>{product.description || "No description available."}</p>
          <button style={styles.button}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#fff',
    minHeight: '100vh',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '900px',
    display: 'flex',
    flexDirection: 'row',
    gap: '40px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
  },
  image: {
    width: '300px',
    height: 'auto',
    borderRadius: '12px',
    objectFit: 'cover',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  price: {
    fontSize: '24px',
    color: '#9be7a3',
    marginBottom: '15px',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '25px',
  },
  button: {
    backgroundColor: '#e53935',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default ProductDetails;
