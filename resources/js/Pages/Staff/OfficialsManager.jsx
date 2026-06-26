import React, { useState, useEffect } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
import { useGlobalLoader } from "../../Hooks/useGlobalLoader";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    User,
    AlertCircle,
    Filter,
    ChevronLeft,
    ChevronRight,
    Building2,
    Star,
    X,
    RefreshCw,
} from "lucide-react";

const API_BASE_URL = "/api/staff";

const positions = ["All Positions", "City Mayor", "Vice Mayor", "Councilor"];
const statuses = ["All Status", "active", "inactive"];

export default function OfficialsManager() {
    const [officials, setOfficials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [positionFilter, setPositionFilter] = useState("All Positions");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const { withLoader } = useGlobalLoader();

    // Fetch officials from both executives and councilors APIs
    const fetchOfficials = async () => {
        setLoading(true);
        try {
            // Fetch executives (Mayor and Vice Mayor)
            const execRes = await fetch(`${API_BASE_URL}/executives`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
            });
            const execJson = await execRes.json();
            const executives = execJson.success ? execJson.data : [];

            // Fetch councilors
            const councilRes = await fetch(`${API_BASE_URL}/councilors`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
            });
            const councilJson = await councilRes.json();
            const councilors = councilJson.success ? councilJson.data : [];

            // Combine and normalize data
            const combined = [
                ...executives.map((e) => ({
                    id: `exec-${e.id}`,
                    name: e.name,
                    position: e.position,
                    office: e.office || "",
                    term:
                        e.termStart && e.termEnd
                            ? `${new Date(e.termStart).getFullYear()} - ${new Date(e.termEnd).getFullYear()}`
                            : "",
                    email: e.email || "",
                    phone: e.phone || "",
                    image: e.photo || null,
                    status: e.is_active ? "active" : "inactive",
                    type: "executive",
                })),
                ...councilors.map((c) => ({
                    id: `council-${c.id}`,
                    name: c.name,
                    position: "Councilor",
                    office: c.office || "Sangguniang Panlungsod",
                    term:
                        c.termStart && c.termEnd
                            ? `${new Date(c.termStart).getFullYear()} - ${new Date(c.termEnd).getFullYear()}`
                            : "",
                    email: c.email || "",
                    phone: c.phone || "",
                    image: c.photo || null,
                    status: c.is_active ? "active" : "inactive",
                    type: "councilor",
                })),
            ];

            setOfficials(combined);
        } catch (e) {
            console.error("Failed to load officials:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfficials();
    }, []);

    // Filter officials
    const filteredOfficials = officials.filter((official) => {
        const matchesSearch =
            official.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            official.position
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            official.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPosition =
            positionFilter === "All Positions" ||
            official.position === positionFilter;
        const matchesStatus =
            statusFilter === "All Status" || official.status === statusFilter;
        return matchesSearch && matchesPosition && matchesStatus;
    });

    // Stats
    const stats = {
        total: officials.length,
        mayor: officials.filter((o) => o.position === "City Mayor").length,
        viceMayor: officials.filter((o) => o.position === "Vice Mayor").length,
        councilors: officials.filter((o) => o.position === "Councilor").length,
    };

    const handleDelete = async (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        await withLoader(async () => {
            try {
                // Determine if it's an executive or councilor
                const isExecutive = deleteId.startsWith("exec-");
                const actualId = deleteId.split("-")[1];
                const endpoint = isExecutive
                    ? `${API_BASE_URL}/executives/${actualId}`
                    : `${API_BASE_URL}/councilors/${actualId}`;

                const res = await fetch(endpoint, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            document.querySelector('meta[name="csrf-token"]')
                                ?.content || "",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                });

                if (res.ok) {
                    fetchOfficials();
                } else {
                    // Fallback: remove from local state
                    setOfficials(officials.filter((o) => o.id !== deleteId));
                }
            } catch (e) {
                // Fallback: remove from local state
                setOfficials(officials.filter((o) => o.id !== deleteId));
            }

            setShowDeleteModal(false);
            setDeleteId(null);
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                    </span>
                );
            case "inactive":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        Inactive
                    </span>
                );
        }
    };

    const getPositionBadge = (position) => {
        const colors = {
            "City Mayor":
                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            "Vice Mayor":
                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            Councilor:
                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        };
        return (
            <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[position] || colors.Councilor}`}
            >
                {position}
            </span>
        );
    };

    if (loading) {
        return (
            <StaffLayout
                currentPage="Officials"
                title="City Officials"
                subtitle="Manage information about city officials including Mayor, Vice Mayor, and Councilors."
            >
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 dark:text-slate-400">
                        Loading officials...
                    </div>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout
            currentPage="Officials"
            title="City Officials"
            subtitle="Manage information about city officials including Mayor, Vice Mayor, and Councilors."
        >
            {/* Refresh Button */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={fetchOfficials}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                    <RefreshCw size={16} />
                    Refresh Data
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Total Officials
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500">
                            <User size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                City Mayor
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.mayor}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-red-500">
                            <Star size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Vice Mayor
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.viceMayor}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500">
                            <Building2 size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Councilors
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.councilors}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500">
                            <User size={20} className="text-white" />
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
                            placeholder="Search officials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={positionFilter}
                                onChange={(e) =>
                                    setPositionFilter(e.target.value)
                                }
                                className="px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            >
                                {positions.map((pos) => (
                                    <option key={pos} value={pos}>
                                        {pos}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() +
                                        status.slice(1)}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    sessionStorage.setItem('addOfficialMode', 'executive');
                                    window.location.href = '/staff/officials/executive';
                                }}
                                disabled={stats.mayor + stats.viceMayor >= 2}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                    stats.mayor + stats.viceMayor >= 2
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                                title={stats.mayor + stats.viceMayor >= 2 ? 'Maximum of 2 executives allowed (Mayor and Vice Mayor)' : 'Add Executive'}
                            >
                                <Plus size={16} />
                                Add Executive
                            </button>
                            <button
                                onClick={() => {
                                    sessionStorage.setItem('addOfficialMode', 'councilor');
                                    window.location.href = '/staff/officials/councilors';
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                            >
                                <Plus size={16} />
                                Add Councilor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Officials Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                    Official
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                                    Position
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                                    Office
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">
                                    Contact
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">
                                    Term
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {filteredOfficials.map((official) => (
                                <tr
                                    key={official.id}
                                    className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {official.image ? (
                                                    <img
                                                        src={official.image}
                                                        alt={official.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User
                                                        size={20}
                                                        className="text-gray-500"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {official.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                                    {official.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        {getPositionBadge(official.position)}
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <span className="text-sm text-gray-600 dark:text-slate-300">
                                            {official.office}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <div className="text-sm text-gray-600 dark:text-slate-300">
                                            <p>{official.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(official.status)}
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <span className="text-sm text-gray-600 dark:text-slate-300">
                                            {official.term}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => {
                                                    // Navigate to the appropriate page with edit mode
                                                    const targetPage =
                                                        official.type ===
                                                        "executive"
                                                            ? "/staff/officials/executive"
                                                            : "/staff/officials/councilors";
                                                    // Store the edit info in sessionStorage and navigate
                                                    sessionStorage.setItem(
                                                        "editOfficialId",
                                                        official.id.replace(
                                                            `${official.type}-`,
                                                            "",
                                                        ),
                                                    );
                                                    sessionStorage.setItem(
                                                        "editOfficialType",
                                                        official.type,
                                                    );
                                                    window.location.href =
                                                        targetPage;
                                                }}
                                                className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                                title="Edit"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(official.id)
                                                }
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
                        Showing {filteredOfficials.length} of {officials.length}{" "}
                        officials
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition disabled:opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium">
                            1
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

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
                                    Remove Official?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This action cannot be undone. The official
                                    will be removed from the list.
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
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}
