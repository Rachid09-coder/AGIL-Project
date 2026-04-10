import { Link } from 'react-router-dom';
import SiteShell from '../components/SiteShell';

export default function HomePage() {
  return (
    <SiteShell>
      <div className="container">
        <section className="card hero-card">
          <h1 className="auth-title">PLATEFORME DE GESTION DU PARC</h1>
          <p className="hero-text">
            Solution centralisée pour piloter les missions, véhicules, chauffeurs et déclarations en temps réel.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-link">ACCÉDER À L’ESPACE CLIENT</Link>
            <Link to="/avantages" className="btn-link secondary">VOIR LES AVANTAGES</Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
