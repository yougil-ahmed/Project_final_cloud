import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [name, setName] = useState('');
  const [professeurId, setProfesseurId] = useState('');
  const [editId, setEditId] = useState(null);
  const [professeurs, setProfesseurs] = useState([]);

  const fetchModules = async () => {
      const res = await axios.get('http://localhost:5000/api/modules');
    setModules(res.data);
  };

  const fetchProfesseurs = async () => {
    const res = await axios.get('http://localhost:5000/api/users');
      const users = res.data.users || res.data;
    setProfesseurs(users.filter(user => user.role === 'professeur'));
  };

  useEffect(() => {
    fetchModules();
    fetchProfesseurs();
  }, []);

  const findModuleById = id => {
    return modules.find(module => module.id === id);
  };

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
          <select
            name="professeurId"
            value={professeurId}
            onChange={e => setProfesseurId(e.target.value)}
            className="grades-select"
            required
          >
            <option value="">-- Choisir un professeur --</option>
            {professeurs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-btn">
          {editId ? 'Modifier' : 'Ajouter'}
        </button>
      </form>

      <table className="grades-table">
        <thead className="grades-table-header">
          <tr>
            <th>#</th>
            <th>Nom du module</th>
            <th>Professeur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="grades-table-body">
          {modules.map((module, idx) => (
            <tr key={module.id}>
              <td className="grades-table-cell">
                <span className="grades-table-id">{idx + 1}</span>
              </td>
              <td className="grades-table-cell">
                <span className="grades-table-name">{module.name}</span>
              </td>
              <td className="grades-table-cell">
                <span className="grades-table-prof">
                  {professeurs.find(p => p.id === module.professeurId)?.name || (
                    <span className="grades-not-found">Non trouvé</span>
                  )}
                </span>
              </td>
              <td className="grades-table-cell">
                <div className="grades-actions">
                  <button
                    onClick={() => handleEdit(module)}
                    className="grades-edit-btn"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(module.id)}
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

export default Modules;
