param(
    [string]$BackendUrl = "http://localhost:8000",
    [string]$NextUrl = "http://localhost:3000",
    [string]$OllamaUrl = "http://localhost:11434",
    [string]$ModelName = "llama3.2:1b"
)

$ErrorActionPreference = "Stop"
$script:passed = 0

function Write-Pass([string]$Message) {
    $script:passed++
    Write-Host "PASS: $Message" -ForegroundColor Green
}

function Invoke-YumiChat([string]$Url, [string]$Question) {
    $requestBody = @{
        question = $Question
        messages = @()
    } | ConvertTo-Json -Depth 6

    Invoke-RestMethod `
        -Method Post `
        -Uri $Url `
        -ContentType "application/json" `
        -Body $requestBody `
        -TimeoutSec 240
}

function Assert-ProjectAnswer($Response, [string]$PathName) {
    if ([string]::IsNullOrWhiteSpace($Response.answer)) {
        throw "$PathName returned an empty answer. Check the backend logs."
    }

    foreach ($project in @("EventSphere", "Social Welfare System", "ECA-IS")) {
        if ($Response.answer -notmatch [regex]::Escape($project)) {
            throw "$PathName answer did not include '$project'. Answer: $($Response.answer)"
        }
    }

    if ($Response.answer -notmatch "(?i)tech\s*stack") {
        throw "$PathName answer did not include the project tech stacks. Answer: $($Response.answer)"
    }

    if (-not $Response.sources -or $Response.sources.Count -lt 1) {
        throw "$PathName response did not include PDF source metadata."
    }
}

try {
    $health = Invoke-RestMethod -Uri "$BackendUrl/health" -TimeoutSec 10
    if ($health.status -ne "ok") {
        throw "Backend health endpoint returned status '$($health.status)'."
    }
    Write-Pass "FastAPI health endpoint is responding."

    $ollama = Invoke-RestMethod -Uri "$OllamaUrl/api/tags" -TimeoutSec 15
    $installedModels = @($ollama.models | ForEach-Object { $_.name })
    if ($installedModels -notcontains $ModelName) {
        throw "Ollama model '$ModelName' is missing. Installed models: $($installedModels -join ', ')"
    }
    Write-Pass "Ollama has model $ModelName installed."

    $question = "List all projects and the tech stack used in each project."

    $backendResponse = Invoke-YumiChat "$BackendUrl/api/chat" $question
    Assert-ProjectAnswer $backendResponse "FastAPI"
    Write-Pass "FastAPI RAG endpoint returned all three projects, stacks, and sources."

    $nextResponse = Invoke-YumiChat "$NextUrl/api/chat" $question
    Assert-ProjectAnswer $nextResponse "Next.js proxy"
    Write-Pass "Next.js API proxy returned all three projects, stacks, and sources."

    Write-Host "`nAll $script:passed YUMI RAG checks passed." -ForegroundColor Green
}
catch {
    Write-Host "`nYUMI RAG check failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check service status with: docker compose ps" -ForegroundColor Yellow
    Write-Host "Check logs with: docker compose logs --tail=100 backend ollama db" -ForegroundColor Yellow
    exit 1
}
