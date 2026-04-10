$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $root 'backend'
$frontendPath = Join-Path $root 'frontend'
$runPath = Join-Path $root '.run'
$scriptsPath = Join-Path $root 'scripts'
$mavenHome = Join-Path $root '.tools\apache-maven-3.9.9'
$javaHome = 'C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot'
$nodeDir = 'C:\Program Files\nodejs'

if (-not (Test-Path $backendPath)) { throw "Dossier backend introuvable: $backendPath" }
if (-not (Test-Path $frontendPath)) { throw "Dossier frontend introuvable: $frontendPath" }
if (-not (Test-Path (Join-Path $mavenHome 'bin\mvn.cmd'))) { throw "Maven local introuvable: $mavenHome" }
if (-not (Test-Path (Join-Path $javaHome 'bin\java.exe'))) { throw "Java 21 introuvable: $javaHome" }
if (-not (Test-Path (Join-Path $nodeDir 'npm.cmd'))) { throw "Node.js introuvable: $nodeDir" }
if (-not (Test-Path (Join-Path $scriptsPath 'start-backend.ps1'))) { throw "Script introuvable: scripts/start-backend.ps1" }
if (-not (Test-Path (Join-Path $scriptsPath 'start-frontend.ps1'))) { throw "Script introuvable: scripts/start-frontend.ps1" }
if (-not (Test-Path $runPath)) { New-Item -ItemType Directory -Path $runPath | Out-Null }

$backendLog = Join-Path $runPath 'backend.log'
$backendErrLog = Join-Path $runPath 'backend.err.log'
$frontendLog = Join-Path $runPath 'frontend.log'
$frontendErrLog = Join-Path $runPath 'frontend.err.log'
$backendPidFile = Join-Path $runPath 'backend.pid'
$frontendPidFile = Join-Path $runPath 'frontend.pid'
$siteUrl = 'http://localhost:5173'

Write-Host 'Démarrage backend (8081)...'
$backendScriptPath = Join-Path $scriptsPath 'start-backend.ps1'
$backendProc = Start-Process powershell -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"{0}"' -f $backendScriptPath)) -RedirectStandardOutput $backendLog -RedirectStandardError $backendErrLog -PassThru
$backendProc.Id | Set-Content -Path $backendPidFile

Write-Host 'En attente du démarrage du backend (15 secondes)...'
Start-Sleep -Seconds 15

Write-Host 'Démarrage frontend (5173)...'
$frontendScriptPath = Join-Path $scriptsPath 'start-frontend.ps1'
$frontendProc = Start-Process powershell -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ('"{0}"' -f $frontendScriptPath)) -RedirectStandardOutput $frontendLog -RedirectStandardError $frontendErrLog -PassThru
$frontendProc.Id | Set-Content -Path $frontendPidFile

Write-Host 'Services lancés:'
Write-Host ' - Backend:  http://localhost:8081'
Write-Host ' - Frontend: http://localhost:5173'
Write-Host " - Logs backend:  $backendLog"
Write-Host " - Logs frontend: $frontendLog"
Write-Host 'Utilisez stop-all.ps1 pour arrêter les services.'

Write-Host 'En attente du démarrage du frontend...'
Start-Sleep -Seconds 5
try {
	Start-Process $siteUrl | Out-Null
	Write-Host "Ouverture du site: $siteUrl"
}
catch {
	Write-Warning "Impossible d'ouvrir automatiquement le navigateur. Ouvrez manuellement: $siteUrl"
}
