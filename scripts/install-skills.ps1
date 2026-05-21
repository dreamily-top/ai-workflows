param(
    [ValidateSet("all", "codex", "claude", "cursor", "gemini")]
    [string]$Target = "all",

    [string]$CodexPath,
    [string]$ClaudePath,
    [string]$CursorPath,
    [string]$GeminiPath
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$skillNames = @(
    "ace-programmer",
    "project-context",
    "system-architect",
    "repo-map-generator",
    "task-coder",
    "code-reviewer"
)

function Join-UserPath {
    param([string]$RelativePath)
    return Join-Path $env:USERPROFILE $RelativePath
}

function Get-DefaultTargets {
    $codexDefault = if ($env:CODEX_HOME) {
        Join-Path $env:CODEX_HOME "skills"
    } else {
        Join-UserPath ".codex\skills"
    }

    return @{
        codex  = if ($CodexPath) { $CodexPath } else { $codexDefault }
        claude = if ($ClaudePath) { $ClaudePath } else { Join-UserPath ".claude\skills" }
        cursor = if ($CursorPath) { $CursorPath } else { Join-UserPath ".cursor\skills-cursor" }
        gemini = if ($GeminiPath) { $GeminiPath } else { Join-UserPath ".gemini\antigravity\skills" }
    }
}

function Copy-Skill {
    param(
        [string]$SkillName,
        [string]$DestinationRoot
    )

    $source = Join-Path $repoRoot $SkillName
    if (-not (Test-Path (Join-Path $source "SKILL.md"))) {
        throw "Missing skill folder or SKILL.md: $source"
    }

    $destination = Join-Path $DestinationRoot $SkillName
    New-Item -ItemType Directory -Force -Path $destination | Out-Null
    Copy-Item -Path (Join-Path $source "*") -Destination $destination -Recurse -Force
}

function Install-ToTarget {
    param(
        [string]$Name,
        [string]$DestinationRoot
    )

    New-Item -ItemType Directory -Force -Path $DestinationRoot | Out-Null
    foreach ($skillName in $skillNames) {
        Copy-Skill -SkillName $skillName -DestinationRoot $DestinationRoot
    }
    Write-Host "Installed to ${Name}: $DestinationRoot"
}

$targets = Get-DefaultTargets
$selectedTargets = if ($Target -eq "all") {
    @("codex", "claude", "cursor", "gemini")
} else {
    @($Target)
}

foreach ($name in $selectedTargets) {
    Install-ToTarget -Name $name -DestinationRoot $targets[$name]
}

Write-Host "Done. Reload skills in the target tool if needed."
