<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC WEB PORTAL — No authentication required (citizen-facing)
// ══════════════════════════════════════════════════════════════════════════════

// --- Main Standalone Links ---
Route::get('/', function () {
    return Inertia::render('Public/Home');
})->name('home');

Route::get('/news', function () {
    return Inertia::render('Public/News');
})->name('news');

Route::get('/news/{id}', function ($id) {
    return Inertia::render('Public/NewsDetail', ['id' => $id]);
});

Route::get('/announcements/{id}', function ($id) {
    return Inertia::render('Public/AnnouncementDetail', ['id' => $id]);
});



Route::get('/drrm', function () {
    return Inertia::render('Public/DRRM');
})->name('drrm');

Route::get('/faqs', function () {
    return Inertia::render('Public/FAQs');
})->name('faqs');

Route::get('/contact', function () {
    return Inertia::render('Public/Contact');
})->name('contact');

// --- Dropdown: The City ---
Route::get('/about', function () {
    return Inertia::render('Public/About');
})->name('about');

Route::get('/accomplishments', function () {
    return Inertia::render('Public/Accomplishments');
})->name('accomplishments');

Route::get('/tourism', function () {
    return Inertia::render('Public/Tourism');
})->name('tourism');

Route::get('/gallery', function () {
    return Inertia::render('Public/Gallery');
})->name('gallery');

Route::get('/citizen-charter', function () {
    return Inertia::render('Public/CitizenCharter');
})->name('citizen-charter');

// --- Dropdown: Government ---
Route::get('/mayor', function () {
    return Inertia::render('Public/Mayor');
})->name('mayor');

Route::get('/council', function () {
    return Inertia::render('Public/Council');
})->name('council');

Route::get('/departments', function () {
    return Inertia::render('Public/Departments');
})->name('departments');

Route::get('/transparency', function () {
    return Inertia::render('Public/Transparency');
})->name('transparency');

// --- Dropdown: E-Services ---
Route::get('/bplo', function () {
    return Inertia::render('Public/BPLO');
})->name('bplo');

Route::get('/peso', function () {
    return Inertia::render('Public/PESO');
})->name('peso');

Route::get('/registry', function () {
    return Inertia::render('Public/Registry');
})->name('registry');

Route::get('/health', function () {
    return Inertia::render('Public/Health');
})->name('health');


// ══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION — Login & Register (guest only)
// ══════════════════════════════════════════════════════════════════════════════

Route::get('/evactech/login', function () {
    return Inertia::render('Auth/EvacTechLogin');
})->name('evactech.login');

Route::get('/evactech/register', function () {
    return Inertia::render('Auth/EvacTechRegister');
})->name('evactech.register');

Route::post('/evactech/register', [AuthController::class, 'evactech.register'])->name('register.submit');
// Rate limited login (5 attempts per minute) to prevent brute force
Route::post('/evactech/login', [AuthController::class, 'evactech.login'])->middleware('throttle:5,1')->name('login.submit');

// Staff-specific login page (separate from EvacTech)
Route::get('/staff/login', function () {
    return Inertia::render('Staff/StaffLogin');
})->name('staff.login');

// Debug route removed for security - use Laravel Telescope or proper logging in production

// Staff registration page (separate from EvacTech)
Route::get('/staff/register', function () {
    return Inertia::render('Staff/StaffRegister');
})->name('staff.register');


