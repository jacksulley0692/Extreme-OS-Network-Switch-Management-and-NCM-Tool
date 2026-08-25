# ==============================================================================
# Watch-Status.ps1 - Live PowerShell Status Monitor
# ==============================================================================
# Run this script in PowerShell to continuously watch live script execution state
# Usage: .\Watch-Status.ps1
# ==============================================================================

$StatusTxt = Join-Path -Path $PSScriptRoot -ChildPath "status.txt"
$StatusJson = Join-Path -Path $PSScriptRoot -ChildPath "status.json"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Starting Live Backup Script Status Monitor" -ForegroundColor Cyan
Write-Host " Press Ctrl+C at any time to exit monitor" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $StatusTxt) {
    Get-Content -Path $StatusTxt -Wait
} elseif (Test-Path $StatusJson) {
    while ($true) {
        Clear-Host
        Get-Content -Path $StatusJson | ConvertFrom-Json | Format-List
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "Waiting for status.txt or status.json to be created..." -ForegroundColor Yellow
    while (-not (Test-Path $StatusTxt) -and -not (Test-Path $StatusJson)) {
        Start-Sleep -Seconds 1
    }
    if (Test-Path $StatusTxt) {
        Get-Content -Path $StatusTxt -Wait
    }
}
