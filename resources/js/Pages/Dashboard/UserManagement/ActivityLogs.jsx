import { useState } from "react";
import { Layout } from "../../../Components/Sidebar";
import { Search, Filter, ShieldAlert } from "lucide-react";

// Mock Data for Audit Logs
const INITIAL_LOGS = [
    {
        id: "LOG-1092",
        user: "Admin User",
        role: "Super Admin",
        action: "Deleted Evacuee Profile (ID: E042)",
        module: "Evacuee Profiles",
        timestamp: "2026-05-16 10:45 AM",
        severity: "High",
    },
    {
        id: "LOG-1091",
        user: "Juan Dela Cruz",
        role: "Shelter Manager",
        action: "Updated Capacity (Mamatid Elem)",
        module: "Evacuation Shelters",
        timestamp: "2026-05-16 09:30 AM",
        severity: "Low",
    },
    {
        id: "LOG-1090",
        user: "Admin User",
        role: "Super Admin",
        action: "Generated 'Daily Operations Report'",
        module: "System Reports",
        timestamp: "2026-05-16 08:35 AM",
        severity: "Low",
    },
    {
        id: "LOG-1089",
        user: "Pedro Reyes",
        role: "Encoder",
        action: "Added New Household (ID: E055)",
        module: "Evacuee Profiles",
        timestamp: "2026-05-15 10:20 PM",
        severity: "Medium",
    },
    {
        id: "LOG-1088",
        user: "Maria Santos",
        role: "Shelter Manager",
        action: "Distributed 250 Sacks of Rice",
        module: "Relief Distribution",
        timestamp: "2026-05-15 03:15 PM",
        severity: "Medium",
    },
];

const SEVERITY_STYLE = {
    Low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    Medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50",
};

export default function ActivityLogs() {
    const [logs] = useState(INITIAL_LOGS);
    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState("All Modules");

    const filtered = logs.filter((log) => {
        const matchSearch =
            log.user.toLowerCase().includes(search.toLowerCase()) ||
            log.action.toLowerCase().includes(search.toLowerCase());
        const matchModule =
            moduleFilter === "All Modules" || log.module === moduleFilter;
        return matchSearch && matchModule;
    });

    return (
        <Layout
            currentPage="Activity Logs"
            title="System Activity Logs"
            subtitle="Secure audit trail of user actions across the dashboard."
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors flex flex-col min-h-[calc(100vh-140px)]">
                {/* Security Banner */}
                <div className="bg-slate-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <ShieldAlert size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            Immutable Audit Trail
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            These records are system-generated and cannot be
                            modified or deleted by any user.
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 transition-colors">
                    <div className="relative w-full sm:w-80">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            size={15}
                        />
                        <input
                            type="text"
                            placeholder="Search by user or action..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full sm:w-auto transition-colors shadow-sm">
                        <Filter
                            size={14}
                            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                        />
                        <select
                            value={moduleFilter}
                            onChange={(e) => setModuleFilter(e.target.value)}
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 focus:outline-none bg-transparent w-full cursor-pointer"
                        >
                            <option className="dark:bg-gray-800">
                                All Modules
                            </option>
                            <option className="dark:bg-gray-800">
                                Evacuee Profiles
                            </option>
                            <option className="dark:bg-gray-800">
                                Evacuation Shelters
                            </option>
                            <option className="dark:bg-gray-800">
                                Relief Distribution
                            </option>
                            <option className="dark:bg-gray-800">
                                System Reports
                            </option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left transition-colors">
                                {[
                                    "Log ID",
                                    "Timestamp",
                                    "User & Role",
                                    "Module",
                                    "Action Performed",
                                    "Severity",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/60 transition-colors">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-5 py-16 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No activity logs found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 font-mono text-xs text-gray-400 dark:text-gray-500">
                                            {log.id}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                                            {log.timestamp}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-bold text-gray-900 dark:text-gray-100">
                                                {log.user}
                                            </p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mt-0.5">
                                                {log.role}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                            {log.module}
                                        </td>
                                        <td className="px-5 py-4 text-gray-800 dark:text-gray-200">
                                            {log.action}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${SEVERITY_STYLE[log.severity]}`}
                                            >
                                                {log.severity}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 transition-colors bg-gray-50/50 dark:bg-gray-900/20">
                    <span className="font-medium">
                        Showing {filtered.length} of {logs.length} logs
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
