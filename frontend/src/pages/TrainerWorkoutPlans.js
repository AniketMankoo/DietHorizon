// frontend/src/pages/TrainerWorkoutPlans.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function TrainerWorkoutPlans() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [clients, setClients] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form state for creating/editing workout plans
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        userId: '',
        duration: 7,
        difficulty: 'Beginner',
        exercises: [{ name: '', sets: 3, reps: '10', day: 1, duration: '', rest: '', description: '' }]
    });

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(null);

    useEffect(() => {
        // Fetch trainer's workout plans when component mounts
        fetchTrainerWorkoutPlans();
        // Fetch clients for dropdown selection
        fetchClients();
    }, []);

    const fetchTrainerWorkoutPlans = async () => {
        try {
            setLoading(true);
            setError('');

            // Call API endpoint to get trainer's workout plans
            const response = await api.get('/workout-plans/trainer');
            setWorkoutPlans(response.data.data || []);

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load workout plans. Please try again later.');
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await api.get('/users/clients'); // Assuming this endpoint exists
            setClients(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch clients:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleExerciseChange = (index, field, value) => {
        const updatedExercises = [...formData.exercises];
        updatedExercises[index] = { ...updatedExercises[index], [field]: value };
        setFormData({ ...formData, exercises: updatedExercises });
    };

    const addExercise = () => {
        const lastExercise = formData.exercises[formData.exercises.length - 1];
        const newDay = lastExercise ? lastExercise.day : 1;

        setFormData({
            ...formData,
            exercises: [
                ...formData.exercises,
                { name: '', sets: 3, reps: '10', day: newDay, duration: '', rest: '', description: '' }
            ]
        });
    };

    const removeExercise = (index) => {
        const updatedExercises = formData.exercises.filter((_, i) => i !== index);
        setFormData({ ...formData, exercises: updatedExercises });
    };

    const handleCreatePlan = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');

            if (isEditing) {
                // Update existing workout plan
                await api.put(`/workout-plans/${editingPlanId}`, formData);
            } else {
                // Create new workout plan
                await api.post('/workout-plans', formData);
            }

            // Reset form and fetch updated list
            resetForm();
            fetchTrainerWorkoutPlans();
            setShowCreateForm(false);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save workout plan. Please try again.');
            setLoading(false);
        }
    };

    const handleEditPlan = (plan) => {
        setIsEditing(true);
        setEditingPlanId(plan._id);
        setFormData({
            title: plan.title || '',
            description: plan.description || '',
            userId: plan.user._id,
            duration: plan.duration || 7,
            difficulty: plan.difficulty || 'Beginner',
            exercises: plan.exercises || []
        });
        setShowCreateForm(true);
        window.scrollTo(0, 0);
    };

    const handleDeleteConfirm = (plan) => {
        setPlanToDelete(plan);
        setShowDeleteConfirm(true);
    };

    const handleDeletePlan = async () => {
        if (!planToDelete) return;

        try {
            setLoading(true);
            await api.delete(`/workout-plans/${planToDelete._id}`);
            setWorkoutPlans(workoutPlans.filter(plan => plan._id !== planToDelete._id));
            setShowDeleteConfirm(false);
            setPlanToDelete(null);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete workout plan. Please try again.');
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            userId: '',
            duration: 7,
            difficulty: 'Beginner',
            exercises: [{ name: '', sets: 3, reps: '10', day: 1, duration: '', rest: '', description: '' }]
        });
        setIsEditing(false);
        setEditingPlanId(null);
    };

    const handleCancelForm = () => {
        resetForm();
        setShowCreateForm(false);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>
                {isEditing ? 'Edit Workout Plan' : 'Trainer Workout Plans'}
            </h2>

            {!showCreateForm && (
                <div style={styles.actionsContainer}>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        style={styles.createButton}
                    >
                        Create New Workout Plan
                    </button>
                    <button
                        onClick={() => navigate('/trainer')}
                        style={styles.backButton}
                    >
                        Back to Dashboard
                    </button>
                </div>
            )}

            {error && (
                <div style={styles.error}>
                    {error}
                    <button onClick={fetchTrainerWorkoutPlans} style={styles.refreshButton}>
                        Try Again
                    </button>
                </div>
            )}

            {showDeleteConfirm && (
                <div style={styles.confirmModal}>
                    <div style={styles.modalContent}>
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete the workout plan "{planToDelete?.title}"? This action cannot be undone.</p>
                        <div style={styles.modalButtons}>
                            <button onClick={handleDeletePlan} style={styles.deleteButton}>Delete</button>
                            <button onClick={() => setShowDeleteConfirm(false)} style={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateForm ? (
                <div style={styles.formContainer}>
                    <form onSubmit={handleCreatePlan}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Plan Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                                placeholder="e.g., 12-Week Strength Program"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                style={styles.textarea}
                                placeholder="Describe the workout plan and goals"
                                rows={4}
                            ></textarea>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Client</label>
                                <select
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    style={styles.select}
                                    required
                                >
                                    <option value="">Select a client</option>
                                    {clients.map((client) => (
                                        <option key={client._id} value={client._id}>
                                            {client.name} ({client.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Duration (days)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    min="1"
                                    max="90"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Difficulty</label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    style={styles.select}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <h3 style={styles.exercisesHeading}>Exercises</h3>
                        <p style={styles.exercisesInfo}>Add all exercises for this workout plan. Group them by day.</p>

                        {formData.exercises.map((exercise, index) => (
                            <div key={index} style={styles.exerciseBox}>
                                <div style={styles.exerciseHeader}>
                                    <h4>Exercise {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeExercise(index)}
                                        style={styles.removeButton}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Exercise Name</label>
                                        <input
                                            type="text"
                                            value={exercise.name}
                                            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                            style={styles.input}
                                            required
                                            placeholder="e.g., Barbell Squat"
                                        />
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Day</label>
                                        <input
                                            type="number"
                                            value={exercise.day}
                                            onChange={(e) => handleExerciseChange(index, 'day', parseInt(e.target.value))}
                                            style={styles.input}
                                            min="1"
                                            max={formData.duration}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Sets</label>
                                        <input
                                            type="number"
                                            value={exercise.sets}
                                            onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                                            style={styles.input}
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Reps/Time</label>
                                        <input
                                            type="text"
                                            value={exercise.reps}
                                            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                            style={styles.input}
                                            required
                                            placeholder="e.g., 10 or 30 sec"
                                        />
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Rest Time</label>
                                        <input
                                            type="text"
                                            value={exercise.rest}
                                            onChange={(e) => handleExerciseChange(index, 'rest', e.target.value)}
                                            style={styles.input}
                                            placeholder="e.g., 60 sec"
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Notes</label>
                                    <textarea
                                        value={exercise.description}
                                        onChange={(e) => handleExerciseChange(index, 'description', e.target.value)}
                                        style={styles.textarea}
                                        placeholder="Form tips, variations, etc."
                                        rows={2}
                                    ></textarea>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addExercise}
                            style={styles.addExerciseButton}
                        >
                            + Add Another Exercise
                        </button>

                        <div style={styles.formActions}>
                            <button type="submit" style={styles.submitButton}>
                                {isEditing ? 'Update Workout Plan' : 'Create Workout Plan'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelForm}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {loading ? (
                        <div style={styles.loader}>Loading workout plans...</div>
                    ) : (
                        <div style={styles.plansContainer}>
                            {workoutPlans.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <p>You haven't created any workout plans yet.</p>
                                    <p>Click the "Create New Workout Plan" button to get started.</p>
                                </div>
                            ) : (
                                workoutPlans.map((plan) => (
                                    <div key={plan._id} style={styles.planCard}>
                                        <div style={styles.cardHeader}>
                                            <h3 style={styles.planTitle}>{plan.title || 'Workout Plan'}</h3>
                                            <span style={{
                                                ...styles.difficultyBadge,
                                                backgroundColor:
                                                    plan.difficulty === 'Advanced' ? '#ff4757' :
                                                        plan.difficulty === 'Intermediate' ? '#ffa502' : '#2ed573'
                                            }}>
                                                {plan.difficulty}
                                            </span>
                                        </div>

                                        <p style={styles.planDescription}>
                                            {plan.description || 'No description available'}
                                        </p>

                                        <div style={styles.planDetails}>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>Duration:</span>
                                                {plan.duration} days
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>Exercises:</span>
                                                {plan.exercises?.length || 0}
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>Client:</span>
                                                {plan.user?.name || 'Unknown'}
                                            </div>
                                            <div style={styles.detailItem}>
                                                <span style={styles.detailLabel}>Created:</span>
                                                {new Date(plan.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div style={styles.cardActions}>
                                            <button
                                                onClick={() => navigate(`/trainer/workouts/${plan._id}`)}
                                                style={styles.viewButton}
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleEditPlan(plan)}
                                                style={styles.editButton}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteConfirm(plan)}
                                                style={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
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
    actionsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px',
    },
    createButton: {
        backgroundColor: '#00c896',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '16px',
    },
    backButton: {
        backgroundColor: 'transparent',
        color: '#00c896',
        padding: '8px 16px',
        border: '1px solid #00c896',
        borderRadius: '6px',
        cursor: 'pointer',
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
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    planTitle: {
        fontSize: '20px',
        fontWeight: '600',
        margin: 0,
    },
    difficultyBadge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    planDescription: {
        fontSize: '16px',
        color: '#bbbbbb',
        marginBottom: '15px',
    },
    planDetails: {
        marginBottom: '15px',
        backgroundColor: '#2a2a2a',
        padding: '10px',
        borderRadius: '8px',
    },
    detailItem: {
        fontSize: '14px',
        color: '#cccccc',
        marginBottom: '5px',
    },
    detailLabel: {
        color: '#888888',
        marginRight: '5px',
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    viewButton: {
        backgroundColor: '#1e88e5',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    editButton: {
        backgroundColor: '#ffac33',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
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
    formContainer: {
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '14px',
        color: '#aaaaaa',
    },
    input: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#2a2a2a',
        border: '1px solid #444',
        borderRadius: '4px',
        color: 'white',
    },
    select: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#2a2a2a',
        border: '1px solid #444',
        borderRadius: '4px',
        color: 'white',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#2a2a2a',
        border: '1px solid #444',
        borderRadius: '4px',
        color: 'white',
        resize: 'vertical',
    },
    exercisesHeading: {
        borderBottom: '1px solid #444',
        paddingBottom: '10px',
        marginTop: '30px',
    },
    exercisesInfo: {
        fontSize: '14px',
        color: '#888',
        marginBottom: '20px',
    },
    exerciseBox: {
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
    },
    exerciseHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
    },
    removeButton: {
        backgroundColor: 'transparent',
        color: '#ff6b6b',
        border: '1px solid #ff6b6b',
        borderRadius: '4px',
        padding: '5px 10px',
        cursor: 'pointer',
    },
    addExerciseButton: {
        backgroundColor: '#2a2a2a',
        color: '#00c896',
        border: '1px solid #00c896',
        borderRadius: '6px',
        padding: '10px',
        width: '100%',
        cursor: 'pointer',
        marginBottom: '30px',
    },
    formActions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: '#00c896',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '16px',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        color: '#aaaaaa',
        padding: '12px 24px',
        border: '1px solid #444',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    confirmModal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        padding: '25px',
        maxWidth: '500px',
        width: '90%',
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
};

export default TrainerWorkoutPlans;