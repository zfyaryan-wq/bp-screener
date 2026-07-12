@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start_share.ps1" -OpenBrowser
echo.
echo BP Screener Workbench has stopped or failed. Press any key to close.
pause >nul
