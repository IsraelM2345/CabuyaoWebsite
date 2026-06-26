<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\PublicContactMessage;
use Illuminate\Http\Request;

class ContactReplyController extends Controller
{
    /**
     * Display a listing of contact messages.
     */
    public function index(Request $request)
    {
        $query = PublicContactMessage::query();
        
        // Search functionality
        if ($search = $request->query('search')) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }
        
        // Status filter
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        
        // Pagination
        $perPage = $request->query('per_page', 15);
        $messages = $query->orderByDesc('created_at')->paginate($perPage);
        
        return response()->json($messages);
    }

    public function show(PublicContactMessage $contactMessage)
    {
        // Mark as read when viewed
        if ($contactMessage->status === 'Unread') {
            $contactMessage->status = 'Read';
            $contactMessage->save();
        }
        
        return response()->json($contactMessage);
    }

    /**
     * Add staff remark to a contact message.
     */
    public function reply(Request $request, PublicContactMessage $contactMessage)
    {

        $validated = $request->validate([
            'reply_text' => ['required', 'string'],
        ]);

        // Update the contact message with staff remark
        $contactMessage->reply = $validated['reply_text'];
        $contactMessage->replied_at = now();
        $contactMessage->status = 'Replied';
        $contactMessage->save();

        return response()->json([
            'message' => 'Staff remark added successfully',
            'data' => $contactMessage
        ]);
    }

    public function updateStatus(Request $request, PublicContactMessage $contactMessage)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:Unread,Read,Replied,Archived'],
        ]);

        $contactMessage->status = $validated['status'];
        $contactMessage->save();

        return response()->json([
            'message' => 'Status updated successfully',
            'data' => $contactMessage
        ]);
    }

    public function destroy(PublicContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return response()->json([
            'message' => 'Message deleted successfully'
        ]);
    }

    /**
     * Bulk delete contact messages.
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:public_contact_messages,id'],
        ]);

        PublicContactMessage::destroy($validated['ids']);

        return response()->json([
            'message' => 'Messages deleted successfully'
        ]);
    }

    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:public_contact_messages,id'],
            'status' => ['required', 'in:Unread,Read,Replied,Archived'],
        ]);

        PublicContactMessage::whereIn('id', $validated['ids'])->update([
            'status' => $validated['status']
        ]);

        return response()->json([
            'message' => 'Status updated successfully'
        ]);
    }
}