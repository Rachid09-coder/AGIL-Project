import SiteShell from '../components/SiteShell';

export default function AdvantagesPage() {
  return (
    <SiteShell>
      <div className="container">
        <section className="card">
          <h1 className="auth-title">AVANTAGES</h1>
          <ul className="feature-list">
            <li>Suivi des missions et des véhicules en temps réel.</li>
            <li>Gestion des chauffeurs, profils et affectations depuis un seul espace.</li>
            <li>Traitement rapide des déclarations (amendes/accidents) et maintenance.</li>
            <li>Statistiques opérationnelles pour la prise de décision.</li>
            <li>Accès sécurisé par rôles (chef de parc / chauffeur).</li>
          </ul>
        </section>
      </div>
    </SiteShell>
  );
}
