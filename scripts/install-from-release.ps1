function Install-SpecOS {
    param(
        [string]$Repo = "mosshello/spec-os",

        [string]$Version = "latest",

        [ValidateSet("all", "codex", "claude", "cursor", "gemini")]
        [string]$Target = "all",

        [string]$CodexPath,
        [string]$ClaudePath,
        [string]$CursorPath,
        [string]$GeminiPath
    )

    $ErrorActionPreference = "Stop"

    $assetName = "spec-os-skills.zip"
    $downloadUrl = if ($Version -eq "latest") {
        "https://github.com/$Repo/releases/latest/download/$assetName"
    } else {
        "https://github.com/$Repo/releases/download/$Version/$assetName"
    }

    $tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("spec-os-" + [System.Guid]::NewGuid().ToString("N"))
    $zipPath = Join-Path $tempRoot $assetName
    $extractPath = Join-Path $tempRoot "extract"

    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

    try {
        Write-Host "Downloading: $downloadUrl"
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
        Expand-Archive -LiteralPath $zipPath -DestinationPath $extractPath -Force

        $installer = Get-ChildItem -Path $extractPath -Recurse -Filter "install-skills.ps1" | Select-Object -First 1
        if (-not $installer) {
            throw "install-skills.ps1 not found in release package."
        }

        $args = @("-ExecutionPolicy", "Bypass", "-File", $installer.FullName, "-Target", $Target)
        if ($CodexPath) { $args += @("-CodexPath", $CodexPath) }
        if ($ClaudePath) { $args += @("-ClaudePath", $ClaudePath) }
        if ($CursorPath) { $args += @("-CursorPath", $CursorPath) }
        if ($GeminiPath) { $args += @("-GeminiPath", $GeminiPath) }

        & powershell @args
    }
    finally {
        if (Test-Path $tempRoot) {
            Remove-Item -LiteralPath $tempRoot -Recurse -Force
        }
    }
}

if ($MyInvocation.InvocationName -ne ".") {
    Install-SpecOS @args
}
