import { useState, useEffect } from "react";
import { Layout } from "../../../Components/Sidebar";
import { Link } from "@inertiajs/react";
import {
    Search,
    Filter,
    Pencil,
    Trash2,
    UserPlus,
    X,
    CheckCircle2,
} from "lucide-react";

const VULNERABLE_COLORS = {
    "Senior Citizen":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Children:
        "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    Pregnant:
        "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    PWD: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const INITIAL_EVACUEES = [
    {
        id: "E001",
        head: "Garcia, Roberto",
        contact: "09123456789",
        members: 5,
        barangay: "Mamatid",
        center: "Mamatid Elementary",
        vulnerable: ["Senior Citizen", "Children"],
    },
    {
        id: "E002",
        head: "Bautista, Loida",
        contact: "09987654321",
        members: 3,
        barangay: "Mamatid",
        center: "Mamatid Elementary",
        vulnerable: ["Pregnant"],
    },
];

const BARANGAYS_FILTER = [
    "All Barangays",
    "Mamatid",
    "Sala",
    "Marinig",
    "Banay-Banay",
    "Gulod",
    "Casile",
    "Banlic",
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

export default function EvacueeProfilesIndex() {
    const [evacuees, setEvacuees] = useState(INITIAL_EVACUEES);
    const [search, setSearch] = useState("");
    const [barangay, setBarangay] = useState("All Barangays");
    const [toastMessage, setToastMessage] = useState(null);

    const filtered = evacuees.filter((e) => {
        const matchSearch =
            e.head.toLowerCase().includes(search.toLowerCase()) ||
            e.id.toLowerCase().includes(search.toLowerCase());
        const matchBrgy =
            barangay === "All Barangays" || e.barangay === barangay;
        return matchSearch && matchBrgy;
    });

    const handleDelete = (idToRemove) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            setEvacuees(evacuees.filter((e) => e.id !== idToRemove));
            setToastMessage("Record deleted successfully.");
        }
    };

    return (
        <Layout
            currentPage="Masterlist"
            title="Evacuee Profiling"
            subtitle="Manage household registrations and evacuee records."
        >
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors flex flex-col min-h-[calc(100vh-140px)]">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 gap-4 transition-colors">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                size={15}
                            />
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-60 pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full sm:w-auto transition-colors">
                            <Filter
                                size={14}
                                className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                            />
                            <select
                                value={barangay}
                                onChange={(e) => setBarangay(e.target.value)}
                                className="text-sm text-gray-600 dark:text-gray-300 focus:outline-none bg-transparent w-full cursor-pointer"
                            >
                                {BARANGAYS_FILTER.map((b) => (
                                    <option
                                        key={b}
                                        className="dark:bg-gray-800"
                                    >
                                        {b}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Link
                        href="/evacuee-profiles/add"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] w-full sm:w-auto transition-all shadow-sm"
                        style={{
                            background:
                                "linear-gradient(90deg, #0d9488, #0f766e)",
                        }}
                    >
                        <UserPlus size={15} />
                        Register Household
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left transition-colors">
                                {[
                                    "ID",
                                    "Head of Family",
                                    "Members",
                                    "Barangay",
                                    "Evacuation Center",
                                    "Vulnerable Groups",
                                    "Actions",
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
                                        <div className="flex flex-col items-center gap-2">
                                            <Search
                                                size={32}
                                                className="text-gray-300 dark:text-gray-600"
                                            />
                                            <p>No evacuee profiles found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((e) => (
                                    <tr
                                        key={e.id}
                                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 font-mono text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            {e.id}
                                        </td>
                                        <td className="px-5 py-4 font-bold text-gray-800 dark:text-gray-100 transition-colors">
                                            {e.head}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 text-center transition-colors font-medium">
                                            {e.members}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 transition-colors">
                                            {e.barangay}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 transition-colors">
                                            {e.center}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {e.vulnerable.length === 0 ? (
                                                    <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                                                        None
                                                    </span>
                                                ) : (
                                                    e.vulnerable.map((v) => (
                                                        <span
                                                            key={v}
                                                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-colors ${VULNERABLE_COLORS[v] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                                        >
                                                            {v}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Link
                                                    href={`/evacuee-profiles/add?id=${e.id}`}
                                                    className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    title="Edit Profile"
                                                >
                                                    <Pencil size={15} />
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(e.id)
                                                    }
                                                    className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title="Delete Profile"
                                                >
                                                    <Trash2 size={15} />
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
                        Showing {filtered.length} of {evacuees.length} entries
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
