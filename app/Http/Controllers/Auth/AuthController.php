<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        try {
            // Normalize email before validation to ensure case-insensitive uniqueness.
            $rawEmail = $request->input('email');
            $normalizedEmail = is_string($rawEmail) ? Str::lower(trim($rawEmail)) : $rawEmail;

            $request->merge([
                'email' => $normalizedEmail,
            ]);

            $validated = $request->validate([
                'firstName' => ['required', 'string', 'max:255'],
                'lastName' => ['required', 'string', 'max:255'],
                'middleName' => ['nullable', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255'],
                'position' => ['nullable', 'string', 'max:255'],
                'department' => ['nullable', 'string', 'max:255'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $email = Str::lower(trim($validated['email']));

            // Explicit duplicate-email check with a clear contract.
            if (User::query()->where('email', $email)->exists()) {
                return response()->json([
                    'message' => 'This email is already registered.',
                ], 409);
            }

            $middleInitial = isset($validated['middleName']) && $validated['middleName'] !== ''
                ? ' ' . substr($validated['middleName'], 0, 1) . '.'
                : '';
            $name = trim($validated['firstName'] . ' ' . $middleInitial . ' ' . $validated['lastName']);

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($validated['password']),
                'role' => $request->input('role', 'staff'),
                'position' => $validated['position'] ?? null,
                'department' => $validated['department'] ?? null,
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
            Log::error('Registration error: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'Registration failed. Please try again or contact support if the problem persists.'
            ], 500);
        }
    }


    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $remember = $request->boolean('remember', false);

        if (!Auth::attempt([
            'email' => $validated['email'],
            'password' => $validated['password'],
        ], $remember)) {
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
