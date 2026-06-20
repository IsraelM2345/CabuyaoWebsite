import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    AlertCircle,
    Filter,
    Building2,
    Globe,
    X,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Eye,
} from "lucide-react";

// Sample departments data
const initialDepartments = [
    {
        id: 1,
        name: "Business Permit and Licensing Office",
        shortName: "BPLO",
        description:
            "Handles business permit applications, renewals, and licensing for all business establishments in Cabuyao.",
        head: "Maria Santos",
        contact: "bplo@cabuyao.gov.ph",
        location: "City Hall Ground Floor",
        status: "active",
        services: 12,
    },
    {
        id: 2,
        name: "City Health Office",
        shortName: "CHO",
        description:
            "Provides health services including checkups, vaccinations, maternal care, and health programs.",
        head: "Dr. Juan Dela Cruz",
        contact: "health@cabuyao.gov.ph",
        location: "City Hall 2nd Floor",
        status: "active",
        services: 8,
    },
    {
        id: 3,
        name: "City Social Welfare and Development Office",
        shortName: "CSWDO",
        description:
            "Provides social services including assistance to senior citizens, PWDs, and indigent families.",
        head: "Linda Mercado",
        contact: "cswdo@cabuyao.gov.ph",
        location: "City Hall Ground Floor",
        status: "active",
        services: 15,
    },
    {
        id: 4,
        name: "City Engineering Office",
        shortName: "CEO",
        description:
            "Handles building permits, engineering services, and infrastructure projects.",
        head: "Engr. Carlos Villanueva",
        contact: "engineering@cabuyao.gov.ph",
        location: "City Hall 3rd Floor",
        status: "active",
        services: 6,
    },
    {
        id: 5,
        name: "City Planning and Development Office",
        shortName: "CPDO",
        description:
            "Handles city development planning, zoning, and land use matters.",
        head: "Arch. Elena Torres",
        contact: "cpdo@cabuyao.gov.ph",
        location: "City Hall 3rd Floor",
        status: "active",
        services: 4,
    },
];

export default function DepartmentsManager() {
    const [departments, setDepartments] = useState(initialDepartments);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        shortName: "",
        description: "",
        head: "",
        contact: "",
        location: "",
        status: "active",
    });

    const filteredDepartments = departments.filter((dept) => {
        const matchesSearch =
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "All" || dept.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (dept) => {
        setEditingId(dept.id);
        setFormData({
            name: dept.name,
            shortName: dept.shortName,
            description: dept.description,
            head: dept.head,
            contact: dept.contact,
            location: dept.location,
            status: dept.status,
        });
        setShowAddModal(true);
    };

    const handleAdd = () => {
        if (formData.name && formData.shortName) {
            if (editingId) {
                setDepartments(
                    departments.map((d) =>
                        d.id === editingId ? { ...d, ...formData } : d,
                    ),
                );
            } else {
                setDepartments([
                    ...departments,
                    { ...formData, id: departments.length + 1, services: 0 },
                ]);
            }
            handleCloseModal();
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setDepartments(departments.filter((d) => d.id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingId(null);
        setFormData({
            name: "",
            shortName: "",
            description: "",
            head: "",
            contact: "",
            location: "",
            status: "active",
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                    </span>
                );
            case "inactive":
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        Inactive
                    </span>
                );
        }
    };

    const stats = {
        total: departments.length,
        active: departments.filter((d) => d.status === "active").length,
        inactive: departments.filter((d) => d.status === "inactive").length,
        totalServices: departments.reduce((sum, d) => sum + d.services, 0),
    };

    return (
        <StaffLayout
            currentPage="Services"
            title="Departments"
            subtitle="Manage city departments and offices."
        >
            {showSuccessToast && (
                <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-2">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">
                            Department saved successfully!
                        </span>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Total Departments
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.total}
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
                                Inactive
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.inactive}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-500">
                            <X size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Total Services
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.totalServices}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-500">
                            <Globe size={20} className="text-white" />
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
                            placeholder="Search departments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        >
                            <option value="All">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            <Plus size={16} />
                            Add Department
                        </button>
                    </div>
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDepartments.map((dept) => (
                    <div
                        key={dept.id}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                    <Building2
                                        className="text-blue-600 dark:text-blue-400"
                                        size={20}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {dept.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        {dept.shortName}
                                    </p>
                                </div>
                            </div>
                            {getStatusBadge(dept.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mb-4 line-clamp-2">
                            {dept.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-500 dark:text-slate-400 mb-4">
                            <div className="flex items-center gap-2">
                                <Building2 size={14} />
                                <span>{dept.head}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={14} />
                                <span>{dept.contact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 size={14} />
                                <span>{dept.location}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                                {dept.services} services
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                    title="Edit"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="h-1 w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #dc2626, #b91c1c)",
                            }}
                        />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {editingId
                                        ? "Edit Department"
                                        : "Add New Department"}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Department Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Business Permit and Licensing Office"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Short Name / Acronym *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.shortName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                shortName: e.target.value,
                                            })
                                        }
                                        placeholder="BPLO"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        placeholder="Brief description of the department..."
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Department Head
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.head}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    head: e.target.value,
                                                })
                                            }
                                            placeholder="Juan Dela Cruz"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.contact}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    contact: e.target.value,
                                                })
                                            }
                                            placeholder="dept@cabuyao.gov.ph"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                location: e.target.value,
                                            })
                                        }
                                        placeholder="City Hall Ground Floor"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition"
                                >
                                    <CheckCircle2 size={16} />
                                    {editingId
                                        ? "Save Changes"
                                        : "Add Department"}
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
                                    Remove Department?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This action cannot be undone. The department
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
