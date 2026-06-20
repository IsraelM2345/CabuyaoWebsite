<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class PublicMedia extends Model
{
    protected $table = 'public_media';

    protected $fillable = [
        'file_name',
        'original_name',
        'label',
        'description',
        'category',
        'mime_type',
        'file_type',
        'disk',
        'path',
        'size_bytes',
        'width',
        'height',
    ];

    protected $appends = [
        'url',
    ];

    protected $casts = [
        'size_bytes' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    /**
     * Get the URL for the media file.
     */
    public function getUrlAttribute(): string
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk($this->disk);
        return $disk->url($this->path);
    }
}

