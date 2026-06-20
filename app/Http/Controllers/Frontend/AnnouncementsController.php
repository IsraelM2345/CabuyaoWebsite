<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\PublicAnnouncement;
use Illuminate\Http\Request;

class AnnouncementsController extends Controller
{
    public function show(Request $request, PublicAnnouncement $announcement)
    {
        // Public pages only allow Published announcements
        if ($announcement->status !== 'Published') {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json(['data' => $announcement]);
    }

    public function index(Request $request)
    {

        $category = $request->query('category');
        $q = $request->query('q');
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);

        $query = PublicAnnouncement::query()
            ->where('status', 'Published');

        if ($category && $category !== 'All') {
            $query->where('category', $category);
        }

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', '%' . $q . '%')
                    ->orWhere('body', 'like', '%' . $q . '%');
            });
        }

        $query->orderBy('published_at', 'desc');

        $results = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $results->items(),
            'meta' => [
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
                'per_page' => $results->perPage(),
                'total' => $results->total(),
            ],
        ]);
    }
}