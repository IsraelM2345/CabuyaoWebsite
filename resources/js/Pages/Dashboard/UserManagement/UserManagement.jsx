import { useState, useEffect } from "react";
import { Layout } from "../../../Components/Sidebar";
import { Search, Plus, Pencil, Trash2, X, CheckCircle2 } from "lucide-react";

// Added unique IDs to the initial data for CRUD operations
const INITIAL_USERS = [
    {
        id: 1,
        initials: "AU",
        color: "#0d9488",
        name: "Admin User",
        email: "admin@cabuyao.gov.ph",
        role: "Super Admin",
        status: "Active",
        lastLogin: "2026-05-16\n08:30 AM",
    },
    {
        id: 2,
        initials: "JDC",
        color: "#3b82f6",
        name: "Juan Dela Cruz",
        email: "juan.delacruz@cabuyao.gov.ph",
        role: "Shelter Manager",
        status: "Active",
        lastLogin: "2026-05-16\n07:15 AM",
    },
    {
        id: 3,
        initials: "MS",
        color: "#8b5cf6",
        name: "Maria Santos",
        email: "maria.santos@cabuyao.gov.ph",
        role: "Shelter Manager",
        status: "Active",
        lastLogin: "2026-05-16\n08:45 AM",
    },
    {
        id: 4,
        initials: "PR",
        color: "#f59e0b",
        name: "Pedro Reyes",
        email: "pedro.reyes@cabuyao.gov.ph",
        role: "Encoder",
        status: "Active",
        lastLogin: "2026-05-15\n10:20 PM",
    },
    {
        id: 5,
        initials: "EG",
        color: "#6b7280",
        name: "Elena Gomez",
        email: "elena.gomez@cabuyao.gov.ph",
        role: "Encoder",
        status: "Inactive",
        lastLogin: "2026-05-10\n09:00 AM",
    },
];

const ROLES = ["Super Admin", "Shelter Manager", "Encoder"];
const STATUSES = ["Active", "Inactive"];

const ROLE_STYLE = {
    "Super Admin":
        "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    "Shelter Manager":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Encoder:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const STATUS_STYLE = {
    Active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Inactive: "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300",
};

// Helper: Toast Notification Component
function Toast({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="text-teal-500" size={20} />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}

// Helpers for new users
const getInitials = (name) => {
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const getRandomColor = () => {
    const colors = [
        "#0d9488",
        "#3b82f6",
        "#8b5cf6",
        "#f59e0b",
        "#6b7280",
        "#10b981",
        "#ef4444",
        "#ec4899",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export default function UserManagement() {
    // 1. Data & Search States
    const [users, setUsers] = useState(INITIAL_USERS);
    const [search, setSearch] = useState("");

    // 2. UI & Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    // 3. Form State
    const defaultForm = {
        name: "",
        email: "",
        role: "Encoder",
        status: "Active",
    };
    const [formData, setFormData] = useState(defaultForm);

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()),
    );

    // Form Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(defaultForm);
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        setEditingId(user.id);
        setIsModalOpen(true);
    };

    // Action Handlers
    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            // EDIT
            setUsers(
                users.map((u) =>
                    u.id === editingId
                        ? {
                              ...u,
                              name: formData.name,
                              email: formData.email,
                              role: formData.role,
                              status: formData.status,
                              initials: getInitials(formData.name), // Update initials if name changed
                          }
                        : u,
                ),
            );
            setToastMessage("User account updated successfully.");
        } else {
            // ADD
            const newId =
                users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
            const newUser = {
                id: newId,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                initials: getInitials(formData.name),
                color: getRandomColor(),
                lastLogin: "Never logged in", // Default for new users
            };
            setUsers([newUser, ...users]);
            setToastMessage("New user successfully added.");
        }

        handleCloseModal();
    };

    const handleDelete = (idToRemove) => {
        if (
            window.confirm(
                "Are you sure you want to delete this user? They will lose access to the system.",
            )
        ) {
            setUsers(users.filter((u) => u.id !== idToRemove));
            setToastMessage("User account has been removed.");
        }
    };

    return (
        <Layout
            currentPage="User Management"
            title="User Management"
            subtitle="Manage system access and user roles."
        >
            {/* Notification Toast */}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}

            {/* Add / Edit Modal overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingId
                                    ? "Edit User Account"
                                    : "Add New User"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        placeholder="e.g. Maria Santos"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        placeholder="name@cabuyao.gov.ph"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        System Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    >
                                        {ROLES.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Account Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white transition-colors"
                                >
                                    {editingId ? "Save Changes" : "Add User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                {/* Toolbar */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            size={15}
                        />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors w-72"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
                        style={{
                            background:
                                "linear-gradient(90deg, #0d9488, #0f766e)",
                        }}
                    >
                        <Plus size={15} />
                        Add User
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left transition-colors">
                                {[
                                    "User",
                                    "Role",
                                    "Status",
                                    "Last Login",
                                    "Actions",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/60 transition-colors">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        {/* User */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                    style={{
                                                        backgroundColor:
                                                            user.color,
                                                    }}
                                                >
                                                    {user.initials}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm transition-colors">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${ROLE_STYLE[user.role] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit transition-colors ${STATUS_STYLE[user.status]}`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                                                />
                                                {user.status}
                                            </span>
                                        </td>

                                        {/* Last Login */}
                                        <td className="px-5 py-4">
                                            {user.lastLogin
                                                .split("\n")
                                                .map((line, j) => (
                                                    <p
                                                        key={j}
                                                        className={
                                                            j === 0
                                                                ? "text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors"
                                                                : "text-gray-400 dark:text-gray-500 text-xs transition-colors"
                                                        }
                                                    >
                                                        {line}
                                                    </p>
                                                ))}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                    className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    Showing {filtered.length} of {users.length} users
                </div>
            </div>
        </Layout>
    );
}
