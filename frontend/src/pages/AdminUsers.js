import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Import the API service

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;

    try {
      setLoading(true);
      // Use the API service instead of axios directly
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {<div style={styles.container}>
        <h2 style={styles.heading}>🌙 All Registered Users</h2>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={styles.row}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={getRoleBadge(user.role)}>{user.role}</span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={styles.deleteButton}
                      disabled={loading}
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#ffffff',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '20px',
    textAlign: 'center',
  },
  error: {
    color: 'tomato',
    textAlign: 'center',
    marginBottom: '20px',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '10px',
    backgroundColor: '#1e1e1e',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.05)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#333333',
    color: '#ffffff',
    padding: '14px',
    textAlign: 'left',
    fontSize: '16px',
    borderBottom: '1px solid #444',
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid #2c2c2c',
    fontSize: '15px',
    color: '#e0e0e0',
  },
  row: {
    transition: 'background 0.3s',
  },
  deleteButton: {
    backgroundColor: '#e53935',
    border: 'none',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

const getRoleBadge = (role) => {
  const baseStyle = {
    padding: '6px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    textTransform: 'capitalize',
    color: '#fff',
    fontWeight: 'bold',
  };

  switch (role) {
    case 'admin':
      return { ...baseStyle, backgroundColor: '#e53935' };
    case 'trainer':
      return { ...baseStyle, backgroundColor: '#1e88e5' };
    default:
      return { ...baseStyle, backgroundColor: '#43a047' };
  }
};

export default AdminUsers;
