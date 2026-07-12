param(
    [switch]$OpenBrowser,
    [switch]$KeepExisting,
    [string]$WakeBaseUrl = "https://bp-screener.pages.dev",
    [string]$WakeToken = "123456"
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$UrlFile = Join-Path $Root "public_url.txt"
$Streamlit = Join-Path $Root ".venv\Scripts\streamlit.exe"
$Cloudflared = Join-Path $Root ".tools\cloudflared.exe"

function Stop-ExistingWorkbench {
    $escapedRoot = [regex]::Escape($Root)
    $currentPid = $PID
    Get-CimInstance Win32_Process |
        Where-Object {
            $_.ProcessId -ne $currentPid -and
            $_.CommandLine -and
            $_.CommandLine -match $escapedRoot -and
            ($_.CommandLine -match "streamlit\.exe|cloudflared\.exe|start_share\.ps1|heartbeat\.ps1|tunnel --protocol|tunnel --url")
        } |
        ForEach-Object {
            try {
                Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop
            } catch {
                Write-Host "Could not stop process $($_.ProcessId): $($_.Exception.Message)"
            }
        }
}

function Test-PublicUrlReady {
    param([string]$Url)
    if (!$Url) {
        return $false
    }
    try {
        $hostName = ([Uri]$Url).Host
        Resolve-DnsName $hostName -ErrorAction Stop | Out-Null
        $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 15
        return [int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 500
    } catch {
        return $false
    }
}

function Wait-PublicUrlReady {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 90
    )
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-PublicUrlReady -Url $Url) {
            return $true
        }
        Start-Sleep -Seconds 3
    }
    return $false
}

function Send-WakeHeartbeat {
    param(
        [string]$Status,
        [string]$LatestUrl = ""
    )
    try {
        $body = @{
            status = $Status
            latest_url = $LatestUrl
        } | ConvertTo-Json
        Invoke-RestMethod `
            -Method Post `
            -Uri "$WakeBaseUrl/api/wake/heartbeat" `
            -Headers @{ "x-wake-token" = $WakeToken } `
            -ContentType "application/json" `
            -Body $body | Out-Null
    } catch {
        Write-Host "Could not update fixed entry: $($_.Exception.Message)"
    }
}

if (!(Test-Path $Streamlit)) {
    throw "Streamlit not found at $Streamlit. Please install dependencies first."
}

if (!(Test-Path $Cloudflared)) {
    throw "cloudflared not found at $Cloudflared."
}

if (!$KeepExisting) {
    Write-Host "Stopping old workbench processes..."
    Stop-ExistingWorkbench
    Start-Sleep -Seconds 1
}

Write-Host "Starting BP Screener Workbench locally..."
$env:STREAMLIT_BROWSER_GATHER_USAGE_STATS = "false"
$streamlitProcess = Start-Process `
    -FilePath $Streamlit `
    -ArgumentList @(
        "run",
        "app.py",
        "--server.address",
        "127.0.0.1",
        "--server.port",
        "8501",
        "--server.headless",
        "true",
        "--server.enableStaticServing",
        "true",
        "--server.enableCORS",
        "false",
        "--server.enableXsrfProtection",
        "false"
    ) `
    -WorkingDirectory $Root `
    -PassThru `
    -WindowStyle Minimized

Start-Sleep -Seconds 3

$url = $null
$cloudflaredProcess = $null

for ($attempt = 1; $attempt -le 4; $attempt++) {
    Remove-Item "$Root\tunnel.log", "$Root\tunnel.err.log" -Force -ErrorAction SilentlyContinue

    Write-Host "Starting Cloudflare temporary tunnel, attempt $attempt..."
    $cloudflaredProcess = Start-Process `
        -FilePath $Cloudflared `
        -ArgumentList @("tunnel", "--protocol", "http2", "--url", "http://127.0.0.1:8501") `
        -WorkingDirectory $Root `
        -PassThru `
        -NoNewWindow `
        -RedirectStandardOutput "$Root\tunnel.log" `
        -RedirectStandardError "$Root\tunnel.err.log"

    Write-Host "Waiting for public URL..."
    for ($i = 0; $i -lt 60; $i++) {
        Start-Sleep -Seconds 1
        $logs = ""
        if (Test-Path "$Root\tunnel.log") {
            $logs += Get-Content "$Root\tunnel.log" -Raw
        }
        if (Test-Path "$Root\tunnel.err.log") {
            $logs += Get-Content "$Root\tunnel.err.log" -Raw
        }
        $match = [regex]::Match($logs, "https://[a-zA-Z0-9-]+\.trycloudflare\.com")
        if ($match.Success) {
            $url = $match.Value
            break
        }
    }

    if ($url) {
        Write-Host "Checking public URL..."
        if (Wait-PublicUrlReady -Url $url -TimeoutSeconds 45) {
            Send-WakeHeartbeat -Status "online" -LatestUrl $url
            break
        }
        Write-Host "Public URL was created but is not reachable yet: $url"
        Send-WakeHeartbeat -Status "starting" -LatestUrl $url
        if ($cloudflaredProcess -and !$cloudflaredProcess.HasExited) {
            Stop-Process -Id $cloudflaredProcess.Id -Force -ErrorAction SilentlyContinue
        }
        $url = $null
        Start-Sleep -Seconds 2
    } else {
        Write-Host "No public URL found on attempt $attempt."
        if ($cloudflaredProcess -and !$cloudflaredProcess.HasExited) {
            Stop-Process -Id $cloudflaredProcess.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

if ($url) {
    Send-WakeHeartbeat -Status "online" -LatestUrl $url
} else {
    Send-WakeHeartbeat -Status "offline"
    if ($streamlitProcess -and !$streamlitProcess.HasExited) {
        Stop-Process -Id $streamlitProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if ($cloudflaredProcess -and !$cloudflaredProcess.HasExited) {
        Stop-Process -Id $cloudflaredProcess.Id -Force -ErrorAction SilentlyContinue
    }
    throw "Could not create a reachable Cloudflare public URL. Check tunnel.log and tunnel.err.log."
}

$message = @"
BP Screener Workbench is online:
$url

Fixed entry: $WakeBaseUrl/wake
Local URL: http://127.0.0.1:8501
"@

$message | Set-Content -Encoding UTF8 $UrlFile
$clipboardUpdated = $false
try {
    $message | Set-Clipboard
    $clipboardUpdated = $true
} catch {
    Write-Host "Could not copy share message to clipboard: $($_.Exception.Message)"
}

if ($OpenBrowser) {
    Start-Process $url
}

Write-Host ""
Write-Host $message
Write-Host ""
if ($clipboardUpdated) {
    Write-Host "The share message has been copied to your clipboard."
}
Write-Host "Keep this window open while your team is using the workbench."
Write-Host "Streamlit PID: $($streamlitProcess.Id)"
Write-Host "Tunnel PID: $($cloudflaredProcess.Id)"
Write-Host "Heartbeat is running in this window."

while ($true) {
    Start-Sleep -Seconds 60
    if ((Test-PublicUrlReady -Url "http://127.0.0.1:8501") -and (Test-PublicUrlReady -Url $url)) {
        Send-WakeHeartbeat -Status "online" -LatestUrl $url
        Write-Host "Heartbeat online: $url"
    } else {
        Write-Host "Heartbeat skipped: workbench or tunnel is not ready."
    }
}
