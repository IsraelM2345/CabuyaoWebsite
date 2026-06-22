<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PublicExecutive extends Model
{
    use HasFactory;

    protected $table = 'public_executives';

    protected $fillable = [
        'name',
        'position',
        'email',
        'phone',
        'office',
        'address',
        'term_start',
        'term_end',
        'election_date',
        'assumption_date',
        'birthdate',
        'bio',
        'education',
        'expertise',
        'quote',
        'facebook_url',
        'photo_path',
        'order_column',
        'is_active',
    ];

    protected $casts = [
        'order_column' => 'integer',
        'is_active' => 'boolean',
        'term_start' => 'date',
        'term_end' => 'date',
    ];

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
     * Get expertise as an array
     */
    public function getExpertiseArrayAttribute(): array
    {
        $expertise = $this->expertise;
        if (empty($expertise)) {
            return [];
        }
        
        // Try to decode as JSON first
        $decoded = json_decode($expertise, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        
        // Fall back to comma-separated or newline-separated
        return array_map('trim', explode("\n", str_replace("\r", "", $expertise)));
    }

    /**
     * Set expertise from array
     */
    public function setExpertiseArrayAttribute(array $value): void
    {
        $this->attributes['expertise'] = json_encode($value);
    }

    /**
     * Scope to get only active executives
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

    /**
     * Scope to get Vice Mayor
     */
    public function scopeViceMayor($query)
    {
        return $query->where('position', 'Vice Mayor');
    }

    /**
     * Scope to get Mayor
     */
    public function scopeMayor($query)
    {
        return $query->where('position', 'Mayor');
    }
}