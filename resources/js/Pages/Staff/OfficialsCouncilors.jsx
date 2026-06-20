import React, { useState, useRef, useEffect } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    Edit3,
    Trash2,
    Plus,
    Save,
    AlertCircle,
    CheckCircle2,
    Grid,
    List,
    Upload,
    Camera,
    X,
    Users,
} from "lucide-react";

const API_BASE_URL = "/api/staff";

// Helper function to format dates in a readable format (e.g., "July 1, 2025")
const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid

        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
    } catch (e) {
        return dateString;
    }
};

export default function OfficialsCouncilors() {
    const [councilors, setCouncilors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    const defaultForm = {
        name: "",
        education: "",
        birthday: "",
        election_date: "",
        assumption_date: "",
        chairmanships: [],
        memberships: [],
        photo: null,
    };

    const [formData, setFormData] = useState(defaultForm);
    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch councilors from API and check for edit mode
    useEffect(() => {
        fetchCouncilors();

        // Check if we need to auto-edit an official (from OfficialsManager navigation)
        const editId = sessionStorage.getItem("editOfficialId");
        const editType = sessionStorage.getItem("editOfficialType");

        if (editId && editType === "councilor") {
            // Wait for data to load, then trigger edit
            setTimeout(() => {
                const councilor = councilors.find((c) => c.id == editId);
                if (councilor) {
                    handleEdit(councilor);
                }
                // Clear the session storage
                sessionStorage.removeItem("editOfficialId");
                sessionStorage.removeItem("editOfficialType");
            }, 500);
        }
    }, []);

    const fetchCouncilors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/councilors`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
            });

            if (!res.ok) {
                if (res.status === 401) {
                    console.error("Unauthorized - please log in");
                    return;
                }
                throw new Error(`Failed to load councilors (${res.status})`);
            }

            const json = await res.json();
            if (json.success) {
                setCouncilors(json.data);
            }
        } catch (e) {
            console.error("Failed to load councilors:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (councilor) => {
        setEditingId(councilor.id);
        setFormData({
            name: councilor.name,
            education: councilor.education || "",
            birthday: councilor.birthday || "",
            election_date: councilor.election_date || "",
            assumption_date: councilor.assumption_date || "",
            chairmanships: councilor.chairmanships || [],
            memberships: councilor.memberships || [],
            photo: councilor.photo || null,
        });
        setPhotoPreview(councilor.photo);
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData(defaultForm);
        setPhotoPreview(null);
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setFormData({ ...formData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhotoPreview(null);
        setFormData({ ...formData, photo: null });
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert("Name is required");
            return;
        }

        // Determine if we're editing (has numeric id) or creating new
        const isEditing = editingId && editingId !== "new";
        const url = isEditing
            ? `${API_BASE_URL}/councilors/${editingId}`
            : `${API_BASE_URL}/councilors`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    name: formData.name,
                    education: formData.education,
                    birthday: formData.birthday,
                    election_date: formData.election_date,
                    assumption_date: formData.assumption_date,
                    chairmanships: Array.isArray(formData.chairmanships)
                        ? formData.chairmanships
                        : formData.chairmanships
                              .split("\n")
                              .map((c) => c.trim())
                              .filter(Boolean),
                    memberships: Array.isArray(formData.memberships)
                        ? formData.memberships
                        : formData.memberships
                              .split("\n")
                              .map((m) => m.trim())
                              .filter(Boolean),
                    photo: formData.photo,
                }),
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || json.errors || "Save failed");
            }

            fetchCouncilors();
            handleCancel();
            setSuccessMessage(
                editingId
                    ? "Councilor updated successfully!"
                    : "Councilor added successfully!",
            );
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } catch (e) {
            alert(e?.message || "Unable to save councilor");
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/councilors/${deleteId}`, {
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

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || "Delete failed");
            }

            fetchCouncilors();
            setShowDeleteModal(false);
            setDeleteId(null);
            setSuccessMessage("Councilor deleted successfully!");
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } catch (e) {
            alert(e?.message || "Unable to delete");
        }
    };

    if (loading) {
        return (
            <StaffLayout
                currentPage="Officials"
                title="City Councilors"
                subtitle="Manage the city council members and their committee assignments."
            >
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 dark:text-slate-400">
                        Loading councilors...
                    </div>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout
            currentPage="Officials"
            title="City Councilors"
            subtitle="Manage the city council members and their committee assignments."
        >
            {showSuccessToast && (
                <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-2">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">{successMessage}</span>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-red-50 dark:bg-red-900/20 text-red-600" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-red-50 dark:bg-red-900/20 text-red-600" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"}`}
                    >
                        <List size={18} />
                    </button>
                </div>
                <button
                    onClick={() => {
                        handleCancel();
                        setEditingId("new");
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
                >
                    <Plus size={16} />
                    Add Councilor
                </button>
            </div>

            {/* Add/Edit Form inserted at the top if adding a new councilor */}
            {editingId === "new" && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 mb-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                        Add New Councilor
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Full Name
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
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Birthday
                            </label>
                            <input
                                type="date"
                                value={formData.birthday}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        birthday: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Date Elected
                            </label>
                            <input
                                type="date"
                                value={formData.election_date}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        election_date: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Date of Assumption
                            </label>
                            <input
                                type="date"
                                value={formData.assumption_date}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        assumption_date: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Educational Background
                            </label>
                            <input
                                type="text"
                                value={formData.education}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        education: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Committee Chairmanships (One per line)
                            </label>
                            <textarea
                                value={
                                    Array.isArray(formData.chairmanships)
                                        ? formData.chairmanships.join("\n")
                                        : formData.chairmanships
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        chairmanships: e.target.value,
                                    })
                                }
                                rows={3}
                                placeholder="Enter each chairmanship on a new line"
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Committee Memberships (One per line)
                            </label>
                            <textarea
                                value={
                                    Array.isArray(formData.memberships)
                                        ? formData.memberships.join("\n")
                                        : formData.memberships
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        memberships: e.target.value,
                                    })
                                }
                                rows={4}
                                placeholder="Enter each membership on a new line"
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                Profile Photo
                            </label>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center cursor-pointer overflow-hidden"
                                    onClick={handlePhotoClick}
                                >
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Camera
                                            size={28}
                                            className="text-gray-400"
                                        />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        onClick={handlePhotoClick}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                                    >
                                        <Upload size={16} />
                                        Upload Photo
                                    </button>
                                    {photoPreview && (
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                        >
                                            <X size={16} />
                                            Remove Photo
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-gray-400 dark:text-slate-500">
                                        JPG, PNG or WebP. Max 5MB.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            Save Profile
                        </button>
                    </div>
                </div>
            )}

            <div
                className={
                    viewMode === "grid"
                        ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
                        : "space-y-4"
                }
            >
                {councilors.map((councilor) => (
                    <div
                        key={councilor.id}
                        className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-5 ${viewMode === "list" ? "flex items-start gap-6" : "flex flex-col"}`}
                    >
                        {editingId === councilor.id ? (
                            <div className="space-y-4 w-full">
                                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-100 pb-2">
                                    Edit Councilor Profile
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border"
                                            onClick={handlePhotoClick}
                                        >
                                            {photoPreview ? (
                                                <img
                                                    src={photoPreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Camera
                                                    size={24}
                                                    className="text-gray-400"
                                                />
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handlePhotoClick}
                                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 flex items-center gap-1"
                                            >
                                                <Upload size={14} /> Upload
                                            </button>
                                            {photoPreview && (
                                                <button
                                                    type="button"
                                                    onClick={removePhoto}
                                                    className="px-3 py-1.5 rounded-lg text-red-600 text-xs font-medium hover:bg-red-50 flex items-center gap-1"
                                                >
                                                    <X size={14} /> Remove
                                                </button>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Name
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
                                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Birthday
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birthday}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    birthday: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Date Elected
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.election_date}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    election_date:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Date of Assumption
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.assumption_date}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    assumption_date:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-red-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Education
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.education}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    education: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-red-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Chairmanships (One per line)
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={
                                                Array.isArray(
                                                    formData.chairmanships,
                                                )
                                                    ? formData.chairmanships.join(
                                                          "\n",
                                                      )
                                                    : formData.chairmanships
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    chairmanships:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-red-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Memberships (One per line)
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={
                                                Array.isArray(
                                                    formData.memberships,
                                                )
                                                    ? formData.memberships.join(
                                                          "\n",
                                                      )
                                                    : formData.memberships
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    memberships: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-red-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3">
                                    <button
                                        onClick={handleCancel}
                                        className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                    >
                                        <Save size={14} /> Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div
                                    className={`flex-shrink-0 ${viewMode === "grid" ? "mb-4 flex gap-4 items-center" : ""}`}
                                >
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden border border-gray-100">
                                        {councilor.photo ? (
                                            <img
                                                src={councilor.photo}
                                                alt={councilor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                                <Users
                                                    size={24}
                                                    className="text-white opacity-80"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {viewMode === "grid" && (
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                                {councilor.name}
                                            </h3>
                                            <p className="text-xs text-red-600 font-medium">
                                                Born:{" "}
                                                {formatDate(councilor.birthday)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {viewMode === "list" && (
                                        <div className="mb-2">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                {councilor.name}
                                            </h3>
                                            <p className="text-xs text-red-600 font-medium">
                                                Born:{" "}
                                                {formatDate(councilor.birthday)}
                                            </p>
                                        </div>
                                    )}
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                                        {councilor.election_date && (
                                            <p>
                                                <span className="font-semibold text-gray-800">
                                                    Elected:
                                                </span>{" "}
                                                {formatDate(
                                                    councilor.election_date,
                                                )}
                                            </p>
                                        )}
                                        {councilor.assumption_date && (
                                            <p>
                                                <span className="font-semibold text-gray-800">
                                                    Assumed Office:
                                                </span>{" "}
                                                {formatDate(
                                                    councilor.assumption_date,
                                                )}
                                            </p>
                                        )}
                                        <p>
                                            <span className="font-semibold text-gray-800">
                                                Education:
                                            </span>{" "}
                                            {councilor.education}
                                        </p>
                                        {Array.isArray(
                                            councilor.chairmanships,
                                        ) &&
                                        councilor.chairmanships.length > 0 ? (
                                            <div>
                                                <span className="font-semibold text-gray-800 block mb-1">
                                                    Chairmanships:
                                                </span>
                                                <ul className="list-disc list-inside text-gray-600 dark:text-slate-300 space-y-0.5">
                                                    {councilor.chairmanships.map(
                                                        (c, idx) => (
                                                            <li key={idx}>
                                                                {c}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        ) : (
                                            <p>
                                                <span className="font-semibold text-gray-800">
                                                    Chairmanships:
                                                </span>{" "}
                                                None
                                            </p>
                                        )}
                                        {Array.isArray(councilor.memberships) &&
                                        councilor.memberships.length > 0 ? (
                                            <div>
                                                <span className="font-semibold text-gray-800 block mb-1">
                                                    Memberships:
                                                </span>
                                                <ul className="list-disc list-inside text-gray-600 dark:text-slate-300 space-y-0.5">
                                                    {councilor.memberships.map(
                                                        (m, idx) => (
                                                            <li key={idx}>
                                                                {m}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        ) : (
                                            <p>
                                                <span className="font-semibold text-gray-800">
                                                    Memberships:
                                                </span>{" "}
                                                None
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={`flex items-center gap-2 ${viewMode === "grid" ? "mt-4 pt-4 border-t border-gray-100" : "flex-col justify-center border-l border-gray-100 pl-4 ml-4"}`}
                                >
                                    <button
                                        onClick={() => handleEdit(councilor)}
                                        className={`flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition ${viewMode === "grid" ? "flex-1 px-3 py-2 text-sm font-medium" : "p-2"}`}
                                        title="Edit Profile"
                                    >
                                        <Edit3 size={16} />{" "}
                                        {viewMode === "grid" && "Edit"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(councilor.id)
                                        }
                                        className={`rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition ${viewMode === "grid" ? "p-2" : "p-2"}`}
                                        title="Remove Profile"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
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
                        className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-800" />
                        <div className="px-6 pt-8 pb-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-50 border-2 border-red-200">
                                    <AlertCircle
                                        size={32}
                                        className="text-red-500"
                                    />
                                </div>
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-2">
                                    Remove Councilor?
                                </h2>
                                <p className="text-sm text-gray-500">
                                    This action cannot be undone. The profile
                                    will be permanently removed.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
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
