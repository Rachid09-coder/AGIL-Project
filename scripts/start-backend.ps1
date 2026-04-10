$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $root 'backend'
$mavenHome = Join-Path $root '.tools\apache-maven-3.9.9'
$javaHome = 'C:\Program Files\Microsoft\jdk-21.0.10.7-hotspot'

Set-Location $backendPath
$env:JAVA_HOME = $javaHome
$env:Path = "$($env:JAVA_HOME)\bin;$mavenHome\bin;$($env:Path)"

mvn --% -s "C:\Users\rachi\OneDrive\Bureau\Smart Parking\backend\settings.xml" -Dspring-boot.run.profiles=local -Dspring-boot.run.arguments=--server.port=8081 spring-boot:run
