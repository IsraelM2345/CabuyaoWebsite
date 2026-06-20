<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'email',
        'department',
        'subject',
        'message',
        'status',
    ];

    public function replies()
    {
        return $this->hasMany(ContactReply::class);
    }
}
