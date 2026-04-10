$ErrorActionPreference = 'SilentlyContinue'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$runPath = Join-Path $root '.run'

function Stop-ByPidFile {
    param([string]$PidFile)
    if (Test-Path $PidFile) {
        $pidValue = Get-Content $PidFile | Select-Object -First 1
        if ($pidValue) {
            Stop-Process -Id ([int]$pidValue) -Force
            Write-Host "Process $pidValue arrêté (PID file)."
        }
        Remove-Item $PidFile -Force
    }
}

function Stop-PortProcess {
    param([int]$Port)
    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if (-not $connections) {
        return
    }
    foreach ($conn in $connections) {
        if ($conn.OwningProcess -and $conn.OwningProcess -ne 0) {
            Stop-Process -Id $conn.OwningProcess -Force
            Write-Host "Port ${Port}: process $($conn.OwningProcess) arrêté"
        }
    }
}

Write-Host 'Arrêt des services Smart Parking...'
Stop-ByPidFile -PidFile (Join-Path $runPath 'backend.pid')
Stop-ByPidFile -PidFile (Join-Path $runPath 'frontend.pid')
Stop-PortProcess -Port 8081
Stop-PortProcess -Port 5173

Write-Host 'Terminé.'
