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
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setMessageType("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage("✅ Enregistrement réussi !");
      setMessageType("success");
      console.log("Utilisateur:", res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage("❌ Une erreur s'est produite.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
  <h2 className="register-title">Créer un compte</h2>
  
  {message && (
    <p className={`register-message ${messageType === 'success' ? 'success' : 'error'}`}>
      {message}
    </p>
  )}
  
  <form onSubmit={handleSubmit} className="register-form">
    <div className="register-field">
      <label className="register-label" htmlFor="register-name">Nom:</label>
      <input 
        type="text" 
        id="register-name"
        name="name" 
        value={formData.name}
        onChange={handleChange} 
        className="register-input"
        placeholder="Entrez votre nom"
        required 
      />
    </div>

    <div className="register-field">
      <label className="register-label" htmlFor="register-email">Email:</label>
      <input 
        type="email" 
        id="register-email"
        name="email" 
        value={formData.email}
        onChange={handleChange} 
        className="register-input"
        placeholder="votre@email.com"
        required 
      />
    </div>

    <div className="register-field">
      <label className="register-label" htmlFor="register-password">Mot de passe:</label>
      <input 
        type="password" 
        id="register-password"
        name="password" 
        value={formData.password}
        onChange={handleChange} 
        className="register-input"
        placeholder="••••••••"
        required 
      />
    </div>

    <div className="register-field">
      <label className="register-label" htmlFor="register-role">Rôle:</label>
      <select 
        id="register-role"
        name="role" 
        value={formData.role}
        onChange={handleChange}
        className="register-select"
        required
      >
        <option value="stagiaire">Stagiaire</option>
        <option value="professeur">Professeur</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <button 
      type="submit" 
      className={`register-submit ${isLoading ? 'loading' : ''}`}
      disabled={isLoading}
    >
      {isLoading ? 'Inscription...' : 'S\'inscrire'}
    </button>
  </form>
</div>
  );
};

export default Register;
