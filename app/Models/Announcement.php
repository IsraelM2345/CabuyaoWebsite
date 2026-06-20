<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'category',
        'date',
        'body',
        'image_path',
        'status',
        'published_at',
    ];
}
