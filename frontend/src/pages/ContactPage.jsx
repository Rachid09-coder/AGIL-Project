import SiteShell from '../components/SiteShell';

export default function ContactPage() {
  return (
    <SiteShell>
      <div className="container">
        <section className="card">
          <h1 className="auth-title">CONTACT</h1>
          <div className="contact-grid">
            <div>
              <h3>Support technique</h3>
              <p>Email: support@sndp.tn</p>
              <p>Tél: +216 70 000 001</p>
            </div>
            <div>
              <h3>Service client</h3>
              <p>Email: client@sndp.tn</p>
              <p>Tél: +216 70 000 002</p>
            </div>
            <div>
              <h3>Adresse</h3>
              <p>SNDP, Tunis, Tunisie</p>
              <p>Lundi - Vendredi: 08:00 - 17:00</p>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