Route::post('/staff/register', [AuthController::class, 'register'])->name('staff.register.submit');
// Rate limited login (5 attempts per minute) to prevent brute force
Route::post('/staff/login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('login.submit');


// ══════════════════════════════════════════════════════════════════════════════
// PROTECTED — Staff / Admin (requires authentication) this is for Evacuation Management System Only
// ══════════════════════════════════════════════════════════════════════════════

Route::middleware(['auth'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // ── Dashboard Overview ──
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Dashboard');
    })->name('dashboard');

    // ── Announcements ──
    Route::prefix('announcements')->name('announcements.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard/Announcements/Index');
        })->name('index');

        Route::get('/create', function () {
            return Inertia::render('Dashboard/Announcements/CreateEdit');
        })->name('create');
    });

    // ── Evacuee Profiles ──
    Route::prefix('evacuee-profiles')->name('evacuee-profiles.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard/EvacueeProfiles/Index');
        })->name('index');

        Route::get('/vulnerable', function () {
            return Inertia::render('Dashboard/EvacueeProfiles/VulnerableList');
        })->name('vulnerable');

        Route::get('/add', function () {
            return Inertia::render('Dashboard/EvacueeProfiles/HouseholdForm');
        })->name('add');
    });

    // ── Relief Distribution ──
    Route::prefix('relief-distribution')->name('relief-distribution.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard/ReliefDistribution/Index');
        })->name('index');

        Route::get('/inventory', function () {
            return Inertia::render('Dashboard/ReliefDistribution/InventoryStock');
        })->name('inventory');

        Route::get('/logs', function () {
            return Inertia::render('Dashboard/ReliefDistribution/DistributionLogs');
        })->name('logs');
    });

    // ── Evacuation Shelters ──
    Route::prefix('evacuation-shelters')->name('evacuation-shelters.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard/EvacuationShelters/Index');
        })->name('index');

        Route::get('/capacity', function () {
            return Inertia::render('Dashboard/EvacuationShelters/CapacityTracking');
        })->name('capacity');
    });

    // ── Risk Heat Map ──
    Route::get('/risk-heatmap', function () {
        return Inertia::render('Dashboard/HeatMap');
    })->name('risk-heatmap');

    // ── System Reports ──
    Route::prefix('system-reports')->name('system-reports.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard/SystemReports/Index');
        })->name('index');

        Route::get('/generate', function () {
            return Inertia::render('Dashboard/SystemReports/GenerateReport');
        })->name('generate');

        Route::get('/history', function () {
            return Inertia::render('Dashboard/SystemReports/ExportHistory');
        })->name('history');
    });

    // ── User Management ──
    Route::prefix('user-management')->name('user-management.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Dashboard/UserManagement/Index');
        })->name('index');

        Route::get('/roles', function () {
            return Inertia::render('Dashboard/UserManagement/StaffRoles');
        })->name('roles');

        Route::get('/logs', function () {
            return Inertia::render('Dashboard/UserManagement/ActivityLogs');
        })->name('logs');
    });

    // ── Admin Profile & Settings  ──
    Route::get('/profile', function () {
        return Inertia::render('Dashboard/Profile');
    })->name('profile');

    Route::get('/settings', function () {
        return Inertia::render('Dashboard/Settings');
    })->name('settings');

    // ── Staff Portal Routes ──
    Route::prefix('staff')->name('staff.')->group(function () {
        // Staff Dashboard (alternative to main dashboard)
        Route::get('/dashboard', function () {
            return Inertia::render('Staff/StaffDashboard');
        })->name('dashboard');

        // Contact Inbox - Manage citizen messages
        Route::get('/contact-inbox', function () {
            return Inertia::render('Staff/ContactInbox');
        })->name('contact-inbox');

        // News Manager - Manage news articles
        Route::get('/news-manager', function () {
            return Inertia::render('Staff/NewsIndex');
        })->name('news-manager');

        // Page Editor - Edit public page content
        Route::get('/page-editor/{page?}', function ($page = 'home') {
            return Inertia::render('Staff/PageEditor', ['page' => $page]);
        })->name('page-editor');

        // Media Manager - Manage images and documents
        Route::get('/media-manager', function () {
            return Inertia::render('Staff/MediaManager');
        })->name('media-manager');

        // Media Upload - Upload new files
        Route::get('/media-manager/upload', function () {
            return Inertia::render('Staff/MediaUpload');
        })->name('media-upload');

        // Officials Manager - Manage city officials
        Route::get('/officials', function () {
            return Inertia::render('Staff/OfficialsManager');
        })->name('officials');

        // Officials Executive - Mayor & Vice Mayor
        Route::get('/officials/executive', function () {
            return Inertia::render('Staff/OfficialsExecutive');
        })->name('officials.executive');

        // Officials Councilors - City Councilors
        Route::get('/officials/councilors', function () {
            return Inertia::render('Staff/OfficialsCouncilors');
        })->name('officials.councilors');

        // Services Manager - Manage departments and e-services
        Route::get('/services', function () {
            return Inertia::render('Staff/ServicesManager');
        })->name('services');

        // Departments Manager
        Route::get('/services/departments', function () {
            return Inertia::render('Staff/DepartmentsManager');
        })->name('services.departments');

        // E-Services Manager
        Route::get('/services/e-services', function () {
            return Inertia::render('Staff/EServicesManager');
        })->name('services.e-services');

        // Announcements Manager - Manage announcements
        Route::get('/announcements-manager', function () {
            return Inertia::render('Staff/AnnouncementsIndex');
        })->name('announcements-manager');

        // Add Announcement - Create new announcement
        Route::get('/add-announcement', function () {
            return Inertia::render('Staff/AnnouncementCreate');
        })->name('add-announcement');

        // Add News Article - Create new news article
        Route::get('/add-news', function () {
            return Inertia::render('Staff/NewsCreate');
        })->name('add-news');

        // User Management - Manage staff accounts
        Route::get('/user-management', function () {
            return Inertia::render('Staff/UserManagement');
        })->name('user-management');

        // News Manager routes - order matters! create must come before {id}/edit
        Route::get('/news-manager/create', function () {
            return Inertia::render('Staff/NewsCreate');
        })->name('news-manager.create');

        Route::get('/news-manager/{id}/edit', function ($id) {
            return Inertia::render('Staff/NewsCreate', ['editingId' => $id]);
        })->name('news-manager.edit');

        // Announcements Manager routes - order matters!
        Route::get('/announcements-manager/create', function () {
            return Inertia::render('Staff/AnnouncementCreate');
        })->name('announcements-manager.create');

        Route::get('/announcements-manager/{id}/edit', function ($id) {
            return Inertia::render('Staff/AnnouncementCreate', ['editingId' => $id]);
        })->name('announcements-manager.edit');
    });

});
