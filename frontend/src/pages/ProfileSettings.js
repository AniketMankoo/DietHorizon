import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';

function ProfileSettings() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState({ text: '', type: '' });

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: '',
        email: ''
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    // Fetch user profile on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/auth/me');
                const userData = response.data.data;

                setProfileData({
                    name: userData.name || '',
                    email: userData.email || ''
                });
            } catch (err) {
                setMessage({
                    text: err.response?.data?.message || 'Failed to load profile data',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem('token')) {
            fetchUserProfile();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Handle profile form changes
    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    // Handle password form changes
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    // Submit profile update
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setMessage({ text: '', type: '' });

            const response = await api.put('/auth/update-details', profileData);

            // Update user context with new data
            setUser({ ...user, ...response.data.data });

            setMessage({
                text: 'Profile updated successfully',
                type: 'success'
            });
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || 'Failed to update profile',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    // Submit password change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({
                text: 'New password and confirmation do not match',
                type: 'error'
            });
            return;
        }

        try {
            setSaving(true);
            setMessage({ text: '', type: '' });

            await api.put('/auth/update-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setMessage({
                text: 'Password updated successfully',
                type: 'success'
            });

            // Clear password fields
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || 'Failed to update password',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading user profile...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Account Settings</h2>

            {/* Navigation tabs */}
            <div style={styles.tabs}>
                <button
                    style={activeTab === 'profile' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile Info
                </button>
                <button
                    style={activeTab === 'password' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
                    onClick={() => setActiveTab('password')}
                >
                    Change Password
                </button>
            </div>

            {/* Message display */}
            {message.text && (
                <div style={message.type === 'error' ? styles.errorMessage : styles.successMessage}>
                    {message.text}
                </div>
            )}

            {/* Profile update form */}
            {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="name" style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Update Profile'}
                    </button>
                </form>
            )}

            {/* Password change form */}
            {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="currentPassword" style={styles.label}>Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="newPassword" style={styles.label}>New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            style={styles.input}
                            required
                            minLength="6"
                        />
                        <small style={styles.hint}>Password must be at least 6 characters</small>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="confirmPassword" style={styles.label}>Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={saving}
                    >
                        {saving ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
            )}

            <div style={styles.footer}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={styles.backButton}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: '#fff',
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#f0f0f0',
        marginBottom: '30px',
        textAlign: 'center',
    },
    tabs: {
        display: 'flex',
        marginBottom: '30px',
        borderBottom: '1px solid #333',
    },
    tab: {
        backgroundColor: 'transparent',
        color: '#ccc',
        border: 'none',
        padding: '12px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        flex: '1',
        transition: 'all 0.3s ease',
    },
    activeTab: {
        color: '#00c896',
        borderBottom: '2px solid #00c896',
        backgroundColor: 'rgba(0, 200, 150, 0.1)',
    },
    form: {
        backgroundColor: '#1e1e1e',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    formGroup: {
        marginBottom: '25px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '16px',
        color: '#ddd',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        fontSize: '16px',
        backgroundColor: '#2c2c2c',
        border: '1px solid #444',
        borderRadius: '6px',
        color: '#fff',
        outline: 'none',
        transition: 'border-color 0.3s',
    },
    hint: {
        display: 'block',
        marginTop: '5px',
        fontSize: '14px',
        color: '#999',
    },
    button: {
        backgroundColor: '#00c896',
        color: '#fff',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        width: '100%',
        marginTop: '10px',
    },
    backButton: {
        backgroundColor: 'transparent',
        color: '#ccc',
        border: '1px solid #444',
        padding: '10px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    footer: {
        marginTop: '30px',
        textAlign: 'center',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#ccc',
        backgroundColor: '#121212',
    },
    errorMessage: {
        backgroundColor: 'rgba(255, 69, 58, 0.2)',
        color: '#ff453a',
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '16px',
        textAlign: 'center',
    },
    successMessage: {
        backgroundColor: 'rgba(48, 209, 88, 0.2)',
        color: '#30d158',
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '16px',
        textAlign: 'center',
    },
};

export default ProfileSettings;