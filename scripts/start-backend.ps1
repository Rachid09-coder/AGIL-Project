param(
	[string]$DbHost = "localhost",
	[int]$DbPort = 3306,
	[string]$DbName = "agil",
	[string]$DbUser = "root",
	[string]$DbPassword = "",
	[int]$ServerPort = 8081
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $root 'backend'

$tcp = Test-NetConnection -ComputerName $DbHost -Port $DbPort -WarningAction SilentlyContinue
if (-not $tcp.TcpTestSucceeded) {
	throw "MySQL n'est pas joignable sur $($DbHost):$($DbPort). Démarrez MySQL (XAMPP) puis relancez start-all.ps1."
}

Set-Location $backendPath
& (Join-Path $backendPath 'run-mysql.ps1') -DbHost $DbHost -DbPort $DbPort -DbName $DbName -DbUser $DbUser -DbPassword $DbPassword -ServerPort $ServerPort
