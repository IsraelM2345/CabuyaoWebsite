<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\PublicCouncilor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CouncilorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $councilors = PublicCouncilor::ordered()->get();
        
        return response()->json([
            'success' => true,
            'data' => $councilors->map(function ($councilor) {
                return [
                    'id' => $councilor->id,
                    'name' => $councilor->name,
                    'position' => $councilor->position,
                    'education' => $councilor->education,
                    'birthday' => $councilor->birthday,
                    'election_date' => $councilor->election_date,
                    'assumption_date' => $councilor->assumption_date,
                    'chairmanships' => $councilor->chairmanships_array,
                    'memberships' => $councilor->memberships_array,
                    'photo' => $councilor->photo_url,
                    'photo_path' => $councilor->photo_path,
                    'order_column' => $councilor->order_column,
                    'is_active' => $councilor->is_active,
                    'created_at' => $councilor->created_at,
                    'updated_at' => $councilor->updated_at,
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
            'position' => 'nullable|string|max:255',
            'education' => 'nullable|string',
            'birthday' => 'nullable|string|max:255',
            'election_date' => 'nullable|string|max:255',
            'assumption_date' => 'nullable|string|max:255',
            'chairmanships' => 'nullable|array',
            'chairmanships.*' => 'string',
            'memberships' => 'nullable|array',
            'memberships.*' => 'string',
            'photo' => 'nullable|string', // base64 encoded image
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
            $photoPath = $this->saveBase64Image($request->photo, 'councilors');
        }

        $maxOrder = PublicCouncilor::max('order_column') ?? 0;
        
        $councilor = PublicCouncilor::create([
            'name' => $request->name,
            'position' => $request->position ?? 'Councilor',
            'education' => $request->education,
            'birthday' => $request->birthday,
            'election_date' => $request->election_date,
            'assumption_date' => $request->assumption_date,
            'chairmanships' => json_encode($request->chairmanships ?? []),
            'memberships' => json_encode($request->memberships ?? []),
            'photo_path' => $photoPath,
            'order_column' => $request->order_column ?? ($maxOrder + 1),
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Councilor created successfully',
            'data' => [
                'id' => $councilor->id,
                'name' => $councilor->name,
                'position' => $councilor->position,
                'education' => $councilor->education,
                'birthday' => $councilor->birthday,
                'election_date' => $councilor->election_date,
                'assumption_date' => $councilor->assumption_date,
                'chairmanships' => $councilor->chairmanships_array,
                'memberships' => $councilor->memberships_array,
                'photo' => $councilor->photo_url,
                'photo_path' => $councilor->photo_path,
                'order_column' => $councilor->order_column,
                'is_active' => $councilor->is_active,
            ],
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $councilor = PublicCouncilor::find($id);
        
        if (!$councilor) {
            return response()->json([
                'success' => false,
                'message' => 'Councilor not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $councilor->id,
                'name' => $councilor->name,
                'position' => $councilor->position,
                'education' => $councilor->education,
                'birthday' => $councilor->birthday,
                'election_date' => $councilor->election_date,
                'assumption_date' => $councilor->assumption_date,
                'chairmanships' => $councilor->chairmanships_array,
                'memberships' => $councilor->memberships_array,
                'photo' => $councilor->photo_url,
                'photo_path' => $councilor->photo_path,
                'order_column' => $councilor->order_column,
                'is_active' => $councilor->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $councilor = PublicCouncilor::find($id);
        
        if (!$councilor) {
            return response()->json([
                'success' => false,
                'message' => 'Councilor not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'education' => 'nullable|string',
            'birthday' => 'nullable|string|max:255',
            'election_date' => 'nullable|string|max:255',
            'assumption_date' => 'nullable|string|max:255',
            'chairmanships' => 'nullable|array',
            'chairmanships.*' => 'string',
            'memberships' => 'nullable|array',
            'memberships.*' => 'string',
            'photo' => 'nullable|string', // base64 encoded image
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
        if ($request->remove_photo && $councilor->photo_path) {
            Storage::disk('public')->delete($councilor->photo_path);
            $councilor->photo_path = null;
        }

        // Handle photo upload if base64 data is provided
        if (!empty($request->photo) && preg_match('/^data:image\/(\w+);base64,/', $request->photo)) {
            // Delete old photo if exists
            if ($councilor->photo_path) {
                Storage::disk('public')->delete($councilor->photo_path);
            }
            $councilor->photo_path = $this->saveBase64Image($request->photo, 'councilors');
        }

        $councilor->update([
            'name' => $request->name,
            'position' => $request->position ?? $councilor->position,
            'education' => $request->education ?? $councilor->education,
            'birthday' => $request->birthday ?? $councilor->birthday,
            'election_date' => $request->has('election_date') ? $request->election_date : $councilor->election_date,
            'assumption_date' => $request->has('assumption_date') ? $request->assumption_date : $councilor->assumption_date,
            'chairmanships' => $request->has('chairmanships') ? json_encode($request->chairmanships) : $councilor->chairmanships,
            'memberships' => $request->has('memberships') ? json_encode($request->memberships) : $councilor->memberships,
            'order_column' => $request->order_column ?? $councilor->order_column,
            'is_active' => $request->has('is_active') ? $request->is_active : $councilor->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Councilor updated successfully',
            'data' => [
                'id' => $councilor->id,
                'name' => $councilor->name,
                'position' => $councilor->position,
                'education' => $councilor->education,
                'birthday' => $councilor->birthday,
                'election_date' => $councilor->election_date,
                'assumption_date' => $councilor->assumption_date,
                'chairmanships' => $councilor->chairmanships_array,
                'memberships' => $councilor->memberships_array,
                'photo' => $councilor->photo_url,
                'photo_path' => $councilor->photo_path,
                'order_column' => $councilor->order_column,
                'is_active' => $councilor->is_active,
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $councilor = PublicCouncilor::find($id);
        
        if (!$councilor) {
            return response()->json([
                'success' => false,
                'message' => 'Councilor not found',
            ], 404);
        }

        // Delete photo if exists
        if ($councilor->photo_path) {
            Storage::disk('public')->delete($councilor->photo_path);
        }

        $councilor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Councilor deleted successfully',
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