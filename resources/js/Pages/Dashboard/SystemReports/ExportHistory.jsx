import { useState } from "react";
import { Layout } from "../../../Components/Sidebar";
import { Search, Download, FileText, CheckCircle2, X } from "lucide-react";

// Mock Data for past exports
const INITIAL_HISTORY = [
    {
        id: "EXP-8901",
        name: "Daily Operations Report",
        dateRange: "2026-05-15",
        format: "PDF",
        user: "Admin User",
        timestamp: "2026-05-15 16:30",
    },
    {
        id: "EXP-8902",
        name: "Evacuee Summary per Barangay",
        dateRange: "All Time",
        format: "Excel",
        user: "Jose Dela Cruz",
        timestamp: "2026-05-15 14:15",
    },
    {
        id: "EXP-8903",
        name: "Relief Distribution Report",
        dateRange: "2026-05-10 to 2026-05-14",
        format: "PDF",
        user: "Admin User",
        timestamp: "2026-05-14 18:00",
    },
    {
        id: "EXP-8904",
        name: "Shelter Occupancy Report",
        dateRange: "All Time",
        format: "PDF",
        user: "Maria Santos",
        timestamp: "2026-05-14 09:45",
    },
    {
        id: "EXP-8905",
        name: "Vulnerable Groups Summary",
        dateRange: "All Time",
        format: "Excel",
        user: "Admin User",
        timestamp: "2026-05-13 11:20",
    },
];

function Toast({ message, onClose }) {
    import("react").then(({ useEffect }) => {
        useEffect(() => {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }, [onClose]);
    });

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

export default function ExportHistory() {
    const [history] = useState(INITIAL_HISTORY);
    const [search, setSearch] = useState("");
    const [toastMessage, setToastMessage] = useState(null);

    const filtered = history.filter(
        (h) =>
            h.name.toLowerCase().includes(search.toLowerCase()) ||
            h.user.toLowerCase().includes(search.toLowerCase()),
    );

    const handleReDownload = (format) => {
        setToastMessage(`Re-downloading archived report as ${format}...`);
    };

    return (
        <Layout
            currentPage="Export History"
            title="Export History"
            subtitle="Audit log of previously generated system reports."
        >
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors flex flex-col min-h-[calc(100vh-140px)]">
                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="relative w-full sm:w-80">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            size={15}
                        />
                        <input
                            type="text"
                            placeholder="Search by report name or user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors shadow-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left transition-colors">
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Export ID
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Report Name
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date Range
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Generated By
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/60 transition-colors">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-5 py-16 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <Search
                                                size={32}
                                                className="text-gray-300 dark:text-gray-600"
                                            />
                                            <p>No export history found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((h) => (
                                    <tr
                                        key={h.id}
                                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 font-mono text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            {h.id}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg ${h.format === "PDF" ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"}`}
                                                >
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-100">
                                                        {h.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mt-0.5">
                                                        {h.format}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                            {h.dateRange}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                            {h.user}
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-sm">
                                            {h.timestamp}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() =>
                                                    handleReDownload(h.format)
                                                }
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs font-medium"
                                            >
                                                <Download size={14} /> Download
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 transition-colors bg-gray-50/50 dark:bg-gray-900/20">
                    <span className="font-medium">
                        Showing {filtered.length} of {history.length} records
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
