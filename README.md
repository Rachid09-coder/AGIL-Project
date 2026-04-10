# SNDP Fleet - Java + React + MySQL

Application MVP pour l'automatisation des processus métiers du parc SNDP.

## Modules couverts

- Authentification sécurisée (JWT)
- Espace Chef du parc
  - Profil
  - Gestion véhicules
  - Gestion missions
  - Consultation chauffeurs
  - Consultation déclarations (amendes / accidents)
  - Statistiques
- Espace Chauffeur
  - Consultation missions
  - Déclaration amendes / accidents
  - Gestion demandes entretien / maintenance

## Stack technique

- Backend: Java 21, Spring Boot 3, Spring Security, Spring Data JPA
- Frontend: React + Vite
- Base de données: MySQL 8 (Docker)

## Lancement

### 1) Démarrer MySQL

Depuis la racine du projet:

```bash
docker compose up -d
```

### 2) Lancer le backend

```bash
cd backend
mvn spring-boot:run
```

API disponible sur `http://localhost:8080`.

Si le port `8080` est déjà utilisé sur votre machine, lancez le backend sur `8081`:

```bash
mvn -s settings.xml -Dspring-boot.run.profiles=local -Dspring-boot.run.arguments=--server.port=8081 spring-boot:run
```

Pour lancer le backend avec MySQL et des paramètres explicites (Windows PowerShell):

```powershell
cd backend
.\run-mysql.ps1 -DbUser "root" -DbPassword "root" -ServerPort 8081
```

Cas XAMPP (MySQL local via `c:\xampp`):

```powershell
cd backend
.\run-mysql.ps1 -ServerPort 8081
```

Ce mode utilise par défaut `root` avec mot de passe vide (configuration classique XAMPP).

Exemple avec un utilisateur dédié:

```powershell
cd backend
.\run-mysql.ps1 -DbUser "sndp" -DbPassword "votre_mot_de_passe" -DbName "sndp_fleet" -ServerPort 8081
```

Le frontend lit l'URL API depuis `frontend/.env.local` (`VITE_API_URL`).

Comptes initiaux:
- Chef du parc: `manager` / `manager123`
- Chauffeur: `driver` / `driver123`

### 3) Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

Application disponible sur `http://localhost:5173`.

## Démarrage automatique (Windows PowerShell)

Depuis la racine du projet:

```powershell
.\start-all.ps1
```

Le script lance:
- Backend: `http://localhost:8081` (profil local H2)
- Frontend: `http://localhost:5173`
- Logs: dossier `.run` (`backend.log`, `frontend.log`)
- Scripts internes: `scripts/start-backend.ps1`, `scripts/start-frontend.ps1`

Pour arrêter:

```powershell
.\stop-all.ps1
```

## Endpoints principaux

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Manager
  - `GET/PUT /api/manager/profile`
  - `GET/POST/PUT/DELETE /api/manager/drivers`
  - `GET/POST/PUT/DELETE /api/manager/vehicles`
  - `GET/POST/PUT/DELETE /api/manager/missions`
  - `GET /api/manager/declarations`
  - `PUT /api/manager/declarations/{id}/review`
  - `DELETE /api/manager/declarations/{id}`
  - `GET /api/stats`
- Driver
  - `GET /api/driver/missions`
  - `GET /api/driver/declarations`
  - `POST /api/driver/declarations`
  - `GET /api/driver/maintenance`
  - `POST /api/driver/maintenance`
  - `GET /api/driver/vehicles`
