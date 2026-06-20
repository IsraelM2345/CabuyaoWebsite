import React, { useState, useRef, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    Upload,
    Search,
    Grid,
    List,
    Trash2,
    Copy,
    Image as ImageIcon,
    FolderOpen,
    X,
    AlertCircle,
    CheckCircle2,
    Edit3,
    Save,
} from "lucide-react";

const API_BASE_URL = "/api/staff";

// Helper function to format bytes to human readable sizes
const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function MediaManager() {
    const [media, setMedia] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [selectedItems, setSelectedItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editFormData, setEditFormData] = useState({
        label: "",
        description: "",
        category: "Community",
    });
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const categories = ["Festivals", "Government", "Tourism", "Community"];

    const filteredMedia = media.filter((item) => {
        const itemName = (item?.name ?? "").toString();
        return itemName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch(`${API_BASE_URL}/media`, {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                });

                if (!res.ok)
                    throw new Error(`Failed to load media (${res.status})`);
                const json = await res.json();

                // Translate Laravel's database columns to React's expected props
                const rawData = json.data || json || [];
                const formattedData = rawData.map((item) => ({
                    id: item.id,
                    label: item.label || null,
                    description: item.description || null,
                    category: item.category || null,
                    name: item.label || item.original_name || item.file_name,
                    type: item.file_type || "image",
                    size: formatFileSize(item.size_bytes),
                    dimensions:
                        item.width && item.height
                            ? `${item.width}x${item.height}`
                            : null,
                    url: item.path ? `/storage/${item.path}` : null,
                    uploadedAt: new Date(item.created_at).toLocaleDateString(),
                }));

                if (!cancelled) setMedia(formattedData);
            } catch (e) {
                console.error("Failed to load media:", e);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const stats = {
        total: media.length,
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/media/${deleteId}`, {
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

            if (!res.ok) throw new Error("Delete failed");

            setMedia((prev) => prev.filter((m) => m.id !== deleteId));
            setShowDeleteModal(false);
            setDeleteId(null);
        } catch (e) {
            alert(e?.message || "Unable to delete");
        }
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) {
            alert("No items selected");
            return;
        }
        setShowDeleteAllModal(true);
    };

    const confirmDeleteAll = async () => {
        if (isDeletingAll) return;

        try {
            setIsDeletingAll(true);

            // Delete selected items (or all if none selected)
            const itemsToDelete =
                selectedItems.length > 0
                    ? selectedItems
                    : media.map((m) => m.id);
            const deletePromises = itemsToDelete.map((id) =>
                fetch(`${API_BASE_URL}/media/${id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            document.querySelector('meta[name="csrf-token"]')
                                ?.content || "",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                }),
            );

            await Promise.all(deletePromises);

            setMedia((prev) =>
                prev.filter((m) => !itemsToDelete.includes(m.id)),
            );
            setSelectedItems([]);
            setShowDeleteAllModal(false);
        } catch (e) {
            alert(e?.message || "Unable to delete items");
        } finally {
            setIsDeletingAll(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredMedia.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredMedia.map((m) => m.id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((i) => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const copyUrl = (url) => {
        if (url) navigator.clipboard.writeText(url);
    };

    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
            router.visit("/staff/media-manager/upload");
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setEditFormData({
            label: item.label || "",
            description: item.description || "",
            category: item.category || "Community",
        });
        setShowEditModal(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
        if (!editingItem) return;

        try {
            setIsSaving(true);

            const res = await fetch(`${API_BASE_URL}/media/${editingItem.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
                body: JSON.stringify(editFormData),
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson?.message || "Update failed");
            }

            // Update local state
            setMedia((prev) =>
                prev.map((m) =>
                    m.id === editingItem.id
                        ? {
                              ...m,
                              ...editFormData,
                              name: editFormData.label || m.name,
                          }
                        : m,
                ),
            );

            setShowEditModal(false);
            setEditingItem(null);
        } catch (e) {
            alert(e?.message || "Unable to update media");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <StaffLayout
            currentPage="Gallery Manager"
            title="Gallery Manager"
            subtitle="Upload, organize, and manage images for the public portal."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Total Images
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500">
                            <ImageIcon size={20} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                                Storage Mode
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                Images Only
                            </p>
                        </div>
                        <div className="p-3 rounded-xl bg-green-500">
                            <FolderOpen size={20} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-slate-700 mb-6 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-900 rounded-lg p-1 transition-colors">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                <Grid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md transition-colors ${
                                    viewMode === "list"
                                        ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white"
                                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                <List size={16} />
                            </button>
                        </div>

                        <Link
                            href="/staff/media-manager/upload"
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                        >
                            <Upload size={16} />
                            Upload Images
                        </Link>

                        {selectedItems.length > 0 && (
                            <button
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                            >
                                <Trash2 size={16} />
                                Delete Selected ({selectedItems.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMedia.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden group hover:border-gray-300 dark:hover:border-slate-500 transition-all"
                        >
                            <div className="relative aspect-square bg-gray-50 dark:bg-slate-900">
                                {item.url ? (
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon
                                            size={24}
                                            className="text-gray-400 dark:text-slate-500"
                                        />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-gray-900 dark:text-white transition"
                                            title="Edit Details"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => copyUrl(item.url)}
                                            className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-gray-900 dark:text-white transition"
                                            title="Copy Image URL"
                                        >
                                            <Copy size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="p-2 rounded-lg bg-red-600/90 hover:bg-red-500 text-white transition"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute top-2 left-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(
                                            item.id,
                                        )}
                                        onChange={() => toggleSelect(item.id)}
                                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-red-600 focus:ring-red-500 dark:focus:ring-offset-slate-900 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {item.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                    {item.size} • Image
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 transition-colors">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider w-12">
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredMedia.length > 0 &&
                                            selectedItems.length ===
                                                filteredMedia.length
                                        }
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-red-600 focus:ring-red-500 dark:focus:ring-offset-slate-900 transition-colors"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                    Size
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                            {filteredMedia.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(
                                                item.id,
                                            )}
                                            onChange={() =>
                                                toggleSelect(item.id)
                                            }
                                            className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-red-600 focus:ring-red-500 dark:focus:ring-offset-slate-900 transition-colors"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-slate-900">
                                                {item.url ? (
                                                    <img
                                                        src={item.url}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon
                                                            size={16}
                                                            className="text-gray-400 dark:text-slate-500"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                                    {item.dimensions || "Image"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">
                                        {item.size}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition"
                                                title="Edit Details"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    copyUrl(item.url)
                                                }
                                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition"
                                                title="Copy URL"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/20 text-red-500 hover:text-red-600 dark:hover:text-red-400 transition"
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
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setShowUploadModal(false)}
                >
                    <div
                        className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-700" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Upload Images
                                </h2>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-red-500 dark:hover:border-red-500 bg-gray-50 dark:bg-slate-800/50 transition-colors"
                            >
                                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Upload
                                        size={28}
                                        className="text-red-500"
                                    />
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                    Select Images to Upload
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                    Supports JPG, PNG, GIF, WEBP
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete All Modal */}
            {showDeleteAllModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setShowDeleteAllModal(false)}
                >
                    <div
                        className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-700" />
                        <div className="px-6 pt-8 pb-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-500/10 border-2 border-red-100 dark:border-red-500/20">
                                    <AlertCircle
                                        size={32}
                                        className="text-red-500"
                                    />
                                </div>
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Delete All Media?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This will permanently delete all{" "}
                                    {media.length} media items. This action
                                    cannot be undone.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowDeleteAllModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                                    disabled={isDeletingAll}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteAll}
                                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isDeletingAll}
                                >
                                    {isDeletingAll
                                        ? "Deleting..."
                                        : "Delete All"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingItem && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-700" />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Edit Media Details
                                </h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                                    {editingItem.url ? (
                                        <img
                                            src={editingItem.url}
                                            alt={editingItem.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon
                                                size={24}
                                                className="text-gray-400"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {editingItem.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        {editingItem.size} •{" "}
                                        {editingItem.uploadedAt}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                        Label
                                    </label>
                                    <input
                                        type="text"
                                        name="label"
                                        value={editFormData.label}
                                        onChange={handleEditFormChange}
                                        placeholder="e.g., City Fiesta 2024"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditFormChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={editFormData.description}
                                        onChange={handleEditFormChange}
                                        placeholder="Brief description of the image..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition"
                                >
                                    <Save size={16} />
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-1 w-full bg-gradient-to-r from-red-600 to-red-700" />
                        <div className="px-6 pt-8 pb-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-500/10 border-2 border-red-100 dark:border-red-500/20">
                                    <AlertCircle
                                        size={32}
                                        className="text-red-500"
                                    />
                                </div>
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Delete Image?
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    This action cannot be undone. The image will
                                    be permanently deleted.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition"
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
