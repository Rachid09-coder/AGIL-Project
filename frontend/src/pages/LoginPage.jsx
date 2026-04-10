import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../state/AuthContext';
import SiteShell from '../components/SiteShell';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'DRIVER'
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? form
        : { username: form.username, password: form.password };

      const { data } = await client.post(endpoint, payload);
      login(data);
      navigate(data.role === 'MANAGER' ? '/manager' : '/driver');
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur d\'authentification');
    }
  };

  return (
    <SiteShell>
      <div className="container auth-wrap">
        <section className="card auth-card">
          <h1 className="auth-title">ESPACE CLIENT</h1>
          <h2 className="auth-subtitle">{isRegister ? 'Créer un compte' : 'Connexion sécurisée'}</h2>

          <form onSubmit={submit}>
            <label>Email / Utilisateur</label>
            <input placeholder="Nom d'utilisateur ou email" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />

            <label>Mot de passe</label>
            <input type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

            {isRegister && (
              <>
                <label>Nom complet</label>
                <input placeholder="Nom complet" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />

                <label>Email</label>
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

                <label>Rôle</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="DRIVER">Chauffeur</option>
                  <option value="MANAGER">Chef de parc</option>
                </select>
              </>
            )}

            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-primary">{isRegister ? 'S’INSCRIRE' : 'SE CONNECTER'}</button>
          </form>

          <div className="auth-links">
            <button className="linkBtn" onClick={() => setIsRegister((prev) => !prev)}>
              {isRegister ? 'Déjà inscrit ? Se connecter' : 'Nouveau compte ? S’inscrire'}
            </button>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
