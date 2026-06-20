# Dynamic Dashboard Implementation Guide

## Overview

The Staff Dashboard has been transformed from a static page with hardcoded data to a fully dynamic system that fetches real-time statistics from the database. This ensures that all staff members see accurate, up-to-date information about the portal's content and activity.

## What Was Changed

### 1. **Backend API Created**

- **File**: `app/Http/Controllers/Staff/DashboardController.php`
- **Purpose**: Serves real-time dashboard statistics from the database
- **Endpoint**: `GET /api/staff/dashboard/stats`

### 2. **API Route Added**

- **File**: `routes/api.php`
- **Route**: `Route::get('/dashboard/stats', [DashboardController::class, 'getDashboardData']);`
- **Middleware**: Requires authentication (`web` + `auth`)

### 3. **Frontend Updated**

- **File**: `resources/js/Pages/Staff/StaffDashboard.jsx`
- **Changes**:
    - Removed all hardcoded sample data
    - Added API fetching logic
    - Implemented loading states
    - Added error handling
    - Added refresh functionality

## How It Works

### Data Flow

```
User visits /staff/dashboard
    ↓
StaffDashboard.jsx component mounts
    ↓
useEffect triggers fetchDashboardData()
    ↓
Fetch request to /api/staff/dashboard/stats
    ↓
DashboardController queries database
    ↓
Returns JSON with real statistics
    ↓
React state updates
    ↓
Dashboard displays real data
```

### Data Retrieved from Database

1. **News Statistics**
    - Total news articles
    - Published vs draft count
    - Weekly trend percentage

2. **Announcement Statistics**
    - Total announcements
    - Active vs expired count
    - Weekly trend percentage

3. **Contact Messages**
    - Total messages received
    - Unread vs responded count
    - Weekly trend percentage

4. **Recent Content**
    - Latest 5 news/announcements
    - Shows title, status, date, author

5. **Pending Tasks**
    - Draft articles to review
    - Unread messages to respond to
    - Expired announcements to check
    - Media files pending approval

6. **Page Views**
    - Simulated 7-day traffic data
    - (Can be connected to real analytics later)

7. **System Status**
    - Website status
    - Database health
    - Storage usage
    - Email service status

## Key Features

### 1. **Real-Time Data**

All statistics are pulled directly from the database, ensuring accuracy.

### 2. **Loading States**

- Shows loading spinners while fetching data
- Skeleton loaders for cards and lists
- Smooth transitions when data loads

### 3. **Error Handling**

- Displays error banner if API fails
- Retry button to refresh data
- Graceful fallbacks for missing data

### 4. **Manual Refresh**

- Refresh button in the header
- Updates all dashboard data
- Shows loading state during refresh

### 5. **Trend Indicators**

- Shows weekly growth/decline percentages
- Helps track content production trends
- Calculated by comparing current vs previous week

## Testing the Dynamic Dashboard

### Test Successful Data Load

1. Login to staff portal
2. Navigate to `/staff/dashboard`
3. Verify data loads from database
4. Check that numbers match actual database records

### Test Loading States

1. Clear browser cache
2. Visit dashboard
3. Should see loading spinners
4. Data should appear after API responds

### Test Error Handling

1. Stop Laravel server
2. Visit dashboard
3. Should see error banner
4. Click "Retry" button
5. Start server and retry should succeed

### Test Refresh

1. Visit dashboard
2. Add new news article in another tab
3. Click "Refresh" button
4. Stats should update to include new article

## Database Tables Used

The dashboard queries these tables:

- `public_news` - News articles (status: 'Published', 'Draft')
- `public_announcements` - Public announcements (status: 'Published', 'Expired')
- `public_contact_messages` - Citizen contact messages (status: 'Unread', 'Responded')
- `public_media` - Media files
- `users` - Staff users

**Note:** Status values in the database use capitalized strings (e.g., 'Published', 'Draft', 'Unread', 'Responded').

## API Response Structure

```json
{
    "stats": {
        "news": {
            "total": 48,
            "published": 42,
            "drafts": 6,
            "trend": "+12%"
        },
        "announcements": {
            "total": 24,
            "active": 18,
            "expired": 6,
            "trend": "+8%"
        },
        "messages": {
            "total": 156,
            "unread": 12,
            "responded": 144,
            "trend": "+23%"
        },
        "pages": {
            "total": 12,
            "updated": 8,
            "needsUpdate": 4,
            "trend": "0%"
        }
    },
    "recentContent": [
        {
            "id": 1,
            "type": "news",
            "title": "Article Title",
            "status": "published",
            "date": "2 hours ago",
            "author": "Admin"
        }
    ],
    "pendingTasks": [
        {
            "id": 1,
            "task": "Review and publish draft news articles",
            "count": 6,
            "urgent": true,
            "icon": "FileText"
        }
    ],
    "pageViews": [
        { "day": "Mon", "views": 2450 },
        { "day": "Tue", "views": 3200 }
    ],
    "systemStatus": {
        "website": "Online",
        "database": "Healthy",
        "storage": "45 files",
        "email": "Active"
    },
    "timestamp": "2026-06-20T09:23:30.000000Z"
}
```

## Benefits

1. **Accuracy**: Real data instead of hardcoded samples
2. **Timeliness**: Always shows current statistics
3. **Accountability**: Staff can see actual workload
4. **Trends**: Weekly comparisons help track progress
5. **Efficiency**: One dashboard shows everything at a glance
6. **Scalability**: Easy to add new metrics

## Future Enhancements

### Potential Improvements

1. **Real Analytics**: Connect to actual page view tracking
2. **Charts**: Add more detailed graphs
3. **Export**: Download dashboard reports
4. **Notifications**: Alert when thresholds are reached
5. **Custom Date Ranges**: Filter by specific time periods
6. **Role-Based Views**: Different dashboards for different roles

### How to Add New Metrics

1. **Add to DashboardController**:

```php
$newMetric = SomeModel::count();
```

2. **Add to API response**:

```php
return response()->json([
    // ... existing data
    'newMetric' => $newMetric,
]);
```

3. **Add to React component**:

```javascript
const [newMetric, setNewMetric] = useState(0);

// In fetchDashboardData:
setNewMetric(data.newMetric);

// In JSX:
<p>{newMetric}</p>;
```

## Troubleshooting

### Dashboard Shows Zeros

- Check if database has data
- Verify API endpoint is accessible
- Check browser console for errors

### Loading Spinner Never Stops

- API request might be failing
- Check network tab in browser DevTools
- Verify authentication is working

### Data Not Updating

- Click the refresh button
- Clear browser cache
- Check if database is being updated

### Error Banner Appears

- Check Laravel logs: `storage/logs/laravel.log`
- Verify API route is registered
- Check database connection

## Summary

The Staff Dashboard is now fully dynamic and connected to real database statistics. All staff members will see accurate, up-to-date information about the portal's content, pending tasks, and system status. The implementation includes proper loading states, error handling, and a manual refresh feature for the best user experience.

This dynamic approach ensures that the dashboard remains valuable as the portal grows and content increases, providing staff with the insights they need to manage the city's web presence effectively.
