#!/bin/bash

echo "========================================"
echo "Cabuyao City Website - Project Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Step 1: Check PHP installation
echo "[1/6] Checking PHP installation..."
if ! command -v php &> /dev/null; then
    print_error "PHP is not installed or not in PATH"
    echo "Please install PHP 8.2 or higher"
    exit 1
fi
php --version
print_success "PHP found"

# Step 2: Install PHP dependencies
echo ""
echo "[2/6] Installing PHP dependencies..."
if ! command -v composer &> /dev/null; then
    print_error "Composer is not installed"
    echo "Please install Composer: https://getcomposer.org/download/"
    exit 1
fi
composer install
if [ $? -ne 0 ]; then
    print_error "Composer install failed"
    exit 1
fi
print_success "PHP dependencies installed"

# Step 3: Install JavaScript dependencies
echo ""
echo "[3/6] Installing JavaScript dependencies..."
if ! command -v npm &> /dev/null; then
    print_error "NPM is not installed"
    echo "Please install Node.js and NPM: https://nodejs.org/"
    exit 1
fi
npm install
if [ $? -ne 0 ]; then
    print_error "NPM install failed"
    exit 1
fi
print_success "JavaScript dependencies installed"

# Step 4: Setup environment file
echo ""
echo "[4/6] Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
else
    echo ".env already exists, skipping..."
fi

echo "Generating application key..."
php artisan key:generate
print_success "Application key generated"

# Step 5: Setup database
echo ""
echo "[5/6] Setting up database..."
if [ -f database/database.sqlite ]; then
    echo "Removing existing database..."
    rm database/database.sqlite
fi

echo "Creating new SQLite database..."
touch database/database.sqlite

if [ -f database/dump.sql ]; then
    echo "Importing database dump..."
    sqlite3 database/database.sqlite < database/dump.sql
else
    echo "No dump.sql found, running migrations instead..."
    php artisan migrate
fi
print_success "Database setup complete"

# Step 6: Build frontend assets
echo ""
echo "[6/6] Building frontend assets..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi
print_success "Frontend assets built"

# Completion message
echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the development server, run:"
echo "    composer run dev"
echo ""
echo "Or start services separately:"
echo "    php artisan serve          (in terminal 1)"
echo "    npm run dev                (in terminal 2)"
echo "    php artisan queue:listen   (in terminal 3)"
echo ""