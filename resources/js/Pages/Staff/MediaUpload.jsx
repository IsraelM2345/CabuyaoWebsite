import React, { useState, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    ArrowLeft,
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
    Image,
} from "lucide-react";

const API_BASE_URL = "/api/staff";

const fileTypes = {
    image: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
    document: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"],
    video: ["mp4", "avi", "mov", "wmv", "mkv"],
    audio: ["mp3", "wav", "ogg", "m4a"],
    archive: ["zip", "rar", "7z", "tar", "gz"],
};

const maxFileSize = 50 * 1024 * 1024; // 50MB

const categories = ["Festivals", "Government", "Tourism", "Community"];

export default function MediaUpload() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Default metadata for new files
    const defaultFileMetadata = {
        label: "",
        description: "",
        category: "Community",
    };

    // IMPORTANT: MediaUpload is images-only.
    const getFileType = (file) => {
        const mime = (file?.type || "").toLowerCase();
        if (mime.startsWith("image/")) return "image";

        const extension = (file.name.split(".").pop() || "").toLowerCase();
        return fileTypes.image.includes(extension) ? "image" : "other";
    };

    const getFileIcon = (type) => {
        switch (type) {
            case "image":
                return <Image size={20} className="text-blue-500" />;
            default:
                return <Image size={20} className="text-gray-500" />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList).map((file) => {
            const type = getFileType(file);
            const isTooLarge = file.size > maxFileSize;
            const isNotImage = type !== "image";

            let status = "pending";
            let error = null;

            if (isTooLarge) {
                status = "error";
                error = `File exceeds ${formatFileSize(maxFileSize)} limit`;
            } else if (isNotImage) {
                status = "error";
                error = "Only image files are allowed.";
            }

            return {
                file,
                name: file.name,
                size: file.size,
                type,
                progress: 0,
                status,
                error,
                preview: type === "image" ? URL.createObjectURL(file) : null,
                metadata: { ...defaultFileMetadata },
            };
        });
        setFiles((prev) => [...prev, ...newFiles]);
    };

    // Update per-file metadata
    const handleFileMetadataChange = (index, field, value) => {
        setFiles((prev) =>
            prev.map((f, i) =>
                i === index
                    ? { ...f, metadata: { ...f.metadata, [field]: value } }
                    : f,
            ),
        );
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        const pendingFiles = files.filter((f) => f.status === "pending");
        if (pendingFiles.length === 0) return;

        // Validate that each file has a label
        const missingLabel = pendingFiles.find((f) => !f.metadata.label.trim());
        if (missingLabel) {
            alert("Please provide a label for each image before uploading.");
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);
            setShowSuccessModal(false);

            const formDataPayload = new FormData();
            // Backend expects files[] array with per-file metadata
            pendingFiles.forEach((f, index) => {
                formDataPayload.append("files[]", f.file);
                formDataPayload.append(`labels[${index}]`, f.metadata.label);
                formDataPayload.append(
                    `descriptions[${index}]`,
                    f.metadata.description,
                );
                formDataPayload.append(
                    `categories[${index}]`,
                    f.metadata.category,
                );
            });

            const response = await fetch(`${API_BASE_URL}/media`, {
                method: "POST",
                body: formDataPayload,
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')
                            ?.content || "",
                },
                credentials: "same-origin",
            });

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                throw new Error(errJson?.message || "Upload failed");
            }

            setUploadProgress(100);
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                router.visit("/staff/media-manager");
            }, 1200);
        } catch (e) {
            alert(e?.message || "Unable to upload files");
            setShowSuccessModal(false);
        } finally {
            setUploading(false);
        }
    };

    const pendingFiles = files.filter((f) => f.status === "pending");
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    return (
        <StaffLayout
            currentPage="Media Manager"
            title="Upload Media"
            subtitle="Upload images for the web portal."
        >
            {showSuccessModal && (
                <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-2">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">
                            Files uploaded successfully!
                        </span>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/staff/media-manager"
                    className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">
                        Back to Media Manager
                    </span>
                </Link>
                {pendingFiles.length > 0 && (
                    <button
                        onClick={uploadFiles}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium transition"
                    >
                        <Upload size={16} />
                        {uploading
                            ? "Uploading..."
                            : `Upload ${pendingFiles.length} File${pendingFiles.length > 1 ? "s" : ""}`}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div
                        className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-dashed transition-all p-8 ${
                            dragActive
                                ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                : "border-gray-200 dark:border-slate-600"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                                <Upload size={28} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Drag and drop files here
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                                Click to browse images from your computer
                            </p>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                            >
                                Browse Files
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-4">
                                Maximum file size: {formatFileSize(maxFileSize)}
                            </p>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        Files ({files.length})
                                    </h3>
                                    <span className="text-xs text-gray-500 dark:text-slate-400">
                                        Total: {formatFileSize(totalSize)}
                                    </span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
                                {files.map((fileData, index) => (
                                    <div
                                        key={index}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {fileData.preview ? (
                                                    <img
                                                        src={fileData.preview}
                                                        alt={fileData.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    getFileIcon(fileData.type)
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {fileData.name}
                                                    </p>
                                                    {fileData.status ===
                                                        "pending" && (
                                                        <button
                                                            onClick={() =>
                                                                removeFile(
                                                                    index,
                                                                )
                                                            }
                                                            className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition ml-2 flex-shrink-0"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
                                                    {formatFileSize(
                                                        fileData.size,
                                                    )}{" "}
                                                    • {fileData.type}
                                                </p>

                                                {fileData.status ===
                                                    "pending" && (
                                                    <div className="space-y-2">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                                                                Label *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    fileData
                                                                        .metadata
                                                                        .label
                                                                }
                                                                onChange={(e) =>
                                                                    handleFileMetadataChange(
                                                                        index,
                                                                        "label",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="e.g., City Fiesta 2024"
                                                                className="w-full px-3 py-1.5 border border-gray-200 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                                                                Category
                                                            </label>
                                                            <select
                                                                value={
                                                                    fileData
                                                                        .metadata
                                                                        .category
                                                                }
                                                                onChange={(e) =>
                                                                    handleFileMetadataChange(
                                                                        index,
                                                                        "category",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full px-3 py-1.5 border border-gray-200 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                                            >
                                                                {categories.map(
                                                                    (cat) => (
                                                                        <option
                                                                            key={
                                                                                cat
                                                                            }
                                                                            value={
                                                                                cat
                                                                            }
                                                                        >
                                                                            {
                                                                                cat
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                                                                Description
                                                            </label>
                                                            <textarea
                                                                value={
                                                                    fileData
                                                                        .metadata
                                                                        .description
                                                                }
                                                                onChange={(e) =>
                                                                    handleFileMetadataChange(
                                                                        index,
                                                                        "description",
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Brief description..."
                                                                rows={2}
                                                                className="w-full px-3 py-1.5 border border-gray-200 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {fileData.status ===
                                                    "pending" &&
                                                    fileData.progress > 0 && (
                                                        <div className="mt-2 w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1">
                                                            <div
                                                                className="bg-red-600 h-1 rounded-full transition-all"
                                                                style={{
                                                                    width: `${fileData.progress}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                {fileData.error && (
                                                    <p className="text-xs text-red-500 mt-2">
                                                        {fileData.error}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {fileData.status ===
                                                    "completed" && (
                                                    <CheckCircle2
                                                        size={16}
                                                        className="text-green-500"
                                                    />
                                                )}
                                                {fileData.status ===
                                                    "error" && (
                                                    <AlertCircle
                                                        size={16}
                                                        className="text-red-500"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Upload Guidelines
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-green-500 mt-0.5 flex-shrink-0"
                                />
                                <span>
                                    Maximum file size:{" "}
                                    {formatFileSize(maxFileSize)}
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-green-500 mt-0.5 flex-shrink-0"
                                />
                                <span>Supported: Images only</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-green-500 mt-0.5 flex-shrink-0"
                                />
                                <span>
                                    Each image can have different metadata
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2
                                    size={16}
                                    className="text-green-500 mt-0.5 flex-shrink-0"
                                />
                                <span>Files are automatically optimized</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Current Session
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-slate-400">
                                    Total Files
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {files.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-slate-400">
                                    Pending
                                </span>
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                    {pendingFiles.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-slate-400">
                                    Completed
                                </span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    {
                                        files.filter(
                                            (f) => f.status === "completed",
                                        ).length
                                    }
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-slate-400">
                                    Total Size
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatFileSize(totalSize)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}
