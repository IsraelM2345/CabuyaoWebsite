import React, { useState } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    AlertCircle,
    Filter,
    ChevronLeft,
    ChevronRight,
    Building2,
    Globe,
    X,
    Briefcase,
    FileText,
    CreditCard,
    Shield,
    Heart,
    GraduationCap,
    Users,
    Home,
    Wrench,
} from "lucide-react";

// Sample services/departments data
const initialServices = [
    {
        id: 1,
        name: "Business Permit and Licensing Office",
        shortName: "BPLO",
        type: "department",
        description:
            "Handles business permit applications, renewals, and licensing for all business establishments in Cabuyao.",
        icon: "Briefcase",
        status: "active",
        services: 12,
    },
    {
        id: 2,
        name: "City Health Office",
        shortName: "CHO",
        type: "department",
        description:
            "Provides health services including checkups, vaccinations, maternal care, and health programs.",
        icon: "Heart",
        status: "active",
        services: 8,
    },
    {
        id: 3,
        name: "City Social Welfare and Development Office",
        shortName: "CSWDO",
        type: "department",
        description:
            "Provides social services including assistance to senior citizens, PWDs, and indigent families.",
        icon: "Users",
        status: "active",
        services: 15,
    },
    {
        id: 4,
        name: "Online Business Permit Application",
        shortName: "e-BPLO",
        type: "e-service",
        description:
            "Apply for or renew your business permit online without visiting the office.",
        icon: "Globe",
        status: "active",
        services: 3,
    },
    {
        id: 5,
        name: " Barangay Clearance Online",
        shortName: "e-Barangay",
        type: "e-service",
        description: "Request and download barangay clearances online.",
        icon: "FileText",
        status: "active",
        services: 2,
    },
    {
        id: 6,
        name: "City Engineering Office",
        shortName: "CEO",
        type: "department",
        description:
            "Handles building permits, engineering services, and infrastructure projects.",
        icon: "Wrench",
        status: "active",
        services: 6,
    },
    {
        id: 7,
        name: "City Planning and Development Office",
        shortName: "CPDO",
        type: "department",
        description:
            "Handles city development planning, zoning, and land use matters.",
        icon: "Home",
        status: "active",
        services: 4,
    },
    {
        id: 8,
        name: "Scholarship Application Portal",
        shortName: "e-Scholarship",
        type: "e-service",
        description:
            "Apply for city government scholarships and educational assistance programs.",
        icon: "GraduationCap",
        status: "draft",
        services: 1,
    },
];

const iconMap = {
    Briefcase,
    Heart,
    Users,
    Globe,
    FileText,
    Wrench,
    Home,
    GraduationCap,
    Building2,
    CreditCard,
    Shield,
};

const types = ["All Types", "department", "e-service"];
const statuses = ["All Status", "active", "draft", "inactive"];

export default function ServicesManager() {
    const [services, setServices] = useState(initialServices);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [newService, setNewService] = useState({
        name: "",
        shortName: "",
        type: "department",
        description: "",
        icon: "Building2",
        status: "active",
    });

    // Filter services
    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.shortName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            service.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesType =
            typeFilter === "All Types" || service.type === typeFilter;
        const matchesStatus =
            statusFilter === "All Status" || service.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    // Stats
    const stats = {
        total: services.length,
        departments: services.filter((s) => s.type === "department").length,
        eServices: services.filter((s) => s.type === "e-service").length,
        totalServices: services.reduce((sum, s) => sum + s.services, 0),
    };

    const handleAdd = () => {
        if (newService.name && newService.shortName) {
            setServices([
                ...services,
                {
                    ...newService,
                    id: services.length + 1,
                    services: 0,
                },
            ]);
            setShowAddModal(false);
            setNewService({
                name: "",
                shortName: "",
                type: "department",
                description: "",
                icon: "Building2",
                status: "active",
            });
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setServices(services.filter((s) => s.id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const getTypeBadge = (type) => {
        switch (type) {
            case "department":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <Building2 size={12} />
                        Department
                    </span>
                );
            case "e-service":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <Globe size={12} />
                        E-Service
                    </span>
                );
        }
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

    const getIconComponent = (iconName) => {
        const IconComponent = iconMap[iconName] || Building2;
        return <IconComponent size={20} />;
    };

    return (
        <StaffLayout
            currentPage="Services"
            title="Services & Departments"
            subtitle="Manage city departments, offices, and e-services available to citizens."
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Total Services
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
                                Departments
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.departments}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500">
                            <Building2 size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                E-Services
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.eServices}
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
                                Total Offerings
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.totalServices}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-500">
                            <FileText size={20} className="text-white" />
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
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-400" />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            >
                                {types.map((type) => (
                                    <option key={type} value={type}>
                                        {type === "All Types"
                                            ? "All Types"
                                            : type === "department"
                                              ? "Departments"
                                              : "E-Services"}
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

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            <Plus size={16} />
                            Add Service
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredServices.map((service) => {
                    const IconComponent = iconMap[service.icon] || Building2;
                    return (
                        <div
                            key={service.id}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-3 rounded-xl ${service.type === "e-service" ? "bg-green-100 dark:bg-green-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}
                                    >
                                        <IconComponent
                                            className={
                                                service.type === "e-service"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-blue-600 dark:text-blue-400"
                                            }
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
                                {getTypeBadge(service.type)}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-slate-300 mb-4 line-clamp-2">
                                {service.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-slate-400">
                                        {service.services} services
                                    </span>
                                    {getStatusBadge(service.status)}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
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
                    );
                })}
            </div>

            {/* Add Service Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={() => setShowAddModal(false)}
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
                                    Add New Service
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
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
                                        value={newService.name}
                                        onChange={(e) =>
                                            setNewService({
                                                ...newService,
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
                                        value={newService.shortName}
                                        onChange={(e) =>
                                            setNewService({
                                                ...newService,
                                                shortName: e.target.value,
                                            })
                                        }
                                        placeholder="BPLO"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Type *
                                        </label>
                                        <select
                                            value={newService.type}
                                            onChange={(e) =>
                                                setNewService({
                                                    ...newService,
                                                    type: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        >
                                            <option value="department">
                                                Department
                                            </option>
                                            <option value="e-service">
                                                E-Service
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Status
                                        </label>
                                        <select
                                            value={newService.status}
                                            onChange={(e) =>
                                                setNewService({
                                                    ...newService,
                                                    status: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        >
                                            <option value="active">
                                                Active
                                            </option>
                                            <option value="draft">Draft</option>
                                            <option value="inactive">
                                                Inactive
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        value={newService.description}
                                        onChange={(e) =>
                                            setNewService({
                                                ...newService,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        placeholder="Brief description of the service..."
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Icon
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.keys(iconMap).map(
                                            (iconName) => {
                                                const IconComponent =
                                                    iconMap[iconName];
                                                return (
                                                    <button
                                                        key={iconName}
                                                        onClick={() =>
                                                            setNewService({
                                                                ...newService,
                                                                icon: iconName,
                                                            })
                                                        }
                                                        className={`p-3 rounded-lg border-2 transition ${
                                                            newService.icon ===
                                                            iconName
                                                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                                                : "border-gray-200 dark:border-slate-600 hover:border-gray-300"
                                                        }`}
                                                    >
                                                        <IconComponent
                                                            size={20}
                                                            className={
                                                                newService.icon ===
                                                                iconName
                                                                    ? "text-red-600"
                                                                    : "text-gray-500 dark:text-slate-400"
                                                            }
                                                        />
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition"
                                >
                                    <Plus size={16} />
                                    Add Service
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
                                    Remove Service?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This action cannot be undone. The service
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
