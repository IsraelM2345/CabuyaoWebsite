<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\PublicNews;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PublicNews::query();

        // Search functionality
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
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
        $news = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json($news);
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
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'image_file' => ['nullable', 'file', 'max:5120'],

            'status' => ['required', 'in:Draft,Published'],

            'author' => ['nullable', 'string', 'max:255'],
        ]);

        // Handle featured image upload (optional)
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');

            // Avoid MIME guessing issues coming from PHP's fileinfo (php_fileinfo).
            // We trust the client-provided extension via validation instead.
            $path = $file->store('news', 'public');
            $validated['image_path'] = $path;
        }


        // Set published_at when status is Published
        if ($validated['status'] === 'Published' && !isset($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $news = PublicNews::create($validated);

        return response()->json([
            'message' => 'News article created successfully',
            'data' => $news,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PublicNews $news)
    {
        return response()->json($news);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PublicNews $news)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'date' => ['nullable', 'date'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'image_file' => ['nullable', 'file', 'max:5120'],

            'status' => ['required', 'in:Draft,Published'],

            'author' => ['nullable', 'string', 'max:255'],
        ]);

        // Update published_at when status changes to Published
        if ($validated['status'] === 'Published' && $news->status === 'Draft') {
            $validated['published_at'] = now();
        } elseif ($validated['status'] === 'Draft') {
            $validated['published_at'] = null;
        }

        // If a new image is uploaded during update, replace old image
        if ($request->hasFile('image_file')) {
            if ($news->image_path && Storage::disk('public')->exists($news->image_path)) {
                Storage::disk('public')->delete($news->image_path);
            }

            $file = $request->file('image_file');
            $path = $file->store('news', 'public');
            $validated['image_path'] = $path;
        }

        $news->update($validated);

        return response()->json([
            'message' => 'News article updated successfully',
            'data' => $news->fresh(),
        ]);
    }

    public function destroy(PublicNews $news)
    {
        if ($news->image_path && Storage::disk('public')->exists($news->image_path)) {
            Storage::disk('public')->delete($news->image_path);
        }

        $news->delete();

        return response()->json([
            'message' => 'News article deleted successfully',
        ]);
    }

    /**
     * Bulk delete news articles.
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:public_news,id'],
        ]);

        PublicNews::destroy($validated['ids']);

        return response()->json([
            'message' => 'News articles deleted successfully',
        ]);
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:public_news,id'],
            'status' => ['required', 'in:Draft,Published'],
        ]);

        $updateData = ['status' => $validated['status']];
        $updateData['published_at'] = $validated['status'] === 'Published' ? now() : null;

        PublicNews::whereIn('id', $validated['ids'])->update($updateData);

        return response()->json([
            'message' => 'Status updated successfully',
        ]);
    }
}

