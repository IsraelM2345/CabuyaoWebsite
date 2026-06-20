import React, { useState } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    AlertCircle,
    Filter,
    Globe,
    X,
    CheckCircle2,
    Link,
    FileText,
    ExternalLink,
} from "lucide-react";

// Sample e-services data
const initialEServices = [
    {
        id: 1,
        name: "Online Business Permit Application",
        shortName: "e-BPLO",
        description:
            "Apply for or renew your business permit online without visiting the office.",
        url: "https://cabuyao.gov.ph/e-services/bplo",
        department: "BPLO",
        status: "active",
        requirements: ["Valid ID", "Previous Permit", "Barangay Clearance"],
    },
    {
        id: 2,
        name: "Barangay Clearance Online",
        shortName: "e-Barangay",
        description: "Request and download barangay clearances online.",
        url: "https://cabuyao.gov.ph/e-services/barangay",
        department: "DILG",
        status: "active",
        requirements: ["Valid ID", "Proof of Residence"],
    },
    {
        id: 3,
        name: "Scholarship Application Portal",
        shortName: "e-Scholarship",
        description:
            "Apply for city government scholarships and educational assistance programs.",
        url: "https://cabuyao.gov.ph/e-services/scholarship",
        department: "Education Office",
        status: "draft",
        requirements: ["Report Card", "Certificate of Indigency", "Valid ID"],
    },
    {
        id: 4,
        name: "Medical Certificate Request",
        shortName: "e-Medical",
        description:
            "Request medical certificates for employment or travel purposes.",
        url: "https://cabuyao.gov.ph/e-services/medical",
        department: "City Health Office",
        status: "active",
        requirements: ["Valid ID", "Previous Medical Records"],
    },
];

export default function EServicesManager() {
    const [eServices, setEServices] = useState(initialEServices);
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
        url: "",
        department: "",
        status: "active",
        requirements: [],
    });
    const [newRequirement, setNewRequirement] = useState("");

    const filteredEServices = eServices.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.shortName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            service.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "All" || service.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEdit = (service) => {
        setEditingId(service.id);
        setFormData({
            name: service.name,
            shortName: service.shortName,
            description: service.description,
            url: service.url,
            department: service.department,
            status: service.status,
            requirements: service.requirements || [],
        });
        setShowAddModal(true);
    };

    const handleAdd = () => {
        if (formData.name && formData.shortName) {
            if (editingId) {
                setEServices(
                    eServices.map((s) =>
                        s.id === editingId ? { ...s, ...formData } : s,
                    ),
                );
            } else {
                setEServices([
                    ...eServices,
                    { ...formData, id: eServices.length + 1 },
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
        setEServices(eServices.filter((s) => s.id !== deleteId));
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
            url: "",
            department: "",
            status: "active",
            requirements: [],
        });
        setNewRequirement("");
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setFormData({
                ...formData,
                requirements: [...formData.requirements, newRequirement.trim()],
            });
            setNewRequirement("");
        }
    };

    const removeRequirement = (index) => {
        setFormData({
            ...formData,
            requirements: formData.requirements.filter((_, i) => i !== index),
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
            case "draft":
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Draft
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
        total: eServices.length,
        active: eServices.filter((s) => s.status === "active").length,
        draft: eServices.filter((s) => s.status === "draft").length,
        inactive: eServices.filter((s) => s.status === "inactive").length,
    };

    return (
        <StaffLayout
            currentPage="Services"
            title="E-Services"
            subtitle="Manage online services available to citizens."
        >
            {showSuccessToast && (
                <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-2">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">
                            E-Service saved successfully!
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
                                Total E-Services
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-500">
                            <Globe size={20} className="text-white" />
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
                                Draft
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.draft}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500">
                            <FileText size={20} className="text-white" />
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
                            placeholder="Search e-services..."
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
                            <option value="draft">Draft</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            <Plus size={16} />
                            Add E-Service
                        </button>
                    </div>
                </div>
            </div>

            {/* E-Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEServices.map((service) => (
                    <div
                        key={service.id}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                                    <Globe
                                        className="text-green-600 dark:text-green-400"
                                        size={20}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {service.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        {service.shortName}
                                    </p>
                                </div>
                            </div>
                            {getStatusBadge(service.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mb-4 line-clamp-2">
                            {service.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-500 dark:text-slate-400 mb-4">
                            <div className="flex items-center gap-2">
                                <Building2 size={14} />
                                <span>{service.department}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link size={14} />
                                <a
                                    href={service.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                                >
                                    {service.url}
                                </a>
                            </div>
                        </div>
                        {service.requirements &&
                            service.requirements.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">
                                        Requirements:
                                    </p>
                                    <ul className="text-xs text-gray-600 dark:text-slate-300 space-y-1">
                                        {service.requirements.map(
                                            (req, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <CheckCircle2
                                                        size={12}
                                                        className="text-green-500"
                                                    />
                                                    {req}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                            <a
                                href={service.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <ExternalLink size={14} />
                                Visit
                            </a>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                    title="Edit"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
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
                                        ? "Edit E-Service"
                                        : "Add New E-Service"}
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
                                        Service Name *
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
                                        placeholder="Online Business Permit Application"
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
                                        placeholder="e-BPLO"
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
                                        placeholder="Brief description of the e-service..."
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Service URL *
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                url: e.target.value,
                                            })
                                        }
                                        placeholder="https://cabuyao.gov.ph/e-services/..."
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                department: e.target.value,
                                            })
                                        }
                                        placeholder="BPLO"
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
                                        <option value="draft">Draft</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Requirements
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newRequirement}
                                            onChange={(e) =>
                                                setNewRequirement(
                                                    e.target.value,
                                                )
                                            }
                                            onKeyPress={(e) =>
                                                e.key === "Enter" &&
                                                addRequirement()
                                            }
                                            placeholder="Add requirement"
                                            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={addRequirement}
                                            className="px-4 py-2.5 bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-500 transition"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.requirements.map(
                                            (req, idx) => (
                                                <span
                                                    key={idx}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium"
                                                >
                                                    {req}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeRequirement(
                                                                idx,
                                                            )
                                                        }
                                                        className="hover:text-blue-900 dark:hover:text-blue-200"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ),
                                        )}
                                    </div>
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
                                        : "Add E-Service"}
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
                                    Remove E-Service?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This action cannot be undone. The e-service
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

function Building2({ size, className }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M8 10h.01" />
            <path d="M16 10h.01" />
            <path d="M8 14h.01" />
            <path d="M16 14h.01" />
        </svg>
    );
}
