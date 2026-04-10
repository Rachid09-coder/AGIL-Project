param(
    [string]$DbHost = "localhost",
    [int]$DbPort = 3306,
    [string]$DbName = "sndp_fleet",
    [string]$DbUser = "root",
    [string]$DbPassword = "",
    [int]$ServerPort = 8081
)

$ErrorActionPreference = 'Stop'

$backendPath = $PSScriptRoot
$rootPath = Split-Path -Parent $backendPath
$mavenHome = Join-Path $rootPath '.tools\apache-maven-3.9.9'
$javaHome = 'C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot'

Set-Location $backendPath

$env:DB_HOST = $DbHost
$env:DB_PORT = "$DbPort"
$env:DB_NAME = $DbName
$env:DB_USER = $DbUser
$env:DB_PASSWORD = $DbPassword

if (Test-Path $javaHome) {
    $env:JAVA_HOME = $javaHome
    $env:Path = "$($env:JAVA_HOME)\bin;$($env:Path)"
}

if (Test-Path (Join-Path $mavenHome 'bin\mvn.cmd')) {
    & (Join-Path $mavenHome 'bin\mvn.cmd') "-s" (Join-Path $backendPath 'settings.xml') "spring-boot:run" "-Dspring-boot.run.arguments=--server.port=$ServerPort"
}
else {
    mvn "-s" (Join-Path $backendPath 'settings.xml') "spring-boot:run" "-Dspring-boot.run.arguments=--server.port=$ServerPort"
}
