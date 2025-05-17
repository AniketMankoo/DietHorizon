// frontend/src/pages/DietPlans.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function DietPlans() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dietPlans, setDietPlans] = useState([]);

    useEffect(() => {
        // Fetch user's diet plans when component mounts
        fetchUserDietPlans();
    }, []);

    const fetchUserDietPlans = async () => {
        try {
            setLoading(true);
            setError('');

            // Call the API endpoint to get user's diet plans
            const response = await api.get('/diet-plans');
            setDietPlans(response.data.dietPlans || []);

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load diet plans. Please try again later.');
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>My Diet Plans</h2>
            <p style={styles.infoText}>
                Here are your personalized diet plans created by your trainer.
            </p>

            {loading ? (
                <div style={styles.loader}>Loading your diet plans...</div>
            ) : error ? (
                <div style={styles.error}>
                    {error}
                    <button onClick={fetchUserDietPlans} style={styles.refreshButton}>
                        Try Again
                    </button>
                </div>
            ) : (
                <div style={styles.plansContainer}>
                    {dietPlans.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>You don't have any diet plans yet.</p>
                            <p>Please contact your trainer to create a diet plan for you.</p>
                        </div>
                    ) : (
                        dietPlans.map((plan) => (
                            <div key={plan._id} style={styles.planCard}>
                                <h3 style={styles.planTitle}>{plan.title || 'Diet Plan'}</h3>
                                <p style={styles.planDescription}>
                                    {plan.description || 'No description available'}
                                </p>
                                <div style={styles.planDetails}>
                                    <p>Total Daily Calories: {plan.totalDailyCalories || 'Not specified'}</p>
                                    <p>Created: {new Date(plan.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/diet-plans/${plan._id}`)}
                                    style={styles.viewButton}
                                >
                                    View Details
                                </button>
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
    refreshButton: {
        backgroundColor: 'transparent',
        color: '#4dabf7',
        border: '1px solid #4dabf7',
        borderRadius: '4px',
        padding: '5px 10px',
        marginTop: '10px',
        cursor: 'pointer',
    },
    plansContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    planCard: {
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
    },
    planTitle: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '10px',
    },
    planDescription: {
        fontSize: '16px',
        color: '#bbbbbb',
        marginBottom: '15px',
    },
    planDetails: {
        fontSize: '14px',
        color: '#888888',
        marginBottom: '15px',
    },
    viewButton: {
        backgroundColor: '#00c896',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
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

export default DietPlans;