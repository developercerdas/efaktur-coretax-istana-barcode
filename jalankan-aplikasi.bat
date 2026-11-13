@echo off
title e-Faktur Coretax - CV. Istana Barcode Computer
color 0b
echo ================================================================
echo   MEMULAI APLIKASI E-FAKTUR CORETAX CV. ISTANA BARCODE COMPUTER
echo ================================================================
echo.
cd /d "%~dp0"
echo Membuka browser ke http://localhost:3000 ...
start http://localhost:3000
echo.
echo Server berjalan di http://localhost:3000
echo Jangan tutup jendela ini selama menggunakan aplikasi.
echo.
node src/server.js
pause
