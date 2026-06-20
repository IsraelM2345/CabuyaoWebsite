import React, { useState, useEffect, useCallback } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
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
    ChevronLeft,
    ChevronRight,
    RefreshCw,
} from "lucide-react";

const ANNOUNCEMENT_TYPES = [
    "All Types",
    "Holiday",
    "Traffic",
    "Health",
    "Employment",
    "Utility",
    "Social Services",
    "Education",
    "Safety",
    "General",
];

const API_BASE_URL = "/api/staff";

export default function AnnouncementsIndex() {
    // State management
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedItems, setSelectedItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteSelectedModal, setShowDeleteSelectedModal] =
        useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeletingSelected, setIsDeletingSelected] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });
    const [refreshing, setRefreshing] = useState(false);

    // Fetch announcements from API
    const fetchAnnouncements = useCallback(
        async (page = 1) => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                params.set("page", page);
                params.set("per_page", pagination.per_page);

                if (searchQuery) params.set("search", searchQuery);
                if (typeFilter !== "All Types")
                    params.set("category", typeFilter);
                if (statusFilter !== "All") params.set("status", statusFilter);

                const response = await fetch(
                    `${API_BASE_URL}/announcements?${params.toString()}`,
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
                        // User is not authenticated - show message
                        throw new Error(
                            "Session expired. Please log in to continue.",
                        );
                    }
                    throw new Error(
                        `Failed to fetch announcements: ${response.status}`,
                    );
                }

                const data = await response.json();
                setAnnouncements(data.data || []);
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
        [searchQuery, typeFilter, statusFilter, pagination.per_page],
    );

    // Initial fetch and filter changes
    useEffect(() => {
        fetchAnnouncements(1);
    }, [fetchAnnouncements]);

    // Handle manual refresh
    const handleRefresh = () => {
        setRefreshing(true);
        fetchAnnouncements(pagination.current_page);
    };

    // Stats calculation
    const stats = {
        total: pagination.total,
        active: announcements.filter((a) => a.status === "Published").length,
        drafts: announcements.filter((a) => a.status === "Draft").length,
        expired: announcements.filter((a) => a.status === "Expired").length,
    };

    // Delete handlers
    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/announcements/${deleteId}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            document.querySelector('meta[name="csrf-token"]')
                                ?.content || "",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Failed to delete announcement");
            }

            // Remove from local state
            setAnnouncements(announcements.filter((a) => a.id !== deleteId));
            setShowDeleteModal(false);
            setDeleteId(null);
            fetchAnnouncements(pagination.current_page);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) {
            alert("No items selected");
            return;
        }
        setShowDeleteSelectedModal(true);
    };

    const confirmDeleteSelected = async () => {
        if (isDeletingSelected) return;

        try {
            setIsDeletingSelected(true);

            const deletePromises = selectedItems.map((id) =>
                fetch(`${API_BASE_URL}/announcements/${id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            document.querySelector('meta[name="csrf-token"]')
                                ?.content || "",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                }),
            );

            await Promise.all(deletePromises);

            setAnnouncements((prev) =>
                prev.filter((a) => !selectedItems.includes(a.id)),
            );
            setSelectedItems([]);
            setShowDeleteSelectedModal(false);
            fetchAnnouncements(pagination.current_page);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeletingSelected(false);
        }
    };

    // Selection handlers
    const toggleSelectAll = () => {
        if (selectedItems.length === announcements.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(announcements.map((a) => a.id));
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
                        Active
                    </span>
                );
            case "Draft":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <Clock size={12} />
                        Draft
                    </span>
                );
            case "Expired":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        <XCircle size={12} />
                        Expired
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

    // Type badge component
    const getTypeBadge = (type) => {
        const colors = {
            Holiday:
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            Traffic:
                "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            Health: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            Employment:
                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            Utility:
                "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            "Social Services":
                "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
            Education:
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            Safety: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            General:
                "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
        };
        return (
            <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[type] || colors.General}`}
            >
                {type}
            </span>
        );
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <StaffLayout
            currentPage="Announcements"
            title="Announcements"
            subtitle="Create and manage public announcements for the city."
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Total Announcements
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500">
                            <Calendar size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Active
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.active}
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
                                Expired
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.expired}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-500">
                            <XCircle size={20} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search announcements..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && fetchAnnouncements(1)
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                    </div>

                    {/* Filters */}
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
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            >
                                {ANNOUNCEMENT_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
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
                            <option value="Published">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Expired">Expired</option>
                        </select>

                        {selectedItems.length > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                            >
                                <Trash2 size={16} />
                                Delete Selected ({selectedItems.length})
                            </button>
                        )}

                        <a
                            href="/staff/add-announcement"
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            <Plus size={16} />
                            New Announcement
                        </a>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-slate-400 mt-2">
                        Loading announcements...
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

            {/* Announcements Table */}
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
                                                selectedItems.length ===
                                                    announcements.length &&
                                                announcements.length > 0
                                            }
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                        Announcement
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                                        Date Range
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {announcements.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-12 text-center text-gray-500 dark:text-slate-400"
                                        >
                                            <Calendar
                                                className="mx-auto mb-2 text-gray-300"
                                                size={48}
                                            />
                                            <p>No announcements found</p>
                                            <a
                                                href="/staff/add-announcement"
                                                className="mt-2 inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                                            >
                                                <Plus size={16} />
                                                Create announcement
                                            </a>
                                        </td>
                                    </tr>
                                ) : (
                                    announcements.map((ann) => (
                                        <tr
                                            key={ann.id}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(
                                                        ann.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(ann.id)
                                                    }
                                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-slate-700">
                                                        {ann.image_path ? (
                                                            <img
                                                                src={
                                                                    ann.image_path.startsWith(
                                                                        "http",
                                                                    )
                                                                        ? ann.image_path
                                                                        : `/storage/${ann.image_path}`
                                                                }
                                                                alt={ann.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) =>
                                                                    (e.target.src =
                                                                        "/images/news.jpg")
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Calendar
                                                                    size={16}
                                                                    className="text-gray-400"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                            {ann.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                            {ann.body}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getTypeBadge(ann.category)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(ann.status)}
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <div className="text-sm text-gray-600 dark:text-slate-300">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} />
                                                        {formatDate(ann.date)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <a
                                                        href={`/news?id=${ann.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                                        title="View on public site"
                                                    >
                                                        <Eye size={16} />
                                                    </a>
                                                    <a
                                                        href={`/staff/announcements-manager/${ann.id}/edit`}
                                                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                                        title="Edit"
                                                    >
                                                        <Edit3 size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(ann.id)
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
                        announcements.length > 0 &&
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
                                    of {pagination.total} announcements
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            fetchAnnouncements(
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
                                                        fetchAnnouncements(page)
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
                                            fetchAnnouncements(
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

            {/* Delete Selected Confirmation Modal */}
            {showDeleteSelectedModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center transition-colors"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={() => setShowDeleteSelectedModal(false)}
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
                                    Delete {selectedItems.length} Announcements?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This action cannot be undone. These
                                    announcements will be permanently deleted
                                    from both the staff system and public
                                    portal.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        setShowDeleteSelectedModal(false)
                                    }
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteSelected}
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-50"
                                    disabled={isDeletingSelected}
                                >
                                    {isDeletingSelected
                                        ? "Deleting..."
                                        : "Delete All"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center transition-colors"
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
                                    Delete Announcement?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This action cannot be undone. The
                                    announcement will be permanently deleted
                                    from both the staff system and public
                                    portal.
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
