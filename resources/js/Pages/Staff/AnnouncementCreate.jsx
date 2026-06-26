import React, { useEffect, useState } from "react";

import { Link, router } from "@inertiajs/react";
import { StaffLayout } from "../../Components/StaffSidebar";
import { useGlobalLoader } from "../../Hooks/useGlobalLoader";
import {
    ArrowLeft,
    Save,
    Eye,
    X,
    CheckCircle2,
    Upload,
    Calendar,
    Clock,
    AlertCircle,
    Megaphone,
    Image as ImageIcon,
    Loader2,
} from "lucide-react";
import DOMPurify from "dompurify";

const announcementTypes = [
    "Public Advisory",
    "Emergency Alert",
    "Event Announcement",
    "Government Update",
    "Health Advisory",
    "Weather Alert",
    "Traffic Advisory",
    "General Information",
];

const urgencyLevels = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
    { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-700" },
    { value: "high", label: "High", color: "bg-amber-100 text-amber-700" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
];

export default function AnnouncementCreate({ editingId }) {
    const API_BASE_URL = "/api/staff";

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "General Information",
        urgency: "normal",
        effectiveDate: "",
        expiryDate: "",
        targetAudience: "general",
        featuredImage: null,
        featuredImagePreview: null,
        status: "draft",
    });

    const [showPreview, setShowPreview] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { withLoader } = useGlobalLoader();

    const mapUIStatusToApiStatus = (uiStatus) => {
        if (uiStatus === "published") return "Published";
        // server only supports Draft/Published
        return "Draft";
    };

    // Load existing announcement (edit)
    React.useEffect(() => {
        if (!editingId) return;

        let cancelled = false;

        async function load() {
            setLoading(true);
            setErrors({});
            try {
                const res = await fetch(
                    `${API_BASE_URL}/announcements/${editingId}`,
                    {
                        headers: {
                            Accept: "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                        },
                        credentials: "same-origin",
                    },
                );

                if (!res.ok) {
                    throw new Error(
                        `Failed to load announcement (${res.status})`,
                    );
                }

                const data = await res.json();
                if (cancelled) return;

                // Build proper image URL
                let imageUrl = null;
                if (data.image_path) {
                    imageUrl = data.image_path.startsWith("http")
                        ? data.image_path
                        : `/storage/${data.image_path}`;
                }

                setFormData((prev) => ({
                    ...prev,
                    title: data.title || "",
                    content: data.body || data.content || "",
                    type: data.category || prev.type,
                    effectiveDate: data.date
                        ? new Date(data.date).toISOString().slice(0, 16)
                        : "",
                    expiryDate: "",
                    targetAudience: "general",
                    featuredImage: null, // Keep null since we're not uploading a new file
                    featuredImagePreview: imageUrl,
                    status: data.status === "Published" ? "published" : "draft",
                }));
            } catch (e) {
                if (cancelled) return;
                setErrors({
                    general: e?.message || "Failed to load announcement",
                });
            } finally {
                if (cancelled) return;
                setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [editingId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    featuredImage: file,
                    featuredImagePreview: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            featuredImage: null,
            featuredImagePreview: null,
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.content.trim()) newErrors.content = "Content is required";
        if (!formData.effectiveDate)
            newErrors.effectiveDate = "Effective date is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        await withLoader(async () => {
            try {
                const apiStatus = mapUIStatusToApiStatus(formData.status);

                // Use FormData for image upload
                const submitData = new FormData();
                submitData.append("title", formData.title);
                submitData.append("category", formData.type);
                submitData.append("body", formData.content);
                submitData.append("status", apiStatus);
                submitData.append(
                    "date",
                    formData.effectiveDate ? formData.effectiveDate : null,
                );
                submitData.append("urgency", formData.urgency);
                submitData.append("target_audience", formData.targetAudience);

                // Send the actual image file to Laravel
                if (formData.featuredImage) {
                    submitData.append("image_file", formData.featuredImage);
                }

                const url = editingId
                    ? `${API_BASE_URL}/announcements/${editingId}?_method=PUT`
                    : `${API_BASE_URL}/announcements`;

                const method = editingId ? "POST" : "POST";

                const response = await fetch(url, {
                    method,
                    body: submitData,
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]',
                        )?.content,
                    },
                });

                if (!response.ok) {
                    const errJson = await response.json().catch(() => ({}));
                    throw new Error(
                        errJson?.message || "Failed to save announcement",
                    );
                }

                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    router.visit("/staff/announcements-manager");
                }, 1200);
            } catch (err) {
                setErrors({
                    general: err?.message || "Unable to save announcement",
                });
            } finally {
                setLoading(false);
            }
        });
    };

    const handleSaveDraft = async () => {
        const nextForm = { ...formData, status: "draft" };
        setFormData(nextForm);
        await handleSubmit({ preventDefault: () => {} });
    };

    const handlePublish = async () => {
        const nextForm = { ...formData, status: "published" };
        setFormData(nextForm);
        await handleSubmit({ preventDefault: () => {} });
    };

    const getUrgencyColor = (level) => {
        const found = urgencyLevels.find((l) => l.value === level);
        return found ? found.color : "bg-gray-100 text-gray-700";
    };

    return (
        <StaffLayout
            currentPage="Announcements"
            title="Add Announcement"
            subtitle="Create a new announcement or advisory for the public portal."
        >
            {/* Success Toast */}
            {showSuccessModal && (
                <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-2">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">
                            Announcement saved successfully!
                        </span>
                    </div>
                </div>
            )}

            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/staff/announcements-manager"
                    className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">
                        Back to Announcements
                    </span>
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >
                        <Eye size={16} />
                        Preview
                    </button>
                    <button
                        onClick={handleSaveDraft}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >
                        <Save size={16} />
                        Save Draft
                    </button>
                    <button
                        onClick={handlePublish}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
                    >
                        <CheckCircle2 size={16} />
                        Publish Now
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                Announcement Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter announcement title..."
                                className={`w-full px-4 py-3 border rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                                    errors.title
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-200 dark:border-slate-600 focus:ring-red-500"
                                }`}
                            />
                            {errors.title && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Announcement Content *
                        </label>
                        {showPreview ? (
                            <div className="prose dark:prose-invert max-w-none">
                                <div
                                    className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 min-h-[300px]"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(formData.content),
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                {/* Simple Toolbar */}
                                <div className="flex flex-wrap items-center gap-1 mb-3 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Bold"
                                    >
                                        <span className="font-bold text-xs">
                                            B
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Italic"
                                    >
                                        <span className="italic text-xs">
                                            I
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Underline"
                                    >
                                        <span className="underline text-xs">
                                            U
                                        </span>
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-2" />
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Heading 1"
                                    >
                                        <span className="font-bold text-xs">
                                            H1
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Heading 2"
                                    >
                                        <span className="font-bold text-xs">
                                            H2
                                        </span>
                                    </button>
                                    <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-2" />
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Bullet List"
                                    >
                                        <span className="text-xs">• List</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Numbered List"
                                    >
                                        <span className="text-xs">1. List</span>
                                    </button>
                                </div>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows={12}
                                    placeholder="Write your announcement content here..."
                                    className={`w-full px-4 py-3 border rounded-lg text-sm font-mono bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition resize-none ${
                                        errors.content
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-200 dark:border-slate-600 focus:ring-red-500"
                                    }`}
                                />
                                {errors.content && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.content}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Announcement Type */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            <Megaphone size={16} className="inline mr-2" />
                            Announcement Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                >
                                    {announcementTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Urgency Level
                                </label>
                                <select
                                    name="urgency"
                                    value={formData.urgency}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                >
                                    {urgencyLevels.map((level) => (
                                        <option
                                            key={level.value}
                                            value={level.value}
                                        >
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(formData.urgency)}`}
                                    >
                                        {
                                            urgencyLevels.find(
                                                (l) =>
                                                    l.value ===
                                                    formData.urgency,
                                            )?.label
                                        }
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Target Audience
                                </label>
                                <select
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                >
                                    <option value="general">
                                        General Public
                                    </option>
                                    <option value="business">
                                        Business Owners
                                    </option>
                                    <option value="students">Students</option>
                                    <option value="seniors">
                                        Senior Citizens
                                    </option>
                                    <option value="drivers">Drivers</option>
                                    <option value="employees">
                                        Government Employees
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            <Calendar size={16} className="inline mr-2" />
                            Schedule
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Effective Date *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="effectiveDate"
                                    value={formData.effectiveDate}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                                        errors.effectiveDate
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-200 dark:border-slate-600 focus:ring-red-500"
                                    }`}
                                />
                                {errors.effectiveDate && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.effectiveDate}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Expiry Date
                                </label>
                                <input
                                    type="datetime-local"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                />
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                    Leave empty for no expiration
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            <ImageIcon size={16} className="inline mr-2" />
                            Cover Image
                        </h3>
                        {formData.featuredImagePreview ? (
                            <div className="relative rounded-lg overflow-hidden">
                                <img
                                    src={formData.featuredImagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-lg cursor-pointer hover:border-red-400 dark:hover:border-red-500 transition">
                                <Upload
                                    size={20}
                                    className="text-gray-400 mb-2"
                                />
                                <span className="text-xs text-gray-500 dark:text-slate-400 text-center">
                                    Click to upload image
                                </span>
                                <span className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                                    JPG, PNG, WebP (max 5MB)
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Status */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            <Clock size={16} className="inline mr-2" />
                            Status
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    checked={formData.status === "draft"}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Draft
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        Save without publishing
                                    </p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="published"
                                    checked={formData.status === "published"}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Published
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        Make visible to the public immediately
                                    </p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="scheduled"
                                    checked={formData.status === "scheduled"}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                />
                                <div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        Scheduled
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        Auto-publish on effective date
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
