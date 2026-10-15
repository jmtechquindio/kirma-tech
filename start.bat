@echo off
title KIRMA V2 - Servidor
echo.
echo  ██╗  ██╗██╗██████╗ ███╗   ███╗ █████╗     ██╗   ██╗██████╗ 
echo  ██║ ██╔╝██║██╔══██╗████╗ ████║██╔══██╗    ██║   ██║╚════██╗
echo  █████╔╝ ██║██████╔╝██╔████╔██║███████║    ██║   ██║ █████╔╝
echo  ██╔═██╗ ██║██╔══██╗██║╚██╔╝██║██╔══██║    ╚██╗ ██╔╝██╔═══╝ 
echo  ██║  ██╗██║██║  ██║██║ ╚═╝ ██║██║  ██║     ╚████╔╝ ███████╗
echo  ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝      ╚═══╝  ╚══════╝
echo.
echo  Tecnologia que renace.
echo  ─────────────────────────────────────────────────────────────
echo.

REM Migrar inventario si la base de datos no existe
if not exist kirma.db (
    echo [INFO] Primera ejecucion: migrando inventario...
    python migrate_inventory.py
    echo.
)

echo [INFO] Iniciando servidor KIRMA V2...
echo [INFO] Abre tu navegador en: http://localhost:8000
echo [INFO] Panel admin en:       http://localhost:8000/admin
echo [INFO] API docs en:          http://localhost:8000/api/docs
echo [INFO] Presiona Ctrl+C para detener.
echo.

python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload --reload-dir backend

pause
