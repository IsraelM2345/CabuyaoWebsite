import React, { useEffect, useMemo, useState } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    Search,
    Mail,
    Eye,
    Trash2,
    Reply,
    AlertCircle,
    CheckCircle2,
    Clock,
    User,
    Filter,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    X,
    Archive,
} from "lucide-react";

// NOTE: Backend data model is `public_contact_messages`.
// Fields available: name, email, department, subject, message, status, reply, replied_at, created_at.
// API routes (staff):
// - GET    /staff/contacts?search=&status=&per_page=
// - GET    /staff/contacts/{contactMessage} (marks as read when status == 'Unread')
// - POST   /staff/contacts/{contactMessage}/reply  { reply_text }
// - PATCH  /staff/contacts/{contactMessage}/status { status }
// - DELETE /staff/contacts/{contactMessage}

const STATUS_FILTERS = ["All", "Unread", "Read", "Replied", "Archived"];

function safeText(v) {
    return typeof v === "string" ? v : "";
}

function formatDate(value) {
    if (!value) return "";
    try {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return String(value);
        return d.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return String(value);
    }
}

function getCsrfToken() {
    if (typeof document === "undefined") return null;
    const el = document.querySelector('meta[name="csrf-token"]');
    return el ? el.getAttribute("content") : null;
}

