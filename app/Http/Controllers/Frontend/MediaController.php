<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\PublicMedia;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = PublicMedia::query();

        // Filter by type (image, document, etc.)
        if ($type = $request->query('type')) {
            if ($type === 'image') {
                $query->where(function($q) {
                    $q->where('file_type', 'image')
                      ->orWhere('mime_type', 'like', 'image/%');
                });
            }
        }

        // Filter by category
        if ($category = $request->query('category')) {
            $query->where('category', 'like', "%{$category}%");
        }

        // Search by label or original name
        if ($search = $request->query('search')) {
            $query->where(function($q) use ($search) {
                $q->where('label', 'like', "%{$search}%")
                  ->orWhere('original_name', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->query('per_page', 12);
        $media = $query->orderByDesc('created_at')->paginate($perPage);

        // Format the response for frontend consumption
        $items = $media->items();
        $formattedData = collect($items)->map(function ($item) {
            return [
                'id' => $item->id,
                'label' => $item->label,
                'description' => $item->description,
                'category' => $item->category,
                'original_name' => $item->original_name,
                'file_name' => $item->file_name,
                'file_type' => $item->file_type,
                'mime_type' => $item->mime_type,
                'path' => $item->path,
                'url' => $item->path ? '/storage/' . $item->path : null,
                'size_bytes' => $item->size_bytes,
                'width' => $item->width,
                'height' => $item->height,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        return response()->json([
            'data' => $formattedData,
            'meta' => [
                'current_page' => $media->currentPage(),
                'last_page' => $media->lastPage(),
                'per_page' => $media->perPage(),
                'total' => $media->total(),
            ],
        ]);
    }
}