# Citizen Charter Implementation Guide

## Overview

The Citizen Charter system has been successfully implemented with a **triple-presence approach** for maximum visibility and accessibility. The page displays **6 department-specific charters** in a grid layout.

## Implementation Details

### 1. Navigation Menu Integration

✅ **Added to "The City" dropdown menu** (both desktop and mobile)

- Desktop: Appears in the dropdown under "The City" navigation item
- Mobile: Appears in the accordion menu under "The City"

### 2. Homepage Service Card

✅ **Added as a service card** in the E-Services & Quick Links section

- Icon: BookOpen (indigo colored)
- Title: "Citizen Charter"
- Description: "View and download our citizen charter"
- Links to: `/citizen-charter`

### 3. Dedicated Page

✅ **Created comprehensive Citizen Charter page** at `/citizen-charter`

- Features:
    - **Grid display of 6 department charters** with color-coded headers
    - View PDF button (opens in new tab)
    - Download button for offline access
    - Expandable service sections with requirements, processing times, and fees
    - Quick links to related e-services
    - Contact information and FAQ links
    - Responsive design for mobile and desktop

## File Structure

### Created Files:

1. `resources/js/Pages/Public/CitizenCharter.jsx` - Main page component
2. `public/documents/` - Directory for PDF storage
3. `CITIZEN_CHARTER_IMPLEMENTATION.md` - This documentation

### Modified Files:

1. `resources/js/Pages/Public/Home.jsx`
    - Added `BookOpen` icon import
    - Added Citizen Charter to SERVICES array
    - Added Citizen Charter to desktop navigation dropdown
    - Added Citizen Charter to mobile navigation menu

2. `routes/web.php`
    - Added route: `Route::get('/citizen-charter', ...)`

## PDF Setup Instructions

### Step 1: Prepare Your PDFs

The system supports **6 department-specific charters**. Convert each to PDF format:

| #   | Department                                    | Filename                                 | Display Title                    |
| --- | --------------------------------------------- | ---------------------------------------- | -------------------------------- |
| 1   | City Treasury Office                          | `treasury-citizens-charter.pdf`          | Treasury Citizen's Charter       |
| 2   | Office of the Mayor                           | `mayors-office-citizen-charter.pdf`      | Mayor's Office Citizen's Charter |
| 3   | Business Permit & Licensing Office            | `2026-cabuyao-bplo-citizens-charter.pdf` | 2026 BPLO Citizen's Charter      |
| 4   | Assistance to Individuals in Crisis Situation | `aics-mo-citizens-charter.pdf`           | AICS Citizen's Charter           |
| 5   | City Assessor's Office                        | `assessor-citizens-charter.pdf`          | Assessor Citizen's Charter       |
| 6   | City Engineering Office                       | `citizen-charter-engineering.pdf`        | Engineering Citizen's Charter    |

**Recommended:** PDF files should be under 5MB each for optimal loading.

### Step 2: Upload PDFs

Place all PDF files in:

```
public/documents/
```

Required files:

- `public/documents/treasury-citizens-charter.pdf`
- `public/documents/mayors-office-citizen-charter.pdf`
- `public/documents/2026-cabuyao-bplo-citizens-charter.pdf`
- `public/documents/aics-mo-citizens-charter.pdf`
- `public/documents/assessor-citizens-charter.pdf`
- `public/documents/citizen-charter-engineering.pdf`

### Step 3: Verify

1. Visit `/citizen-charter` in your browser
2. All 6 charters should display in a grid layout
3. Test "View PDF" button (opens in new tab)
4. Test "Download" button for each charter

## Features

### PDF Viewer

- Embedded iframe displays the PDF directly on the page
- Users can view without leaving the website
- Toolbar hidden for cleaner interface

### Download Functionality

- Prominent download button in the header
- Direct download link for offline access
- Works even if iframe doesn't load

### Service Information

The page includes expandable sections for common services:

1. Business Permit
2. Civil Registry Services
3. Health Services
4. Social Welfare Services
5. Community Tax Certificate (Cedula)

Each section shows:

- Requirements
- Processing time
- Fees

### Quick Links

Direct access to related e-services:

- Business Permits (BPLO)
- Job Openings (PESO)
- Civil Registry
- Health Services

## Customization

### Updating Service Information

Edit the `CHARTER_SECTIONS` array in `CitizenCharter.jsx`:

```javascript
const CHARTER_SECTIONS = [
    {
        id: 1,
        title: "Service Name",
        description: "Service description",
        requirements: ["Requirement 1", "Requirement 2"],
        processingTime: "X working days",
        fee: "₱XXX",
    },
    // ... more sections
];
```

### Changing PDF Location

Update the `pdfUrl` variable in `CitizenCharter.jsx`:

```javascript
const pdfUrl = "/documents/your-file.pdf";
```

### Styling

The page uses Tailwind CSS classes. Key colors:

- Primary: Red (#DC2626)
- Secondary: Indigo (#4C1D95)
- Accent: Yellow (#F59E0B)

## Testing Checklist

- [ ] PDF loads in the viewer
- [ ] Download button works
- [ ] Navigation menu shows Citizen Charter link
- [ ] Homepage service card is visible
- [ ] Mobile menu includes Citizen Charter
- [ ] All expandable sections work
- [ ] Quick links navigate correctly
- [ ] Page is responsive on mobile devices

## Troubleshooting

### PDF Not Loading

1. Check file exists at `public/documents/citizen-charter.pdf`
2. Verify file permissions allow reading
3. Check browser console for errors
4. Try accessing PDF directly: `http://your-domain/documents/citizen-charter.pdf`

### Route Not Found

Run: `php artisan route:cache` to refresh routes

### Styling Issues

Ensure Tailwind CSS is properly compiled:

```bash
npm run dev
# or
npm run build
```

## Future Enhancements

Potential improvements:

1. Multi-language support (English/Filipino)
2. Search functionality within the charter
3. Printable version
4. Accessibility improvements (screen reader support)
5. Analytics tracking for charter views/downloads
6. Version history for charter updates

## Support

For issues or questions:

- Check browser console for errors
- Verify all files are in correct locations
- Clear browser cache
- Contact development team

---

**Implementation Date:** June 7, 2026
**Last Updated:** June 7, 2026
**Version:** 1.0
