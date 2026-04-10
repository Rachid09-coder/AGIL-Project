$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$frontendPath = Join-Path $root 'frontend'
$nodeDir = 'C:\Program Files\nodejs'

Set-Location $frontendPath
$env:Path = "$nodeDir;$($env:Path)"

if (-not (Test-Path (Join-Path $frontendPath 'node_modules'))) {
    & (Join-Path $nodeDir 'npm.cmd') install
}

& (Join-Path $nodeDir 'npm.cmd') run dev -- --host 0.0.0.0 --port 5173
