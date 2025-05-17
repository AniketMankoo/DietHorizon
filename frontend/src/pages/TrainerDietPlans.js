// frontend/src/pages/TrainerDietPlans.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function TrainerDietPlans() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dietPlans, setDietPlans] = useState([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    useEffect(() => {
        fetchTrainerDietPlans();
    }, []);

    const fetchTrainerDietPlans = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/diet-plans/trainer');
            setDietPlans(response.data.data || []);

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load diet plans. Please try again later.');
            setLoading(false);
        }
    };

    const deleteDietPlan = async (planId) => {
        try {
            await api.delete(`/diet-plans/${planId}`);
            // Refresh the list after deletion
            fetchTrainerDietPlans();
            setDeleteConfirmation(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete diet plan. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.heading}>Manage Diet Plans</h2>
                <button
                    onClick={() => navigate('/trainer/diet-plans/create')}
                    style={styles.createButton}
                >
                    Create New Diet Plan
                </button>
            </div>

            <p style={styles.infoText}>
                Create, view, modify, and delete diet plans for your clients.
            </p>

            {loading ? (
                <div style={styles.loader}>Loading your diet plans...</div>
            ) : error ? (
                <div style={styles.error}>
                    {error}
                    <button onClick={fetchTrainerDietPlans} style={styles.refreshButton}>
                        Try Again
                    </button>
                </div>
            ) : (
                <div style={styles.plansContainer}>
                    {dietPlans.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>You haven't created any diet plans yet.</p>
                            <button
                                onClick={() => navigate('/trainer/diet-plans/create')}
                                style={styles.createButton}
                            >
                                Create Your First Diet Plan
                            </button>
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
                                    <p>Client: {plan.user?.name || 'Unknown Client'}</p>
                                </div>
                                <div style={styles.planActions}>
                                    <button
                                        onClick={() => navigate(`/trainer/diet-plans/${plan._id}`)}
                                        style={styles.viewButton}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => navigate(`/trainer/diet-plans/edit/${plan._id}`)}
                                        style={styles.editButton}
                                    >
                                        Edit Plan
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirmation(plan._id)}
                                        style={styles.deleteButton}
                                    >
                                        Delete Plan
                                    </button>
                                </div>

                                {/* Delete Confirmation Dialog */}
                                {deleteConfirmation === plan._id && (
                                    <div style={styles.confirmationDialog}>
                                        <p>Are you sure you want to delete this diet plan?</p>
                                        <div style={styles.confirmationButtons}>
                                            <button
                                                onClick={() => deleteDietPlan(plan._id)}
                                                style={styles.confirmButton}
                                            >
                                                Yes, Delete
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmation(null)}
                                                style={styles.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    heading: {
        fontSize: '28px',
        fontWeight: '600',
        margin: '0',
    },
    infoText: {
        fontSize: '16px',
        marginBottom: '30px',
    },
    createButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    loader: {
        textAlign: 'center',
        padding: '30px',
        fontSize: '18px',
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
    },
    refreshButton: {
        backgroundColor: '#c62828',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        marginTop: '10px',
        cursor: 'pointer',
    },
    plansContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px',
    },
    planCard: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        position: 'relative',
    },
    planTitle: {
        fontSize: '20px',
        margin: '0 0 10px 0',
    },
    planDescription: {
        color: '#666',
        marginBottom: '15px',
    },
    planDetails: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '15px',
    },
    planActions: {
        display: 'flex',
        gap: '10px',
    },
    viewButton: {
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    editButton: {
        backgroundColor: '#FF9800',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deleteButton: {
        backgroundColor: '#F44336',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
    },
    confirmationDialog: {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(255,255,255,0.95)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '8px',
        zIndex: '10',
    },
    confirmationButtons: {
        display: 'flex',
        gap: '10px',
        marginTop: '15px',
    },
    confirmButton: {
        backgroundColor: '#F44336',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#9e9e9e',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default TrainerDietPlans;
