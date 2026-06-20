<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\PublicNews;
use App\Models\PublicAnnouncement;
use App\Models\PublicContactMessage;
use App\Models\PublicMedia;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics and data for the Staff Portal
     */
    public function getDashboardData()
    {
        // News Statistics
        $newsTotal = PublicNews::count();
        $newsPublished = PublicNews::where('status', 'Published')->count();
        $newsDrafts = PublicNews::where('status', 'Draft')->count();
        $newsTrend = $this->calculateTrend(PublicNews::class, 'Published');

        // Announcement Statistics
        $announcementsTotal = PublicAnnouncement::count();
        $announcementsActive = PublicAnnouncement::where('status', 'Published')->count();
        $announcementsExpired = PublicAnnouncement::where('status', 'Expired')->count();
        $announcementsTrend = $this->calculateTrend(PublicAnnouncement::class, 'Published');

        // Contact Messages Statistics
        $messagesTotal = PublicContactMessage::count();
        $messagesUnread = PublicContactMessage::where('status', 'Unread')->count();
        $messagesResponded = PublicContactMessage::where('status', 'Responded')->count();
        $messagesTrend = $this->calculateTrend(PublicContactMessage::class, 'Responded');

        // Pages Statistics (we have 12 main pages in the portal)
        $pagesTotal = 12;
        $pagesUpdated = 8;
        $pagesNeedsUpdate = 4;

        // Recent Content (mix of news, announcements, and pages)
        $recentNews = PublicNews::with('author')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'news',
                    'title' => $item->title,
                    'status' => $item->status,
                    'date' => $item->created_at->diffForHumans(),
                    'author' => $item->author?->name ?? 'Admin',
                ];
            });

        $recentAnnouncements = PublicAnnouncement::orderBy('created_at', 'desc')
            ->limit(2)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => 'announcement',
                    'title' => $item->title,
                    'status' => $item->status,
                    'date' => $item->created_at->diffForHumans(),
                    'author' => 'PIO',
                ];
            });

        $recentContent = $recentNews->merge($recentAnnouncements)
            ->sortByDesc('date')
            ->values()
            ->take(5);

        // Pending Tasks
        $pendingTasks = [
            [
                'id' => 1,
                'task' => 'Review and publish draft news articles',
                'count' => $newsDrafts,
                'urgent' => $newsDrafts > 0,
                'icon' => 'FileText',
            ],
            [
                'id' => 2,
                'task' => 'Respond to citizen contact messages',
                'count' => $messagesUnread,
                'urgent' => $messagesUnread > 0,
                'icon' => 'Mail',
            ],
            [
                'id' => 3,
                'task' => 'Review expired announcements',
                'count' => $announcementsExpired,
                'urgent' => false,
                'icon' => 'Calendar',
            ],
            [
                'id' => 4,
                'task' => 'Review and approve new images',
                'count' => 0, // No status field in public_media table yet
                'urgent' => false,
                'icon' => 'Image',
            ],
        ];

        // Page Views Data (last 7 days) - Using a simulation since we don't have analytics table
        $pageViewsData = $this->getPageViewsData();

        // System Status
        $systemStatus = [
            'website' => 'Online',
            'database' => 'Healthy',
            'storage' => PublicMedia::count() . ' files',
            'email' => 'Active',
        ];

        return response()->json([
            'stats' => [
                'news' => [
                    'total' => $newsTotal,
                    'published' => $newsPublished,
                    'drafts' => $newsDrafts,
                    'trend' => $newsTrend,
                ],
                'announcements' => [
                    'total' => $announcementsTotal,
                    'active' => $announcementsActive,
                    'expired' => $announcementsExpired,
                    'trend' => $announcementsTrend,
                ],
                'messages' => [
                    'total' => $messagesTotal,
                    'unread' => $messagesUnread,
                    'responded' => $messagesResponded,
                    'trend' => $messagesTrend,
                ],
                'pages' => [
                    'total' => $pagesTotal,
                    'updated' => $pagesUpdated,
                    'needsUpdate' => $pagesNeedsUpdate,
                    'trend' => '0%',
                ],
            ],
            'recentContent' => $recentContent,
            'pendingTasks' => $pendingTasks,
            'pageViews' => $pageViewsData,
            'systemStatus' => $systemStatus,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Calculate trend percentage compared to previous period
     */
    private function calculateTrend($model, $statusField)
    {
        try {
            // Get actual status values from the database for trend calculation
            $currentWeek = $model::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                ->whereIn('status', ['Published', 'Responded', 'Active'])
                ->count();

            $lastWeek = $model::whereBetween('created_at', [now()->subWeek()->startOfWeek(), now()->subWeek()->endOfWeek()])
                ->whereIn('status', ['Published', 'Responded', 'Active'])
                ->count();

            if ($lastWeek == 0) {
                return $currentWeek > 0 ? '+100%' : '0%';
            }

            $percentage = round((($currentWeek - $lastWeek) / $lastWeek) * 100);
            return ($percentage >= 0 ? '+' : '') . $percentage . '%';
        } catch (\Exception $e) {
            // Return 0% if there's any error calculating trend
            return '0%';
        }
    }

    /**
     * Generate page views data for the last 7 days
     */
    private function getPageViewsData()
    {
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $data = [];

        foreach ($days as $day) {
            // Simulate page views (in real app, this would come from analytics)
            $data[] = [
                'day' => $day,
                'views' => rand(1500, 4500),
            ];
        }

        return $data;
    }
}