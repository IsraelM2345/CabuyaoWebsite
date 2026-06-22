<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'firstName' => ['required', 'string', 'max:255'],
                'lastName' => ['required', 'string', 'max:255'],
                'middleName' => ['nullable', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'position' => ['nullable', 'string', 'max:255'],
                'department' => ['nullable', 'string', 'max:255'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $middleInitial = isset($validated['middleName']) ? ' ' . substr($validated['middleName'], 0, 1) . '.' : '';
            $name = trim($validated['firstName'] . ' ' . $middleInitial . ' ' . $validated['lastName']);

                        $user = User::create([
                'name' => $name,
                'email' => Str::lower($validated['email']),
                'password' => $validated['password'],
            ]);

            return response()->json([
                'message' => 'Account created successfully. Please log in.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt([
            'email' => $validated['email'],
            'password' => $validated['password'],
        ])) {
            // Check if the request is an AJAX/Fetch request (used in your StaffLogin.jsx)
            if ($request->wantsJson() || $request->ajax() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
                return response()->json(['message' => 'Invalid credentials.'], 401);
            }

            return back()->withErrors([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        $request->session()->regenerate();

        // If it's a fetch request from your React frontend, return success with user role
        if ($request->wantsJson() || $request->ajax() || $request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json([
                'message' => 'Login successful.',
                'user' => [
                    'id' => Auth::user()->id,
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'role' => Auth::user()->role,
                ]
            ]);
        }

        // Default redirect for normal form submissions (EvacTech Dashboard)
        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Check the custom hidden input sent from StaffLayout.jsx
        if ($request->input('from_staff') === 'true') {
            return redirect()->route('staff.login');
        }

        // Default redirect for EvacTech users
        return redirect()->route('login');
    }
}
