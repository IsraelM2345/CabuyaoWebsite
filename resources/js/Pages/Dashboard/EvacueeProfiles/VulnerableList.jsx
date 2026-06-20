import { useState } from "react";
import { Layout } from "../../../Components/Sidebar";
import { Link } from "@inertiajs/react";
import { Search, Filter, Pencil, UserPlus, HeartPulse } from "lucide-react";

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
    {
        id: "E003",
        head: "Reyes, Antonio",
        contact: "09221113333",
        members: 2,
        barangay: "Banlic",
        center: "Banlic Covered Court",
        vulnerable: ["PWD", "Senior Citizen"],
    },
    {
        id: "E004",
        head: "Cruz, Maria",
        contact: "09334445555",
        members: 4,
        barangay: "Sala",
        center: "Sala Hall",
        vulnerable: [],
    }, // Will be filtered out
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

export default function VulnerableList() {
    // Force filter to ONLY show evacuees with vulnerable members
    const [evacuees] = useState(
        INITIAL_EVACUEES.filter((e) => e.vulnerable && e.vulnerable.length > 0),
    );
    const [search, setSearch] = useState("");
    const [barangay, setBarangay] = useState("All Barangays");

    const filtered = evacuees.filter((e) => {
        const matchSearch =
            e.head.toLowerCase().includes(search.toLowerCase()) ||
            e.id.toLowerCase().includes(search.toLowerCase());
        const matchBrgy =
            barangay === "All Barangays" || e.barangay === barangay;
        return matchSearch && matchBrgy;
    });

    // Calculate dynamic stats
    const stats = {
        total: evacuees.length,
        seniors: evacuees.filter((e) => e.vulnerable.includes("Senior Citizen"))
            .length,
        children: evacuees.filter((e) => e.vulnerable.includes("Children"))
            .length,
        pwd: evacuees.filter((e) => e.vulnerable.includes("PWD")).length,
        pregnant: evacuees.filter((e) => e.vulnerable.includes("Pregnant"))
            .length,
    };

    return (
        <Layout
            currentPage="Vulnerable Groups"
            title="Vulnerable Populations"
            subtitle="Monitor and prioritize households with specific needs."
        >
            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center text-center">
                    <HeartPulse size={24} className="text-teal-500 mb-2" />
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {stats.total}
                    </p>
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                        Total Priority
                    </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-black text-blue-700 dark:text-blue-400">
                        {stats.seniors}
                    </p>
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider mt-1">
                        Seniors
                    </p>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-xl border border-cyan-100 dark:border-cyan-900/30 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-black text-cyan-700 dark:text-cyan-400">
                        {stats.children}
                    </p>
                    <p className="text-[10px] font-bold text-cyan-600 dark:text-cyan-500 uppercase tracking-wider mt-1">
                        Children
                    </p>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-900/30 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-black text-pink-700 dark:text-pink-400">
                        {stats.pregnant}
                    </p>
                    <p className="text-[10px] font-bold text-pink-600 dark:text-pink-500 uppercase tracking-wider mt-1">
                        Pregnant
                    </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-black text-purple-700 dark:text-purple-400">
                        {stats.pwd}
                    </p>
                    <p className="text-[10px] font-bold text-purple-600 dark:text-purple-500 uppercase tracking-wider mt-1">
                        PWD
                    </p>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors flex flex-col min-h-[500px]">
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
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] w-full sm:w-auto transition-all shadow-sm bg-gray-900 dark:bg-gray-700"
                    >
                        <UserPlus size={15} /> Add Priority Household
                    </Link>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left transition-colors">
                                {[
                                    "ID",
                                    "Head of Family",
                                    "Barangay",
                                    "Evacuation Center",
                                    "Identified Needs",
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
                                        colSpan="6"
                                        className="px-5 py-16 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No vulnerable records found.
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
                                        <td className="px-5 py-4 font-bold text-gray-800 dark:text-gray-100">
                                            {e.head}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                            {e.barangay}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                            {e.center}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {e.vulnerable.map((v) => (
                                                    <span
                                                        key={v}
                                                        className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-colors ${VULNERABLE_COLORS[v]}`}
                                                    >
                                                        {v}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/evacuee-profiles/add?id=${e.id}`}
                                                className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-block"
                                                title="Edit Profile"
                                            >
                                                <Pencil size={15} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
