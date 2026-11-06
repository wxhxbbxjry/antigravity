@echo off
setlocal
cd /d "%~dp0"
echo ===================================================================
echo   RunRoute Art - Push ke GitHub (wxhxbbxjry/antigravity)
echo ===================================================================
echo.

rem Gunakan portable git jika sistem belum menginstal git di PATH
if exist "..\mingit\cmd\git.exe" (
    set "PATH=%~dp0..\mingit\cmd;%PATH%"
)

echo Memeriksa status Git lokal...
git status

echo.
echo Melakukan push ke branch 'run-route-art' (agar file Telering aman)...
git branch -M run-route-art
git push -u origin run-route-art

if %errorlevel% neq 0 (
    echo.
    echo [INFO] Jika ingin menggabungkan langsung ke branch main, jalankan:
    echo        git push origin run-route-art:main
)

echo.
pause
