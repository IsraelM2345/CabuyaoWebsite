<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicContactMessage extends Model
{
    protected $table = 'public_contact_messages';

    protected $fillable = [
        'name',
        'email',
        'department',
        'subject',
        'message',
        'status',
        'reply',
        'replied_at',
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];
}