param(
    [string]$WakeBaseUrl = "https://bp-screener.pages.dev",
    [string]$WakeToken = "123456",
    [int]$IntervalSeconds = 60
)

$ErrorActionPreference = "Continue"

$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$UrlFile = Join-Path $Root "public_url.txt"
$LogFile = Join-Path $Root "heartbeat.log"

function Write-HeartbeatLog {
    param([string]$Message)
    "$(Get-Date -Format s) $Message" | Add-Content -Encoding UTF8 $LogFile
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

function Test-UrlReady {
    param([string]$Url)
    if (!$Url) {
        return $false
    }
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 15
        return [int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 500
    } catch {
        Write-HeartbeatLog "URL probe failed: $($_.Exception.Message)"
        return $false
    }
}

function Send-Heartbeat {
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
        Write-HeartbeatLog "Heartbeat failed: $($_.Exception.Message)"
    }
}

Write-HeartbeatLog "Heartbeat started. WakeBaseUrl=$WakeBaseUrl IntervalSeconds=$IntervalSeconds"

while ($true) {
    try {
        $url = Get-CurrentPublicUrl
        if ((Test-UrlReady -Url "http://127.0.0.1:8501") -and (Test-UrlReady -Url $url)) {
            Send-Heartbeat -Status "online" -LatestUrl $url
            Write-HeartbeatLog "Heartbeat online: $url"
        } else {
            Send-Heartbeat -Status "offline"
            Write-HeartbeatLog "Heartbeat offline."
        }
    } catch {
        Write-HeartbeatLog "Heartbeat loop error: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds $IntervalSeconds
}
