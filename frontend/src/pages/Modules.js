import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [name, setName] = useState('');
  const [professeurId, setProfesseurId] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchModules = async () => {
    const res = await axios.get('http://localhost:5000/api/modules');
    setModules(res.data);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if(editId) {
      await axios.put(`http://localhost:5000/api/modules/${editId}`, { name, professeurId });
    } else {
      await axios.post('http://localhost:5000/api/modules', { name, professeurId });
    }
    setName('');
    setProfesseurId('');
    setEditId(null);
    fetchModules();
  };

  const handleEdit = module => {
    setEditId(module.id);
    setName(module.name);
    setProfesseurId(module.professeurId);
  };

  const handleDelete = async id => {
    await axios.delete(`http://localhost:5000/api/modules/${id}`);
    fetchModules();
  };

  return (
    <div className="module-management-container">
      <h2 className="module-management-title">Gestion des Modules</h2>
      <form onSubmit={handleSubmit} className="module-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nom du module"
            value={name}
            onChange={e => setName(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="ID Professeur"
            value={professeurId}
            onChange={e => setProfesseurId(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          {editId ? 'Modifier' : 'Ajouter'}
        </button>
      </form>

      <ul className="module-list">
        {modules.map(module => (
          <li key={module.id} className="module-item">
            <div className="module-info">
              <span className="module-name">{module.name}</span>
              <span className="prof-id">(Prof ID: {module.professeurId})</span>
            </div>
            <div className="module-actions">
              <button onClick={() => handleEdit(module)} className="edit-btn">
                Modifier
              </button>
              <button onClick={() => handleDelete(module.id)} className="delete-btn">
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Modules;
