import { NavLink } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export default function SiteShell({ children }) {
  const { user } = useAuth();
  const espaceClientPath = user?.role === 'MANAGER' ? '/manager' : user?.role === 'DRIVER' ? '/driver' : '/login';

  return (
    <div className="ag-shell">
      <header className="ag-header">
        <div className="ag-brand">
          <img
            src="/image.png"
            alt="Agil Energy"
            className="ag-logo"
          />
          <div className="ag-brand-text">AGILIS</div>
        </div>
        <nav className="ag-nav">
          <NavLink to="/" end>ACCUEIL</NavLink>
          <NavLink to="/avantages">AVANTAGES</NavLink>
          <NavLink to={espaceClientPath}>ESPACE CLIENT</NavLink>
          <NavLink to="/contact">CONTACT</NavLink>
        </nav>
      </header>

      <main className="ag-main">{children}</main>

      <footer className="ag-footer">
        <div>
          <strong>Adresse :</strong> Société Nationale de Distribution des Produits SNDP - Tunis
        </div>
        <div>
          <strong>TEL :</strong> +216 70 000 000
        </div>
        <div>
          <strong>Email :</strong> contact@sndp.tn
        </div>
        <div>
          <strong>Web :</strong> www.sndp.tn
        </div>
      </footer>
    </div>
  );
}
