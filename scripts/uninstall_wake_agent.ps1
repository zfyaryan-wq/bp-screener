$ErrorActionPreference = "Stop"

$TaskName = "BP Screener Wake Agent"

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Wake agent removed."
} else {
    Write-Host "Wake agent was not installed."
}
