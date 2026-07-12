param(
    [string]$WakeBaseUrl = "https://bp-screener.pages.dev",
    [string]$WakeToken = "123456",
    [int]$PollSeconds = 10
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Agent = Join-Path $Root "scripts\wake_agent.ps1"
$TaskName = "BP Screener Wake Agent"
$StartupFolder = [Environment]::GetFolderPath("Startup")
$StartupShortcut = Join-Path $StartupFolder "BP Screener Wake Agent.lnk"

if (!(Test-Path $Agent)) {
    throw "Wake agent not found at $Agent"
}

$argument = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$Agent`" -WakeBaseUrl `"$WakeBaseUrl`" -WakeToken `"$WakeToken`" -PollSeconds $PollSeconds"
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $argument -WorkingDirectory $Root
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1)

try {
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Description "Polls the fixed BP Screener wake page and starts the local workbench on demand." `
        -Force `
        -ErrorAction Stop | Out-Null

    Start-ScheduledTask -TaskName $TaskName -ErrorAction Stop
    Write-Host "Wake agent installed as a scheduled task and started."
    Write-Host "Task name: $TaskName"
} catch {
    Write-Host "Scheduled task install failed: $($_.Exception.Message)"
    Write-Host "Falling back to Startup folder shortcut."

    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($StartupShortcut)
    $shortcut.TargetPath = "powershell.exe"
    $shortcut.Arguments = $argument
    $shortcut.WorkingDirectory = $Root
    $shortcut.Description = "BP Screener wake agent"
    $shortcut.Save()

    Start-Process powershell.exe -ArgumentList $argument -WorkingDirectory $Root -WindowStyle Hidden
    Write-Host "Wake agent installed in Startup folder and started."
    Write-Host "Shortcut: $StartupShortcut"
}

Write-Host "Fixed wake URL: $WakeBaseUrl/wake.html"
