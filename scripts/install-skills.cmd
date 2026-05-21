@echo off
powershell -ExecutionPolicy Bypass -File "%~dp0install-skills.ps1" -Target all
pause
