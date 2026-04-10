import { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../state/AuthContext';
import SiteShell from '../components/SiteShell';

export default function ManagerPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', password: '' });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [missions, setMissions] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [stats, setStats] = useState({});
  const [editingMissionId, setEditingMissionId] = useState(null);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [driverForm, setDriverForm] = useState({ username: '', fullName: '', email: '', password: '' });
  const [reviewComments, setReviewComments] = useState({});
  const [vehicleForm, setVehicleForm] = useState({ plateNumber: '', brand: '', model: '', status: 'AVAILABLE' });
  const [missionForm, setMissionForm] = useState({ title: '', description: '', destination: '', startDate: '', endDate: '', status: 'PLANNED', driverId: '', vehicleId: '' });
  const [searchVehicle, setSearchVehicle] = useState('');
  const [searchDriver, setSearchDriver] = useState('');
  const [searchMission, setSearchMission] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const extractError = (error) => error?.response?.data?.message || 'Une erreur est survenue.';

  const loadData = async () => {
    setPageError('');
    try {
      const [p, v, d, m, dec, s] = await Promise.all([
        client.get('/manager/profile'),
        client.get('/manager/vehicles'),
        client.get('/manager/drivers'),
        client.get('/manager/missions'),
        client.get('/manager/declarations'),
        client.get('/stats')
      ]);

      setProfileForm({ fullName: p.data.fullName || '', email: p.data.email || '', password: '' });
      setVehicles(v.data);
      setDrivers(d.data);
      setMissions(m.data);
      setDeclarations(dec.data);
      setReviewComments(Object.fromEntries(dec.data.map((item) => [item.id, item.managerComment || ''])));
      setStats(s.data);
    } catch (error) {
      setPageError(extractError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleForm.plateNumber.trim() || !vehicleForm.brand.trim() || !vehicleForm.model.trim()) {
      setPageError('Veuillez remplir tous les champs du véhicule');
      return;
    }
    try {
      if (editingVehicleId) {
        await client.put(`/manager/vehicles/${editingVehicleId}`, vehicleForm);
        setSuccessMessage('Véhicule mis à jour avec succès');
      } else {
        await client.post('/manager/vehicles', vehicleForm);
        setSuccessMessage('Véhicule créé avec succès');
      }
      setEditingVehicleId(null);
      setVehicleForm({ plateNumber: '', brand: '', model: '', status: 'AVAILABLE' });
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const editVehicle = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setVehicleForm({
      plateNumber: vehicle.plateNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      status: vehicle.status
    });
  };

  const createMission = async (e) => {
    e.preventDefault();
    if (!missionForm.title.trim() || !missionForm.destination.trim() || !missionForm.driverId || !missionForm.vehicleId) {
      setPageError('Veuillez remplir tous les champs requis de la mission');
      return;
    }
    if (new Date(missionForm.startDate) >= new Date(missionForm.endDate)) {
      setPageError('La date de fin doit être après la date de début');
      return;
    }
    const payload = {
      ...missionForm,
      driverId: Number(missionForm.driverId),
      vehicleId: Number(missionForm.vehicleId)
    };

    try {
      if (editingMissionId) {
        await client.put(`/manager/missions/${editingMissionId}`, payload);
        setSuccessMessage('Mission mise à jour avec succès');
      } else {
        await client.post('/manager/missions', payload);
        setSuccessMessage('Mission créée avec succès');
      }

      setEditingMissionId(null);
      setMissionForm({ title: '', description: '', destination: '', startDate: '', endDate: '', status: 'PLANNED', driverId: '', vehicleId: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const editMission = (mission) => {
    setEditingMissionId(mission.id);
    setMissionForm({
      title: mission.title,
      description: mission.description || '',
      destination: mission.destination,
      startDate: mission.startDate,
      endDate: mission.endDate,
      status: mission.status,
      driverId: String(mission.driver?.id || ''),
      vehicleId: String(mission.vehicle?.id || '')
    });
  };

  const deleteMission = async (id) => {
    try {
      await client.delete(`/manager/missions/${id}`);
      if (editingMissionId === id) {
        setEditingMissionId(null);
        setMissionForm({ title: '', description: '', destination: '', startDate: '', endDate: '', status: 'PLANNED', driverId: '', vehicleId: '' });
      }
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const createDriver = async (e) => {
    e.preventDefault();
    if (!driverForm.username.trim() || !driverForm.fullName.trim() || !driverForm.email.trim()) {
      setPageError('Veuillez remplir tous les champs requis');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(driverForm.email)) {
      setPageError('Email invalide');
      return;
    }
    try {
      if (editingDriverId) {
        await client.put(`/manager/drivers/${editingDriverId}`, driverForm);
        setSuccessMessage('Chauffeur mis à jour avec succès');
      } else {
        await client.post('/manager/drivers', driverForm);
        setSuccessMessage('Chauffeur créé avec succès');
      }
      setEditingDriverId(null);
      setDriverForm({ username: '', fullName: '', email: '', password: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const editDriver = (driver) => {
    setEditingDriverId(driver.id);
    setDriverForm({
      username: driver.username,
      fullName: driver.fullName,
      email: driver.email,
      password: ''
    });
  };

  const deleteDriver = async (id) => {
    try {
      await client.delete(`/manager/drivers/${id}`);
      if (editingDriverId === id) {
        setEditingDriverId(null);
        setDriverForm({ username: '', fullName: '', email: '', password: '' });
      }
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await client.delete(`/manager/vehicles/${id}`);
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.fullName.trim() || !profileForm.email.trim()) {
      setPageError('Veuillez remplir tous les champs requis');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileForm.email)) {
      setPageError('Email invalide');
      return;
    }
    try {
      await client.put('/manager/profile', profileForm);
      setProfileForm((prev) => ({ ...prev, password: '' }));
      setSuccessMessage('Profil mis à jour avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const reviewDeclaration = async (id) => {
    try {
      await client.put(`/manager/declarations/${id}/review`, {
        managerComment: reviewComments[id] || ''
      });
      loadData();
    } catch (error) {
      setPageError(extractError(error));
    }
  };

  const deleteDeclaration = async (id) => {
    try {
      await client.delete(`/manager/declarations/${id}`);
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
          <h1>Espace Chef du parc</h1>
          <p>{user?.fullName}</p>
        </div>
        <button onClick={logout}>Déconnexion</button>
      </header>

      <section className="grid stats">
        <div className="card"><h3>Chauffeurs</h3><p>{stats.drivers || 0}</p></div>
        <div className="card"><h3>Véhicules</h3><p>{stats.vehicles || 0}</p></div>
        <div className="card"><h3>Missions</h3><p>{stats.missions || 0}</p></div>
        <div className="card"><h3>Déclarations</h3><p>{stats.declarations || 0}</p></div>
        <div className="card"><h3>Maint. en attente</h3><p>{stats.pendingMaintenance || 0}</p></div>
      </section>

      <section className="grid two">
        <form className="card" onSubmit={updateProfile}>
          <h3>Mon profil</h3>
          <input placeholder="Nom complet" value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} required />
          <input type="email" placeholder="Email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required />
          <input type="password" placeholder="Nouveau mot de passe (optionnel)" value={profileForm.password} onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} />
          <button type="submit">Mettre à jour</button>
        </form>

        <form className="card" onSubmit={createDriver}>
          <h3>{editingDriverId ? 'Modifier chauffeur' : 'Ajouter chauffeur'}</h3>
          <input placeholder="Nom d'utilisateur" value={driverForm.username} onChange={(e) => setDriverForm({ ...driverForm, username: e.target.value })} required />
          <input placeholder="Nom complet" value={driverForm.fullName} onChange={(e) => setDriverForm({ ...driverForm, fullName: e.target.value })} required />
          <input type="email" placeholder="Email" value={driverForm.email} onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })} required />
          <input type="password" placeholder={editingDriverId ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe (optionnel)'} value={driverForm.password} onChange={(e) => setDriverForm({ ...driverForm, password: e.target.value })} />
          <button type="submit">{editingDriverId ? 'Mettre à jour chauffeur' : 'Créer chauffeur'}</button>
          {editingDriverId && <button type="button" onClick={() => { setEditingDriverId(null); setDriverForm({ username: '', fullName: '', email: '', password: '' }); }}>Annuler édition</button>}
        </form>
      </section>

      <section className="grid two">
        <form className="card" onSubmit={createVehicle}>
          <h3>{editingVehicleId ? 'Modifier véhicule' : 'Ajouter véhicule'}</h3>
          <input placeholder="Matricule" value={vehicleForm.plateNumber} onChange={(e) => setVehicleForm({ ...vehicleForm, plateNumber: e.target.value })} required />
          <input placeholder="Marque" value={vehicleForm.brand} onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })} required />
          <input placeholder="Modèle" value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} required />
          <select value={vehicleForm.status} onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })} required>
            <option value="AVAILABLE">Disponible</option>
            <option value="IN_USE">En service</option>
            <option value="MAINTENANCE">En maintenance</option>
          </select>
          <button type="submit">{editingVehicleId ? 'Mettre à jour véhicule' : 'Créer véhicule'}</button>
          {editingVehicleId && <button type="button" onClick={() => { setEditingVehicleId(null); setVehicleForm({ plateNumber: '', brand: '', model: '', status: 'AVAILABLE' }); }}>Annuler édition</button>}
        </form>

        <form className="card" onSubmit={createMission}>
          <h3>{editingMissionId ? 'Modifier mission' : 'Ajouter mission'}</h3>
          <input placeholder="Titre" value={missionForm.title} onChange={(e) => setMissionForm({ ...missionForm, title: e.target.value })} required />
          <input placeholder="Destination" value={missionForm.destination} onChange={(e) => setMissionForm({ ...missionForm, destination: e.target.value })} required />
          <input placeholder="Description" value={missionForm.description} onChange={(e) => setMissionForm({ ...missionForm, description: e.target.value })} />
          <input type="date" value={missionForm.startDate} onChange={(e) => setMissionForm({ ...missionForm, startDate: e.target.value })} required />
          <input type="date" value={missionForm.endDate} onChange={(e) => setMissionForm({ ...missionForm, endDate: e.target.value })} required />
          <select value={missionForm.status} onChange={(e) => setMissionForm({ ...missionForm, status: e.target.value })} required>
            <option value="PLANNED">Planifiée</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Complétée</option>
          </select>
          <select value={missionForm.driverId} onChange={(e) => setMissionForm({ ...missionForm, driverId: e.target.value })} required>
            <option value="">Choisir chauffeur</option>
            {drivers.map((d) => <option key={d.id} value={d.id}>{d.fullName}</option>)}
          </select>
          <select value={missionForm.vehicleId} onChange={(e) => setMissionForm({ ...missionForm, vehicleId: e.target.value })} required>
            <option value="">Choisir véhicule</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.brand} {v.plateNumber} - ({v.status})</option>)}
          </select>
          <button type="submit">{editingMissionId ? 'Mettre à jour mission' : 'Créer mission'}</button>
          {editingMissionId && <button type="button" onClick={() => { setEditingMissionId(null); setMissionForm({ title: '', description: '', destination: '', startDate: '', endDate: '', status: 'PLANNED', driverId: '', vehicleId: '' }); }}>Annuler édition</button>}
        </form>
      </section>

      <section className="grid two">
        <div className="card">
          <h3>Véhicules</h3>
          <input type="text" placeholder="Rechercher véhicule..." value={searchVehicle} onChange={(e) => setSearchVehicle(e.target.value)} style={{marginBottom: '10px', width: '100%', padding: '8px'}} />
          <ul>
            {vehicles.filter(v => v.plateNumber.toLowerCase().includes(searchVehicle.toLowerCase()) || v.brand.toLowerCase().includes(searchVehicle.toLowerCase())).map((v) => (
              <li key={v.id}>
                <strong>{v.brand} {v.model}</strong> - {v.plateNumber} - <span style={{color: v.status === 'AVAILABLE' ? 'green' : v.status === 'IN_USE' ? 'orange' : 'red'}}>{v.status === 'AVAILABLE' ? 'Disponible' : v.status === 'IN_USE' ? 'En service' : 'En maintenance'}</span>
                <div>
                  <button type="button" onClick={() => editVehicle(v)}>Modifier</button>
                  <button type="button" onClick={() => deleteVehicle(v.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Missions</h3>
          <input type="text" placeholder="Rechercher mission..." value={searchMission} onChange={(e) => setSearchMission(e.target.value)} style={{marginBottom: '10px', width: '100%', padding: '8px'}} />
          <ul>
            {missions.filter(m => m.title.toLowerCase().includes(searchMission.toLowerCase()) || m.destination.toLowerCase().includes(searchMission.toLowerCase())).map((m) => (
              <li key={m.id}>
                <strong>{m.title}</strong> → {m.destination} - {m.status === 'PLANNED' ? 'Planifiée' : m.status === 'IN_PROGRESS' ? 'En cours' : 'Complétée'}
                <div>
                  <button type="button" onClick={() => editMission(m)}>Modifier</button>
                  <button type="button" onClick={() => deleteMission(m.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <h3>Chauffeurs</h3>
        <input type="text" placeholder="Rechercher chauffeur..." value={searchDriver} onChange={(e) => setSearchDriver(e.target.value)} style={{marginBottom: '10px', width: '100%', padding: '8px'}} />
        <ul>
          {drivers.filter(d => d.fullName.toLowerCase().includes(searchDriver.toLowerCase()) || d.username.toLowerCase().includes(searchDriver.toLowerCase())).map((d) => (
            <li key={d.id}>
              <strong>{d.fullName}</strong> ({d.username}) - {d.email}
              <div>
                <button type="button" onClick={() => editDriver(d)}>Modifier</button>
                <button type="button" onClick={() => deleteDriver(d.id)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Déclarations chauffeurs (amendes / accidents)</h3>
        <ul>
          {declarations.map((d) => (
            <li key={d.id}>
              <div>{d.type} - {d.description}</div>
              <textarea
                placeholder="Commentaire chef du parc"
                value={reviewComments[d.id] || ''}
                onChange={(e) => setReviewComments({ ...reviewComments, [d.id]: e.target.value })}
              />
              <div>
                <button type="button" onClick={() => reviewDeclaration(d.id)}>Enregistrer commentaire</button>
                <button type="button" onClick={() => deleteDeclaration(d.id)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
    </SiteShell>
  );
}
