<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PublicNews;
use App\Models\PublicAnnouncement;
use App\Models\PublicContactMessage;

class PublicContentSeeder extends Seeder
{
    public function run(): void
    {
        PublicNews::query()->delete();
        PublicAnnouncement::query()->delete();
        PublicContactMessage::query()->delete();

        PublicNews::create([
            'title' => 'City Government Launches New E-Governance Portal',
            'category' => 'Technology',
            'date' => '2026-05-15',
            'excerpt' => 'Integrated portal to streamline public services and disaster management.',
            'body' => 'The City of Cabuyao officially launches its integrated web portal to streamline public services and disaster management operations.',
            'image_path' => '/images/news-portal.png',
            'status' => 'Published',
            'published_at' => now(),
        ]);

        PublicAnnouncement::create([
            'title' => 'Mayor’s Advisory: Please Register for Typhoon Season',
            'category' => 'DRRM',
            'date' => '2026-05-10',
            'body' => 'CDRRMO releases updated guidelines and designated evacuation centers. Residents in low-lying areas are advised to register their households immediately.',
            'image_path' => '/images/news-typhoon.png',
            'status' => 'Published',
            'published_at' => now(),
        ]);

        PublicContactMessage::create([
            'name' => 'Sample User',
            'email' => 'sample@example.com',
            'department' => 'City Hall',
            'subject' => 'Hello',
            'message' => 'This is a sample contact message.',
            'status' => 'New',
        ]);
    }
}

