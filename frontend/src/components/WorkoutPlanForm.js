// frontend/src/components/WorkoutPlanForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function WorkoutPlanForm() {
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
        duration: 4,
        exercises: [
            { name: '', sets: 3, reps: '10-12', day: 1 }
        ]
    });

    // Fetch clients (users with 'user' role)
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('/admin/users');
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

    // Fetch workout plan data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchWorkoutPlan = async () => {
                try {
                    const result = await api.get(`/workout-plans/${id}`);
                    const plan = result.data.data;

                    setFormData({
                        title: plan.title || '',
                        description: plan.description || '',
                        userId: plan.userId || '',
                        duration: plan.duration || 4,
                        exercises: plan.exercises && plan.exercises.length > 0
                            ? plan.exercises
                            : [{ name: '', sets: 3, reps: '10-12', day: 1 }]
                    });

                    setLoading(false);
                } catch (err) {
                    setError('Failed to load workout plan');
                    console.error('Error loading workout plan:', err);
                    setLoading(false);
                }
            };

            fetchWorkoutPlan();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleExerciseChange = (index, field, value) => {
        const updatedExercises = [...formData.exercises];
        updatedExercises[index] = {
            ...updatedExercises[index],
            [field]: value
        };

        setFormData({
            ...formData,
            exercises: updatedExercises
        });
    };

    const addExercise = () => {
        setFormData({
            ...formData,
            exercises: [
                ...formData.exercises,
                { name: '', sets: 3, reps: '10-12', day: 1 }
            ]
        });
    };

    const removeExercise = (index) => {
        if (formData.exercises.length <= 1) {
            return; // Don't remove the last exercise
        }

        const updatedExercises = formData.exercises.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            exercises: updatedExercises
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        // Validate form data
        if (!formData.title || !formData.userId || formData.exercises.some(ex => !ex.name)) {
            setError('Please fill in all required fields');
            setSubmitting(false);
            return;
        }

        try {
            if (isEditMode) {
                await api.put(`/workout-plans/${id}`, formData);
                setSuccess('Workout plan updated successfully');
            } else {
                await api.post('/workout-plans', formData);
                setSuccess('Workout plan created successfully');

                // Reset form after successful creation
                setFormData({
                    title: '',
                    description: '',
                    userId: '',
                    duration: 4,
                    exercises: [
                        { name: '', sets: 3, reps: '10-12', day: 1 }
                    ]
                });
            }

            // Redirect after a short delay to show success message
            setTimeout(() => {
                navigate('/trainer/workout-plans');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save workout plan');
            console.error('Error saving workout plan:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div style={styles.container}>Loading workout plan data...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>{isEditMode ? 'Edit Workout Plan' : 'Create New Workout Plan'}</h2>

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
                        placeholder="Enter workout plan title"
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
                        placeholder="Enter workout plan description"
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
                    <label htmlFor="duration" style={styles.label}>Duration (weeks)</label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        style={styles.input}
                        min="1"
                        max="12"
                    />
                </div>

                <h3 style={styles.subheading}>Exercises *</h3>

                {formData.exercises.map((exercise, index) => (
                    <div key={index} style={styles.exerciseContainer}>
                        <div style={styles.exerciseHeader}>
                            <span>Exercise #{index + 1}</span>
                            <button
                                type="button"
                                onClick={() => removeExercise(index)}
                                style={styles.removeButton}
                                disabled={formData.exercises.length <= 1}
                            >
                                Remove
                            </button>
                        </div>

                        <div style={styles.exerciseFields}>
                            <div style={styles.formGroup}>
                                <label htmlFor={`exercise-name-${index}`} style={styles.label}>Name</label>
                                <input
                                    type="text"
                                    id={`exercise-name-${index}`}
                                    value={exercise.name}
                                    onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                    style={styles.input}
                                    placeholder="Exercise name"
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label htmlFor={`exercise-sets-${index}`} style={styles.label}>Sets</label>
                                <input
                                    type="number"
                                    id={`exercise-sets-${index}`}
                                    value={exercise.sets}
                                    onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 1)}
                                    style={styles.input}
                                    min="1"
                                    max="10"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label htmlFor={`exercise-reps-${index}`} style={styles.label}>Reps</label>
                                <input
                                    type="text"
                                    id={`exercise-reps-${index}`}
                                    value={exercise.reps}
                                    onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                    style={styles.input}
                                    placeholder="e.g., 10-12 or 3x8"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label htmlFor={`exercise-day-${index}`} style={styles.label}>Day</label>
                                <input
                                    type="number"
                                    id={`exercise-day-${index}`}
                                    value={exercise.day}
                                    onChange={(e) => handleExerciseChange(index, 'day', parseInt(e.target.value) || 1)}
                                    style={styles.input}
                                    min="1"
                                    max="7"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addExercise}
                    style={styles.addButton}
                >
                    + Add Exercise
                </button>

                <div style={styles.buttonContainer}>
                    <button
                        type="button"
                        onClick={() => navigate('/trainer/workout-plans')}
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
                        {submitting ? 'Saving...' : (isEditMode ? 'Update Workout Plan' : 'Create Workout Plan')}
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
    exerciseContainer: {
        backgroundColor: '#f1f1f1',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '15px'
    },
    exerciseHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        fontWeight: 'bold'
    },
    exerciseFields: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px'
    },
    removeButton: {
        padding: '5px 10px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    addButton: {
        padding: '10px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
        marginBottom: '20px'
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

export default WorkoutPlanForm;
