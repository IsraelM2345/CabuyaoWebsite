<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\PublicContactMessage;
class PublicContactMessageLookupController extends Controller

{
    // Citizen-facing: fetch a specific contact message/reply status
    // so the UI can show reply once staff answers.
    public function show(PublicContactMessage $contactMessage)
    {
        return response()->json([
            'ok' => true,
            'data' => [
                'id' => $contactMessage->id,
                'name' => $contactMessage->name,
                'email' => $contactMessage->email,
                'department' => $contactMessage->department,
                'subject' => $contactMessage->subject,
                'message' => $contactMessage->message,
                'status' => $contactMessage->status,
                'reply' => $contactMessage->reply,
                'replied_at' => $contactMessage->replied_at,
                'created_at' => $contactMessage->created_at,
            ],
        ]);
    }
}