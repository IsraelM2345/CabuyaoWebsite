<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\PublicMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class MediaController extends Controller

{
    public function index(Request $request)
    {
        $query = PublicMedia::query();

        if ($search = $request->query('search')) {
            $query->where('original_name', 'like', "%{$search}%")
                ->orWhere('file_name', 'like', "%{$search}%");
        }

        if ($type = $request->query('type')) {
            $query->where('file_type', $type);
        }

        $perPage = (int) $request->query('per_page', 30);
        $media = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json($media);
    }

    public function upload(Request $request)
    {
        // Debug: Log incoming request data
        Log::info('Media Upload Request', [
            'method' => $request->method(),
            'path' => $request->path(),
            'all_input' => $request->all(),
            'all_files' => array_keys($request->allFiles()),
            'files_count' => count($request->allFiles()),
        ]);

        // Payload normalization: merge 'files' and 'files[]' into a unified array
        // This fixes 422 errors caused by mismatched input key/structure
        // Handles: files[], files (array), and single file named 'file'
        $normalizedFiles = $this->normalizeFilesInput($request);
        
        Log::info('Normalized files count', ['count' => count($normalizedFiles)]);
        
        if (!empty($normalizedFiles)) {
            $request->merge(['files' => $normalizedFiles]);
        }

        try {
            $validated = $request->validate([
                'files' => ['required', 'array'],
                // Only images
                'files.*' => ['required', 'file', 'image', 'max:51200'], // 50MB each
                // Per-file metadata arrays (optional)
                'labels' => ['nullable', 'array'],
                'labels.*' => ['nullable', 'string', 'max:255'],
                'descriptions' => ['nullable', 'array'],
                'descriptions.*' => ['nullable', 'string', 'max:1000'],
                'categories' => ['nullable', 'array'],
                'categories.*' => ['nullable', 'string', 'max:100'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Upload validation failed', [
                'errors' => $e->errors(),
                'files_input' => $request->input('files'),
                'files_file' => $request->file('files'),
            ]);
            return response()->json([
                'message' => 'Upload validation failed',
                'errors' => $e->errors(),
                'received_files' => is_array($request->input('files')) ? count($request->input('files')) : null,
                'received_files_count_hint' => is_array($request->file('files')) ? count($request->file('files')) : null,
            ], 422);
        }

        // Get per-file metadata arrays
        $labels = $request->input('labels', []);
        $descriptions = $request->input('descriptions', []);
        $categories = $request->input('categories', []);

        $stored = [];


        foreach ($validated['files'] as $index => $file) {
            $ext = strtolower($file->getClientOriginalExtension() ?: 'file');

            // IMPORTANT: do NOT call $file->getMimeType() here.
            // That can trigger fileinfo/MIME guessing and reintroduce the php_fileinfo error.
            $isImage = in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']);

            // UI is image-only, so always store as image.
            $fileType = 'image';

            $disk = 'public';
            $folder = 'media';
            $fileName = (string) Str::uuid();
            $storedPath = $file->storeAs($folder, $fileName . '.' . $ext, $disk);

            $width = null;
            $height = null;

            try {
                $manager = new ImageManager(new Driver());
                /** @var \Intervention\Image\Interfaces\ImageInterface $img */
                // Build image from path (intervention can differ by version; decodePath is widely supported)
                $img = $manager->decodePath($file->getRealPath());

                // Ensure we have consistent sizing; Intervention returns pixels.
                $width = $img->width();
                $height = $img->height();

                // Cover/thumbnail crop (800x800)
                // Use resize + fit semantics when available; otherwise keep it simple.
                try {
                    if (method_exists($img, 'cover')) {
                        $img->cover(800, 800);
                    } else {
                        // simple resize to square
                        $img->resize(800, 800);
                    }
                } catch (\Throwable $e) {
                    try {
                        $img->resize(800, 800);
                    } catch (\Throwable $e2) {
                        // ignore
                    }
                }

                // Save the cover in a deterministic place next to the original.
                $coverName = $fileName . '_cover.' . $ext;
                $coverPath = $folder . '/' . $coverName;
                $img->save(storage_path('app/public/' . $coverPath));

            } catch (\Throwable $e) {
                // ignore dimension/cover errors
            }

            // Get per-file metadata (if available for this index)
            $label = $labels[$index] ?? null;
            $description = $descriptions[$index] ?? null;
            $category = $categories[$index] ?? null;

            $row = PublicMedia::create([
                'file_name' => $fileName . '.' . $ext,
                'original_name' => $file->getClientOriginalName(),
                'label' => $label,
                'description' => $description,
                'category' => $category,
                'mime_type' => null,

                'file_type' => $fileType,
                'disk' => $disk,
                'path' => $storedPath,
                'size_bytes' => $file->getSize(),
                'width' => $width,
                'height' => $height,
            ]);

            $stored[] = $row;
        }

        return response()->json([
            'message' => 'Media uploaded successfully',
            'data' => $stored,
        ], 201);
    }

    public function update(Request $request, PublicMedia $media)
    {
        $validated = $request->validate([
            'label' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $media->update($validated);

        return response()->json([
            'message' => 'Media updated successfully',
            'data' => $media,
        ]);
    }

    public function destroy(PublicMedia $media)
    {
        if ($media->path && Storage::disk($media->disk)->exists($media->path)) {
            Storage::disk($media->disk)->delete($media->path);
        }

        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }

    /**
     * Normalize file input to handle various upload formats.
     * 
     * Handles:
     * - 'files' as array (standard Laravel format)
     * - 'files[]' as array (FormData with bracket notation)
     * - Single 'file' as fallback
     * 
     * This fixes 422 validation errors caused by mismatched input key/structure.
     */
    protected function normalizeFilesInput(Request $request): array
    {
        $normalizedFiles = [];
        
        // Get all uploaded files from the request
        $allFiles = $request->allFiles();
        
        Log::info('normalizeFilesInput debug', [
            'allFiles_keys' => array_keys($allFiles),
            'files_data' => isset($allFiles['files']) ? gettype($allFiles['files']) : 'not set',
            'files_count' => isset($allFiles['files']) ? count($allFiles['files']) : 0,
            'first_file_class' => isset($allFiles['files']) && !empty($allFiles['files']) ? get_class(reset($allFiles['files'])) : 'none',
        ]);
        
        // Method 1: Check for 'files' key (standard Laravel format and files[] format)
        if (isset($allFiles['files']) && is_array($allFiles['files'])) {
            $filesData = $allFiles['files'];
            
            // Get the first element to check its type
            $firstElement = reset($filesData);
            
            // Check if it's an array of UploadedFile objects (standard Laravel format)
            if (!empty($filesData) && $firstElement instanceof \Symfony\Component\HttpFoundation\File\UploadedFile) {
                foreach ($filesData as $file) {
                    if ($file instanceof \Symfony\Component\HttpFoundation\File\UploadedFile && $file->isValid()) {
                        $normalizedFiles[] = $file;
                    }
                }
            }
            // Check if it's PHP's multi-dimensional format (name, tmp_name, type, error)
            elseif (isset($filesData['name'])) {
                if (is_array($filesData['name'])) {
                    // Multiple files
                    foreach ($filesData['name'] as $key => $name) {
                        if (empty($name) || !is_string($name)) {
                            continue;
                        }
                        $tmpName = $filesData['tmp_name'][$key] ?? '';
                        if (empty($tmpName)) {
                            continue;
                        }
                        $file = new \Symfony\Component\HttpFoundation\File\UploadedFile(
                            $tmpName,
                            $name,
                            $filesData['type'][$key] ?? null,
                            (int) ($filesData['error'][$key] ?? \UPLOAD_ERR_OK),
                            true
                        );
                        if ($file->isValid()) {
                            $normalizedFiles[] = $file;
                        }
                    }
                } else {
                    // Single file
                    $name = $filesData['name'] ?? '';
                    $tmpName = $filesData['tmp_name'] ?? '';
                    if (!empty($name) && !empty($tmpName)) {
                        $file = new \Symfony\Component\HttpFoundation\File\UploadedFile(
                            $tmpName,
                            $name,
                            $filesData['type'] ?? null,
                            (int) ($filesData['error'] ?? \UPLOAD_ERR_OK),
                            false
                        );
                        if ($file->isValid()) {
                            $normalizedFiles[] = $file;
                        }
                    }
                }
            }
        }
        
        // Method 2: Recursively search through all file keys for UploadedFile objects
        if (empty($normalizedFiles)) {
            $this->extractFilesFromArray($allFiles, $normalizedFiles);
        }
        
        // Fallback: check for single 'file' key
        if (empty($normalizedFiles)) {
            $singleFile = $request->file('file');
            if ($singleFile instanceof \Symfony\Component\HttpFoundation\File\UploadedFile && $singleFile->isValid()) {
                $normalizedFiles[] = $singleFile;
            }
        }
        
        return $normalizedFiles;
    }
    
    /**
     * Recursively extract UploadedFile objects from nested arrays.
     */
    protected function extractFilesFromArray(array $data, array &$result): void
    {
        foreach ($data as $key => $item) {
            if ($item instanceof \Symfony\Component\HttpFoundation\File\UploadedFile) {
                Log::info('extractFilesFromArray found file', [
                    'key' => $key,
                    'class' => get_class($item),
                    'valid' => $item->isValid(),
                    'error' => $item->getError(),
                ]);
                if ($item->isValid()) {
                    $result[] = $item;
                }
            } elseif (is_array($item)) {
                $this->extractFilesFromArray($item, $result);
            }
        }
    }
}

