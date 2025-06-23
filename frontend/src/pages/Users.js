import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'stagiaire' });
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');

    // Validation function
    const validate = () => {
        if (!formData.name.trim()) {
            setError('Le nom est requis.');
            return false;
        }
        if (!formData.email.trim()) {
            setError("L'email est requis.");
            return false;
        }
        // Simple email regex
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            setError("L'email n'est pas valide.");
            return false;
        }
        if (!editId && !formData.password) {
            setError('Le mot de passe est requis.');
            return false;
        }
        if (!['admin', 'professeur', 'stagiaire'].includes(formData.role)) {
            setError('Le rôle est invalide.');
            return false;
        }
        setError('');
        return true;
    };

    // Récupérer tous les utilisateurs
    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (err) {
            toast.error('Erreur lors du chargement des utilisateurs');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Mettre à jour les données du formulaire
    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Soumettre le formulaire (ajouter ou modifier)
    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/users/${editId}`, {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                });
                toast.success('Utilisateur modifié avec succès');
            } else {
                await axios.post('http://localhost:5000/api/users', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                });
                toast.success('Utilisateur ajouté avec succès');
            }
            setFormData({ name: '', email: '', password: '', role: 'stagiaire' });
            setEditId(null);
            setError('');
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'opération");
            toast.error(err.response?.data?.error || "Erreur lors de l'opération");
        }
    };

    // Charger les données de l'utilisateur dans le formulaire pour modification
    const handleEdit = user => {
        setEditId(user.id);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setError('');
    };

    // Supprimer un utilisateur
    const handleDelete = async id => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            toast.success('Utilisateur supprimé avec succès');
            fetchUsers();
        } catch (err) {
            toast.error('Une erreur est survenue lors de la suppression');
        }
    };

    return (
        <div className="user-management-container">
            <ToastContainer />
            <h2 className="management-title">Gestion des utilisateurs</h2>

            <form onSubmit={handleSubmit} className="user-form">
                <div className="input-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nom complet"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Adresse email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    {!editId && (
                        <input
                            type="password"
                            name="password"
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    )}
                    <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="admin">Administrateur</option>
                        <option value="professeur">Professeur</option>
                        <option value="stagiaire">Stagiaire</option>
                    </select>
                    <button type="submit" className="primary-btn">
                        {editId ? 'Modifier' : 'Ajouter'}
                    </button>
                </div>
            </form>

            {error && <p className="error-message">{error}</p>}

            <div className="table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`role-badge ${u.role}-badge`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleEdit(u)}
                                        className="edit-btn"
                                    >
                                        Modifier
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(u.id)}
                                        className="delete-btn"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
