# Staff User Management Guide

## Overview

This guide explains how to view and manage staff user accounts through both the **Admin Dashboard** and **phpMyAdmin** database interface.

## Table of Contents

1. [Admin Dashboard User Management](#admin-dashboard-user-management)
2. [Accessing phpMyAdmin](#accessing-phpmyadmin)
3. [Database Structure](#database-structure)
4. [Common Database Queries](#common-database-queries)
5. [Troubleshooting](#troubleshooting)

---

## Admin Dashboard User Management

### Accessing the User Management Page

1. **Login** to the staff portal at `/staff/login`
2. Navigate to **User Management** in the staff sidebar, or go directly to `/staff/user-management`

### Features

The User Management dashboard provides:

- **View all registered users** in a table format
- **Search** users by name or email
- **Pagination** for easy navigation (10 users per page)
- **View user details** (click the eye icon)
- **Delete users** (click the trash icon)
- **Export users to CSV** for offline analysis

### User Actions

#### View User Details

Click the **eye icon** on any user row to see:

- User ID
- Full name
- Email address
- Account creation date
- Last update date

#### Delete User

Click the **trash icon** to delete a user account. You'll be asked to confirm before deletion.

**Note:** You cannot delete the last user in the system.

#### Export to CSV

Click the **Export CSV** button to download all user data in a spreadsheet format.

---

## Accessing phpMyAdmin

### For XAMPP Users

1. **Start XAMPP Control Panel**
2. Ensure **Apache** and **MySQL** are running
3. Open your browser and go to: `http://localhost/phpmyadmin`
4. You'll see the phpMyAdmin interface

### For WAMP Users

1. **Start WAMP Server**
2. Click the WAMP icon in the system tray
3. Select **phpMyAdmin** from the menu
4. Or go to: `http://localhost/phpmyadmin`

### For Remote Server Users

1. Access your hosting control panel (cPanel, Plesk, etc.)
2. Look for **phpMyAdmin** in the database section
3. Click to launch phpMyAdmin

---

## Database Structure

### Users Table

The staff users are stored in the `users` table with the following columns:

| Column              | Type         | Description                        |
| ------------------- | ------------ | ---------------------------------- |
| `id`                | BIGINT       | Unique user ID (auto-increment)    |
| `name`              | VARCHAR(255) | User's full name                   |
| `email`             | VARCHAR(255) | User's email address (unique)      |
| `password`          | VARCHAR(255) | Hashed password                    |
| `email_verified_at` | TIMESTAMP    | When email was verified (nullable) |
| `remember_token`    | VARCHAR(100) | Session remember token             |
| `created_at`        | TIMESTAMP    | Account creation date              |
| `updated_at`        | TIMESTAMP    | Last update date                   |

### Viewing the Users Table

1. In phpMyAdmin, select your database from the left sidebar
2. Click on the **`users`** table
3. You'll see the table structure and data

### Browsing User Data

1. Click the **Browse** tab at the top
2. You'll see all registered users
3. Use the search box to find specific users
4. Click **Edit** to modify user data
5. Click **Delete** to remove a user

---

## Common Database Queries

### View All Users

```sql
SELECT id, name, email, created_at, updated_at
FROM users
ORDER BY created_at DESC;
```

### Count Total Users

```sql
SELECT COUNT(*) as total_users FROM users;
```

### Find User by Email

```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

### Find Users Created Today

```sql
SELECT * FROM users
WHERE DATE(created_at) = CURDATE();
```

### Find Users Created This Week

```sql
SELECT * FROM users
WHERE YEARWEEK(created_at) = YEARWEEK(NOW());
```

### Find Users Created This Month

```sql
SELECT * FROM users
WHERE MONTH(created_at) = MONTH(NOW())
AND YEAR(created_at) = YEAR(NOW());
```

### Delete a User (CAUTION!)

```sql
DELETE FROM users WHERE id = 1;
```

**⚠️ Warning:** This action cannot be undone. Make sure you have the correct user ID.

### Update User Email

```sql
UPDATE users
SET email = 'newemail@example.com'
WHERE id = 1;
```

### Update User Name

```sql
UPDATE users
SET name = 'New Name'
WHERE id = 1;
```

---

## Troubleshooting

### Cannot Access phpMyAdmin

**Problem:** Getting "403 Forbidden" or "404 Not Found"

**Solutions:**

- Ensure XAMPP/WAMP is running
- Check if Apache service is started
- Verify the URL: `http://localhost/phpmyadmin` (not `https`)
- Check firewall settings

### Cannot See Users Table

**Problem:** The `users` table is not visible in phpMyAdmin

**Solutions:**

- Make sure you selected the correct database
- Check if the database exists: Look for a database named `evactech` or your configured database name
- Run migrations: `php artisan migrate`

### Login Issues

**Problem:** Users cannot login after registration

**Solutions:**

1. Check if the user exists in the database:
    ```sql
    SELECT * FROM users WHERE email = 'user@example.com';
    ```
2. Verify the password is hashed (should start with `$2y$`)
3. Try resetting the password:
    ```sql
    UPDATE users
    SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
    WHERE id = 1;
    ```
    (This sets password to "password")

### User Cannot Be Deleted

**Problem:** Getting error "Cannot delete the last user"

**Solution:** This is a safety feature. You must have at least one user in the system. Create a new user first, then delete the old one.

### Database Connection Issues

**Problem:** Cannot connect to database

**Solutions:**

1. Check `.env` file for correct database credentials:
    ```
    DB_CONNECTION=sqlite
    DB_DATABASE=/path/to/database.sqlite
    ```
    OR for MySQL:
    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database
    DB_USERNAME=root
    DB_PASSWORD=
    ```
2. Ensure MySQL service is running
3. Verify database exists

---

## Security Best Practices

### For Admin Dashboard

1. **Never share login credentials**
2. **Use strong passwords** (minimum 8 characters, mix of letters, numbers, symbols)
3. **Log out** when finished
4. **Regularly review** user accounts

### For phpMyAdmin

1. **Never expose phpMyAdmin to the internet** without proper authentication
2. **Use strong MySQL root password**
3. **Regularly backup** your database
4. **Be cautious** when running DELETE or UPDATE queries
5. **Always backup** before making bulk changes

### Database Backups

#### Export Database (phpMyAdmin)

1. Select your database
2. Click **Export** tab
3. Choose **Quick** export method
4. Click **Go**
5. Save the `.sql` file

#### Import Database (phpMyAdmin)

1. Select your database
2. Click **Import** tab
3. Choose the `.sql` file
4. Click **Go**

---

## Quick Reference

### Admin Dashboard URL

```
http://localhost/staff/user-management
```

### phpMyAdmin URL

```
http://localhost/phpmyadmin
```

### Database Name

```
Check .env file: DB_DATABASE=your_database_name
```

### Users Table

```
Table name: users
```

### Key Columns

- `id` - User ID
- `name` - User's full name
- `email` - User's email (unique)
- `created_at` - Registration date
- `updated_at` - Last update date

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the application logs: `storage/logs/laravel.log`
2. Review the `.env` file for configuration issues
3. Contact the development team for assistance

---

**Last Updated:** June 10, 2026
**Version:** 1.0
