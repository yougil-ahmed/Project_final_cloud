import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [name, setName] = useState('');
  const [professeurId, setProfesseurId] = useState('');
  const [editId, setEditId] = useState(null);
  const [professeurs, setProfesseurs] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchModules = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/modules');
      setModules(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des modules.");
    }
  };

  const fetchProfesseurs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      const users = res.data.users || res.data;
      setProfesseurs(users.filter(user => user.role === 'professeur'));
    } catch (err) {
      toast.error("Erreur lors du chargement des professeurs.");
    }
  };

  useEffect(() => {
    fetchModules();
    fetchProfesseurs();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Le nom du module est requis.";
    if (!professeurId) newErrors.professeurId = "Le professeur est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/modules/${editId}`, { name, professeurId });
        toast.success("Module modifié avec succès !");
      } else {
        await axios.post('http://localhost:5000/api/modules', { name, professeurId });
        toast.success("Module ajouté avec succès !");
      }
      setName('');
      setProfesseurId('');
      setEditId(null);
      setErrors({});
      fetchModules();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement du module.");
    }
  };

  const handleEdit = module => {
    setEditId(module.id);
    setName(module.name);
    setProfesseurId(module.professeurId);
    setErrors({});
  };

  const handleDelete = async id => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce module ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/modules/${id}`);
      toast.success("Module supprimé avec succès !");
      fetchModules();
    } catch (err) {
      toast.error("Erreur lors de la suppression du module.");
    }
  };

  return (
    <div className="module-management-container">
      <ToastContainer />
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
          {errors.name && <div className="form-error">{errors.name}</div>}
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
          {errors.professeurId && <div className="form-error">{errors.professeurId}</div>}
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
