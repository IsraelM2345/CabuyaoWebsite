# Staff-Public Portal Dynamic Synchronization Implementation

## Overview

This document describes the implementation of dynamic synchronization between the Staff management system and the Public web portal. All CRUD operations performed by staff members are now reflected in real-time on the public-facing website.

## Architecture

### Database Layer

- **Single Source of Truth**: Staff operations directly modify the `public_news`, `public_announcements`, and `public_contact_messages` tables
- **Models Used**:
    - `App\Models\PublicNews` - News articles
    - `App\Models\PublicAnnouncement` - Announcements
    - `App\Models\PublicContactMessage` - Contact form submissions

### API Layer

#### Public API (No Authentication Required)

```
GET /api/public/news           - Fetch published news for public display
GET /api/public/announcements  - Fetch active announcements for public display
POST /api/public/contact       - Submit contact form
```

#### Staff API (Authentication Required)

```
GET    /api/staff/news                    - List all news articles (with filters)
POST   /api/staff/news                    - Create new news article
GET    /api/staff/news/{id}               - Get single news article
PUT    /api/staff/news/{id}               - Update news article
DELETE /api/staff/news/{id}               - Delete news article

GET    /api/staff/announcements           - List all announcements (with filters)
POST   /api/staff/announcements           - Create new announcement
GET    /api/staff/announcements/{id}      - Get single announcement
PUT    /api/staff/announcements/{id}      - Update announcement
DELETE /api/staff/announcements/{id}      - Delete announcement

GET    /api/staff/contacts                - List contact messages
GET    /api/staff/contacts/{id}           - View contact message
POST   /api/staff/contacts/{id}/reply     - Reply to contact message
PATCH  /api/staff/contacts/{id}/status    - Update contact message status
DELETE /api/staff/contacts/{id}           - Delete contact message
```

### Frontend Layer

#### Public Portal Pages (`resources/js/Pages/Public/`)

- **News.jsx** - Displays news from `/api/public/news`
- All pages fetch data dynamically from the database via API

#### Staff Portal Pages (`resources/js/Pages/Staff/`)

- **NewsIndex.jsx** - Manage news articles (CRUD operations)
- **NewsCreate.jsx** - Create/Edit news articles
- **AnnouncementsIndex.jsx** - Manage announcements (CRUD operations)
- **AnnouncementCreate.jsx** - Create/Edit announcements
- **ContactInbox.jsx** - View and reply to contact messages

## Key Features

### 1. Real-Time Synchronization

- When staff creates/updates/deletes content, it immediately affects the public portal
- Public pages fetch fresh data on each load
- No caching delays between staff actions and public visibility

### 2. Status Management

- **News**: Draft vs Published
- **Announcements**: Draft vs Published vs Expired
- Only published content appears on public portal

### 3. Search & Filtering

Staff can filter by:

- Search query (title, content)
- Category/Type
- Status (Draft/Published)
- Date ranges

### 4. Pagination

- Server-side pagination for large datasets
- Configurable items per page
- Navigation controls on both staff and public interfaces

### 5. Image Management

- Featured images for news articles
- Image upload support
- Automatic cleanup on deletion

## Implementation Details

### Controller Changes

#### Staff News Controller (`app/Http/Controllers/Staff/NewsController.php`)

```php
// Uses PublicNews model directly
// Implements full CRUD operations
// Handles status transitions (Draft -> Published sets published_at)
// Supports bulk operations
```

#### Staff Announcements Controller (`app/Http/Controllers/Staff/AnnouncementsController.php`)

```php
// Uses PublicAnnouncement model directly
// Implements full CRUD operations
// Handles status transitions
// Supports bulk operations
```

#### Staff Contact Controller (`app/Http/Controllers/Staff/ContactReplyController.php`)

```php
// Uses PublicContactMessage model
// Reply functionality
// Status management (Unread, Read, Replied, Archived)
// Bulk operations support
```

### Frontend Changes

#### NewsIndex.jsx

- Fetches data from `/api/staff/news`
- Implements search, filter, and pagination
- Delete confirmation modal
- Direct links to edit and view on public site

#### NewsCreate.jsx

- Loads existing data when editing
- Form validation
- Image upload preview
- Save as Draft or Publish options
- Success notifications

#### AnnouncementsIndex.jsx

- Similar to NewsIndex but for announcements
- Type-based filtering
- Status management

### Database Schema

#### public_news table

```sql
id, title, category, date, excerpt, body, image_path, status, published_at, created_at, updated_at
```

#### public_announcements table

```sql
id, title, category, date, body, image_path, status, published_at, created_at, updated_at
```

#### public_contact_messages table

```sql
id, name, email, department, subject, message, status, reply, replied_at, created_at, updated_at
```

## Testing the Implementation

### 1. Run Migrations

```bash
php artisan migrate:fresh --seed
```

### 2. Start Development Server

```bash
php artisan serve
npm run dev
```

### 3. Test Staff Operations

1. Login to staff portal at `/staff/login`
2. Navigate to News Manager (`/staff/news-manager`)
3. Create a new news article
4. Publish it
5. Visit `/news` to see it on public portal

### 4. Test Public Display

1. Visit `/news` - Should show all published news
2. Visit `/` (home) - May show featured news
3. Filter by category on public news page

## Security Considerations

1. **Authentication**: All staff API routes require `auth:sanctum` middleware
2. **CSRF Protection**: All forms include CSRF tokens
3. **Validation**: Server-side validation on all inputs
4. **Authorization**: Staff can only access staff routes when authenticated

## Future Enhancements

1. **WebSocket Integration**: Real-time updates without page refresh
2. **Media Library**: Centralized image/document management
3. **Version History**: Track changes to content
4. **Scheduled Publishing**: Set future publish dates
5. **Multi-language Support**: Content in multiple languages
6. **SEO Tools**: Meta tags, slugs, sitemap generation
7. **Analytics**: View counts, popular content tracking

## Troubleshooting

### Issue: Changes not appearing on public portal

**Solution**: Clear browser cache, ensure content status is "Published"

### Issue: API returns 401 Unauthorized

**Solution**: Ensure staff is logged in, check auth middleware

### Issue: Images not displaying

**Solution**: Check `APP_URL` in .env, ensure storage link exists (`php artisan storage:link`)

### Issue: Validation errors

**Solution**: Check required fields, ensure data meets validation rules

## Conclusion

This implementation provides a complete CRUD system where staff operations directly and immediately affect the public portal. The architecture is scalable, secure, and maintainable, following Laravel and React best practices.
