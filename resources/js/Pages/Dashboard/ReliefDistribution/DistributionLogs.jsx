import { useState, useEffect } from "react";
import { Layout } from "../../../Components/Sidebar";
import { Search, Filter, Send, X, CheckCircle2 } from "lucide-react";

// Mock Data for items to populate the dropdown
const INVENTORY_ITEMS = [
    { id: 1, name: "Rice (50kg Sack)", current: 150, unit: "sacks" },
    { id: 2, name: "Canned Goods Assorted", current: 1200, unit: "pieces" },
    { id: 3, name: "Bottled Water (1L)", current: 800, unit: "bottles" },
];

const INITIAL_LOGS = [
    {
        id: "DL-1001",
        date: "2026-05-15 14:30",
        item: "Rice (50kg Sack)",
        qty: 50,
        center: "Banlic Covered Court",
        authorizedBy: "Admin User",
        status: "Completed",
    },
    {
        id: "DL-1002",
        date: "2026-05-15 10:15",
        item: "Bottled Water (1L)",
        qty: 200,
        center: "Mamatid Elementary",
        authorizedBy: "System Auto",
        status: "Completed",
    },
    {
        id: "DL-1003",
        date: "2026-05-14 16:45",
        item: "Canned Goods Assorted",
        qty: 500,
        center: "Sala Hall",
        authorizedBy: "Admin User",
        status: "Completed",
    },
];

const CENTERS = [
    "Banlic Covered Court",
    "Mamatid Elementary",
    "Sala Hall",
    "Marinig Evacuation Center",
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

export default function DistributionLogs() {
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [search, setSearch] = useState("");
    const [centerFilter, setCenterFilter] = useState("All Centers");
    const [toastMessage, setToastMessage] = useState(null);
    const [isDistributeOpen, setIsDistributeOpen] = useState(false);

    const [distributeData, setDistributeData] = useState({
        itemId: "",
        quantity: 1,
        center: CENTERS[0],
    });

    const filtered = logs.filter((l) => {
        const matchSearch =
            l.item.toLowerCase().includes(search.toLowerCase()) ||
            l.id.toLowerCase().includes(search.toLowerCase());
        const matchCenter =
            centerFilter === "All Centers" || l.center === centerFilter;
        return matchSearch && matchCenter;
    });

    const handleDistributeSubmit = (e) => {
        e.preventDefault();
        const selectedItem = INVENTORY_ITEMS.find(
            (i) => i.id === parseInt(distributeData.itemId),
        );
        if (!selectedItem) return;

        if (distributeData.quantity > selectedItem.current) {
            alert("Insufficient stock available.");
            return;
        }

        const newId = "DL-" + (logs.length + 1001);
        const newLog = {
            id: newId,
            date: new Date().toISOString().replace("T", " ").substring(0, 16),
            item: selectedItem.name,
            qty: parseInt(distributeData.quantity),
            center: distributeData.center,
            authorizedBy: "Admin User",
            status: "Completed",
        };

        setLogs([newLog, ...logs]);
        setIsDistributeOpen(false);
        setDistributeData({ itemId: "", quantity: 1, center: CENTERS[0] });
        setToastMessage(
            `Successfully recorded distribution of ${distributeData.quantity} ${selectedItem.unit} to ${distributeData.center}.`,
        );
    };

    return (
        <Layout
            currentPage="Distribution Logs"
            title="Distribution History"
            subtitle="Track and verify the deployment of relief goods to evacuation centers."
        >
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}

            {isDistributeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-gray-700">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Record Distribution
                            </h2>
                            <button
                                onClick={() => setIsDistributeOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleDistributeSubmit} className="p-6">
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Destination Center
                                    </label>
                                    <select
                                        required
                                        value={distributeData.center}
                                        onChange={(e) =>
                                            setDistributeData({
                                                ...distributeData,
                                                center: e.target.value,
                                            })
                                        }
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                                    >
                                        {CENTERS.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Select Item
                                    </label>
                                    <select
                                        required
                                        value={distributeData.itemId}
                                        onChange={(e) =>
                                            setDistributeData({
                                                ...distributeData,
                                                itemId: e.target.value,
                                            })
                                        }
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                                    >
                                        <option value="" disabled>
                                            -- Choose an item --
                                        </option>
                                        {INVENTORY_ITEMS.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name} (Available:{" "}
                                                {item.current} {item.unit})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Quantity to Distribute
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={distributeData.quantity}
                                        onChange={(e) =>
                                            setDistributeData({
                                                ...distributeData,
                                                quantity: e.target.value,
                                            })
                                        }
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsDistributeOpen(false)}
                                    className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white border border-transparent dark:bg-red-600 dark:hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:opacity-90 active:scale-[0.98]"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #0d9488, #0f766e)",
                                    }}
                                >
                                    <Send size={15} /> Confirm Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors flex flex-col min-h-[calc(100vh-140px)]">
                <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 gap-4 transition-colors">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                size={15}
                            />
                            <input
                                type="text"
                                placeholder="Search by item or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full sm:w-auto transition-colors shadow-sm">
                            <Filter
                                size={14}
                                className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                            />
                            <select
                                value={centerFilter}
                                onChange={(e) =>
                                    setCenterFilter(e.target.value)
                                }
                                className="text-sm font-medium text-gray-600 dark:text-gray-300 focus:outline-none bg-transparent w-full cursor-pointer"
                            >
                                <option className="dark:bg-gray-800">
                                    All Centers
                                </option>
                                {CENTERS.map((c) => (
                                    <option
                                        key={c}
                                        className="dark:bg-gray-800"
                                    >
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsDistributeOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] w-full sm:w-auto transition-all shadow-sm"
                        style={{
                            background:
                                "linear-gradient(90deg, #3b82f6, #2563eb)",
                        }}
                    >
                        <Send size={15} /> New Record
                    </button>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left transition-colors border-b border-gray-100 dark:border-gray-700">
                                {[
                                    "Log ID",
                                    "Date & Time",
                                    "Item Name",
                                    "Quantity",
                                    "Destination Center",
                                    "Authorized By",
                                    "Status",
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
                                        colSpan="7"
                                        className="px-5 py-16 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No logs found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 font-mono text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            {log.id}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                            {log.date}
                                        </td>
                                        <td className="px-5 py-4 font-bold text-gray-800 dark:text-gray-100">
                                            {log.item}
                                        </td>
                                        <td className="px-5 py-4 font-black text-blue-600 dark:text-blue-400">
                                            {log.qty}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                            {log.center}
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">
                                            {log.authorizedBy}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/20">
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
