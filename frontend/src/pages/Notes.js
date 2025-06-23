import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({
    value: '',
    moduleId: '',
    stagiaireId: '',
  });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchNotes(), fetchStagiaires(), fetchModules()]);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotes = async () => {
    const res = await axios.get('http://localhost:5000/api/notes');
    setNotes(res.data);
  };

  const fetchStagiaires = async () => {
    const res = await axios.get('http://localhost:5000/api/users');
    const users = res.data.users || res.data;
    setStagiaires(users.filter(user => user.role === 'stagiaire'));
  };

  const fetchModules = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/modules', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setModules(res.data.modules || res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.value || isNaN(form.value) || parseFloat(form.value) < 0 || parseFloat(form.value) > 20) {
      toast.error('Veuillez entrer une note valide (entre 0 et 20)');
      return false;
    }
    if (!form.stagiaireId) {
      toast.error('Veuillez sélectionner un stagiaire');
      return false;
    }
    if (!form.moduleId) {
      toast.error('Veuillez sélectionner un module');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      if (editingNoteId) {
        await axios.put(`http://localhost:5000/api/notes/${editingNoteId}`, form);
        toast.success('Note modifiée avec succès');
        setEditingNoteId(null);
      } else {
        await axios.post('http://localhost:5000/api/notes', form);
        toast.success('Note ajoutée avec succès');
      }

      setForm({ value: '', moduleId: '', stagiaireId: '' });
      await fetchNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (note) => {
    setForm({
      value: note.value,
      moduleId: note.moduleId,
      stagiaireId: note.stagiaireId,
    });
    setEditingNoteId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:5000/api/notes/${id}`);
        toast.success('Note supprimée avec succès');
        await fetchNotes();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="grades-container">
      <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="grades-title">Gestion des Notes</h2>

        <form onSubmit={handleSubmit} className="grades-form">
            <input
            type="number"
            name="value"
            placeholder="Valeur de la note"
            value={form.value}
            onChange={handleChange}
            className="grades-input"
            step="0.01"
            required
            />

            <select
            name="stagiaireId"
            value={form.stagiaireId}
            onChange={handleChange}
            className="grades-select"
            required
            >
            <option value="">-- Choisir un stagiaire --</option>
            {stagiaires.map((s) => (
                <option key={s.id} value={s.id}>
                {s.name}
                </option>
            ))}
            </select>

            <select
            name="moduleId"
            value={form.moduleId}
            onChange={handleChange}
            className="grades-select"
            required
            >
            <option value="">-- Choisir un module --</option>
            {modules.map((m) => (
                <option key={m.id} value={m.id}>
                {m.name}
                </option>
            ))}
            </select>

            <button type="submit" className="grades-submit-btn">
            {editingNoteId ? 'Modifier' : 'Ajouter'}
            </button>
        </form>

        <table className="grades-table">
            <thead className="grades-table-header">
            <tr>
                <th>#</th>
                <th>Note</th>
                <th>Stagiaire</th>
                <th>Module</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody className="grades-table-body">
            {notes.map((note) => (
                <tr key={note.id}>
                <td className="grades-table-cell">
                    <span className="grades-table-id">{note.id}</span>
                </td>
                <td className="grades-table-cell">
                    <span className="grades-table-value">{note.value}</span>
                </td>
                <td className="grades-table-cell">
                    <span className="grades-table-name">
                    {note.stagiaire?.name || <span className="grades-not-found">Non trouvé</span>}
                    </span>
                </td>
                <td className="grades-table-cell">
                    <span className="grades-table-module">
                    {note.module?.name || <span className="grades-not-found">Non trouvé</span>}
                    </span>
                </td>
                <td className="grades-table-cell">
                    <div className="grades-actions">
                    <button
                        onClick={() => handleEdit(note)}
                        className="grades-edit-btn"
                    >
                        Modifier
                    </button>
                    <button
                        onClick={() => handleDelete(note.id)}
                        className="grades-delete-btn"
                    >
                        Supprimer
                    </button>
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
  );
};

export default Notes;