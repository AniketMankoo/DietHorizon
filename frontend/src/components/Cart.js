import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Your Cart</h2>
        <p style={styles.emptyMessage}>Your cart is empty</p>
        <button
          onClick={() => navigate('/products')}
          style={styles.shopButton}
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Cart</h2>
      <div style={styles.cartItems}>
        {cartItems.map(item => (
          <div key={item.id} style={styles.cartItem}>
            <img src={item.img} alt={item.name} style={styles.productImage} />
            <div style={styles.productInfo}>
              <h3 style={styles.productName}>{item.name}</h3>
              <p style={styles.productDescription}>{item.description}</p>
              <p style={styles.productPrice}>{item.price}</p>
            </div>
            <div style={styles.quantityControls}>
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={styles.quantityButton}
              >
                -
              </button>
              <span style={styles.quantity}>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={styles.quantityButton}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              style={styles.removeButton}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div style={styles.cartSummary}>
        <div style={styles.total}>
          <span>Total:</span>
          <span>Rs {getCartTotal()}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          style={styles.checkoutButton}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    color: '#fff',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  shopButton: {
    display: 'block',
    margin: '0 auto',
    padding: '1rem 2rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    backgroundColor: '#1e1e1e',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  productImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  productDescription: {
    color: '#ccc',
    marginBottom: '0.5rem',
  },
  productPrice: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  quantityButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  quantity: {
    fontSize: '1.1rem',
  },
  removeButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cartSummary: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
  },
  checkoutButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
  },
};

export default Cart; 