import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('ahmed@gmail.com');
  const [password, setPassword] = useState('ahmed@gmail.com');
  const [error, setError] = useState('');

  // Simple email regex for validation
  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    if (!validateEmail(email)) {
      setError('Email invalide');
      toast.error('Email invalide');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.user, res.data.token);
      toast.success('Connexion réussie !');
      // Redirect based on role
      if (res.data.user.role === 'admin') navigate('/admin');
      else if (res.data.user.role === 'professeur') navigate('/professeur');
      else navigate('/stagiaire');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
      toast.error('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-card">
        <h2 className="auth-title">Connexion</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="votre@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button">
            Se connecter
          </button>
          <div className="auth-footer">
            <a href="#forgot-password" className="auth-link">Mot de passe oublié ?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
