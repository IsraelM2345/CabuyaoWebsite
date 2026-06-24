import React, { useState, useRef, useEffect } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit3,
    Trash2,
    Plus,
    Save,
    X,
    AlertCircle,
    CheckCircle2,
    Upload,
    Camera,
    ExternalLink,
} from "lucide-react";

const API_BASE_URL = "/api/staff";

export default function OfficialsExecutive() {
    const [executives, setExecutives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        position: "",
        email: "",
        phone: "",
        office: "",
        address: "",
        termStart: "",
        termEnd: "",
        election_date: "",
        assumption_date: "",
        birthdate: "",
        bio: "",
        education: "",
        expertise: "",
        quote: "",
        facebook_url: "",
        photo: null,
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const fileInputRef = useRef(null);

    // Helper to check which positions are already filled
    const hasMayor = executives.some((e) => e.position === "City Mayor");
    const hasViceMayor = executives.some((e) => e.position === "Vice Mayor");

    // Get available positions for the dropdown when adding new
    const getAvailablePositions = () => {
        const positions = [];
        if (!hasMayor) positions.push("City Mayor");
        if (!hasViceMayor) positions.push("Vice Mayor");
        return positions;
    };

    // Check if all positions are filled (no more can be added)
    // There can only be 2 executives: 1 Mayor and 1 Vice Mayor
    const allPositionsFilled = executives.length >= 2;

    // Fetch executives from API and check for edit/add mode
    useEffect(() => {
        fetchExecutives();

        // Check if we need to auto-edit an official (from OfficialsManager navigation)
        const editId = sessionStorage.getItem("editOfficialId");
        const editType = sessionStorage.getItem("editOfficialType");

        if (editId && editType === "executive") {
            // Wait for data to load, then trigger edit
            setTimeout(() => {
                const official = executives.find((e) => e.id == editId);
                if (official) {
                    handleEdit(official);
                }
                // Clear the session storage
                sessionStorage.removeItem("editOfficialId");
                sessionStorage.removeItem("editOfficialType");
            }, 500);
        }

        // Check if we need to auto-add a new executive (from OfficialsManager navigation)
        const addMode = sessionStorage.getItem("addOfficialMode");
        if (addMode === "executive") {
            setTimeout(() => {
                setIsAddingNew(true);
                sessionStorage.removeItem("addOfficialMode");
            }, 500);
        }
    }, []);

    const fetchExecutives = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/executives`, {
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
                throw new Error(`Failed to load executives (${res.status})`);
            }

            const json = await res.json();
            if (json.success) {
                setExecutives(json.data);
            }
        } catch (e) {
            console.error("Failed to load executives:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        const availablePositions = getAvailablePositions();
        if (availablePositions.length === 0) {
            alert(
                "All executive positions are already filled. Please edit existing officials or delete one before adding a new one.",
            );
            return;
        }

        setEditingId("new");
        setIsAddingNew(true);
        setFormData({
            name: "",
            position: availablePositions[0], // Default to first available position
            email: "",
            phone: "",
            office: "",
            address: "",
            termStart: "",
            termEnd: "",
            election_date: "",
            assumption_date: "",
            birthdate: "",
            bio: "",
            education: "",
            expertise: "",
            quote: "",
            photo: null,
        });
        setPhotoPreview(null);
    };

    const handleEdit = (official) => {
        setEditingId(official.id);
        setIsAddingNew(false);
        setFormData({
            name: official.name,
            position: official.position,
            email: official.email || "",
            phone: official.phone || "",
            office: official.office || "",
            address: official.address || "",
            termStart: official.termStart || "",
            termEnd: official.termEnd || "",
            election_date: official.election_date || "",
            assumption_date: official.assumption_date || "",
            birthdate: official.birthdate || "",
            bio: official.bio || "",
            education: official.education || "",
            expertise: official.expertise || "",
            quote: official.quote || "",
            facebook_url: official.facebook_url || "",
            photo: official.photo || null,
        });
        setPhotoPreview(official.photo);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAddingNew(false);
        setFormData({
            name: "",
            position: "",
            email: "",
            phone: "",
            office: "",
            address: "",
            termStart: "",
            termEnd: "",
            election_date: "",
            assumption_date: "",
            birthdate: "",
            bio: "",
            education: "",
            expertise: "",
            quote: "",
            photo: null,
        });
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

        const isEditing = editingId && editingId !== "new" && !isAddingNew;
        const url = isEditing
            ? `${API_BASE_URL}/executives/${editingId}`
            : `${API_BASE_URL}/executives`;
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
                    position: formData.position,
                    email: formData.email,
                    phone: formData.phone,
                    office: formData.office,
                    address: formData.address,
                    termStart: formData.termStart,
                    termEnd: formData.termEnd,
                    election_date: formData.election_date,
                    assumption_date: formData.assumption_date,
                    birthdate: formData.birthdate,
                    bio: formData.bio,
                    education: formData.education,
                    expertise: formData.expertise,
                    quote: formData.quote,
                    facebook_url: formData.facebook_url,
                    photo: formData.photo,
                }),
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || json.errors || "Save failed");
            }

            fetchExecutives();
            handleCancel();
            setSuccessMessage(
                editingId
                    ? "Official updated successfully!"
                    : "Official added successfully!",
            );
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } catch (e) {
            alert(e?.message || "Unable to save official");
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/executives/${deleteId}`, {
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

            fetchExecutives();
            setShowDeleteModal(false);
            setDeleteId(null);
            setSuccessMessage("Official deleted successfully!");
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
        } catch (e) {
            alert(e?.message || "Unable to delete");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <StaffLayout
                currentPage="Officials"
                title="Mayor & Vice Mayor"
                subtitle="Manage the city's executive officials information."
            >
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 dark:text-slate-400">
                        Loading executives...
                    </div>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout
            currentPage="Officials"
            title="Mayor & Vice Mayor"
            subtitle="Manage the city's executive officials information."
        >
            {showSuccessToast && (
                <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-2">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">{successMessage}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Officials List */}
                <div className="lg:col-span-2 space-y-4">
                    {isAddingNew && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    Add New Executive Official
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Full Name *
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
                                            placeholder="Hon. Juan Dela Cruz"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Position *
                                        </label>
                                        <select
                                            value={formData.position}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    position: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        >
                                            {getAvailablePositions().map(
                                                (pos) => (
                                                    <option
                                                        key={pos}
                                                        value={pos}
                                                    >
                                                        {pos}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                })
                                            }
                                            placeholder="email@cabuyao.gov.ph"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            placeholder="+63 XXX XXX XXXX"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Office
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.office}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    office: e.target.value,
                                                })
                                            }
                                            placeholder="Office of the City Mayor"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: e.target.value,
                                                })
                                            }
                                            placeholder="City Hall, Cabuyao City"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Term Start
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.termStart}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    termStart: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Term End
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.termEnd}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    termEnd: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Date Elected
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. May 12, 2025"
                                            value={formData.election_date}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    election_date:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Date of Assumption
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. July 1, 2025"
                                            value={formData.assumption_date}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    assumption_date:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.birthdate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    birthdate: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Biography
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                bio: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        placeholder="Brief biography of the official..."
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Education Background
                                    </label>
                                    <textarea
                                        value={formData.education}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                education: e.target.value,
                                            })
                                        }
                                        rows={2}
                                        placeholder="e.g. BS Business Management, Masters in Public Administration"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Expertise / Commitments
                                    </label>
                                    <textarea
                                        value={formData.expertise}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                expertise: e.target.value,
                                            })
                                        }
                                        rows={4}
                                        placeholder="List of expertise areas and commitments (one per line)"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Personal Quote / Motto
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.quote}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                quote: e.target.value,
                                            })
                                        }
                                        placeholder='e.g. "Leading with precision, patience, and purpose"'
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                        Facebook Page URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.facebook_url}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                facebook_url: e.target.value,
                                            })
                                        }
                                        placeholder="https://www.facebook.com/OfficialPage"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    />
                                </div>
                                <div>
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
                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                                    >
                                        <Save size={16} />
                                        Add Official
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {executives.map((official) => (
                        <div
                            key={official.id}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6"
                        >
                            {editingId === official.id ? (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                        Edit Official
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
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
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                                Position
                                            </label>
                                            <select
                                                value={formData.position}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        position:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            >
                                                {(() => {
                                                    const currentOfficial =
                                                        executives.find(
                                                            (e) =>
                                                                e.id ===
                                                                editingId,
                                                        );
                                                    const positions = [];

                                                    // Always include current position
                                                    if (currentOfficial) {
                                                        positions.push(
                                                            currentOfficial.position,
                                                        );
                                                    }

                                                    // Add other available positions (not occupied by others)
                                                    // Only add City Mayor if not occupied by someone else AND not already in list
                                                    if (
                                                        !executives.some(
                                                            (e) =>
                                                                e.position ===
                                                                    "City Mayor" &&
                                                                e.id !==
                                                                    editingId,
                                                        ) &&
                                                        !positions.includes(
                                                            "City Mayor",
                                                        )
                                                    ) {
                                                        positions.push(
                                                            "City Mayor",
                                                        );
                                                    }

                                                    // Only add Vice Mayor if not occupied by someone else AND not already in list
                                                    if (
                                                        !executives.some(
                                                            (e) =>
                                                                e.position ===
                                                                    "Vice Mayor" &&
                                                                e.id !==
                                                                    editingId,
                                                        ) &&
                                                        !positions.includes(
                                                            "Vice Mayor",
                                                        )
                                                    ) {
                                                        positions.push(
                                                            "Vice Mayor",
                                                        );
                                                    }

                                                    return positions.map(
                                                        (pos) => (
                                                            <option
                                                                key={pos}
                                                                value={pos}
                                                            >
                                                                {pos}
                                                            </option>
                                                        ),
                                                    );
                                                })()}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: e.target.value,
                                                    })
                                                }
                                                placeholder="City Hall, Cabuyao City"
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                                Term Start
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.termStart}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        termStart:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                                Term End
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.termEnd}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        termEnd: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                                Date Elected
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. May 12, 2025"
                                                value={formData.election_date}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        election_date:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                                Date of Assumption
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. July 1, 2025"
                                                value={formData.assumption_date}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        assumption_date:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.birthdate}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        birthdate:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Biography
                                        </label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    bio: e.target.value,
                                                })
                                            }
                                            rows={3}
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Education Background
                                        </label>
                                        <textarea
                                            value={formData.education}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    education: e.target.value,
                                                })
                                            }
                                            rows={2}
                                            placeholder="e.g. BS Business Management, Masters in Public Administration"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Expertise / Commitments
                                        </label>
                                        <textarea
                                            value={formData.expertise}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    expertise: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            placeholder="List of expertise areas and commitments (one per line)"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Personal Quote / Motto
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.quote}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    quote: e.target.value,
                                                })
                                            }
                                            placeholder='e.g. "Leading with precision, patience, and purpose"'
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                                            Facebook Page URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.facebook_url}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    facebook_url:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="https://www.facebook.com/OfficialPage"
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                        />
                                    </div>
                                    <div>
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

                                    <div className="flex items-center justify-end gap-3 pt-4">
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                                        >
                                            <Save size={16} />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-4">
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
                                        {official.photo ? (
                                            <img
                                                src={official.photo}
                                                alt={official.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center">
                                                {official.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                    {official.name}
                                                </h3>
                                                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                    {official.position}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(official)
                                                    }
                                                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            official.id,
                                                        )
                                                    }
                                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                                <Mail size={14} />
                                                <span>{official.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                                <Phone size={14} />
                                                <span>{official.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                                <MapPin size={14} />
                                                <span>{official.office}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                                <Calendar size={14} />
                                                <span>
                                                    {formatDate(
                                                        official.termStart,
                                                    )}{" "}
                                                    -{" "}
                                                    {formatDate(
                                                        official.termEnd,
                                                    )}
                                                </span>
                                            </div>
                                            {official.election_date && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                                    <Calendar size={14} />
                                                    <span>
                                                        Elected:{" "}
                                                        {official.election_date}
                                                    </span>
                                                </div>
                                            )}
                                            {official.assumption_date && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                                    <Calendar size={14} />
                                                    <span>
                                                        Assumed:{" "}
                                                        {
                                                            official.assumption_date
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {official.bio && (
                                            <p className="text-sm text-gray-600 dark:text-slate-300 mt-4">
                                                {official.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Executive Office
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">
                            The City Mayor and Vice Mayor lead the executive
                            branch of the Cabuyao City Government.
                        </p>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-slate-400">
                                    Total Officials
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {executives.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-slate-400">
                                    Active Terms
                                </span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    {
                                        executives.filter(
                                            (e) =>
                                                e.termEnd &&
                                                new Date(e.termEnd) >
                                                    new Date(),
                                        ).length
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={handleAddNew}
                                disabled={allPositionsFilled}
                                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                    allPositionsFilled
                                        ? "bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-slate-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                            >
                                <Plus size={16} />
                                Add New Official
                            </button>
                            {allPositionsFilled && (
                                <p className="text-xs text-gray-500 dark:text-slate-400 text-center">
                                    Both Mayor and Vice Mayor positions are
                                    filled
                                </p>
                            )}
                            <button
                                onClick={() => window.open("/mayor", "_blank")}
                                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                            >
                                <ExternalLink size={16} />
                                View Public Page
                            </button>
                        </div>
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
