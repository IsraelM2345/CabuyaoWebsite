# Role-Based Access Control Setup Guide

## Overview

The User Management system now has role-based access control. Only users with the `admin` role can:

- View the User Management page
- See the User Management link in the sidebar
- Access the user management API endpoints

## How It Works

### User Roles

Users have a `role` column in the database with two possible values:

- `admin` - Full access to User Management
- `user` - Regular staff access (cannot manage users)

### Default Role

New users are assigned the `user` role by default when they register.

## Setting Up an Admin User

### Option 1: Via phpMyAdmin (Recommended for First Admin)

1. Open phpMyAdmin at `http://localhost/phpmyadmin`
2. Select your database
3. Click on the `users` table
4. Click **Browse** to see all users
5. Click **Edit** on the user you want to make admin
6. In the `role` field, change the value from `user` to `admin`
7. Click **Go** to save

### Option 2: Via SQL Query

Run this SQL query in phpMyAdmin (replace `1` with the user ID you want to make admin):

```sql
UPDATE users SET role = 'admin' WHERE id = 1;
```

### Option 3: Via Laravel Tinker

```bash
php artisan tinker
```

Then run:

```php
$user = App\Models\User::find(1); // Replace 1 with the user ID
$user->role = 'admin';
$user->save();
exit
```

## Verifying Admin Access

1. **Login as the admin user** at `/staff/login`
2. **Check the sidebar** - You should see the "User Management" link
3. **Click User Management** - You should see the full user management interface

## Verifying Non-Admin Access

1. **Login as a regular user** (role = 'user')
2. **Check the sidebar** - The "User Management" link should NOT be visible
3. **Try accessing** `/staff/user-management` directly - You should see an "Access Denied" page

## Security Features

### Frontend Protection

- Sidebar filters menu items based on user role
- User Management page checks authorization before loading
- Non-admin users see an "Access Denied" page

### Backend Protection

- API endpoints check user role via middleware
- Non-admin API requests return 403 Forbidden
- Current user endpoint (`/api/staff/me`) returns user role

## Important Notes

1. **First Admin**: The first user to register should be manually set as admin via phpMyAdmin
2. **Admin Creation**: Only existing admins can create new admin users (via the User Management interface)
3. **Last Admin**: The system prevents deleting the last admin user
4. **Role Persistence**: User roles persist across sessions

## Troubleshooting

### "User Management" link not showing for admin

- Verify the user's `role` is set to `admin` in the database
- Clear browser cache and localStorage
- Logout and login again

### Access Denied for admin user

- Check the database to confirm role is `admin` (not `Admin` or `ADMIN`)
- Ensure the migration ran successfully

### API returns 403 for admin

- Verify the user is logged in
- Check the `role` column value in the database

## Database Schema

The `users` table now includes:

| Column       | Type      | Default | Description            |
| ------------ | --------- | ------- | ---------------------- |
| `id`         | BIGINT    | Auto    | User ID                |
| `name`       | VARCHAR   | -       | User's full name       |
| `email`      | VARCHAR   | -       | User's email (unique)  |
| `role`       | VARCHAR   | 'user'  | User role (admin/user) |
| `password`   | VARCHAR   | -       | Hashed password        |
| `created_at` | TIMESTAMP | -       | Account creation date  |
| `updated_at` | TIMESTAMP | -       | Last update date       |

## Quick Reference

### Check current user's role

```sql
SELECT id, name, email, role FROM users WHERE id = 1;
```

### List all admin users

```sql
SELECT id, name, email FROM users WHERE role = 'admin';
```

### List all non-admin users

```sql
SELECT id, name, email FROM users WHERE role = 'user';
```

---

**Last Updated:** June 10, 2026
**Version:** 1.0
