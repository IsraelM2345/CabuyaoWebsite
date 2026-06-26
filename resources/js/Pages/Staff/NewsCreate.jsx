import React, { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import { StaffLayout } from "../../Components/StaffSidebar";
import { useGlobalLoader } from "../../Hooks/useGlobalLoader";
import {
    ArrowLeft,
    Save,
    Eye,
    Image,
    X,
    CheckCircle2,
    AlertCircle,
    Upload,
    Calendar,
    Tag,
    User,
    FileText,
    Loader2,
} from "lucide-react";
import DOMPurify from "dompurify";

const categories = [
    "Technology",
    "Health",
    "Education",
    "Infrastructure",
    "Economic Development",
    "Social Services",
    "Tourism",
    "Environment",
    "Sports",
    "Culture",
    "General",
    "DRRM",
    "Business",
];

const API_BASE_URL = "/api/staff";

export default function NewsCreate({ editingId }) {
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "General",
        author: "",
        featuredImage: null,
        featuredImagePreview: null,
        status: "Draft",
        publishDate: "",
        tags: "",
        date: "",
    });
    const [showPreview, setShowPreview] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { withLoader } = useGlobalLoader();

    // Load existing news if editing
    useEffect(() => {
        if (editingId) {
            setIsEditing(true);
            fetchNews(editingId);
        }
    }, [editingId]);

    const fetchNews = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/news/${id}`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch news");
            }

            const data = await response.json();
            setFormData({
                title: data.title || "",
                slug: data.slug || "",
                excerpt: data.excerpt || "",
                content: data.body || "",
                category: data.category || "General",
                author: data.author || "",
                featuredImage: null,
                featuredImagePreview: data.image_path || null,
                status: data.status || "Draft",
                publishDate: data.published_at
                    ? new Date(data.published_at).toISOString().slice(0, 16)
                    : "",
                tags: data.tags || "",
                date: data.date || "",
            });
        } catch (err) {
            setErrors({ general: "Failed to load news article" });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "title") {
            // Auto-generate slug from title
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
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

    const handleSubmit = async (e, status = null) => {
        e.preventDefault();

        // Validate
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.content.trim()) newErrors.content = "Content is required";
        if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        await withLoader(async () => {
            try {
                // Prepare form data for API
                const submitData = new FormData();
                submitData.append("title", formData.title);
                submitData.append("category", formData.category);
                submitData.append("excerpt", formData.excerpt);
                submitData.append("body", formData.content);
                submitData.append("status", status || formData.status);
                submitData.append("author", formData.author || "Admin");
                submitData.append(
                    "date",
                    formData.date || new Date().toISOString().split("T")[0],
                );

                // Send the actual image file to Laravel
                if (formData.featuredImage) {
                    submitData.append("image_file", formData.featuredImage);
                }

                const url = isEditing
                    ? `${API_BASE_URL}/news/${editingId}?_method=PUT`
                    : `${API_BASE_URL}/news`;

                const method = isEditing ? "POST" : "POST";

                const response = await fetch(url, {
                    method,
                    body: submitData,
                    headers: {
                        Accept: "application/json",
                        "X-CSRF-TOKEN":
                            document.querySelector('meta[name="csrf-token"]')
                                ?.content || "",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to save news");
                }

                setSuccessMessage(
                    isEditing
                        ? "Article updated successfully!"
                        : "Article created successfully!",
                );
                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                    router.visit("/staff/news-manager");
                }, 2000);
            } catch (err) {
                setErrors({ general: err.message });
            } finally {
                setLoading(false);
            }
        });
    };

    const handleSaveDraft = (e) => {
        handleSubmit(e, "Draft");
    };

    const handlePublish = (e) => {
        handleSubmit(e, "Published");
    };

    return (
        <StaffLayout
            currentPage="News Manager"
            title={isEditing ? "Edit News Article" : "Add News Article"}
            subtitle={
                isEditing
                    ? "Update an existing news article for the public portal."
                    : "Create a new news article for the public portal."
            }
        >
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-2">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">{successMessage}</span>
                    </div>
                </div>
            )}

            {/* General Error */}
            {errors.general && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <span className="text-red-700 dark:text-red-400 text-sm font-medium">
                        {errors.general}
                    </span>
                </div>
            )}

            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/staff/news-manager"
                    className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">
                        Back to News Manager
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
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        Save Draft
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <CheckCircle2 size={16} />
                        )}
                        {loading ? "Saving..." : "Publish"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Slug */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Article Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter article title..."
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    URL Slug
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 dark:text-slate-400">
                                        /news/
                                    </span>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="article-slug"
                                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Excerpt *
                        </label>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
                            Brief summary of the article (150-200 characters)
                        </p>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Write a brief summary..."
                            className={`w-full px-4 py-3 border rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition resize-none ${
                                errors.excerpt
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-200 dark:border-slate-600 focus:ring-red-500"
                            }`}
                        />
                        {errors.excerpt && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.excerpt}
                            </p>
                        )}
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Article Content *
                        </label>
                        {showPreview ? (
                            <div className="prose dark:prose-invert max-w-none">
                                <div
                                    className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 min-h-[400px]"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(formData.content),
                                    }}
                                />
                            </div>
                        ) : (
                            <>
                                {/* Editor Toolbar */}
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
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Heading 3"
                                    >
                                        <span className="font-bold text-xs">
                                            H3
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
                                    <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-2" />
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Insert Image"
                                    >
                                        <Image size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                        title="Insert Link"
                                    >
                                        <Link size={16} />
                                    </button>
                                </div>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows={16}
                                    placeholder="Write your article content here..."
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
                    {/* Featured Image */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                            Featured Image
                        </label>
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
                                    size={24}
                                    className="text-gray-400 mb-2"
                                />
                                <span className="text-xs text-gray-500 dark:text-slate-400 text-center">
                                    Click to upload image
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

                    {/* Publish Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Publish Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    Publish Date
                                </label>
                                <input
                                    type="datetime-local"
                                    name="publishDate"
                                    value={formData.publishDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category & Tags */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Classification
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                    <Tag size={14} className="inline mr-1" />
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
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
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="tag1, tag2, tag3"
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                />
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                    Separate tags with commas
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Author */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                <User size={14} className="inline mr-1" />
                                Author
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                placeholder="Enter author name"
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
