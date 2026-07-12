$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Launcher = Join-Path $Root "Start BP Workbench.bat"
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "BP Screener Workbench.lnk"

if (!(Test-Path $Launcher)) {
    throw "Launcher not found at $Launcher"
}

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($ShortcutPath)
$shortcut.TargetPath = $Launcher
$shortcut.WorkingDirectory = $Root
$shortcut.Description = "Start BP Screener Workbench and copy the temporary share URL"
$shortcut.Save()

Write-Host "Desktop shortcut created:"
Write-Host $ShortcutPath
