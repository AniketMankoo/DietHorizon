// Create a new file: src/pages/ClientDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ClientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [dietPlans, setDietPlans] = useState([]);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClientData();
    }, [id]);

    const fetchClientData = async () => {
        setLoading(true);
        try {
            // Get client details
            const clientResponse = await api.get(`/users/${id}`);
            setClient(clientResponse.data.data);

            // Get diet plans for this client
            const dietResponse = await api.get(`/diet-plans?userId=${id}`);
            setDietPlans(dietResponse.data.data || []);

            // Get workout plans for this client
            const workoutResponse = await api.get(`/workout-plans?userId=${id}`);
            setWorkoutPlans(workoutResponse.data.data || []);

            setLoading(false);
        } catch (err) {
            console.error('Error fetching client data:', err);
            setError('Failed to load client data. Please try again.');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading client data...</div>;
    if (error) return <div>{error}</div>;
    if (!client) return <div>Client not found</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Client: {client.name}</h2>
            <p style={styles.clientInfo}>Email: {client.email}</p>

            <div style={styles.section}>
                <h3 style={styles.sectionHeading}>Diet Plans</h3>
                {dietPlans.length === 0 ? (
                    <p>No diet plans created for this client yet.</p>
                ) : (
                    <div style={styles.planList}>
                        {dietPlans.map((plan) => (
                            <div key={plan._id} style={styles.planCard}>
                                <h4>{plan.title}</h4>
                                <p>{plan.description}</p>
                                <button
                                    onClick={() => navigate(`/trainer/diet-plans/${plan._id}`)}
                                    style={styles.button}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => navigate(`/trainer/diet-plans/create?userId=${id}`)}
                    style={styles.createButton}
                >
                    Create New Diet Plan
                </button>
            </div>

            <div style={styles.section}>
                <h3 style={styles.sectionHeading}>Workout Plans</h3>
                {workoutPlans.length === 0 ? (
                    <p>No workout plans created for this client yet.</p>
                ) : (
                    <div style={styles.planList}>
                        {workoutPlans.map((plan) => (
                            <div key={plan._id} style={styles.planCard}>
                                <h4>{plan.title}</h4>
                                <p>{plan.description}</p>
                                <button
                                    onClick={() => navigate(`/trainer/workouts/${plan._id}`)}
                                    style={styles.button}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => navigate(`/trainer/workouts/create?userId=${id}`)}
                    style={styles.createButton}
                >
                    Create New Workout Plan
                </button>
            </div>
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
    clientInfo: {
        marginBottom: '20px',
        color: '#666',
    },
    section: {
        marginBottom: '30px',
    },
    sectionHeading: {
        fontSize: '22px',
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
    planList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '20px',
    },
    planCard: {
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    button: {
        backgroundColor: '#4A90E2',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    },
    createButton: {
        backgroundColor: '#5CB85C',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default ClientDetail;
