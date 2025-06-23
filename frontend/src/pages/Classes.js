import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [stagiaires, setStagiaires] = useState([]);
  const [modules, setModules] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: '',
    professeurId: '',
    stagiaireIds: [],
    moduleIds: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Get classes
      const classesRes = await axios.get('http://localhost:5000/api/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Get users (professeurs and stagiaires)
      const usersRes = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = usersRes.data.users || usersRes.data;
      const professeurs = users.filter(user => user.role === 'professeur');
      const stagiaires = users.filter(user => user.role === 'stagiaire');

      // Get modules
      const modulesRes = await axios.get('http://localhost:5000/api/modules', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setClasses(classesRes.data);
      setProfesseurs(professeurs);
      setStagiaires(stagiaires);
      setModules(modulesRes.data);
    } catch (error) {
      alert('Erreur lors du chargement des données');
      throw error;
    }
  };

  // تحديث الفورم
  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (e.target.multiple) {
      const values = Array.from(options).filter(opt => opt.selected).map(opt => parseInt(opt.value));
      setForm({ ...form, [name]: values });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // إرسال الفورم (إنشاء أو تعديل)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        // تعديل
        await axios.put(`http://localhost:5000/api/classes/${form.id}`, {
          name: form.name,
          professeurId: parseInt(form.professeurId),
          stagiaireIds: form.stagiaireIds,
          moduleIds: form.moduleIds,
        });
      } else {
        // إنشاء
        await axios.post('http://localhost:5000/api/classes', {
          name: form.name,
          professeurId: parseInt(form.professeurId),
          stagiaireIds: form.stagiaireIds,
          moduleIds: form.moduleIds,
        });
      }
      setForm({ id: null, name: '', professeurId: '', stagiaireIds: [], moduleIds: [] });
      fetchData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // حذف فصل
  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الفصل؟')) return;
    await axios.delete(`http://localhost:5000/api/classes/${id}`);
    fetchData();
  };

  // تعبئة الفورم للتعديل
  const handleEdit = (classe) => {
    setForm({
      id: classe.id,
      name: classe.name,
      professeurId: classe.professeurResponsable?.id || '',
      stagiaireIds: classe.stagiaires ? classe.stagiaires.map(s => s.id) : [],
      moduleIds: classe.modules ? classe.modules.map(m => m.id) : [],
    });
  };

  return (
    <div className="container p-4">
      <h2 className="mb-3">Gestion des Classes</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Nom de la classe"
          value={form.name}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        <select
          name="professeurId"
          value={form.professeurId}
          onChange={handleChange}
          className="form-control mb-2"
          required
        >
          <option value="">-- Choisir un professeur --</option>
          {professeurs.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <label>Stagiaires (plusieurs):</label>
        <select
          name="stagiaireIds"
          multiple
          value={form.stagiaireIds}
          onChange={handleChange}
          className="form-control mb-2"
          style={{height: '100px'}}
          required
        >
          {stagiaires.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <label>Modules (plusieurs):</label>
        <select
          name="moduleIds"
          multiple
          value={form.moduleIds}
          onChange={handleChange}
          className="form-control mb-2"
          style={{height: '100px'}}
          required
        >
          {modules.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary">
          {form.id ? 'Modifier' : 'Ajouter'}
        </button>

        {form.id && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setForm({ id: null, name: '', professeurId: '', stagiaireIds: [], moduleIds: [] })}
          >
            Annuler
          </button>
        )}
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Professeur</th>
            <th>Stagiaires</th>
            <th>Modules</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(classe => (
            <tr key={classe.id}>
              <td>{classe.name}</td>
              <td>{classe.professeurResponsable?.name || '-'}</td>
              <td>{classe.stagiaires?.map(s => s.name).join(', ') || '-'}</td>
              <td>{classe.modules?.map(m => m.name).join(', ') || '-'}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(classe)}>
                  Modifier
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(classe.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Classes;
