<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\PublicExecutive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ExecutiveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $executives = PublicExecutive::ordered()->get();
        
        return response()->json([
            'success' => true,
            'data' => $executives->map(function ($executive) {
                return [
                    'id' => $executive->id,
                    'name' => $executive->name,
                    'position' => $executive->position,
                    'email' => $executive->email,
                    'phone' => $executive->phone,
                    'office' => $executive->office,
                    'address' => $executive->address,
                    'termStart' => $executive->term_start ? $executive->term_start->format('Y-m-d') : null,
                    'termEnd' => $executive->term_end ? $executive->term_end->format('Y-m-d') : null,
                    'election_date' => $executive->election_date,
                    'assumption_date' => $executive->assumption_date,
                    'birthdate' => $executive->birthdate,
                    'bio' => $executive->bio,
                    'education' => $executive->education,
                    'expertise' => $executive->expertise,
                    'quote' => $executive->quote,
                    'facebook_url' => $executive->facebook_url,
                    'photo' => $executive->photo_url,
                    'photo_path' => $executive->photo_path,
                    'order_column' => $executive->order_column,
                    'is_active' => $executive->is_active,
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'office' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'termStart' => 'nullable|date',
            'termEnd' => 'nullable|date|after_or_equal:termStart',
            'election_date' => 'nullable|string|max:255',
            'assumption_date' => 'nullable|string|max:255',
            'birthdate' => 'nullable|date',
            'bio' => 'nullable|string',
            'education' => 'nullable|string',
            'expertise' => 'nullable|string',
            'quote' => 'nullable|string',
            'facebook_url' => 'nullable|url|max:500',
            'photo' => 'nullable|string',
            'order_column' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $photoPath = null;
        
        // Handle photo upload if base64 data is provided
        if (!empty($request->photo) && preg_match('/^data:image\/(\w+);base64,/', $request->photo)) {
            $photoPath = $this->saveBase64Image($request->photo, 'executives');
        }

        $maxOrder = PublicExecutive::max('order_column') ?? 0;
        
        $executive = PublicExecutive::create([
            'name' => $request->name,
            'position' => $request->position,
            'email' => $request->email,
            'phone' => $request->phone,
            'office' => $request->office,
            'address' => $request->address,
            'term_start' => $request->termStart,
            'term_end' => $request->termEnd,
            'election_date' => $request->election_date,
            'assumption_date' => $request->assumption_date,
            'birthdate' => $request->birthdate,
            'bio' => $request->bio,
            'education' => $request->education,
            'expertise' => $request->expertise,
            'quote' => $request->quote,
            'facebook_url' => $request->facebook_url,
            'photo_path' => $photoPath,
            'order_column' => $request->order_column ?? ($maxOrder + 1),
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Executive created successfully',
            'data' => [
                'id' => $executive->id,
                'name' => $executive->name,
                'position' => $executive->position,
                'email' => $executive->email,
                'phone' => $executive->phone,
                'office' => $executive->office,
                'address' => $executive->address,
                'termStart' => $executive->term_start ? $executive->term_start->format('Y-m-d') : null,
                'termEnd' => $executive->term_end ? $executive->term_end->format('Y-m-d') : null,
                'election_date' => $executive->election_date,
                'assumption_date' => $executive->assumption_date,
                'birthdate' => $executive->birthdate,
                'bio' => $executive->bio,
                'education' => $executive->education,
                'expertise' => $executive->expertise,
                'quote' => $executive->quote,
                'facebook_url' => $executive->facebook_url,
                'photo' => $executive->photo_url,
                'photo_path' => $executive->photo_path,
                'order_column' => $executive->order_column,
                'is_active' => $executive->is_active,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $executive = PublicExecutive::find($id);
        
        if (!$executive) {
            return response()->json([
                'success' => false,
                'message' => 'Executive not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $executive->id,
                'name' => $executive->name,
                'position' => $executive->position,
                'email' => $executive->email,
                'phone' => $executive->phone,
                'office' => $executive->office,
                'address' => $executive->address,
                'termStart' => $executive->term_start ? $executive->term_start->format('Y-m-d') : null,
                'termEnd' => $executive->term_end ? $executive->term_end->format('Y-m-d') : null,
                'election_date' => $executive->election_date,
                'assumption_date' => $executive->assumption_date,
                'birthdate' => $executive->birthdate,
                'bio' => $executive->bio,
                'education' => $executive->education,
                'expertise' => $executive->expertise,
                'quote' => $executive->quote,
                'facebook_url' => $executive->facebook_url,
                'photo' => $executive->photo_url,
                'photo_path' => $executive->photo_path,
                'order_column' => $executive->order_column,
                'is_active' => $executive->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $executive = PublicExecutive::find($id);
        
        if (!$executive) {
            return response()->json([
                'success' => false,
                'message' => 'Executive not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'office' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'termStart' => 'nullable|date',
            'termEnd' => 'nullable|date|after_or_equal:termStart',
            'election_date' => 'nullable|string|max:255',
            'assumption_date' => 'nullable|string|max:255',
            'birthdate' => 'nullable|date',
            'bio' => 'nullable|string',
            'education' => 'nullable|string',
            'expertise' => 'nullable|string',
            'quote' => 'nullable|string',
            'facebook_url' => 'nullable|url|max:500',
            'photo' => 'nullable|string',
            'remove_photo' => 'nullable|boolean',
            'order_column' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Handle photo removal
        if ($request->remove_photo && $executive->photo_path) {
            Storage::disk('public')->delete($executive->photo_path);
            $executive->photo_path = null;
        }

        // Handle photo upload if base64 data is provided
        if (!empty($request->photo) && preg_match('/^data:image\/(\w+);base64,/', $request->photo)) {
            // Delete old photo if exists
            if ($executive->photo_path) {
                Storage::disk('public')->delete($executive->photo_path);
            }
            $executive->photo_path = $this->saveBase64Image($request->photo, 'executives');
        }

        $executive->update([
            'name' => $request->name,
            'position' => $request->position,
            'email' => $request->email ?? $executive->email,
            'phone' => $request->phone ?? $executive->phone,
            'office' => $request->office ?? $executive->office,
            'address' => $request->address ?? $executive->address,
            'term_start' => $request->termStart ?? $executive->term_start,
            'term_end' => $request->termEnd ?? $executive->term_end,
            'election_date' => $request->has('election_date') ? $request->election_date : $executive->election_date,
            'assumption_date' => $request->has('assumption_date') ? $request->assumption_date : $executive->assumption_date,
            'birthdate' => $request->has('birthdate') ? $request->birthdate : $executive->birthdate,
            'bio' => $request->bio ?? $executive->bio,
            'education' => $request->has('education') ? $request->education : $executive->education,
            'expertise' => $request->has('expertise') ? $request->expertise : $executive->expertise,
            'quote' => $request->has('quote') ? $request->quote : $executive->quote,
            'facebook_url' => $request->has('facebook_url') ? $request->facebook_url : $executive->facebook_url,
            'order_column' => $request->order_column ?? $executive->order_column,
            'is_active' => $request->has('is_active') ? $request->is_active : $executive->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Executive updated successfully',
            'data' => [
                'id' => $executive->id,
                'name' => $executive->name,
                'position' => $executive->position,
                'email' => $executive->email,
                'phone' => $executive->phone,
                'office' => $executive->office,
                'address' => $executive->address,
                'termStart' => $executive->term_start ? $executive->term_start->format('Y-m-d') : null,
                'termEnd' => $executive->term_end ? $executive->term_end->format('Y-m-d') : null,
                'election_date' => $executive->election_date,
                'assumption_date' => $executive->assumption_date,
                'birthdate' => $executive->birthdate,
                'bio' => $executive->bio,
                'education' => $executive->education,
                'expertise' => $executive->expertise,
                'quote' => $executive->quote,
                'facebook_url' => $executive->facebook_url,
                'photo' => $executive->photo_url,
                'photo_path' => $executive->photo_path,
                'order_column' => $executive->order_column,
                'is_active' => $executive->is_active,
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $executive = PublicExecutive::find($id);
        
        if (!$executive) {
            return response()->json([
                'success' => false,
                'message' => 'Executive not found',
            ], 404);
        }

        // Delete photo if exists
        if ($executive->photo_path) {
            Storage::disk('public')->delete($executive->photo_path);
        }

        $executive->delete();

        return response()->json([
            'success' => true,
            'message' => 'Executive deleted successfully',
        ]);
    }

    /**
     * Save base64 encoded image and return path
     */
    private function saveBase64Image($base64Image, $directory)
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif
            
            $image = base64_decode($base64Image);
            
            if ($image === false) {
                return null;
            }
            
            $filename = uniqid() . '.' . $type;
            $path = $directory . '/' . $filename;
            
            Storage::disk('public')->put($path, $image);
            
            return $path;
        }
        
        return null;
    }
}