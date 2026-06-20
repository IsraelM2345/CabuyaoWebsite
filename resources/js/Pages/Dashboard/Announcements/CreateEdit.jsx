import { useState } from "react";
import { Layout } from "../../../Components/Sidebar";
import { Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    Globe,
    Smartphone,
    MonitorDot,
    AlertCircle,
} from "lucide-react";

const CATEGORIES = [
    "Weather Alert",
    "Relief Operations",
    "Announcement",
    "Evacuation",
    "Infrastructure",
];

export default function CreateEditAnnouncement() {
    const [formData, setFormData] = useState({
        title: "",
        category: "Announcement",
        date: new Date().toISOString().split("T")[0],
        status: "Draft",
        img: "",
        body: "",
        targets: {
            publicPortal: true,
            smsAlert: false,
            dashboard: true,
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTargetChange = (targetName) => {
        setFormData((prev) => ({
            ...prev,
            targets: {
                ...prev.targets,
                [targetName]: !prev.targets[targetName],
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would use Inertia's router.post() or router.put() here
        // router.post('/announcements', formData);
        alert(
            `Announcement ${formData.status === "Published" ? "Published" : "Saved as Draft"} successfully!`,
        );
        window.history.back();
    };

    return (
        <Layout
            currentPage="Create New"
            title="Create Announcement"
            subtitle="Draft and publish critical updates to the public and staff."
        >
            <div className="max-w-5xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/announcements"
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Announcements
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">
                                Announcement Details
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Announcement Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-gray-400"
                                        placeholder="e.g. Mandatory Pre-emptive Evacuation in Coastal Areas"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Category
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Date Published
                                        </label>
                                        <input
                                            required
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white dark:[color-scheme:dark] rounded-lg px-4 py-3 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Feature Image URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        name="img"
                                        value={formData.img}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-gray-400"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    {formData.img && (
                                        <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-32 w-full max-w-sm">
                                            <img
                                                src={formData.img}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Announcement Content{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    {/* Simulated Rich Text Editor Toolbar */}
                                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all">
                                        <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 px-3 py-2 flex gap-2">
                                            <button
                                                type="button"
                                                className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded font-serif font-bold"
                                            >
                                                B
                                            </button>
                                            <button
                                                type="button"
                                                className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded font-serif italic"
                                            >
                                                I
                                            </button>
                                            <button
                                                type="button"
                                                className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded font-serif underline"
                                            >
                                                U
                                            </button>
                                            <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 self-center mx-1"></div>
                                            <button
                                                type="button"
                                                className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded text-xs font-bold uppercase"
                                            >
                                                Link
                                            </button>
                                        </div>
                                        <textarea
                                            required
                                            name="body"
                                            rows="8"
                                            value={formData.body}
                                            onChange={handleInputChange}
                                            className="w-full bg-white dark:bg-gray-800 border-none text-gray-900 dark:text-white px-4 py-3 text-sm focus:ring-0 resize-y placeholder-gray-400"
                                            placeholder="Write the full details here..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar Area */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Publishing Status */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                                Publishing
                            </h3>

                            <div className="mb-5">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
                                >
                                    <option value="Draft">
                                        Draft (Hidden)
                                    </option>
                                    <option value="Published">
                                        Published (Live)
                                    </option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 mb-5">
                                <AlertCircle
                                    size={16}
                                    className="flex-shrink-0"
                                />
                                <p>
                                    Ensure all facts are verified before setting
                                    status to Published.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    href="/announcements"
                                    className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:opacity-90 active:scale-[0.98]"
                                    style={{
                                        background:
                                            formData.status === "Published"
                                                ? "linear-gradient(90deg, #0d9488, #0f766e)"
                                                : "linear-gradient(90deg, #4b5563, #374151)",
                                    }}
                                >
                                    <Save size={16} />
                                    {formData.status === "Published"
                                        ? "Publish Now"
                                        : "Save Draft"}
                                </button>
                            </div>
                        </div>

                        {/* Target Audience Options */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                                Target Audience
                            </h3>

                            <div className="space-y-3">
                                <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-teal-500 cursor-pointer"
                                        checked={formData.targets.publicPortal}
                                        onChange={() =>
                                            handleTargetChange("publicPortal")
                                        }
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 dark:text-gray-200">
                                            <Globe
                                                size={14}
                                                className="text-blue-500"
                                            />
                                            Public Portal
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                            Visible to all citizens on the main
                                            EvacTech website.
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-teal-500 cursor-pointer"
                                        checked={formData.targets.smsAlert}
                                        onChange={() =>
                                            handleTargetChange("smsAlert")
                                        }
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 dark:text-gray-200">
                                            <Smartphone
                                                size={14}
                                                className="text-amber-500"
                                            />
                                            SMS Broadcast
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                            Push text alert to all currently
                                            registered evacuees.
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 text-teal-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-teal-500 cursor-pointer"
                                        checked={formData.targets.dashboard}
                                        onChange={() =>
                                            handleTargetChange("dashboard")
                                        }
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 dark:text-gray-200">
                                            <MonitorDot
                                                size={14}
                                                className="text-purple-500"
                                            />
                                            Dashboard Alert
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                            Pin this announcement to the top of
                                            the admin dashboard.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
