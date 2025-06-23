import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmploiDuTemps = () => {
  const [emplois, setEmplois] = useState([]);
  const [classes, setClasses] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);

  const [form, setForm] = useState({
    startTime: '',
    endTime: '',
    file: null,
    classId: '',
    professeurId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes, profsRes, emploisRes] = await Promise.all([
        axios.get('http://localhost:5000/api/classes'),
        axios.get('http://localhost:5000/api/users?role=professeur'),
        axios.get('http://localhost:5000/api/emplois'),
      ]);
      setClasses(classesRes.data);
      setProfesseurs(profsRes.data);
      setEmplois(emploisRes.data);
    } catch (error) {
      alert('خطأ في تحميل البيانات');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.file) {
      alert('الرجاء اختيار ملف');
      return;
    }

    const data = new FormData();
    data.append('startTime', form.startTime);
    data.append('endTime', form.endTime);
    data.append('file', form.file);
    if (form.classId) data.append('classId', form.classId);
    if (form.professeurId) data.append('professeurId', form.professeurId);

    try {
      await axios.post('http://localhost:5000/api/emplois', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({
        startTime: '',
        endTime: '',
        file: null,
        classId: '',
        professeurId: '',
      });
      fetchData();
    } catch (error) {
      alert('خطأ أثناء رفع جدول الحصص');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا الجدول؟')) return;
    try {
      await axios.delete(`http://localhost:5000/api/emplois/${id}`);
      fetchData();
    } catch (error) {
      alert('خطأ في حذف الجدول');
    }
  };

  return (
    <div className="container p-4">
      <h2>Gestion Emploi Du Temps</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <label>Start Time:</label>
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        <label>End Time:</label>
        <input
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        <label>Upload File (image/pdf):</label>
        <input
          type="file"
          name="file"
          accept="image/*,application/pdf"
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        <label>Class (Stagiaires):</label>
        <select
          name="classId"
          value={form.classId}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">-- Select Class --</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Professeur:</label>
        <select
          name="professeurId"
          value={form.professeurId}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">-- Select Professeur --</option>
          {professeurs.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>

      <h3>Liste des Emplois du Temps</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Début</th>
            <th>Fin</th>
            <th>Fichier</th>
            <th>Classe</th>
            <th>Professeur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emplois.map(e => (
            <tr key={e.id}>
              <td>{new Date(e.startTime).toLocaleString()}</td>
              <td>{new Date(e.endTime).toLocaleString()}</td>
              <td>
                <a href={`http://localhost:5000/uploads/${e.file}`} target="_blank" rel="noreferrer">
                  Voir
                </a>
              </td>
              <td>{e.classe?.name || '-'}</td>
              <td>{e.professeur?.name || '-'}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmploiDuTemps;
