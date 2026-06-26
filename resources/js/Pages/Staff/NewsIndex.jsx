import React, { useState, useEffect, useCallback } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
import { useGlobalLoader } from "../../Hooks/useGlobalLoader";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Eye,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Filter,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    User,
    RefreshCw,
} from "lucide-react";

const CATEGORIES = [
    "All Categories",
    "Technology",
    "Health",
    "Education",
    "Infrastructure",
    "Economic Development",
    "Social Services",
    "Tourism",
    "Environment",
    "Sports",
    "Culture",
    "General",
    "DRRM",
    "Business",
];

const API_BASE_URL = "/api/staff";

export default function NewsIndex() {
    // State management
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedItems, setSelectedItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });
    const [refreshing, setRefreshing] = useState(false);
    const { withLoader } = useGlobalLoader();

    // Fetch news from API
    const fetchNews = useCallback(
        async (page = 1) => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                params.set("page", page);
                params.set("per_page", pagination.per_page);

                if (searchQuery) params.set("search", searchQuery);
                if (categoryFilter !== "All Categories")
                    params.set("category", categoryFilter);
                if (statusFilter !== "All") params.set("status", statusFilter);

                const response = await fetch(
                    `${API_BASE_URL}/news?${params.toString()}`,
                    {
                        headers: {
                            Accept: "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                        },
                        credentials: "same-origin", // Include cookies for session auth
                    },
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        // User is not authenticated - show message and suggest login
                        throw new Error(
                            "Session expired. Please log in to continue.",
                        );
                    }
                    throw new Error(`Failed to fetch news: ${response.status}`);
                }

                const data = await response.json();
                setNews(data.data || []);
                setPagination({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    per_page: data.per_page,
                    total: data.total,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [searchQuery, categoryFilter, statusFilter, pagination.per_page],
    );

    // Initial fetch and filter changes
    useEffect(() => {
        fetchNews(1);
    }, [fetchNews]);

    // Handle manual refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await withLoader(async () => {
            await fetchNews(pagination.current_page);
        });
    };

    // Stats calculation
    const stats = {
        total: pagination.total,
        published: news.filter((n) => n.status === "Published").length,
        drafts: news.filter((n) => n.status === "Draft").length,
        totalViews: news.reduce((sum, n) => sum + (n.views || 0), 0),
    };

    // Delete handlers
    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            // Bulk delete case (ids stored in selectedItems)
            if (selectedItems.length > 0 && deleteId === null) {
                const response = await fetch(
                    `${API_BASE_URL}/news/bulk-delete`,
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN":
                                document.querySelector(
                                    'meta[name="csrf-token"]',
                                )?.content || "",
                            "X-Requested-With": "XMLHttpRequest",
                        },
                        credentials: "same-origin",
                        body: JSON.stringify({ ids: selectedItems }),
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to delete selected news");
                }

                setSelectedItems([]);
                setShowDeleteModal(false);
                setDeleteId(null);
                fetchNews(pagination.current_page);
                return;
            }

            // Single delete case
            const response = await fetch(`${API_BASE_URL}/news/${deleteId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete news");
            }

            // Remove from local state
            setNews(news.filter((n) => n.id !== deleteId));
            setShowDeleteModal(false);
            setDeleteId(null);
            fetchNews(pagination.current_page);
        } catch (err) {
            setError(err.message);
        }
    };

    // Selection handlers
    const toggleSelectAll = () => {
        if (selectedItems.length === news.length && news.length > 0) {
            setSelectedItems([]);
        } else {
            setSelectedItems(news.map((n) => n.id));
        }
    };

    const deleteSelected = async () => {
        try {
            if (selectedItems.length === 0) return;

            const response = await fetch(`${API_BASE_URL}/news/bulk-delete`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
                body: JSON.stringify({ ids: selectedItems }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete selected news");
            }

            setSelectedItems([]);
            setShowDeleteModal(false);
            setDeleteId(null);
            fetchNews(pagination.current_page);
        } catch (err) {
            setError(err.message);
        }
    };

    const toggleSelect = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((i) => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Status badge component
    const getStatusBadge = (status) => {
        switch (status) {
            case "Published":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 size={12} />
                        Published
                    </span>
                );
            case "Draft":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <Clock size={12} />
                        Draft
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        <XCircle size={12} />
                        {status}
                    </span>
                );
        }
    };

    // Category badge component
    const getCategoryBadge = (category) => {
        const colors = {
            Technology:
                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            Health: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            Education:
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            Environment:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            Business:
                "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            Sports: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            Culture:
                "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
            Governance:
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            Infrastructure:
                "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
            "Economic Development":
                "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
            "Social Services":
                "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
            Tourism:
                "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
            DRRM: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            General:
                "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
        };
        return (
            <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[category] || colors.General}`}
            >
                {category}
            </span>
        );
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return "Not published";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <StaffLayout
            currentPage="News Manager"
            title="News Manager"
            subtitle="Create, edit, and manage news articles for the public portal."
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Total Articles
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-red-500">
                            <Calendar size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Published
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.published}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-500">
                            <CheckCircle2 size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Drafts
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.drafts}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500">
                            <Clock size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Total Views
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.totalViews.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500">
                            <Eye size={20} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search news articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchNews(1)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={handleRefresh}
                            className={`flex items-center gap-2 px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium transition ${
                                refreshing
                                    ? "animate-spin"
                                    : "hover:bg-gray-50 dark:hover:bg-slate-700"
                            }`}
                            disabled={refreshing}
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>

                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(e.target.value)
                                }
                                className="px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        >
                            <option value="All">All Status</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                        </select>

                        <a
                            href="/staff/add-news"
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            <Plus size={16} />
                            New Article
                        </a>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-slate-400 mt-2">
                        Loading news articles...
                    </p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                    <AlertCircle
                        className="mx-auto text-red-500 mb-2"
                        size={48}
                    />
                    <p className="text-red-500 font-medium">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Bulk Actions */}
            {!loading && !error && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <p className="text-sm text-gray-700 dark:text-slate-200">
                                Selected: {selectedItems.length}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                if (selectedItems.length === 0) return;
                                setDeleteId(null); // bulk mode
                                setShowDeleteModal(true);
                            }}
                            disabled={selectedItems.length === 0}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                                selectedItems.length === 0
                                    ? "bg-red-300 cursor-not-allowed text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                        >
                            <Trash2 size={16} />
                            Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* News Table */}
            {!loading && !error && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={
                                                news.length > 0 &&
                                                selectedItems.length ===
                                                    news.length
                                            }
                                            ref={(el) => {
                                                if (!el) return;
                                                const isIndeterminate =
                                                    selectedItems.length > 0 &&
                                                    selectedItems.length <
                                                        news.length;
                                                el.indeterminate =
                                                    isIndeterminate;
                                            }}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                        Article
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                                        Author
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {news.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-12 text-center text-gray-500 dark:text-slate-400"
                                        >
                                            <ImageIcon
                                                className="mx-auto mb-2 text-gray-300"
                                                size={48}
                                            />
                                            <p>No news articles found</p>
                                            <a
                                                href="/staff/add-news"
                                                className="mt-2 inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                                            >
                                                <Plus size={16} />
                                                Create article
                                            </a>
                                        </td>
                                    </tr>
                                ) : (
                                    news.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(
                                                        item.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(item.id)
                                                    }
                                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-8 rounded-lg bg-gray-100 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {item.image_path ? (
                                                            <img
                                                                src={
                                                                    item.image_path.startsWith(
                                                                        "http",
                                                                    )
                                                                        ? item.image_path
                                                                        : `/storage/${item.image_path}`
                                                                }
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageIcon
                                                                size={16}
                                                                className="text-gray-400"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                            {item.title}
                                                        </p>
                                                        <p
                                                            className="text-xs text-gray-500 dark:text-slate-400 mt-0.5"
                                                            style={{
                                                                display:
                                                                    "-webkit-box",
                                                                WebkitLineClamp: 3,
                                                                WebkitBoxOrient:
                                                                    "vertical",
                                                                overflow:
                                                                    "hidden",
                                                            }}
                                                            title={item.excerpt}
                                                        >
                                                            {item.excerpt}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                {getCategoryBadge(
                                                    item.category,
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                                                        <User
                                                            size={12}
                                                            className="text-gray-500"
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-slate-300">
                                                        {item.author || "Admin"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="text-sm text-gray-600 dark:text-slate-300">
                                                    {formatDate(
                                                        item.published_at ||
                                                            item.date,
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <a
                                                        href={`/news?id=${item.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                                        title="View on public site"
                                                    >
                                                        <Eye size={16} />
                                                    </a>
                                                    <a
                                                        href={`/staff/news-manager/${item.id}/edit`}
                                                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                                        title="Edit"
                                                    >
                                                        <Edit3 size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id,
                                                            )
                                                        }
                                                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading &&
                        !error &&
                        news.length > 0 &&
                        pagination.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-700">
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                    Showing{" "}
                                    {(pagination.current_page - 1) *
                                        pagination.per_page +
                                        1}{" "}
                                    to{" "}
                                    {Math.min(
                                        pagination.current_page *
                                            pagination.per_page,
                                        pagination.total,
                                    )}{" "}
                                    of {pagination.total} articles
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            fetchNews(
                                                pagination.current_page - 1,
                                            )
                                        }
                                        disabled={pagination.current_page === 1}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition disabled:opacity-50"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    {Array.from(
                                        {
                                            length: Math.min(
                                                5,
                                                pagination.last_page,
                                            ),
                                        },
                                        (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() =>
                                                        fetchNews(page)
                                                    }
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                                        pagination.current_page ===
                                                        page
                                                            ? "bg-red-600 text-white"
                                                            : "hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        },
                                    )}
                                    <button
                                        onClick={() =>
                                            fetchNews(
                                                pagination.current_page + 1,
                                            )
                                        }
                                        disabled={
                                            pagination.current_page ===
                                            pagination.last_page
                                        }
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition disabled:opacity-50"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="h-1 w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #dc2626, #b91c1c)",
                            }}
                        />
                        <div className="px-6 pt-8 pb-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                                    <AlertCircle
                                        size={32}
                                        className="text-red-500"
                                    />
                                </div>
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Delete Article?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This action cannot be undone. The article
                                    will be permanently deleted from both the
                                    staff system and public portal.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
