@echo off
title Visor Geografico I2D - Portable Helper
cd /d "%~dp0"

echo.
echo ================================================
echo   Visor Geografico I2D - Portable Helper
echo ================================================
echo.

:: Check if we're in the right directory
if not exist "visor-geografico-I2D-backend\manage.py" (
    echo ERROR: No se encuentra el directorio del backend.
    echo Asegurate de ejecutar este archivo desde:
    echo %~dp0
    echo.
    pause
    exit /b 1
)

echo Para usar el visor geografico portable, siga estos pasos:
echo.
echo PASO 1: Iniciar el backend
echo   Abra una nueva ventana de CMD o PowerShell
echo   Ejecute estos comandos:
echo     cd /d "%~dp0visor-geografico-I2D-backend"
echo     pip install -r requirements.txt
echo     python manage.py runserver
echo.
echo   El backend se ejecutara en: http://localhost:8001
echo.
echo PASO 2: Abrir el visor
echo   En ESTA ventana, haga doble clic en:
echo     geovisor_portable_secure\index.html
echo   O copie y pegue esta ruta en su navegador:
echo     file:///%~dp0geovisor_portable_secure\index.html
echo.
echo NOTA: El visor consume datos de http://localhost:8001
echo   Asegureese de que el backend este ejecutándose antes de buscar.
echo.
echo ================================================
echo   Cuando termine, cierre la ventana del backend (Ctrl+C)
echo ================================================
echo.
pause
