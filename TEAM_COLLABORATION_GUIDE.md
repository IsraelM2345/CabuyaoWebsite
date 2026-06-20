# Team Collaboration & Environment Setup Guide

This guide ensures all team members can set up identical development environments and see the same output when running the project.

## 📋 Table of Contents

1. [Version Control Setup](#version-control-setup)
2. [Initial Project Setup](#initial-project-setup)
3. [Database Synchronization](#database-synchronization)
4. [Environment Configuration](#environment-configuration)
5. [Sharing Database State](#sharing-database-state)
6. [Daily Workflow](#daily-workflow)
7. [Troubleshooting](#troubleshooting)

---

## Version Control Setup

### 1. Repository Access

All team members should have access to the same Git repository. If you're the main developer:

```bash
# Make sure your repository is properly set up
git remote -v
# Should show something like:
# origin  https://github.com/yourusername/your-repo.git (fetch)
# origin  https://github.com/yourusername/your-repo.git (push)
```

### 2. Branch Strategy

Adopt a simple branching strategy:

```bash
# Main branch (always stable)
main

# Development branch (where you work)
develop

# Feature branches (for specific features)
feature/new-announcement-system
fix/database-migration-issue
```

### 3. .gitignore Best Practices

Your current `.gitignore` is good. It properly excludes:

- `.env` (environment variables)
- `node_modules/` (npm dependencies)
- `vendor/` (PHP dependencies)
- `storage/` (runtime files)
- `public/build/` (compiled assets)

**Important**: Never commit `.env` file as it contains sensitive data like database passwords.

---

## Initial Project Setup

### For New Team Members

Share these exact steps with your groupmates:

#### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

#### Step 2: Install PHP Dependencies

```bash
composer install
```

#### Step 3: Install JavaScript Dependencies

```bash
npm install
```

#### Step 4: Environment Configuration

```bash
# Copy the example environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

#### Step 5: Database Setup

**Option A: Using SQLite (Easiest - Recommended for Development)**

```bash
# SQLite is already configured in .env.example
# Just create the database file
type nul > database/database.sqlite

# Run migrations
php artisan migrate
```

**Option B: Using MySQL**

If you want to use MySQL like the main developer:

1. Install XAMPP or similar
2. Start Apache and MySQL
3. Create database in phpMyAdmin:
    ```sql
    CREATE DATABASE cabuyao_city_website;
    ```
4. Update `.env` file:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=cabuyao_city_website
    DB_USERNAME=root
    DB_PASSWORD=
    ```
5. Run migrations:
    ```bash
    php artisan migrate
    ```

#### Step 6: Seed the Database (Optional)

If you want sample data:

```bash
php artisan db:seed
```

Or run both migration and seeding:

```bash
php artisan migrate:fresh --seed
```

#### Step 7: Build Frontend Assets

```bash
npm run build
```

#### Step 8: Start Development Server

**Option A: Start everything with one command (Recommended)**

```bash
composer run dev
```

This starts:

- Laravel development server
- Queue worker
- Log viewer (Pail)
- Vite frontend dev server

**Option B: Start services separately**

Terminal 1 - Laravel Server:

```bash
php artisan serve
```

Terminal 2 - Vite:

```bash
npm run dev
```

Terminal 3 - Queue Worker:

```bash
php artisan queue:listen
```

---

## Database Synchronization

### Sharing Database Structure

The database structure is shared through **migrations**. When you create new tables or modify existing ones:

```bash
# Create a new migration
php artisan make:migration create_feature_name_table

# Edit the migration file in database/migrations/

# Commit and push
git add database/migrations/
git commit -m "Add new feature table"
git push
```

Team members pull and run:

```bash
git pull
php artisan migrate
```

### Sharing Database Content

#### Method 1: Using Seeders (Recommended for Sample Data)

Create seeders for data that should be shared:

```bash
php artisan make:seeder FeatureNameSeeder
```

Edit the seeder file in `database/seeders/`, then commit and push.

Team members run:

```bash
php artisan db:seed --class=FeatureNameSeeder
```

#### Method 2: Database Dump (For Complete State)

**Export database (Main developer):**

For SQLite:

```bash
# Export structure and data
sqlite3 database/database.sqlite .dump > database/dump.sql
```

For MySQL:

```bash
# Export using mysqldump
mysqldump -u root cabuyao_city_website > database/dump.sql
```

Commit and push the dump file:

```bash
git add database/dump.sql
git commit -m "Update database dump with latest data"
git push
```

**Import database (Team members):**

For SQLite:

```bash
# Delete existing database
del database/database.sqlite

# Create new database
type nul > database/database.sqlite

# Import dump
sqlite3 database/database.sqlite < database/dump.sql
```

For MySQL:

```bash
# Drop and recreate database
mysql -u root -e "DROP DATABASE IF EXISTS cabuyao_city_website; CREATE DATABASE cabuyao_city_website;"

# Import dump
mysql -u root cabuyao_city_website < database/dump.sql
```

#### Method 3: Using Laravel's Built-in Commands

**Export:**

```bash
php artisan db:dump --output=database/dump.sql
```

**Import:**

```bash
# First, clear existing database
php artisan db:wipe

# Then import
# For SQLite:
sqlite3 database/database.sqlite < database/dump.sql

# For MySQL:
mysql -u root cabuyao_city_website < database/dump.sql
```

---

## Environment Configuration

### Sharing Environment Settings

Create a detailed `.env.example` file that includes all necessary settings:

```env
APP_NAME="Cabuyao City Website"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

# Database Configuration
# Choose ONE of the following:

# Option 1: SQLite (Recommended for simplicity)
DB_CONNECTION=sqlite

# Option 2: MySQL
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=cabuyao_city_website
# DB_USERNAME=root
# DB_PASSWORD=

# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Cache Configuration
CACHE_STORE=database

# Queue Configuration
QUEUE_CONNECTION=database

# Mail Configuration (Log driver for development)
MAIL_MAILER=log

# Vite Configuration
VITE_APP_NAME="${APP_NAME}"
```

### Important Notes for Team Members

1. **Never commit `.env`** - Only commit `.env.example`
2. **Each developer should have their own `.env`** with local settings
3. **Database credentials** will differ based on each developer's setup

---

## Sharing Database State

### When to Share Database State

Share your database state when:

- You've added important sample data
- You've created new seeders
- You want team to see exact same content

### Best Practices

1. **Use migrations for structure changes**
2. **Use seeders for reproducible data**
3. **Use database dumps for complex state**

### Creating a Complete Setup Script

Create a script that team members can run to get exact same state:

**File: `setup_from_dump.bat` (Windows)**

```batch
@echo off
echo Setting up project from database dump...

REM Install dependencies
composer install
npm install

REM Setup environment
if not exist .env copy .env.example .env
php artisan key:generate

REM Setup database
if exist database/database.sqlite del database/database.sqlite
type nul > database/database.sqlite
sqlite3 database/database.sqlite < database/dump.sql

REM Build assets
npm run build

echo Setup complete! Run 'composer run dev' to start.
```

**File: `setup_from_dump.sh` (Mac/Linux)**

```bash
#!/bin/bash
echo "Setting up project from database dump..."

# Install dependencies
composer install
npm install

# Setup environment
if [ ! -f .env ]; then cp .env.example .env; fi
php artisan key:generate

# Setup database
if [ -f database/database.sqlite ]; then rm database/database.sqlite; fi
touch database/database.sqlite
sqlite3 database/database.sqlite < database/dump.sql

# Build assets
npm run build

echo "Setup complete! Run 'composer run dev' to start."
```

---

## Daily Workflow

### Starting Work

```bash
# Pull latest changes
git pull

# Install any new dependencies
composer install
npm install

# Run new migrations if any
php artisan migrate

# Start development
composer run dev
```

### Making Changes

1. **Create a feature branch:**

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **Make your changes**

3. **Test locally:**

    ```bash
    npm run build
    php artisan serve
    ```

4. **Commit changes:**

    ```bash
    git add .
    git commit -m "Description of changes"
    ```

5. **Push to remote:**

    ```bash
    git push origin feature/your-feature-name
    ```

6. **Create Pull Request** on GitHub

### Sharing Progress with Team

#### 1. Commit Messages

Write clear, descriptive commit messages:

```bash
# Bad
git commit -m "fixed stuff"

# Good
git commit -m "Add announcement CRUD functionality
- Created AnnouncementController
- Added React components for listing and forms
- Created database migration and seeder
- Updated routes and navigation"
```

#### 2. Push Regularly

Push your work at the end of each session:

```bash
git add .
git commit -m "Completed feature X"
git push
```

#### 3. Update Database Dump When Needed

If you've added important data:

```bash
# Export current database state
sqlite3 database/database.sqlite .dump > database/dump.sql

# Commit the dump
git add database/dump.sql
git commit -m "Update database dump with new announcements and officials"
git push
```

#### 4. Communicate Changes

Let your team know about:

- New migrations that need to be run
- New seeders that should be executed
- Breaking changes
- New environment variables needed

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Class not found" errors

```bash
composer dump-autoload
```

#### Issue 2: Database connection errors

Check your `.env` file:

```env
# For SQLite
DB_CONNECTION=sqlite

# For MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cabuyao_city_website
DB_USERNAME=root
DB_PASSWORD=
```

#### Issue 3: Migration errors

```bash
# Clear configuration cache
php artisan config:clear

# Rollback and re-run migrations
php artisan migrate:rollback
php artisan migrate
```

#### Issue 4: Vite/Asset errors

```bash
# Clear cache
npm run build

# Or delete build folder and rebuild
rmdir /s public/build
npm run build
```

#### Issue 5: Permission errors (Storage)

```bash
# Windows
icacls storage /grant Users:F /T
icacls bootstrap/cache /grant Users:F /T

# Mac/Linux
chmod -R 775 storage bootstrap/cache
```

#### Issue 6: "Application key is missing"

```bash
php artisan key:generate
```

#### Issue 7: Node modules issues

```bash
# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

### Getting Help

If you encounter issues:

1. Check the error message carefully
2. Search for the error online
3. Check Laravel documentation
4. Ask in team chat with:
    - Error message
    - What you were trying to do
    - Steps you've already tried

---

## Quick Reference Commands

### Daily Commands

```bash
# Start development
composer run dev

# Stop development (Ctrl+C in terminal)

# Pull latest changes
git pull

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Fresh migration with seeding
php artisan migrate:fresh --seed

# Build assets
npm run build

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Git Commands

```bash
# Check status
git status

# View changes
git diff

# Stage all changes
git add .

# Commit
git commit -m "message"

# Push
git push

# Pull
git pull

# Create branch
git checkout -b feature/name

# Switch branch
git checkout branch-name

# Merge branch
git merge branch-name
```

---

## Best Practices Summary

1. **Always pull before starting work**
2. **Commit and push regularly**
3. **Write clear commit messages**
4. **Test before pushing**
5. **Update documentation when needed**
6. **Communicate breaking changes**
7. **Keep `.env` out of version control**
8. **Use migrations for database changes**
9. **Use seeders for sample data**
10. **Help teammates with setup issues**

---

## For the Main Developer (You)

As the primary developer, you should:

1. **Maintain the main branch** - Keep it stable
2. **Update `.env.example`** when adding new config
3. **Create database dumps** when significant data is added
4. **Write migration files** for all database changes
5. **Create seeders** for sample data
6. **Document new features** in README or separate files
7. **Review team members' pull requests**
8. **Resolve merge conflicts** when they occur

---

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Git Documentation](https://git-scm.com/doc)
- [React Documentation](https://react.dev/)
- [Inertia.js Documentation](https://inertiajs.com/)

---

**Remember**: Good collaboration starts with clear communication and consistent practices. Follow this guide to ensure everyone on your team has the same experience when running the project!
