<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\NewsController as PublicNewsController;
use App\Http\Controllers\Frontend\AnnouncementsController as PublicAnnouncementsController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Staff\NewsController as StaffNewsController;
use App\Http\Controllers\Staff\AnnouncementsController as StaffAnnouncementsController;
use App\Http\Controllers\Staff\ContactReplyController;
use App\Http\Controllers\Staff\MediaController as StaffMediaController;
use App\Http\Controllers\Frontend\PublicContactMessageLookupController;
use App\Http\Controllers\Frontend\MediaController as PublicMediaController;
use App\Http\Controllers\Staff\CouncilorController;
use App\Http\Controllers\Staff\ExecutiveController;
use App\Http\Controllers\Staff\UserController;
use App\Http\Controllers\Staff\DashboardController;


// Media Management
// (file upload/list/delete for staff)
Route::middleware(['web', 'auth'])->prefix('staff')->group(function () {
    Route::get('media', [StaffMediaController::class, 'index']);
    Route::post('media', [StaffMediaController::class, 'upload']);
    Route::put('media/{media}', [StaffMediaController::class, 'update']);
    Route::delete('media/{media}', [StaffMediaController::class, 'destroy']);
});



// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC API — No authentication required (citizen-facing)
// ══════════════════════════════════════════════════════════════════════════════
Route::prefix('public')->group(function () {
    Route::get('/media', [PublicMediaController::class, 'index']);

    Route::get('/news', [PublicNewsController::class, 'index']);
    Route::get('/news/{news}', [PublicNewsController::class, 'show']);

    Route::get('/announcements', [PublicAnnouncementsController::class, 'index']);
    Route::get('/announcements/{announcement}', [PublicAnnouncementsController::class, 'show']);

    // Rate limited to prevent spam (10 submissions per minute)
    Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:10,1');
    Route::get('/contact/{contactMessage}', [PublicContactMessageLookupController::class, 'show']);
});



// ══════════════════════════════════════════════════════════════════════════════
// STAFF API — Requires authentication (uses web/session guard)
// Uses 'web' middleware for session-based auth
// ══════════════════════════════════════════════════════════════════════════════
Route::middleware(['web', 'auth'])->prefix('staff')->group(function () {
    // News Management
    Route::apiResource('news', StaffNewsController::class);
    Route::post('news/bulk-delete', [StaffNewsController::class, 'bulkDelete']);

    // Announcements Management
    Route::apiResource('announcements', StaffAnnouncementsController::class);

    // Contact Messages Management

    Route::get('/contacts', [ContactReplyController::class, 'index']);
    Route::get('/contacts/{contactMessage}', [ContactReplyController::class, 'show']);
    Route::post('/contacts/{contactMessage}/reply', [ContactReplyController::class, 'reply']);
    Route::patch('/contacts/{contactMessage}/status', [ContactReplyController::class, 'updateStatus']);
    Route::delete('/contacts/{contactMessage}', [ContactReplyController::class, 'destroy']);

    // Councilors Management
    Route::apiResource('councilors', CouncilorController::class);

    // Executives Management (Mayor & Vice Mayor)
    Route::apiResource('executives', ExecutiveController::class);

    // User Management
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);

    // Current User
    Route::get('me', function () {
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    });

    // Dashboard Statistics
    Route::get('/dashboard/stats', [DashboardController::class, 'getDashboardData']);
});

// Public councilors API (no auth required)
Route::prefix('public')->group(function () {
    Route::get('/councilors', [CouncilorController::class, 'index']);
    Route::get('/councilors/{councilor}', [CouncilorController::class, 'show']);

    // Public executives API (Mayor & Vice Mayor)
    Route::get('/executives', [ExecutiveController::class, 'index']);
    Route::get('/executives/{executive}', [ExecutiveController::class, 'show']);
});
