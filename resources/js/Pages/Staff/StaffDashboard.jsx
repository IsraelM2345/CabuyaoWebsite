import React, { useState, useEffect } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    FileText,
    Megaphone,
    Mail,
    Image,
    Users,
    Building2,
    Briefcase,
    Shield,
    Edit3,
    Plus,
    Eye,
    Trash2,
    Clock,
    TrendingUp,
    MessageSquare,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    AlertCircle,
    CheckCircle2,
    Download,
    ChevronRight,
    RefreshCw,
    Loader2,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

// ── Custom Tooltip ───────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-xl shadow-lg">
                <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 mb-2">
                    {label}
                </p>
                {payload.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 text-[11px]"
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-600 dark:text-slate-300">
                            {entry.name}:{" "}
                            <span className="font-semibold text-gray-900 dark:text-slate-100">
                                {entry.value.toLocaleString()}
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// ── Stat Card ────────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, iconBg, onClick, loading }) {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 flex items-start gap-4 transition-all ${
                onClick
                    ? "cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700"
                    : ""
            }`}
        >
            <div className={`p-3 rounded-xl ${iconBg}`}>
                {loading ? (
                    <Loader2 size={20} className="text-white animate-spin" />
                ) : (
                    <Icon size={20} className="text-white" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-0.5">
                    {label}
                </p>
                {loading ? (
                    <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                )}
                {sub && (
                    <p className="text-xs font-medium mt-0.5 flex items-center gap-1 text-gray-500 dark:text-slate-400">
                        {sub}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Quick Action Card ────────────────────────────────────────────────────────────
function QuickActionCard({ icon: Icon, label, description, color, href }) {
    return (
        <a
            href={href}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800/50 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all group"
        >
            <div className="flex items-center gap-3">
                <div
                    className={`${color} p-2.5 rounded-lg group-hover:scale-110 transition-transform`}
                >
                    <Icon size={18} className="text-white" />
                </div>
                <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {label}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
            <ChevronRight
                size={18}
                className="text-gray-400 group-hover:text-blue-500 transition-colors"
            />
        </a>
    );
}

// ── Quick Actions Data ───────────────────────────────────────────────────────────
const quickActions = [
    {
        label: "Create News",
        description: "Add new news article",
        icon: FileText,
        color: "bg-red-500",
        href: "/staff/add-news",
    },
    {
        label: "Post Announcement",
        description: "Create public announcement",
        icon: Megaphone,
        color: "bg-blue-500",
        href: "/staff/add-announcement",
    },
    {
        label: "Edit Pages",
        description: "Update page content",
        icon: Edit3,
        color: "bg-amber-500",
        href: "/staff/page-editor",
    },
    {
        label: "View Messages",
        description: "Check citizen inquiries",
        icon: Mail,
        color: "bg-emerald-500",
        href: "/staff/contact-inbox",
    },
    {
        label: "Manage Media",
        description: "Upload images & files",
        icon: Image,
        color: "bg-purple-500",
        href: "/staff/media-manager",
    },
    {
        label: "Manage Officials",
        description: "Update city officials",
        icon: Users,
        color: "bg-pink-500",
        href: "/staff/officials",
    },
];

// ── Main Staff Dashboard (CMS for Web Portal) ───────────────────────────────────
export default function StaffDashboard() {
    const [stats, setStats] = useState(null);
    const [content, setContent] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [pageViews, setPageViews] = useState([]);
    const [systemStatus, setSystemStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/staff/dashboard/stats", {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const data = await response.json();

            setStats(data.stats);
            setContent(data.recentContent || []);
            setPendingTasks(data.pendingTasks || []);
            setPageViews(data.pageViews || []);
            setSystemStatus(data.systemStatus || {});
            setLastUpdated(new Date(data.timestamp));
            setError(null);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Format time ago
    const formatTimeAgo = (date) => {
        if (!date) return "";
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return "Just now";
    };

    return (
        <StaffLayout
            currentPage="Dashboard"
            title="Web Portal Dashboard"
            subtitle="Manage and monitor your city's public web portal content."
        >
            {/* Header with Refresh Button */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Overview
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        {loading
                            ? "Loading data..."
                            : lastUpdated
                              ? `Last updated ${formatTimeAgo(lastUpdated)}`
                              : "Real-time statistics"}
                    </p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <div>
                            <h4 className="text-red-900 dark:text-red-100 font-bold text-sm">
                                Error Loading Data
                            </h4>
                            <p className="text-red-700 dark:text-red-300 text-sm">
                                {error}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        className="text-red-600 dark:text-red-400 font-medium text-sm hover:underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Alert Banner */}
            {!loading && stats && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-xl p-4 mb-6 flex items-start gap-4 shadow-sm">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
                        <AlertCircle size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-blue-900 dark:text-blue-100 font-bold text-sm">
                            Content Updates Pending
                        </h4>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-0.5">
                            You have {stats.news.drafts} draft articles and{" "}
                            {stats.messages.unread} unread messages waiting for
                            your attention.
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            (window.location.href = "/staff/news-manager")
                        }
                        className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                    >
                        View All
                    </button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={FileText}
                    label="News Articles"
                    value={stats?.news.total ?? 0}
                    sub={
                        stats
                            ? `${stats.news.published} published, ${stats.news.drafts} drafts (${stats.news.trend})`
                            : ""
                    }
                    iconBg="bg-red-500"
                    onClick={() =>
                        (window.location.href = "/staff/news-manager")
                    }
                    loading={loading}
                />
                <StatCard
                    icon={Megaphone}
                    label="Announcements"
                    value={stats?.announcements.total ?? 0}
                    sub={
                        stats
                            ? `${stats.announcements.active} active, ${stats.announcements.expired} expired (${stats.announcements.trend})`
                            : ""
                    }
                    iconBg="bg-blue-500"
                    onClick={() =>
                        (window.location.href = "/staff/announcements-manager")
                    }
                    loading={loading}
                />
                <StatCard
                    icon={Mail}
                    label="Contact Messages"
                    value={stats?.messages.total ?? 0}
                    sub={
                        stats
                            ? `${stats.messages.unread} unread, ${stats.messages.responded} responded (${stats.messages.trend})`
                            : ""
                    }
                    iconBg="bg-emerald-500"
                    onClick={() =>
                        (window.location.href = "/staff/contact-inbox")
                    }
                    loading={loading}
                />
                <StatCard
                    icon={Edit3}
                    label="Pages Managed"
                    value={stats?.pages.total ?? 0}
                    sub={stats ? `${stats.pages.updated} updated recently` : ""}
                    iconBg="bg-amber-500"
                    onClick={() =>
                        (window.location.href = "/staff/page-editor")
                    }
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Left Column - Charts & Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Page Views Chart */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    Website Traffic
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                    Page views over the last 7 days
                                </p>
                            </div>
                            <button className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors">
                                <Download size={14} />
                                Export
                            </button>
                        </div>
                        <div
                            className="w-full"
                            style={{ height: 280, minHeight: 280 }}
                        >
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={pageViews} barSize={24}>
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                        className="text-gray-500 dark:text-slate-400"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dx={-10}
                                        className="text-gray-500 dark:text-slate-400"
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="views"
                                        name="Page Views"
                                        fill="#dc2626"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Content */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    Recent Content
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                    Latest updates across all content types
                                </p>
                            </div>
                            <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                                View All
                            </button>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse" />
                                        <div className="flex-1">
                                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
                                            <div className="h-3 w-1/2 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : content.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                                <FileText
                                    size={40}
                                    className="mx-auto mb-3 opacity-50"
                                />
                                <p>No recent content</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                {content.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    item.type === "news"
                                                        ? "bg-red-100 dark:bg-red-900/30"
                                                        : item.type ===
                                                            "announcement"
                                                          ? "bg-blue-100 dark:bg-blue-900/30"
                                                          : "bg-amber-100 dark:bg-amber-900/30"
                                                }`}
                                            >
                                                {item.type === "news" ? (
                                                    <FileText
                                                        size={14}
                                                        className="text-red-600 dark:text-red-400"
                                                    />
                                                ) : item.type ===
                                                  "announcement" ? (
                                                    <Megaphone
                                                        size={14}
                                                        className="text-blue-600 dark:text-blue-400"
                                                    />
                                                ) : (
                                                    <Edit3
                                                        size={14}
                                                        className="text-amber-600 dark:text-amber-400"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {item.title}
                                                </p>
                                                <p className="text-[10px] text-gray-400 dark:text-slate-500">
                                                    {item.date} • by{" "}
                                                    {item.author}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                                    item.status === "published"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : item.status ===
                                                            "draft"
                                                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Quick Actions & Tasks */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                Quick Actions
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {quickActions.map((action, idx) => (
                                <QuickActionCard
                                    key={idx}
                                    icon={action.icon}
                                    label={action.label}
                                    description={action.description}
                                    color={action.color}
                                    href={action.href}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                                <Clock size={16} className="text-amber-500" />
                                Pending Tasks
                            </h3>
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                                {pendingTasks.reduce(
                                    (acc, task) => acc + task.count,
                                    0,
                                )}{" "}
                                total
                            </span>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-slate-600" />
                                        <div className="flex-1 h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                                        <div className="w-8 h-6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : pendingTasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                                <CheckCircle2
                                    size={40}
                                    className="mx-auto mb-3 opacity-50"
                                />
                                <p>No pending tasks</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                {pendingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-2 h-2 rounded-full ${task.urgent ? "bg-red-500" : "bg-amber-500"}`}
                                            />
                                            <span className="text-sm text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                {task.task}
                                            </span>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-900 dark:text-white bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md border border-gray-200 dark:border-slate-600">
                                            {task.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* System Status */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">
                            System Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={14}
                                        className="text-green-500"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-slate-300">
                                        Website
                                    </span>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400">
                                    Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={14}
                                        className="text-green-500"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-slate-300">
                                        Database
                                    </span>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400">
                                    Healthy
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={14}
                                        className="text-green-500"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-slate-300">
                                        Media Storage
                                    </span>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400">
                                    {systemStatus?.storage || "Active"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={14}
                                        className="text-green-500"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-slate-300">
                                        Email Service
                                    </span>
                                </div>
                                <span className="text-xs text-green-600 dark:text-green-400">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
