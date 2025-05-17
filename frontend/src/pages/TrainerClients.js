// Create a new file: src/pages/TrainerClients.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function TrainerClients() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/clients');
            setClients(response.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Failed to load clients. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Your Clients</h2>
            <p style={styles.infoText}>
                Manage diet and workout plans for your clients.
            </p>

            {loading ? (
                <div style={styles.loadingMessage}>Loading clients...</div>
            ) : error ? (
                <div style={styles.errorMessage}>{error}</div>
            ) : (
                <div style={styles.clientList}>
                    {clients.length === 0 ? (
                        <div style={styles.emptyMessage}>
                            You don't have any clients yet.
                        </div>
                    ) : (
                        clients.map((client) => (
                            <div key={client._id} style={styles.clientCard}>
                                <h3 style={styles.clientName}>{client.name}</h3>
                                <p style={styles.clientEmail}>{client.email}</p>
                                <div style={styles.buttonContainer}>
                                    <button
                                        onClick={() => navigate(`/trainer/clients/${client._id}`)}
                                        style={styles.viewButton}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => navigate(`/trainer/diet-plans/create?userId=${client._id}`)}
                                        style={styles.createButton}
                                    >
                                        Create Diet Plan
                                    </button>
                                    <button
                                        onClick={() => navigate(`/trainer/workouts/create?userId=${client._id}`)}
                                        style={styles.createButton}
                                    >
                                        Create Workout Plan
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    heading: {
        fontSize: '28px',
        marginBottom: '10px',
    },
    infoText: {
        marginBottom: '20px',
        color: '#666',
    },
    clientList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    clientCard: {
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    clientName: {
        fontSize: '20px',
        marginBottom: '5px',
    },
    clientEmail: {
        color: '#666',
        marginBottom: '15px',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    viewButton: {
        backgroundColor: '#4A90E2',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    createButton: {
        backgroundColor: '#5CB85C',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loadingMessage: {
        textAlign: 'center',
        padding: '20px',
    },
    errorMessage: {
        textAlign: 'center',
        padding: '20px',
        color: 'red',
    },
    emptyMessage: {
        textAlign: 'center',
        padding: '20px',
        gridColumn: '1 / -1',
    },
};

export default TrainerClients;
