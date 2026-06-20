# Dynamic Mayor & Vice Mayor Management System

## Overview

Created a complete backend system for managing Mayor and Vice Mayor information dynamically, similar to the councilors system. Staff edits now automatically reflect on the public Council page.

## Backend Implementation

### Database

- **Migration**: `2026_06_07_000002_create_public_executives_table.php`
    - Created `public_executives` table with fields: name, position, email, phone, office, term_start, term_end, election_date, assumption_date, bio, photo_path, order_column, is_active
- **Model**: `app/Models/PublicExecutive.php`
    - Fillable fields include all columns
    - Scopes: `active()`, `ordered()`, `viceMayor()`, `mayor()`
    - Accessor: `photo_url` for generating photo URLs
- **Controller**: `app/Http/Controllers/Staff/ExecutiveController.php`
    - Full CRUD operations (index, store, show, update, destroy)
    - Handles base64 image uploads
    - Validates election_date and assumption_date fields
- **Seeder**: `database/seeders/PublicExecutiveSeeder.php`
    - Seeds initial Mayor (Hon. Deniel Fernandez) and Vice Mayor (Hon. Junjun Batallones) data
- **Routes**: `routes/api.php`
    - Staff routes: `GET/POST/PUT/DELETE /api/staff/executives`
    - Public routes: `GET /api/public/executives`

### Migration & Seeding

```bash
php artisan migrate                    # Created public_executives table
php artisan db:seed --class=PublicExecutiveSeeder  # Seeded initial data
```

## Frontend Implementation

### Staff Interface (OfficialsExecutive.jsx)

- **API Integration**: Connects to `/api/staff/executives`
- **Features**:
    - Fetches executives from database on load
    - Edit mode for each official with form fields
    - Add new official functionality
    - Delete with confirmation modal
    - Photo upload support
    - Success toast notifications
    - Loading state while fetching data

### Public Interface (Council.jsx)

- **Vice Mayor Section**:
    - Fetches Vice Mayor from `/api/public/executives`
    - Filters for position = "Vice Mayor"
    - Displays as clickable card with:
        - Photo (or avatar fallback)
        - Name and position badge
        - "Elected as Cabuyao City Councilor last [date]"
        - "Date of Assumption: [date]"
        - "View Full Profile" call-to-action
    - Clicking opens detailed modal (same as councilors)
    - Shows placeholder if no Vice Mayor data exists

- **Modal Display**:
    - Shows position badge dynamically (displays actual position from database)
    - Displays election and assumption dates as info pills
    - Same modal structure as councilors for consistency

## Data Flow

1. **Staff edits Vice Mayor**:
    - OfficialsExecutive.jsx → PUT /api/staff/executives/{id}
    - ExecutiveController validates and updates database
    - PublicExecutive model saves to `public_executives` table

2. **Public views Vice Mayor**:
    - Council.jsx → GET /api/public/executives
    - ExecutiveController returns all active executives
    - Council.jsx filters for Vice Mayor and displays
    - Clicking opens modal with full details

## Key Features

### Dynamic Updates

- Changes made in staff interface immediately reflect on public page
- No hardcoded data - everything comes from database
- Real-time sync between staff and public views

### Election & Assumption Dates

- Both fields are editable in staff interface
- Displayed prominently on public page
- Format: "Elected as Cabuyao City Councilor last [date]" and "Date of Assumption: [date]"

### Photo Management

- Upload photos via staff interface (base64 encoding)
- Photos stored in `storage/app/public/executives/`
- Fallback to avatar API if no photo exists

### Validation

- Name and position are required
- Email validation for email field
- Date validation for term dates
- Election and assumption dates are optional strings (flexible format)

## Files Modified/Created

### Backend

- `database/migrations/2026_06_07_000002_create_public_executives_table.php` (new)
- `app/Models/PublicExecutive.php` (new)
- `app/Http/Controllers/Staff/ExecutiveController.php` (new)
- `database/seeders/PublicExecutiveSeeder.php` (new)
- `routes/api.php` (modified - added executive routes)

### Frontend

- `resources/js/Pages/Staff/OfficialsExecutive.jsx` (rewritten - now dynamic)
- `resources/js/Pages/Public/Council.jsx` (modified - fetches Vice Mayor from API)

## Testing

### Staff Side

1. Navigate to Staff Dashboard → Officials → Mayor & Vice Mayor
2. Edit Vice Mayor information (add election/assumption dates)
3. Save changes
4. Verify success toast appears

### Public Side

1. Navigate to /council page
2. Verify Vice Mayor card displays with correct data
3. Click on Vice Mayor card
4. Verify modal opens with full details including election/assumption dates
5. Verify dates match what was entered in staff interface

## Future Enhancements

- Add Mayor page (Mayor.jsx) to fetch and display Mayor data dynamically
- Add ordering/reordering functionality
- Add bulk actions
- Add search/filter functionality
- Add export functionality

## Notes

- The system is fully dynamic - no hardcoded names or dates
- Both Mayor and Vice Mayor can be managed through the same interface
- The public page automatically displays the correct information based on database content
- Election and assumption dates are stored as flexible string fields to accommodate any date format
