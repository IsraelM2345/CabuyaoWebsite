import { useState, useEffect } from "react";
import { Layout } from "../../../Components/Sidebar";
import { Link } from "@inertiajs/react";
import {
    Plus,
    Eye,
    Pencil,
    Trash2,
    Search,
    X,
    CheckCircle2,
} from "lucide-react";

const CATEGORY_COLORS = {
    "Weather Alert":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Relief Operations":
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Announcement:
        "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    Evacuation:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    Infrastructure:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

// Simulated Backend Data Prop
const INITIAL_ANNOUNCEMENTS = [
    {
        id: 1,
        title: "Typhoon Baesyang Update:",
        body: "PAGASA has raised Tropical Cyclone Signal No. 2. All residents are advised to stay indoors.",
        category: "Weather Alert",
        date: "2026-05-15",
        status: "Published",
        img: "https://images.unsplash.com/photo-1504608524841-42584120d693?w=60&h=60&fit=crop",
    },
    {
        id: 2,
        title: "City Government Distributes Relief",
        body: "Mayor's office spearheaded the distribution of 500 food packs in Barangay Mamatid.",
        category: "Relief Operations",
        date: "2026-05-14",
        status: "Published",
        img: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=60&h=60&fit=crop",
    },
    {
        id: 3,
        title: "Suspension of Classes Draft",
        body: "Drafting the suspension of classes pending final mayor approval.",
        category: "Announcement",
        date: "2026-05-14",
        status: "Draft",
        img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=60&h=60&fit=crop",
    },
];

function Toast({ message, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="text-teal-500" size={20} />
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}

export default function AnnouncementsIndex() {
    const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
    const [search, setSearch] = useState("");
    const [toastMessage, setToastMessage] = useState(null);
    const [viewingAnnouncement, setViewingAnnouncement] = useState(null);

    const filtered = announcements.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase()),
    );

    const handleDelete = (idToRemove) => {
        if (
            window.confirm("Are you sure you want to delete this announcement?")
        ) {
            setAnnouncements(announcements.filter((a) => a.id !== idToRemove));
            setToastMessage("Announcement deleted successfully.");
        }
    };

    return (
        <Layout
            currentPage="All Announcements"
            title="Announcements"
            subtitle="Manage news and public announcements."
        >
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}

            {/* View Modal Overlay */}
            {viewingAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                View Announcement
                                <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full ${viewingAnnouncement.status === "Published" ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
                                >
                                    {viewingAnnouncement.status}
                                </span>
                            </h2>
                            <button
                                onClick={() => setViewingAnnouncement(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <img
                                src={viewingAnnouncement.img}
                                alt={viewingAnnouncement.title}
                                className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm"
                            />
                            <div className="flex items-center gap-3 mb-3">
                                <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${CATEGORY_COLORS[viewingAnnouncement.category] || CATEGORY_COLORS["Announcement"]}`}
                                >
                                    {viewingAnnouncement.category}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    Published: {viewingAnnouncement.date}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {viewingAnnouncement.title}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                                {viewingAnnouncement.body}
                            </p>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={() => setViewingAnnouncement(null)}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors flex flex-col min-h-[calc(100vh-140px)]">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 gap-4 transition-colors">
                    <div className="relative w-full sm:w-auto">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            size={15}
                        />
                        <input
                            type="text"
                            placeholder="Search announcements..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-80 pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors shadow-sm"
                        />
                    </div>
                    {/* Replaced Modal Trigger with Inertia Link */}
                    <Link
                        href="/announcements/create"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] w-full sm:w-auto shadow-sm"
                        style={{
                            background:
                                "linear-gradient(90deg, #0d9488, #0f766e)",
                        }}
                    >
                        <Plus size={16} />
                        New Announcement
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left transition-colors">
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date Published
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/60 transition-colors">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-5 py-16 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Search
                                                size={32}
                                                className="text-gray-300 dark:text-gray-600"
                                            />
                                            <p>No announcements found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((a) => (
                                    <tr
                                        key={a.id}
                                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={a.img}
                                                    alt=""
                                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm transition-colors">
                                                        {a.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs transition-colors mt-0.5">
                                                        {a.body}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${CATEGORY_COLORS[a.category] || CATEGORY_COLORS["Announcement"]}`}
                                            >
                                                {a.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`flex items-center gap-1.5 text-xs font-semibold ${a.status === "Published" ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}`}
                                            >
                                                <div
                                                    className={`w-1.5 h-1.5 rounded-full ${a.status === "Published" ? "bg-teal-500" : "bg-gray-400"}`}
                                                />
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">
                                            {a.date}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        setViewingAnnouncement(
                                                            a,
                                                        )
                                                    }
                                                    className="p-1.5 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {/* Edit Link routed to CreateEdit page with parameter */}
                                                <Link
                                                    href={`/announcements/create?id=${a.id}`}
                                                    className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    title="Edit Announcement"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(a.id)
                                                    }
                                                    className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 transition-colors bg-gray-50/50 dark:bg-gray-900/20">
                    <span className="font-medium">
                        Showing {filtered.length} of {announcements.length}{" "}
                        entries
                    </span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm">
                            Previous
                        </button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
