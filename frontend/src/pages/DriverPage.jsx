import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../state/AuthContext';
import SiteShell from '../components/SiteShell';

export default function DriverPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    if (!declarationForm.description.trim()) {
      setPageError('Veuillez décrire la situation');
      return;
    }
    try {
      await client.post('/driver/declarations', declarationForm);
      setDeclarationForm({ type: 'FINE', description: '' });
      setSuccessMessage('Déclaration envoyée au chef du parc');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const createMaintenance = async (e) => {
    e.preventDefault();
    if (!maintenanceForm.description.trim() || !maintenanceForm.vehicleId) {
      setPageError('Veuillez remplir tous les champs');
      return;
    }
    try {
      await client.post('/driver/maintenance', {
        ...maintenanceForm,
        vehicleId: Number(maintenanceForm.vehicleId)
      });
      setMaintenanceForm({ requestType: 'ENTRETIEN', description: '', vehicleId: '' });
      setSuccessMessage('Demande d\'entretien envoyée');
      setTimeout(() => setSuccessMessage(''), 3000);
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
      {!loading && successMessage && <div className="card" style={{backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724'}}>{successMessage}</div>}
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
          {missions.length === 0 ? (
            <p style={{color: '#999'}}>Aucune mission assignée</p>
          ) : (
            <ul>
              {missions.map((m) => (
                <li key={m.id}>
                  <strong>{m.title}</strong><br/>
                  🎯 Destination: {m.destination}<br/>
                  📋 {m.description ? m.description : '-'}<br/>
                  📅 {new Date(m.startDate).toLocaleDateString()} → {new Date(m.endDate).toLocaleDateString()}<br/>
                  🚗 Véhicule: {m.vehicle ? `${m.vehicle.brand} ${m.vehicle.plateNumber}` : '-'}<br/>
                  <span style={{color: m.status === 'PLANNED' ? 'orange' : m.status === 'IN_PROGRESS' ? 'blue' : 'green'}}>
                    {m.status === 'PLANNED' ? '⏳ Planifiée' : m.status === 'IN_PROGRESS' ? '▶ En cours' : '✓ Complétée'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Mes déclarations</h3>
          {declarations.length === 0 ? (
            <p style={{color: '#999'}}>Aucune déclaration</p>
          ) : (
            <ul>
              {declarations.map((d) => (
                <li key={d.id}>
                  <strong>{d.type === 'FINE' ? '⚠️ Amende' : '🚨 Accident'}</strong><br/>
                  {d.description}<br/>
                  <small>Commentaire chef: {d.managerComment ? d.managerComment : 'En attente'}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid two">
        <form className="card" onSubmit={createDeclaration}>
          <h3>Déclarer amende / accident</h3>
          <select value={declarationForm.type} onChange={(e) => setDeclarationForm({ ...declarationForm, type: e.target.value })} required>
            <option value="FINE">⚠️ Amende</option>
            <option value="ACCIDENT">🚨 Accident</option>
          </select>
          <textarea placeholder="Décrivez la situation en détail..." value={declarationForm.description} onChange={(e) => setDeclarationForm({ ...declarationForm, description: e.target.value })} required />
          <button type="submit">Envoyer déclaration</button>
        </form>

        <form className="card" onSubmit={createMaintenance}>
          <h3>Demande d'entretien / maintenance</h3>
          <select value={maintenanceForm.requestType} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, requestType: e.target.value })} required>
            <option value="ENTRETIEN">🔧 Entretien</option>
            <option value="REPARATION">🛠️ Réparation</option>
            <option value="INSPECTION">🔍 Inspection</option>
          </select>
          <textarea placeholder="Décrivez le problème..." value={maintenanceForm.description} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })} required />
          <select value={maintenanceForm.vehicleId} onChange={(e) => setMaintenanceForm({ ...maintenanceForm, vehicleId: e.target.value })} required>
            <option value="">Choisir véhicule</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plateNumber})</option>)}
          </select>
          <button type="submit">Envoyer demande</button>
        </form>
      </section>

      <section className="grid two">
        <div className="card">
          <h3>Demandes de maintenance</h3>
          {maintenance.length === 0 ? (
            <p style={{color: '#999'}}>Aucune demande</p>
          ) : (
            <ul>
              {maintenance.map((m) => (
                <li key={m.id}>
                  <strong>{m.requestType}</strong><br/>
                  {m.description}<br/>
                  <span style={{color: m.status === 'PENDING' ? 'orange' : m.status === 'APPROVED' ? 'blue' : 'green'}}>
                    {m.status === 'PENDING' ? '⏳ En attente' : m.status === 'APPROVED' ? '📋 Approuvée' : '✓ Complétée'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Véhicules disponibles</h3>
          {vehicles.length === 0 ? (
            <p style={{color: '#999'}}>Aucun véhicule disponible</p>
          ) : (
            <ul>
              {vehicles.map((v) => (
                <li key={v.id}>
                  <strong>{v.brand} {v.model}</strong><br/>
                  📋 Matricule: {v.plateNumber}<br/>
                  <span style={{color: v.status === 'AVAILABLE' ? 'green' : v.status === 'IN_USE' ? 'orange' : 'red'}}>
                    {v.status === 'AVAILABLE' ? '✓ Disponible' : v.status === 'IN_USE' ? '⏺ En service' : '🔧 En maintenance'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
    </SiteShell>
  );
}
