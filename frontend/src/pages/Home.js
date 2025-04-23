import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import products from '../data/products.json';

function Home() {
  const images = ['/back1.jpg', '/back2.jpg', '/back3.jpg', '/back4.jpg'];
  const texts = [
    "Get your workout plan now",
    "Get personalised diet plan",
    "Explore other features",
    "Welcome to Diet Horizon"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentText, setCurrentText] = useState(texts[0]);
  const [textAlignment, setTextAlignment] = useState('center');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        setCurrentText(texts[nextIndex]);

        if (nextIndex === 0) setTextAlignment('left');
        else if (nextIndex === 1) setTextAlignment('center');
        else if (nextIndex === 2) setTextAlignment('right');
        else setTextAlignment('center');

        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const backgroundImage = `url(${images[currentImageIndex]})`;

  return (
    <div>
      {/* Hero Section */}
      <div style={{ ...styles.container, backgroundImage }}>
        <div style={styles.overlay}></div>

        <div style={{
          ...styles.heroTextContainer,
          textAlign: textAlignment,
          left: textAlignment === 'left' ? '10%' : textAlignment === 'right' ? '75%' : '50%',
          transform: 'translateX(-50%)'
        }}>
          <p style={styles.subtitle}>
            {currentText.split(' ').map((word, index) => (
              <span key={index} style={{
                display: 'block',
                fontSize: '60px',
                marginLeft: '70px',
                marginBottom: '12px'
              }}>
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Shop Section */}
      <div style={styles.ecommerceSection}>
        <h2 style={styles.sectionTitle}>Shop Smart • Eat Smart</h2>
        <div style={styles.productsGrid}>
          {products.map((item) => (
            <div
              key={item.id}
              style={styles.productCard}
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.img} alt={item.name} style={styles.productImage} />
              <h3 style={styles.productName}>{item.name}</h3>
              <p style={styles.productPrice}>₹{item.price}</p>
              <button
                style={styles.buyButton}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`${item.name} added to cart!`);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>Start your journey today and take control of your health!</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '80vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '40px 20px',
    transition: 'background-image 1s ease-in-out',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  heroTextContainer: {
    position: 'absolute',
    top: '10%',
    zIndex: 2,
    color: '#fff',
    maxWidth: '600px',
    padding: '20px',
  },
  subtitle: {
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    animation: 'fadeIn 2s ease-in-out',
  },
  ecommerceSection: {
    backgroundColor: '#1e1e1e',
    padding: '60px 20px',
    textAlign: 'center',
    color: '#fff',
    marginTop: '60px',
  },
  sectionTitle: {
    fontSize: '32px',
    marginBottom: '40px',
    color: '#ffffff',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  productCard: {
    backgroundColor: '#2c2c2c',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  productImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '15px',
    transition: 'transform 0.3s ease',
  },
  productName: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '6px',
  },
  productPrice: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#9be7a3',
    marginBottom: '14px',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 'bold',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  footer: {
    position: 'relative',
    textAlign: 'center',
    width: '100%',
    zIndex: 2,
    marginTop: '60px',
  },
  footerText: {
    fontSize: '16px',
    color: '#fff',
  },
};

export default Home;
