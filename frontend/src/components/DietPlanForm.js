// frontend/src/components/DietPlanForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function DietPlanForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [clients, setClients] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        userId: '',
        duration: 7,
        meals: [
            { type: 'Breakfast', description: '' },
            { type: 'Lunch', description: '' },
            { type: 'Dinner', description: '' },
            { type: 'Snacks', description: '' }
        ]
    });

    // Fetch clients (users with 'user' role)
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/users/clients');
                // Filter for users with 'user' role
                const userClients = response.data.data.filter(user => user.role === 'user');
                setClients(userClients);
            } catch (err) {
                setError('Failed to load clients');
                console.error('Error loading clients:', err);
            }
        };

        fetchClients();
    }, []);

    // Fetch diet plan data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchDietPlan = async () => {
                try {
                    const result = await api.get(`/diet-plans/${id}`);
                    const plan = result.data.data;

                    // Prepare meal data - ensure all required meal types exist
                    const existingMealTypes = plan.meals.map(meal => meal.type);
                    const requiredMealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

                    const completeMeals = [...plan.meals];

                    // Add any missing meal types
                    requiredMealTypes.forEach(type => {
                        if (!existingMealTypes.includes(type)) {
                            completeMeals.push({ type, description: '' });
                        }
                    });

                    setFormData({
                        title: plan.title || '',
                        description: plan.description || '',
                        userId: plan.userId || '',
                        duration: plan.duration || 7,
                        meals: completeMeals
                    });

                    setLoading(false);
                } catch (err) {
                    setError('Failed to load diet plan');
                    console.error('Error loading diet plan:', err);
                    setLoading(false);
                }
            };

            fetchDietPlan();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleMealChange = (index, e) => {
        const updatedMeals = [...formData.meals];
        updatedMeals[index] = {
            ...updatedMeals[index],
            description: e.target.value
        };

        setFormData({
            ...formData,
            meals: updatedMeals
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        if (!formData.title || !formData.userId || formData.meals.some(meal => !meal.description)) {
            setError('Please fill in all required fields');
            setSubmitting(false);
            return;
        }

        try {
            if (isEditMode) {
                await api.put(`/diet-plans/${id}`, formData);
                setSuccess('Diet plan updated successfully');
            } else {
                await api.post('/diet-plans', formData);
                setSuccess('Diet plan created successfully');

                // Reset form after successful creation
                setFormData({
                    title: '',
                    description: '',
                    userId: '',
                    duration: 7,
                    meals: [
                        { type: 'Breakfast', description: '' },
                        { type: 'Lunch', description: '' },
                        { type: 'Dinner', description: '' },
                        { type: 'Snacks', description: '' }
                    ]
                });
            }

            // Redirect after a short delay to show success message
            setTimeout(() => {
                navigate('/trainer/diet-plans');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save diet plan');
            console.error('Error saving diet plan:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={styles.container}>Loading diet plan data...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>{isEditMode ? 'Edit Diet Plan' : 'Create New Diet Plan'}</h2>

            {error && <div style={styles.errorMessage}>{error}</div>}
            {success && <div style={styles.successMessage}>{success}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="title" style={styles.label}>Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Enter diet plan title"
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="description" style={styles.label}>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={styles.textarea}
                        placeholder="Enter diet plan description"
                        rows="3"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="userId" style={styles.label}>Client *</label>
                    <select
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        style={styles.select}
                        required
                    >
                        <option value="">Select a client</option>
                        {clients.map(client => (
                            <option key={client._id} value={client._id}>
                                {client.name} ({client.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="duration" style={styles.label}>Duration (days)</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        style={styles.input}
                        min="1"
                        max="90"
                    />
                </div>

                <h3 style={styles.subheading}>Meal Plan *</h3>

                {formData.meals.map((meal, index) => (
                    <div key={meal.type} style={styles.formGroup}>
                        <label htmlFor={`meal-${index}`} style={styles.label}>{meal.type}</label>
                        <textarea
                            id={`meal-${index}`}
                            value={meal.description}
                            onChange={(e) => handleMealChange(index, e)}
                            style={styles.textarea}
                            placeholder={`Enter ${meal.type.toLowerCase()} details`}
                            rows="3"
                            required
                        />
                    </div>
                ))}

                <div style={styles.buttonContainer}>
                    <button
                        type="button"
                        onClick={() => navigate('/trainer/diet-plans')}
                        style={styles.cancelButton}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        style={styles.submitButton}
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : (isEditMode ? 'Update Diet Plan' : 'Create Diet Plan')}
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    heading: {
        color: '#333',
        marginBottom: '20px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px'
    },
    subheading: {
        color: '#444',
        margin: '20px 0 10px 0'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px'
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555'
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px'
    },
    textarea: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px',
        fontFamily: 'inherit'
    },
    select: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px',
        backgroundColor: '#fff'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px'
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    errorMessage: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    },
    successMessage: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
    }
};

export default DietPlanForm;
