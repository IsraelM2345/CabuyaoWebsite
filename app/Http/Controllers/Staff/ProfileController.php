<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\File;

class ProfileController extends Controller
{
    /**
     * Update the currently authenticated staff profile.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user(); // auth:web

        // Normalize incoming string inputs (FormData often sends empty strings)
        $request->merge([
            'firstName' => $request->input('firstName') !== null ? trim((string) $request->input('firstName')) : null,
            'lastName' => $request->input('lastName') !== null ? trim((string) $request->input('lastName')) : null,
            'middleName' => $request->input('middleName') !== null ? trim((string) $request->input('middleName')) : null,
            'email' => $request->input('email') !== null ? trim((string) $request->input('email')) : null,
            'position' => $request->input('position') !== null ? trim((string) $request->input('position')) : null,
            'department' => $request->input('department') !== null ? trim((string) $request->input('department')) : null,
        ]);

        // Convert empty strings to null for position and department
        if ($request->input('position') === '') {
            $request->merge(['position' => null]);
        }
        if ($request->input('department') === '') {
            $request->merge(['department' => null]);
        }

        $validated = $request->validate([
            'firstName' => ['nullable', 'string', 'max:255'],
            'lastName' => ['nullable', 'string', 'max:255'],
            'middleName' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'position' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            // Accept common image uploads; FormData can send empty filename but hasFile will be false.
            'avatar' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,gif,svg', 'max:10240'], // 10MB
        ]);





        // Update name fields if provided
        if (!empty($validated['firstName']) || !empty($validated['lastName'])) {
            $firstName = $validated['firstName'] ?? '';
            $lastName = $validated['lastName'] ?? '';
            $middleName = $validated['middleName'] ?? '';
            $name = trim($firstName . ' ' . ($middleName ? $middleName . ' ' : '') . $lastName);
            if (!empty($name)) {
                $user->name = $name;
            }
        }

        // Update email if provided
        if (!empty($validated['email'])) {
            $user->email = Str::lower(trim($validated['email']));
        }

        // Only set these if the columns exist on the users table.
        // If they don't exist yet, keep DB unchanged.
        // NOTE: property existence is not enough for dynamic saving; we must set DB column values.
        // Columns exist in database, directly assign values

        // If columns exist, update them.
        // If they don’t exist, still accept the input in response so UI remains consistent.
        // (This avoids “looks saved but reverts” confusion.)
        $user->position = !empty($validated['position']) ? $validated['position'] : null;
        $user->department = !empty($validated['department']) ? $validated['department'] : null;




        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename = (string) Str::uuid() . '.' . $ext;

            // store under: storage/app/public/avatars
            $path = $file->storeAs('avatars', $filename, ['disk' => 'public']);

            // $path example: avatars/uuid.jpg (on public disk)
            $user->photo = $path; // Database uses 'photo' column
        }

        $user->save();

        $avatarUrl = null;
        if (!empty($user->photo)) {
            $avatarUrl = URL::to(Storage::url($user->photo));
        }


        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'position' => $user->position,
                'department' => $user->department,
                'avatar' => $avatarUrl,
                'firstName' => collect(explode(' ', trim((string) $user->name)))->filter()->values()->get(0) ?? null,
                'middleName' => (function () use ($user) {
                    $parts = collect(explode(' ', trim((string) $user->name)))->filter()->values();
                    return $parts->count() >= 3 ? $parts->slice(1, $parts->count() - 2)->join(' ') : null;
                })(),
                'lastName' => collect(explode(' ', trim((string) $user->name)))->filter()->values()->last() ?? null,

            ],
        ]);
    }
}

