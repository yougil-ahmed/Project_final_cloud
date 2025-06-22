// Notes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchNotes();
    fetchStagiaires();
    fetchModules();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get('http://localhost:5000/api/notes');
    setNotes(res.data);
  };

  const fetchStagiaires = async () => {
    const res = await axios.get('http://localhost:5000/api/users');
    const users = res.data.users || res.data;
    setStagiaires(users.filter(user => user.role === 'stagiaire'));
  };
  
  // hadi chi sa3a o ana m9atl m3aha lokan machi gpt ga3 ma nselekehache
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingNoteId) {
      await axios.put(`http://localhost:5000/api/notes/${editingNoteId}`, form);
      setEditingNoteId(null);
    } else {
      await axios.post('http://localhost:5000/api/notes', form);
    }

    setForm({ value: '', moduleId: '', stagiaireId: '' });
    fetchNotes();
  };

  const handleEdit = (note) => {
    setForm({
      value: note.value,
      moduleId: note.moduleId,
      stagiaireId: note.stagiaireId,
    });
    setEditingNoteId(note.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`);
    fetchNotes();
  };

  return (
    <div className="grades-container">
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
