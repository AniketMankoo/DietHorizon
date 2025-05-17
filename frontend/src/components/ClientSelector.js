// components/ClientSelector.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ClientSelector({ onClientSelect }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                // Get all users (for now - later you can create a specific endpoint for potential clients)
                const response = await api.get('/admin/users');
                // Filter for users with 'user' role
                const userClients = response.data.data.filter(user => user.role === 'user');
                setClients(userClients);
            } catch (err) {
                setError('Failed to load clients');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) return <p>Loading clients...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <label htmlFor="client-select">Select Client:</label>
            <select
                id="client-select"
                onChange={(e) => onClientSelect(e.target.value)}
                defaultValue=""
            >
                <option value="" disabled>Select a client</option>
                {clients.map(client => (
                    <option key={client._id} value={client._id}>
                        {client.name} ({client.email})
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ClientSelector;
