// صفحة تسجيل مستخدم جديد

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "stagiaire",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Simple validation function
  const validate = () => {
    if (!formData.name.trim()) {
      toast.error("Le nom est requis.");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("L'email est requis.");
      return false;
    }
    // Simple email regex
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      toast.error("L'email n'est pas valide.");
      return false;
    }
    if (!formData.password) {
      toast.error("Le mot de passe est requis.");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      toast.success("Enregistrement réussi !");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "stagiaire",
      });
      console.log("Utilisateur:", res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Une erreur s'est produite.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <h2 className="register-title">Créer un compte</h2>
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