export default function ContactInbox() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Pagination (server-side)
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [replyContent, setReplyContent] = useState("");

    const [refreshing, setRefreshing] = useState(false);

    const fetchMessages = async ({
        search,
        status,
        silent = false,
        page: nextPage,
    } = {}) => {
        if (silent) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const params = new URLSearchParams();
            params.set("per_page", String(perPage));
            params.set("page", String(nextPage ?? page));
            if (search) params.set("search", search);
            if (status && status !== "All") params.set("status", status);

            const csrfToken = getCsrfToken();

            const res = await fetch(
                `/api/staff/contacts?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
                    },
                    credentials: "include",
                },
            );

            const json = await res.json();
            if (!res.ok) {
                throw new Error(
                    json?.message || `Failed to load (${res.status})`,
                );
            }

            // Controller returns Laravel paginator
            // Expected: { data: [...], current_page, last_page, total, ... }
            const list = Array.isArray(json?.data)
                ? json.data
                : Array.isArray(json)
                  ? json
                  : [];

            setMessages(list);
            setTotal(Number(json?.total ?? list.length));

            if (Number.isFinite(Number(json?.current_page))) {
                setPage(Number(json.current_page));
            }

            // Keep paginator metadata if backend provides it
            if (Number.isFinite(Number(json?.last_page))) {
                setLastPage(Number(json.last_page));
            } else {
                setLastPage(
                    Math.max(1, Math.ceil(Number(json?.total ?? 0) / perPage)),
                );
            }
        } catch (e) {
            setError(e?.message || "Unable to load contact inbox.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMessages({ search: "", status: "All" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When filters change, reset to page 1 and refetch.
    useEffect(() => {
        setPage(1);
        fetchMessages({ search: searchQuery, status: statusFilter });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, statusFilter]);

    const stats = useMemo(() => {
        const total = messages.length;
        const unread = messages.filter((m) => m.status === "Unread").length;
        const pending = messages.filter((m) => m.status === "Read").length; // backend has Read/Unread/Replied
        const replied = messages.filter((m) => m.status === "Replied").length;
        return { total, unread, pending, replied };
    }, [messages]);

    // Backend already applies search + status filter.
    // Keep this as-is only for display safety.
    const filteredMessages = useMemo(() => {
        return messages;
    }, [messages]);

    const getStatusBadge = (status) => {
        switch (status) {
            case "Unread":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <Mail size={12} />
                        Unread
                    </span>
                );
            case "Read":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <Clock size={12} />
                        Read
                    </span>
                );
            case "Replied":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 size={12} />
                        Replied
                    </span>
                );
            case "Archived":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300">
                        <Archive size={12} />
                        Archived
                    </span>
                );
        }

        return (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                {status || "Unknown"}
            </span>
        );
    };

    const getSafeCategory = () => {
        return (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                {selectedMessage?.department || "—"}
            </span>
        );
    };

    const markAsRead = async (contactMessage) => {
        try {
            const csrfToken = getCsrfToken();

            const res = await fetch(
                `/api/staff/contacts/${contactMessage?.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
                    },
                    credentials: "include",
                },
            );

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(
                    json?.message || `Failed to mark as read (${res.status})`,
                );
            }
            // Update local list
            setMessages((prev) =>
                prev.map((m) => (m.id === contactMessage.id ? json : m)),
            );
        } catch {
            // best effort: do nothing
        }
    };

    const handleReply = (message) => {
        setSelectedMessage(message);
        setReplyContent("");
        setShowReplyModal(true);
    };

    const [viewModalMessage, setViewModalMessage] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const handleView = async (message) => {
        // Best effort: mark as read via GET show endpoint then open modal
        try {
            await markAsRead(message);
        } catch {
            // ignore
        }
        setSelectedMessage(message);
        setViewModalMessage(message);
        setShowViewModal(true);
    };

    const submitReply = async () => {
        if (!selectedMessage || !replyContent.trim()) return;

        const contactMessageId = selectedMessage.id;
        try {
            const csrfToken = getCsrfToken();

            const res = await fetch(
                `/api/staff/contacts/${contactMessageId}/reply`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
                    },
                    credentials: "include",
                    body: JSON.stringify({ reply_text: replyContent }),
                },
            );

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(
                    json?.message || `Failed to send reply (${res.status})`,
                );
            }

            setShowReplyModal(false);
            setSelectedMessage(null);
            setReplyContent("");

            // Refresh
            await fetchMessages({ search: searchQuery, status: statusFilter });
        } catch (e) {
            setError(e?.message || "Unable to send reply.");
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const csrfToken = getCsrfToken();

            const res = await fetch(`/api/staff/contacts/${deleteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
                },
                credentials: "include",
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(
                    json?.message || `Failed to delete (${res.status})`,
                );
            }

            setShowDeleteModal(false);
            setDeleteId(null);
            await fetchMessages({ search: searchQuery, status: statusFilter });
        } catch (e) {
            setError(e?.message || "Unable to delete message.");
        }
    };

    const handlePageChange = async (nextPage) => {
        if (!Number.isFinite(nextPage) || nextPage < 1) return;

        // Optional: avoid duplicate requests while loading
        if (refreshing) return;

        await fetchMessages({
            search: searchQuery,
            status: statusFilter,
            page: nextPage,
        });
    };

    return (
        <StaffLayout
            currentPage="Contact Inbox"
            title="Contact Inbox"
            subtitle="Manage and respond to citizen inquiries and messages."
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Total Messages
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500">
                            <Mail size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Unread
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.unread}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500">
                            <AlertCircle size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Pending
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.pending}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-orange-500">
                            <Clock size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Replied
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.replied}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-500">
                            <CheckCircle2 size={20} className="text-white" />
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
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            >
                                {STATUS_FILTERS.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() =>
                                fetchMessages({
                                    search: searchQuery,
                                    status: statusFilter,
                                    silent: true,
                                })
                            }
                            disabled={refreshing}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                refreshing
                                    ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-400 cursor-not-allowed"
                                    : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200"
                            }`}
                        >
                            <RefreshCw
                                size={16}
                                className={refreshing ? "animate-spin" : ""}
                            />
                            {refreshing ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                    Sender
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                                    Subject
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                                    Priority
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                                    Received
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {filteredMessages.map((msg) => (
                                <tr
                                    key={msg.id}
                                    className={`hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${msg.status === "Unread" ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}`}
                                    onClick={() => markAsRead(msg)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                                                <User
                                                    size={14}
                                                    className="text-gray-500"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {msg.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                                    {msg.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                                                {msg.subject}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                                {msg.message.substring(0, 60)}
                                                ...
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                            {msg.department || "—"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(msg.status)}
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                            —
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className="text-sm text-gray-600 dark:text-slate-300">
                                            {formatDate(
                                                msg.replied_at ||
                                                    msg.created_at,
                                            )}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReply(msg);
                                                }}
                                                className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                                title="Reply"
                                            >
                                                <Reply size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleView(msg);
                                                }}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(msg.id);
                                                }}
                                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-slate-700">
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                        Showing {filteredMessages.length} of {messages.length}{" "}
                        messages
                    </p>

                    {(() => {
                        const currentPage = Number.isFinite(page) ? page : 1;
                        const effectiveLastPage = Number.isFinite(lastPage)
                            ? lastPage
                            : 1;
                        const canPrev = currentPage > 1;
                        const canNext = currentPage < effectiveLastPage;

                        const windowSize = 5;
                        let start = Math.max(
                            1,
                            currentPage - Math.floor(windowSize / 2),
                        );
                        let end = Math.min(
                            effectiveLastPage,
                            start + windowSize - 1,
                        );
                        start = Math.max(1, end - windowSize + 1);

                        const pages = [];
                        for (let p = start; p <= end; p++) pages.push(p);

                        return (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={!canPrev}
                                    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition disabled:opacity-50 ${
                                        !canPrev ? "cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {pages.map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        disabled={p === currentPage}
                                        className={`px-3 py-1.5 rounded-lg text-xs transition ${
                                            p === currentPage
                                                ? "bg-red-600 text-white font-medium"
                                                : "bg-transparent hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={!canNext}
                                    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition disabled:opacity-50 ${
                                        !canNext ? "cursor-not-allowed" : ""
                                    }`}
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* View Modal */}
            {showViewModal && viewModalMessage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={() => setShowViewModal(false)}
                >
                    <div
                        className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="h-1 w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #6d28d9, #4c1d95)",
                            }}
                        />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Message Details
                                </h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4">
                                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                    From
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {viewModalMessage.name}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-slate-300">
                                    {viewModalMessage.email}
                                </p>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                        Subject
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {viewModalMessage.subject}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4">
                                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-2">
                                    Message
                                </p>
                                <p className="text-sm text-gray-700 dark:text-slate-200 whitespace-pre-wrap">
                                    {viewModalMessage.message}
                                </p>
                            </div>

                            {viewModalMessage.reply && (
                                <div className="mt-5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30 p-4">
                                    <p className="text-xs text-green-700 dark:text-green-300 font-medium mb-2">
                                        Staff Reply
                                    </p>
                                    <p className="text-sm text-green-900 dark:text-green-100 whitespace-pre-wrap">
                                        {viewModalMessage.reply}
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {showReplyModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={() => setShowReplyModal(false)}
                >
                    <div
                        className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="h-1 w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #2563eb, #1d4ed8)",
                            }}
                        />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Reply to {selectedMessage?.name}
                                </h2>
                                <button
                                    onClick={() => setShowReplyModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Original Message */}
                            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Original Message
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-slate-300">
                                    {selectedMessage?.message}
                                </p>
                            </div>

                            {/* Reply Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Your Reply
                                </label>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) =>
                                        setReplyContent(e.target.value)
                                    }
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                    placeholder="Type your reply here..."
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowReplyModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitReply}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                                >
                                    <Reply size={16} />
                                    Send Reply
                                </button>
                            </div>
                        </div>
                    </div>
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
                                    Delete Message?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This action cannot be undone. The message
                                    will be permanently deleted.
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
