@echo off
title Visor Geografico I2D - Portable Launcher
cd /d "%~dp0"

echo.
echo ================================================
echo   Visor Geografico I2D - Portable Launcher
echo ================================================
echo.

:: Check if we're in the right directory
if not exist "visor-geografico-I2D-backend\docker-compose.yml" (
    echo ERROR: No se encuentra el directorio del backend.
    echo Asegurate de ejecutar este archivo desde:
    echo %~dp0
    echo.
    pause
    exit /b 1
)

echo Iniciando el backend del Visor I2D...
cd visor-geografico-I2D-backend

:: Try to start with Docker Compose
if exist docker-compose.yml (
    echo Iniciando contenedores con Docker Compose...
    docker-compose up -d
    if %errorlevel% neq 0 (
        echo.
        echo ADVERTENCIA: No se pudo iniciar con Docker Compose.
        echo Asegurate de tener Docker y Docker Compose instalados y en ejecucion.
        echo.
        echo Puede intentar ejecutar el backend manualmente:
        echo   cd visor-geografico-I2D-backend
        echo   pip install -r requirements.txt
        echo   python manage.py runserver
        echo.
    ) else (
        echo Backend iniciado en segundo plano.
        echo Esperando a que el servicio este listo...
        timeout /t 10 > nul
    )
) else (
    echo No se encontro docker-compose.yml
    echo Por favor inicia el backend manualmente:
    echo   cd visor-geografico-I2D-backend
    echo   pip install -r requirements.txt
    echo   python manage.py runserver
)

:: Return to root and open the geovisor
cd ..
echo.
echo Abriendo el visor geografico en su navegador predeterminado...
start " "geovisor_portable_secure\index.html"

echo.
echo ================================================
echo   El visor se ha abierto en su navegador.
echo   Si no ve datos, verifique que el backend este accesible en:
echo   http://localhost:8001
echo.
echo Para detener el backend cuando termine, ejecute:
echo   cd visor-geografico-I2D-backend && docker-compose down
echo ================================================
echo.
pause