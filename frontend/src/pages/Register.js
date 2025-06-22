// صفحة تسجيل مستخدم جديد

import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "stagiaire", // القيم الممكنة: stagiaire, professeur, admin
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage("✅ Enregistrement réussi !");
      console.log("Utilisateur:", res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage("❌ Une erreur s'est produite.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Créer un compte</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label>Mot de passe:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange} 
            required 
          />
        </div>

        <div>
          <label>Rôle:</label>
          <select 
            name="role" 
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="stagiaire">Stagiaire</option>
            <option value="professeur">Professeur</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
