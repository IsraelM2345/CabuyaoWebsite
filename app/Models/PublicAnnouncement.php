<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicAnnouncement extends Model
{
    protected $table = 'public_announcements';

    protected $fillable = [
        'title',
        'category',
        'date',
        'body',
        'image_path',
        'status',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];
}
