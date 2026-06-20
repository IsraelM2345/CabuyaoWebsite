# Cabuyao City Website

A modern web application for Cabuyao City built with Laravel 12, React, Inertia.js, and Tailwind CSS.

## 🚀 Quick Start for Team Members

### Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2+** (with SQLite extension)
- **Composer** (PHP package manager)
- **Node.js 18+** and **NPM**
- **Git**

### One-Command Setup

**Windows:**

```bash
setup_from_dump.bat
```

**Mac/Linux:**

```bash
chmod +x setup_from_dump.sh
./setup_from_dump.sh
```

This automated script will:

1. Install all PHP dependencies
2. Install all JavaScript dependencies
3. Set up the environment file
4. Generate application key
5. Set up the database with all data
6. Build frontend assets

### Manual Setup (Alternative)

If you prefer to set up manually:

```bash
# 1. Clone the repository
git clone <repository-url>
cd <project-directory>

# 2. Install dependencies
composer install
npm install

# 3. Setup environment
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux
php artisan key:generate

# 4. Setup database (SQLite - recommended)
type nul > database/database.sqlite  # Windows
touch database/database.sqlite       # Mac/Linux
php artisan migrate

# 5. Build assets
npm run build

# 6. Start development server
composer run dev
```

### Starting the Application

After setup, start the development environment:

```bash
composer run dev
```

This single command starts:

- Laravel development server (http://localhost:8000)
- Vite frontend dev server
- Queue worker
- Log viewer

**Alternative:** Start services separately in different terminals:

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev

# Terminal 3
php artisan queue:listen
```

## 📚 Project Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Application controllers
│   │   └── Middleware/      # HTTP middleware
│   └── Models/              # Eloquent models
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── resources/
│   ├── js/
│   │   ├── Components/      # React components
│   │   └── Pages/           # Inertia.js pages
│   └── views/               # Blade templates
├── routes/
│   ├── web.php              # Web routes
│   └── api.php              # API routes
└── public/                  # Public assets
```

## 🛠️ Tech Stack

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 19 with Inertia.js
- **Styling:** Tailwind CSS
- **Database:** SQLite (development) / MySQL (production)
- **Build Tool:** Vite
- **UI Components:** Lucide React, Recharts

## 🤝 Team Collaboration

### Daily Workflow

```bash
# Start of day - get latest changes
git pull
composer install  # if new dependencies
npm install       # if new dependencies
php artisan migrate  # if new migrations

# Start development
composer run dev

# End of day - commit and push changes
git add .
git commit -m "Description of changes"
git push
```

### Database Synchronization

The team shares database state through:

1. **Migrations** - for database structure changes
2. **Seeders** - for sample data
3. **Database Dumps** - for complete state sharing

To update your database with the latest data:

```bash
# Option 1: Run migrations
php artisan migrate

# Option 2: Fresh migration with seeders
php artisan migrate:fresh --seed

# Option 3: Import database dump (if available)
# Windows:
del database\database.sqlite
type nul > database\database.sqlite
sqlite3 database\database.sqlite < database\dump.sql

# Mac/Linux:
rm database/database.sqlite
touch database/database.sqlite
sqlite3 database/database.sqlite < database/dump.sql
```

### Sharing Your Progress

When you've made significant changes:

1. **Commit your code changes:**

    ```bash
    git add .
    git commit -m "Add feature X with description"
    ```

2. **If you added data, export the database:**

    ```bash
    sqlite3 database/database.sqlite .dump > database/dump.sql
    git add database/dump.sql
    git commit -m "Update database dump"
    ```

3. **Push to repository:**

    ```bash
    git push
    ```

4. **Notify team about:**
    - New migrations to run
    - New seeders to execute
    - Breaking changes
    - New environment variables

## 📖 Documentation

- **[Team Collaboration Guide](TEAM_COLLABORATION_GUIDE.md)** - Comprehensive guide for team workflows
- **[Laravel Documentation](https://laravel.com/docs)** - Framework reference
- **[React Documentation](https://react.dev/)** - React reference
- **[Inertia.js Documentation](https://inertiajs.com/)** - Inertia.js reference

## 🔧 Common Commands

```bash
# Development
composer run dev          # Start all services
composer install          # Install PHP dependencies
npm install               # Install JS dependencies
npm run build             # Build production assets

# Database
php artisan migrate       # Run migrations
php artisan migrate:fresh --seed  # Reset and seed database
php artisan db:seed       # Run seeders

# Cache
php artisan cache:clear   # Clear application cache
php artisan config:clear  # Clear config cache
php artisan route:clear   # Clear route cache
php artisan view:clear    # Clear view cache

# Git
git pull                  # Get latest changes
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push                  # Push to remote
```

## 🐛 Troubleshooting

### Common Issues

**"Class not found" errors:**

```bash
composer dump-autoload
```

**Database connection errors:**
Check your `.env` file and ensure SQLite extension is enabled in PHP.

**Permission errors (storage):**

```bash
# Windows
icacls storage /grant Users:F /T
icacls bootstrap/cache /grant Users:F /T

# Mac/Linux
chmod -R 775 storage bootstrap/cache
```

**Vite/Asset errors:**

```bash
npm run build
```

**Application key missing:**

```bash
php artisan key:generate
```

For more troubleshooting steps, see the [Team Collaboration Guide](TEAM_COLLABORATION_GUIDE.md#troubleshooting).

## 📝 License

This project is proprietary software. All rights reserved.

---

**Need help?** Check the [Team Collaboration Guide](TEAM_COLLABORATION_GUIDE.md) or contact your team lead.
