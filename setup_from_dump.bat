@echo off
echo ========================================
echo Cabuyao City Website - Project Setup
echo ========================================
echo.

echo [1/6] Checking PHP installation...
php --version
if errorlevel 1 (
    echo ERROR: PHP is not installed or not in PATH
    echo Please install PHP 8.2 or higher
    pause
    exit /b 1
)

echo [2/6] Installing PHP dependencies...
composer install
if errorlevel 1 (
    echo ERROR: Composer install failed
    pause
    exit /b 1
)

echo [3/6] Installing JavaScript dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: NPM install failed
    pause
    exit /b 1
)

echo [4/6] Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo Created .env from .env.example
) else (
    echo .env already exists, skipping...
)

echo Generating application key...
php artisan key:generate

echo [5/6] Setting up database...
if exist database\database.sqlite (
    echo Removing existing database...
    del database\database.sqlite
)

echo Creating new SQLite database...
type nul > database\database.sqlite

if exist database\dump.sql (
    echo Importing database dump...
    sqlite3 database\database.sqlite < database\dump.sql
) else (
    echo No dump.sql found, running migrations instead...
    php artisan migrate
)

echo [6/6] Building frontend assets...
call npm run build

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo     composer run dev
echo.
echo Or start services separately:
echo     php artisan serve     (in terminal 1)
echo     npm run dev           (in terminal 2)
echo     php artisan queue:listen (in terminal 3)
echo.
pause