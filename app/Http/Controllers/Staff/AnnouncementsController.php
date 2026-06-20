<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\PublicAnnouncement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AnnouncementsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PublicAnnouncement::query();
        
        // Search functionality
        if ($search = $request->query('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('body', 'like', "%{$search}%");
            });
        }
        
        // Category filter
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        
        // Status filter
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        
        // Pagination
        $perPage = $request->query('per_page', 15);
        $announcements = $query->orderByDesc('created_at')->paginate($perPage);
        
        return response()->json($announcements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'date' => ['nullable', 'date'],
            'body' => ['required', 'string'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'image_file' => ['nullable', 'file', 'max:5120'],
            'status' => ['required', 'in:Draft,Published'],
        ]);

        // Handle featured image upload (optional)
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $path = $file->store('announcements', 'public');
            $validated['image_path'] = $path;
        }

        // Set published_at when status is Published
        if ($validated['status'] === 'Published' && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $announcement = PublicAnnouncement::create($validated);

        return response()->json([
            'message' => 'Announcement created successfully',
            'data' => $announcement
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PublicAnnouncement $announcement)
    {
        return response()->json($announcement);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PublicAnnouncement $announcement)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'date' => ['nullable', 'date'],
            'body' => ['required', 'string'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'image_file' => ['nullable', 'file', 'max:5120'],
            'status' => ['required', 'in:Draft,Published'],
        ]);

        // Update published_at when status changes to Published
        if ($validated['status'] === 'Published' && $announcement->status === 'Draft') {
            $validated['published_at'] = now();
        } elseif ($validated['status'] === 'Draft') {
            $validated['published_at'] = null;
        }

        // If a new image is uploaded during update, replace old image
        if ($request->hasFile('image_file')) {
            if ($announcement->image_path && Storage::disk('public')->exists($announcement->image_path)) {
                Storage::disk('public')->delete($announcement->image_path);
            }

            $file = $request->file('image_file');
            $path = $file->store('announcements', 'public');
            $validated['image_path'] = $path;
        }

        $announcement->update($validated);

        return response()->json([
            'message' => 'Announcement updated successfully',
            'data' => $announcement->fresh()
        ]);
    }


    public function destroy(PublicAnnouncement $announcement)
    {
        // Delete associated image if exists
        if ($announcement->image_path && Storage::disk('public')->exists($announcement->image_path)) {
            Storage::disk('public')->delete($announcement->image_path);
        }

        $announcement->delete();

        return response()->json([
            'message' => 'Announcement deleted successfully'
        ]);
    }


    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:public_announcements,id'],
        ]);

        PublicAnnouncement::destroy($validated['ids']);

        return response()->json([
            'message' => 'Announcements deleted successfully'
        ]);
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:public_announcements,id'],
            'status' => ['required', 'in:Draft,Published'],
        ]);

        $updateData = ['status' => $validated['status']];
        if ($validated['status'] === 'Published') {
            $updateData['published_at'] = now();
        } else {
            $updateData['published_at'] = null;
        }

        PublicAnnouncement::whereIn('id', $validated['ids'])->update($updateData);

        return response()->json([
            'message' => 'Status updated successfully'
        ]);
    }
}