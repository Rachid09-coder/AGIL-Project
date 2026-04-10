import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../state/AuthContext';
import SiteShell from '../components/SiteShell';

export default function DriverPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [missions, setMissions] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [declarationForm, setDeclarationForm] = useState({ type: 'FINE', description: '' });
  const [maintenanceForm, setMaintenanceForm] = useState({ requestType: 'ENTRETIEN', description: '', vehicleId: '' });

  const extractError = (error) => error?.response?.data?.message || 'Une erreur est survenue.';

  const loadData = async () => {
    setPageError('');
    try {
      const [m, d, mr, v] = await Promise.all([
        client.get('/driver/missions'),
        client.get('/driver/declarations'),
        client.get('/driver/maintenance'),
        client.get('/driver/vehicles')
      ]);

      setMissions(m.data);
      setDeclarations(d.data);
      setMaintenance(mr.data);
      setVehicles(v.data);
    } catch (error) {
      setPageError(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createDeclaration = async (e) => {
    e.preventDefault();
    try {
      await client.post('/driver/declarations', declarationForm);
      setDeclarationForm({ type: 'FINE', description: '' });
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const createMaintenance = async (e) => {
    e.preventDefault();
    try {
      await client.post('/driver/maintenance', {
        ...maintenanceForm,
        vehicleId: Number(maintenanceForm.vehicleId)
      });
      setMaintenanceForm({ requestType: 'ENTRETIEN', description: '', vehicleId: '' });
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  return (
    <SiteShell>
    <div className="container wide dashboard-wrap">
      {loading && <div className="card">Chargement des données...</div>}
      {!loading && pageError && <div className="card error-banner">{pageError}</div>}
      <header className="topbar">
        <div>
          <h1>Espace Chauffeur</h1>
          <p>{user?.fullName}</p>
        </div>
        <button onClick={logout}>Déconnexion</button>
      </header>

      <section className="grid two">
        <div className="card">
          <h3>Mes missions</h3>
          <ul>{missions.map((m) => <li key={m.id}>{m.title} - {m.destination} - {m.status}</li>)}</ul>
        </div>

        <div className="card">
          <h3>Mes déclarations</h3>
          <ul>{declarations.map((d) => <li key={d.id}>{d.type} - {d.description}</li>)}</ul>
        </div>
      </section>

      <section className="grid two">
        <form className="card" onSubmit={createDeclaration}>
          <h3>Déclarer amende / accident</h3>
          <select value={declarationForm.type} onChange={(e) => setDeclarationForm({ ...declarationForm, type: e.target.value })}>
            <option value="FINE">Amende</option>
            <option value="ACCIDENT">Accident</option>
          </select>
          <textarea placeholder="Description" value={declarationForm.description} onChange={(e) => setDeclarationForm({ ...declarationForm, description: e.target.value })} required />
          <button type="submit">Envoyer</button>
        </form>

        <form className="card" onSubmit={createMaintenance}>
          <h3>Demande d'entretien / maintenance</h3>
          <input placeholder="Type" value={maintenanceForm.requestType} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, requestType: e.target.value })} required />
          <textarea placeholder="Description" value={maintenanceForm.description} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })} required />
          <select value={maintenanceForm.vehicleId} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, vehicleId: e.target.value })} required>
            <option value="">Choisir véhicule</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plateNumber}</option>)}
          </select>
          <button type="submit">Envoyer</button>
        </form>
      </section>

      <section className="card">
        <h3>Mes demandes de maintenance</h3>
        <ul>{maintenance.map((m) => <li key={m.id}>{m.requestType} - {m.status}</li>)}</ul>
      </section>
    </div>
    </SiteShell>
  );
}
