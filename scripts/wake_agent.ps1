param(
    [string]$WakeBaseUrl = "https://bp-screener.pages.dev",
    [string]$WakeToken = "123456",
    [int]$PollSeconds = 10
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$UrlFile = Join-Path $Root "public_url.txt"
$LogFile = Join-Path $Root "wake_agent.log"
$LastNonce = $null

function Write-AgentLog {
    param([string]$Message)
    $line = "$(Get-Date -Format s) $Message"
    $line | Add-Content -Encoding UTF8 $LogFile
}

function Get-CurrentPublicUrl {
    if (!(Test-Path $UrlFile)) {
        return ""
    }
    $content = Get-Content $UrlFile -Raw
    $match = [regex]::Match($content, "https://[a-zA-Z0-9-]+\.trycloudflare\.com")
    if ($match.Success) {
        return $match.Value
    }
    return ""
}

function Test-LocalWorkbenchReady {
    try {
        $response = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8501" -TimeoutSec 5
        return [int]$response.StatusCode -eq 200
    } catch {
        return $false
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
        Write-AgentLog "Public URL probe failed: $($_.Exception.Message)"
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

function Send-Heartbeat {
    param(
        [string]$Status,
        [string]$LatestUrl = ""
    )
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
}

function Start-Workbench {
    Write-AgentLog "Starting workbench on wake request."
    $script = Join-Path $Root "scripts\start_share.ps1"
    Start-Process `
        -FilePath "powershell.exe" `
        -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $script) `
        -WorkingDirectory $Root `
        -WindowStyle Minimized | Out-Null
    Start-Sleep -Seconds 3
    $url = Get-CurrentPublicUrl
    if ($url) {
        if (Wait-PublicUrlReady -Url $url) {
            Send-Heartbeat -Status "online" -LatestUrl $url
            Write-AgentLog "Workbench online: $url"
        } else {
            Send-Heartbeat -Status "starting"
            Write-AgentLog "Public URL was created but is not reachable yet: $url"
        }
    } else {
        Send-Heartbeat -Status "starting"
        Write-AgentLog "Workbench started but public URL was not found yet."
    }
}

Write-AgentLog "Wake agent started. WakeBaseUrl=$WakeBaseUrl PollSeconds=$PollSeconds"

try {
    $initialState = Invoke-RestMethod -Method Get -Uri "$WakeBaseUrl/api/wake/status" -TimeoutSec 20
    $LastNonce = $initialState.request_nonce
} catch {
    Write-AgentLog "Initial state read failed: $($_.Exception.Message)"
}

while ($true) {
    try {
        $state = Invoke-RestMethod -Method Get -Uri "$WakeBaseUrl/api/wake/status" -TimeoutSec 20
        $localReady = Test-LocalWorkbenchReady
        $currentUrl = if ($localReady) { Get-CurrentPublicUrl } else { "" }
        if ($localReady -and $currentUrl) {
            Send-Heartbeat -Status "online" -LatestUrl $currentUrl
            if (!(Test-PublicUrlReady -Url $currentUrl)) {
                Write-AgentLog "Workbench is local-ready but public URL probe failed: $currentUrl"
            }
        } elseif ($state.status -ne "starting") {
            Send-Heartbeat -Status "offline"
        }

        if ($state.request_nonce -and $state.request_nonce -ne $LastNonce) {
            $LastNonce = $state.request_nonce
            Start-Workbench
        }
    } catch {
        Write-AgentLog "Loop error: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds $PollSeconds
}
