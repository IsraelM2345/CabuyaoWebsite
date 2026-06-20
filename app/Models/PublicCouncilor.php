<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PublicCouncilor extends Model
{
    use HasFactory;

    protected $table = 'public_councilors';

    protected $fillable = [
        'name',
        'position',
        'education',
        'birthday',
        'election_date',
        'assumption_date',
        'chairmanships',
        'memberships',
        'photo_path',
        'order_column',
        'is_active',
    ];

    protected $casts = [
        'order_column' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get chairmanships as an array
     */
    public function getChairmanshipsArrayAttribute(): array
    {
        $chairmanships = $this->chairmanships;
        if (empty($chairmanships)) {
            return [];
        }
        
        // Try to decode as JSON first
        $decoded = json_decode($chairmanships, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        
        // Fall back to comma-separated
        return array_map('trim', explode(',', $chairmanships));
    }

    /**
     * Get memberships as an array
     */
    public function getMembershipsArrayAttribute(): array
    {
        $memberships = $this->memberships;
        if (empty($memberships)) {
            return [];
        }
        
        // Try to decode as JSON first
        $decoded = json_decode($memberships, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        
        // Fall back to comma-separated
        return array_map('trim', explode(',', $memberships));
    }

    /**
     * Set chairmanships from array
     */
    public function setChairmanshipsArrayAttribute(array $value): void
    {
        $this->attributes['chairmanships'] = json_encode($value);
    }

    /**
     * Set memberships from array
     */
    public function setMembershipsArrayAttribute(array $value): void
    {
        $this->attributes['memberships'] = json_encode($value);
    }

    /**
     * Get the URL for the photo
     */
    public function getPhotoUrlAttribute(): ?string
    {
        if (empty($this->photo_path)) {
            return null;
        }
        return '/storage/' . $this->photo_path;
    }

    /**
     * Scope to get only active councilors
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by order_column
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_column')->orderBy('name');
    }
}