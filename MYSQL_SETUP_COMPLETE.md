# MySQL Database Setup - COMPLETE ✅

## Setup Summary

Your Laravel project has been successfully migrated from SQLite to MySQL!

### What Was Done

1. ✅ **Created MySQL Database**: `cabuyao_city_portal`
2. ✅ **Updated Configuration**: Modified `.env` to use MySQL
3. ✅ **Ran Migrations**: All 23 migrations executed successfully
4. ✅ **Seeded Database**: Initial data populated
5. ✅ **Verified Connection**: MySQL connection confirmed working

### Current Configuration

**Database Details:**

- **Connection**: MySQL
- **Host**: 127.0.0.1:3306
- **Database**: `cabuyao_city_portal`
- **Username**: `root`
- **Password**: (empty)
- **Character Set**: utf8mb4_unicode_ci

### Database Tables Created

Your database now includes all necessary tables:

- `users` (with role-based access)
- `cache`
- `jobs`
- `news`
- `announcements`
- `contact_messages`
- `contact_replies`
- `cms_pages`
- `cms_images`
- `cms_list_items`
- `public_news`
- `public_announcements`
- `public_contact_messages`
- `public_media`
- `public_councilors`
- `public_executives`
- And more...

### How to View Your Database

**Option 1: phpMyAdmin**

1. Open `http://localhost/phpmyadmin`
2. Select `cabuyao_city_portal` database from the left sidebar
3. Browse tables and data

**Option 2: Laravel Tinker**

```bash
php artisan tinker
```

Then run queries:

```php
// View all users
App\Models\User::all();

// Count records
App\Models\User::count();

// Find specific user
App\Models\User::find(1);
```

### Next Steps: Create Your Admin User

Since you now have a fresh MySQL database, you'll need to create an admin user:

**Step 1: Register a Staff Account**

1. Go to `http://localhost/your-project/staff/register`
2. Fill in your details
3. Submit the form

**Step 2: Make Yourself Admin**
Since new users get the `user` role by default, you need to manually set yourself as admin:

**Via phpMyAdmin:**

1. Open phpMyAdmin
2. Select `cabuyao_city_portal` database
3. Click on `users` table
4. Find your user and click "Edit"
5. Change `role` from `user` to `admin`
6. Click "Go" to save

**Via Laravel Tinker:**

```bash
php artisan tinker
```

```php
$user = App\Models\User::where('email', 'your-email@example.com')->first();
$user->role = 'admin';
$user->save();
exit
```

**Step 3: Login**

1. Go to `http://localhost/your-project/staff/login`
2. Login with your credentials
3. You should now see the "User Management" link in the sidebar

### Testing the Setup

**Test Database Connection:**

```bash
php artisan migrate:status
```

**Test User Model:**

```bash
php artisan tinker
>>> App\Models\User::count();
```

**Test Application:**

```bash
php artisan serve
```

Then visit `http://localhost:8000`

### Important Notes

1. **No SQLite File**: The old SQLite file (`database/database.sqlite`) was not present, so no cleanup was needed.

2. **Session Driver**: Your `.env` is configured to use `SESSION_DRIVER=database`, which stores sessions in MySQL. This is perfect for production.

3. **Cache & Queue**: Also configured to use database (`CACHE_STORE=database`, `QUEUE_CONNECTION=database`).

4. **Backup**: Remember to regularly backup your MySQL database:
    ```bash
    mysqldump -u root cabuyao_city_portal > backup_$(date +%Y%m%d).sql
    ```

### Troubleshooting

**If you get "Database not found" error:**

- Make sure you created the database in phpMyAdmin
- Check that MySQL is running in XAMPP

**If you get "Access denied" error:**

- Verify your `.env` credentials match your MySQL setup
- Default XAMPP MySQL credentials: username=`root`, password=(empty)

**If migrations fail:**

```bash
php artisan migrate:rollback
php artisan migrate:fresh --seed
```

### Switching Back to SQLite (If Needed)

If you ever need to switch back to SQLite:

1. Update `.env`:

    ```env
    DB_CONNECTION=sqlite
    # Comment out other DB_* lines
    ```

2. Create SQLite file:

    ```bash
    touch database/database.sqlite
    ```

3. Run migrations:
    ```bash
    php artisan migrate:fresh --seed
    ```

### Performance Benefits

By switching to MySQL, you now have:

- ✅ Better concurrent user support
- ✅ Improved scalability
- ✅ Advanced database features
- ✅ Better data integrity
- ✅ Industry-standard database system

---

**Setup Completed:** June 10, 2026
**Database:** MySQL (cabuyao_city_portal)
**Status:** ✅ Fully Operational

For any questions or issues, refer to the Laravel documentation or check the application logs at `storage/logs/laravel.log`.
