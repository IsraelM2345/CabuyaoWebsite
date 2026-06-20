# Councilor Dynamic Synchronization Implementation Guide

## Overview

This guide explains the complete implementation of the dynamic councilor management system that connects the staff admin panel with the public-facing Council page.

## Architecture

### Database Layer

- **Table**: `public_councilors`
- **Model**: `App\Models\PublicCouncilor`
- **Migration**: `database/migrations/2026_06_07_000000_create_public_councilors_table.php`

### API Layer

- **Controller**: `App\Http\Controllers\Staff\CouncilorController`
- **Routes**:
    - Staff API (authenticated): `/api/staff/councilors` (CRUD operations)
    - Public API (no auth): `/api/public/councilors` (read-only)

### Frontend Layer

- **Staff Interface**: `resources/js/Pages/Staff/OfficialsCouncilors.jsx`
- **Public Interface**: `resources/js/Pages/Public/Council.jsx`

## Key Features

### 1. Real-Time Synchronization

✅ **Staff Side**: When you add, edit, or delete a councilor in the admin panel, changes are immediately saved to the database.

✅ **Public Side**: The Council page fetches data from the API, so any changes made in the admin panel are instantly reflected on the public page.

### 2. Data Structure

Each councilor record includes:

- `id` - Unique identifier
- `name` - Full name
- `position` - Position title (default: "Councilor")
- `education` - Educational background
- `birthday` - Date of birth
- `chairmanships` - Array of committee chairmanships (stored as JSON)
- `memberships` - Array of committee memberships (stored as JSON)
- `photo_path` - Path to uploaded photo (stored in storage/app/public)
- `order_column` - Display order
- `is_active` - Active/inactive status

### 3. Photo Management

- Photos are uploaded as base64 data
- Stored in `storage/app/public/councilors/`
- Accessible via `/storage/councilors/{filename}`
- Automatic fallback to avatar API if no photo exists

### 4. API Endpoints

#### Staff Endpoints (Require Authentication)

```
GET    /api/staff/councilors          - List all councilors
POST   /api/staff/councilors          - Create new councilor
GET    /api/staff/councilors/{id}     - Get single councilor
PUT    /api/staff/councilors/{id}     - Update councilor
DELETE /api/staff/councilors/{id}     - Delete councilor
```

#### Public Endpoints (No Authentication)

```
GET    /api/public/councilors         - List all active councilors
GET    /api/public/councilors/{id}    - Get single councilor
```

## How It Works

### Staff Admin Workflow

1. **Loading Data**

    ```javascript
    // OfficialsCouncilors.jsx
    useEffect(() => {
        fetchCouncilors();
    }, []);

    const fetchCouncilors = async () => {
        const res = await fetch("/api/staff/councilors", {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "same-origin",
        });
        const json = await res.json();
        if (json.success) {
            setCouncilors(json.data);
        }
    };
    ```

2. **Adding/Editing Councilor**
    - Form collects data including photo (as base64)
    - On save, sends POST (new) or PUT (edit) request
    - Server saves to database and returns updated data
    - Component refreshes the list

3. **Deleting Councilor**
    - Shows confirmation modal
    - On confirm, sends DELETE request
    - Server deletes record and associated photo
    - Component refreshes the list

### Public Display Workflow

1. **Loading Data**

    ```javascript
    // Council.jsx
    useEffect(() => {
        fetchCouncilors();
    }, []);

    const fetchCouncilors = async () => {
        const res = await fetch("/api/public/councilors", {
            headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "same-origin",
        });
        const json = await res.json();
        if (json.success) {
            setCouncilors(json.data);
        }
    };
    ```

2. **Displaying Councilors**
    - Maps through councilors array
    - Shows grid of councilor cards
    - Each card shows photo (or avatar fallback), name
    - Click to open detailed modal

3. **Modal Details**
    - Shows full profile with education, birthday
    - Lists chairmanships and memberships
    - Graceful handling of missing data

## Setup Instructions

### 1. Database Setup

```bash
# Run migration
php artisan migrate

# Seed initial data (optional)
php artisan db:seed --class=PublicCouncilorSeeder
```

### 2. Storage Link

Ensure storage link is created:

```bash
php artisan storage:link
```

### 3. Frontend Build

```bash
npm run build
# or for development
npm run dev
```

### 4. Access Points

- **Staff Admin**: `/staff/officials-councilors` (requires login)
- **Public Page**: `/council` (no login required)

## Testing the Synchronization

### Test 1: Add New Councilor

1. Log in to staff panel
2. Go to Officials > City Councilors
3. Click "Add Councilor"
4. Fill in details and upload photo
5. Click "Save Profile"
6. Visit `/council` page - new councilor should appear

### Test 2: Edit Existing Councilor

1. In staff panel, click "Edit" on any councilor
2. Modify information (e.g., add committee membership)
3. Click "Save"
4. Refresh `/council` page - changes should be visible

### Test 3: Delete Councilor

1. In staff panel, click delete icon on any councilor
2. Confirm deletion
3. Visit `/council` page - councilor should be gone

## Data Flow Diagram

```
┌─────────────────┐
│   Staff Admin   │
│  (Officials     │
│  Councilors)    │
└────────┬────────┘
         │
         │ POST/PUT/DELETE
         │ /api/staff/councilors
         ▼
┌─────────────────┐
│   Database      │
│ public_councilors│
└────────┬────────┘
         │
         │ GET
         │ /api/public/councilors
         ▼
┌─────────────────┐
│   Public Page   │
│    (Council)    │
└─────────────────┘
```

## Benefits

1. **Single Source of Truth**: All data stored in database, no duplication
2. **Real-Time Updates**: Changes immediately visible on public page
3. **Scalable**: Can handle unlimited councilors
4. **Photo Management**: Automatic upload and storage handling
5. **Responsive**: Works on mobile and desktop
6. **Accessible**: Public API available for future integrations

## Troubleshooting

### Issue: Photos not displaying

**Solution**: Ensure storage link exists: `php artisan storage:link`

### Issue: API returns 401 Unauthorized

**Solution**: Staff endpoints require authentication. Ensure you're logged in.

### Issue: Changes not appearing on public page

**Solution**:

1. Check browser console for errors
2. Verify API endpoint is accessible: `curl http://localhost/api/public/councilors`
3. Clear browser cache

### Issue: Database errors

**Solution**:

1. Check `.env` file for correct database configuration
2. Ensure migration ran successfully: `php artisan migrate:status`
3. Check database file permissions

## Future Enhancements

1. **Image Optimization**: Auto-resize uploaded photos
2. **Bulk Operations**: Import/export councilors via CSV
3. **Versioning**: Track changes to councilor profiles
4. **Search**: Add search functionality to public page
5. **Filtering**: Filter by committee or position
6. **API Pagination**: For large numbers of councilors

## Security Notes

- Staff endpoints require authentication
- CSRF protection enabled on all forms
- File upload validation (image types only)
- SQL injection protection via Eloquent ORM
- XSS protection via Laravel's built-in escaping

## Support

For issues or questions:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Check browser console for JavaScript errors
3. Verify API responses using browser dev tools Network tab

---

**Implementation Date**: June 7, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
