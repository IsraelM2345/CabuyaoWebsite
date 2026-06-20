<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\PublicContactMessage;

use App\Models\PublicContactMessage as ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        $msg = ContactMessage::create([
            ...$validated,
            'status' => 'New',
        ]);

        return response()->json([
            'ok' => true,
            'message_id' => $msg->id,
        ], 201);
    }
}