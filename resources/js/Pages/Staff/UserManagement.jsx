import { useState, useEffect } from "react";
import { useGlobalLoader } from "@/Hooks/useGlobalLoader";
import {
    Users,
    Search,
    Filter,
    Trash2,
    Eye,
    Download,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    CheckCircle,
    X,
    Lock,
    Shield,
} from "lucide-react";
import { StaffLayout } from "@/Components/StaffSidebar";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const { withLoader } = useGlobalLoader();

    // Check user authorization
    useEffect(() => {
        checkAuthorization();
    }, []);

    const checkAuthorization = async () => {
        try {
            const response = await fetch("/api/staff/me", {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserRole(data.user?.role || "user");
                setIsAuthorized(data.user?.role === "admin");
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error("Error checking authorization:", error);
            setIsAuthorized(false);
        } finally {
            setAuthLoading(false);
        }
    };

    // Fetch users from API
    useEffect(() => {
        if (isAuthorized) {
            fetchUsers();
        }
    }, [isAuthorized]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/staff/users", {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.users || data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setErrorMessage("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Delete user
    const handleDelete = async () => {
        if (!userToDelete) return;

        await withLoader(async () => {
            try {
                const response = await fetch(
                    `/api/staff/users/${userToDelete.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Accept: "application/json",
                            "X-CSRF-TOKEN": document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content"),
                        },
                    },
                );

                const data = await response.json();
                if (data.success) {
                    setUsers(users.filter((u) => u.id !== userToDelete.id));
                    setSuccessMessage("User deleted successfully");
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                    setTimeout(() => setSuccessMessage(""), 3000);
                } else {
                    setErrorMessage("Failed to delete user");
                    setTimeout(() => setErrorMessage(""), 3000);
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                setErrorMessage("An error occurred while deleting user");
                setTimeout(() => setErrorMessage(""), 3000);
            }
        });
    };

    // Export users to CSV
    const exportToCSV = () => {
        const headers = ["ID", "Name", "Email", "Created At", "Updated At"];
        const csvContent = [
            headers.join(","),
            ...users.map((user) =>
                [
                    user.id,
                    `"${user.name}"`,
                    user.email,
                    user.created_at,
                    user.updated_at,
                ].join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
    };

    // Show loading state
    if (authLoading) {
        return (
            <StaffLayout
                currentPage="User Management"
                title="User Management"
                subtitle="Manage staff accounts and permissions"
            >
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <RefreshCw
                            className="animate-spin mx-auto mb-4 text-gray-400"
                            size={32}
                        />
                        <p className="text-gray-500">Loading...</p>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    // Show access denied if not admin
    if (!isAuthorized) {
        return (
            <StaffLayout
                currentPage="User Management"
                title="User Management"
                subtitle="Manage staff accounts and permissions"
                userRole={userRole || "user"}
            >
                <div className="flex items-center justify-center h-96">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
                            <Lock
                                className="text-red-600 dark:text-red-400"
                                size={40}
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Access Denied
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            You don't have permission to access the User
                            Management page. Only administrators can manage user
                            accounts.
                        </p>
                        <button
                            onClick={() =>
                                (window.location.href = "/staff/dashboard")
                            }
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Shield size={18} />
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout
            currentPage="User Management"
            title="User Management"
            subtitle="Manage staff accounts and permissions"
            userRole="admin"
        >
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            User Management
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Manage staff accounts and permissions
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                        <button
                            onClick={fetchUsers}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Total Users
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {users.length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/30">
                                <Users
                                    className="text-blue-600 dark:text-blue-400"
                                    size={24}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Filter size={16} />
                            <span className="font-medium">
                                Showing {filteredUsers.length} of {users.length}{" "}
                                users
                            </span>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <RefreshCw
                                className="animate-spin text-gray-400 dark:text-gray-500 mb-4"
                                size={32}
                            />
                            <div className="text-gray-500 dark:text-gray-400 font-medium">
                                Loading users...
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {currentUsers.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                                    <Users
                                                        size={48}
                                                        className="mb-4 opacity-20"
                                                    />
                                                    <p className="text-lg font-medium">
                                                        No users found
                                                    </p>
                                                    <p className="text-sm mt-1">
                                                        Try adjusting your
                                                        search terms.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                                                                {user.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {user.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(
                                                            user.created_at,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(
                                                            user.updated_at,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedUser(
                                                                    user,
                                                                )
                                                            }
                                                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setUserToDelete(
                                                                    user,
                                                                );
                                                                setShowDeleteModal(
                                                                    true,
                                                                );
                                                            }}
                                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50">
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from(
                                    { length: Math.min(5, totalPages) },
                                    (_, i) => {
                                        let page;
                                        if (totalPages <= 5) page = i + 1;
                                        else if (currentPage <= 3) page = i + 1;
                                        else if (currentPage >= totalPages - 2)
                                            page = totalPages - 4 + i;
                                        else page = currentPage - 2 + i;

                                        return (
                                            <button
                                                key={page}
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                    currentPage === page
                                                        ? "bg-blue-600 text-white shadow-sm"
                                                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    },
                                )}
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedUser(null)}
                    />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-700 transform transition-all">
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6 mt-2">
                            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-sm">
                                <span className="text-3xl text-blue-600 dark:text-blue-400 font-bold">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {selectedUser.name}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                {selectedUser.email}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    User ID
                                </p>
                                <p className="font-medium text-gray-900 dark:text-gray-200">
                                    {selectedUser.id}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Account Created
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-gray-200 text-sm">
                                        {new Date(
                                            selectedUser.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Last Updated
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-gray-200 text-sm">
                                        {new Date(
                                            selectedUser.updated_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => {
                            setShowDeleteModal(false);
                            setUserToDelete(null);
                        }}
                    />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-700 transform transition-all">
                        <div className="text-center mb-6 mt-2">
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-sm">
                                <AlertTriangle
                                    className="text-red-600 dark:text-red-400"
                                    size={32}
                                />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Delete User Account
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Are you sure you want to delete{" "}
                                <span className="font-bold text-gray-700 dark:text-gray-300">
                                    {userToDelete.name}
                                </span>
                                ? This action cannot be undone and will
                                permanently remove their access.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setUserToDelete(null);
                                }}
                                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toasts */}
            {successMessage && (
                <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-800 border border-gray-800 dark:border-gray-700 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="font-medium text-sm">
                        {successMessage}
                    </span>
                </div>
            )}
            {errorMessage && (
                <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-800 border border-gray-800 dark:border-gray-700 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
                    <AlertTriangle className="text-red-400" size={20} />
                    <span className="font-medium text-sm">{errorMessage}</span>
                </div>
            )}
        </StaffLayout>
    );
}
