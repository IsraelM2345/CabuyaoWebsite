import { useState, useEffect } from "react";
import { Layout } from "../../../Components/Sidebar";
import {
    Search,
    Filter,
    Pencil,
    Trash2,
    UserPlus,
    X,
    CheckCircle2,
} from "lucide-react";

// Colors for the badges
const VULNERABLE_COLORS = {
    "Senior Citizen":
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Children:
        "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    Pregnant:
        "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    PWD: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

// Initial static data
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

// Helper: Toast Notification Component
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

export default function EvacueeProfiles() {
    // 1. Data States
    const [evacuees, setEvacuees] = useState(INITIAL_EVACUEES);
    const [search, setSearch] = useState("");
    const [barangay, setBarangay] = useState("All Barangays");

    // 2. UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [editingId, setEditingId] = useState(null); // Tracks if we are editing

    // 3. Form State
    const defaultForm = {
        head: "",
        contact: "",
        members: 1,
        barangay: "Banlic",
        center: "Banlic Covered Court",
        vulnerable: [],
    };
    const [formData, setFormData] = useState(defaultForm);

    // Filtering Logic
    const filtered = evacuees.filter((e) => {
        const matchSearch =
            e.head.toLowerCase().includes(search.toLowerCase()) ||
            e.id.toLowerCase().includes(search.toLowerCase());
        const matchBrgy =
            barangay === "All Barangays" || e.barangay === barangay;
        return matchSearch && matchBrgy;
    });

    // Form Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (value) => {
        setFormData((prev) => {
            const current = prev.vulnerable;
            if (current.includes(value)) {
                return {
                    ...prev,
                    vulnerable: current.filter((item) => item !== value),
                };
            } else {
                return { ...prev, vulnerable: [...current, value] };
            }
        });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(defaultForm); // Reset form when closing
    };

    const handleEdit = (evacuee) => {
        // Populate the form with the selected evacuee's data
        setFormData({
            head: evacuee.head,
            contact: evacuee.contact || "", // Fallback if missing
            members: evacuee.members,
            barangay: evacuee.barangay,
            center: evacuee.center,
            vulnerable: evacuee.vulnerable || [],
        });
        setEditingId(evacuee.id); // Set the ID so we know we are updating
        setIsModalOpen(true);
    };

    // Action Handlers
    const handleSubmitProfile = (e) => {
        e.preventDefault();

        if (editingId) {
            // EDIT EXISTING RECORD
            setEvacuees(
                evacuees.map((ev) =>
                    ev.id === editingId
                        ? {
                              ...ev,
                              head: formData.head,
                              contact: formData.contact,
                              members: parseInt(formData.members),
                              barangay: formData.barangay,
                              center: formData.center,
                              vulnerable: formData.vulnerable,
                          }
                        : ev,
                ),
            );
            setToastMessage("Evacuee profile successfully updated.");
        } else {
            // ADD NEW RECORD
            // Find the highest number in existing IDs to generate the next one accurately
            const nextNum =
                evacuees.length > 0
                    ? Math.max(
                          ...evacuees.map((e) =>
                              parseInt(e.id.replace("E", "")),
                          ),
                      ) + 1
                    : 1;
            const newId = "E" + String(nextNum).padStart(3, "0");

            const newRecord = {
                id: newId,
                head: formData.head,
                contact: formData.contact,
                members: parseInt(formData.members),
                barangay: formData.barangay,
                center: formData.center,
                vulnerable: formData.vulnerable,
            };

            setEvacuees([newRecord, ...evacuees]); // Add to top of list
            setToastMessage("Evacuee profile successfully registered.");
        }

        handleCloseModal(); // Close modal & reset states
    };

    const handleDelete = (idToRemove) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            setEvacuees(evacuees.filter((e) => e.id !== idToRemove));
            setToastMessage("Record deleted successfully.");
        }
    };

    return (
        <Layout
            currentPage="Evacuee Profiles"
            title="Evacuee Profiling"
            subtitle="Manage household registrations and evacuee records."
        >
            {/* Notification Toast */}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}

            {/* Add / Edit Modal overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingId
                                    ? "Edit Evacuee Profile"
                                    : "Add New Evacuee Profile"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitProfile} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Head of Family
                                    </label>
                                    <input
                                        required
                                        name="head"
                                        value={formData.head}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        placeholder="e.g. Dela Cruz, Juan"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Contact Number
                                    </label>
                                    <input
                                        required
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        placeholder="09XXXXXXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Family Size
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        name="members"
                                        value={formData.members}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Barangay
                                    </label>
                                    <select
                                        name="barangay"
                                        value={formData.barangay}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    >
                                        {BARANGAYS_FILTER.filter(
                                            (b) => b !== "All Barangays",
                                        ).map((b) => (
                                            <option key={b} value={b}>
                                                {b}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                    Assigned Center
                                </label>
                                <input
                                    required
                                    name="center"
                                    value={formData.center}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                />
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
                                    Vulnerable Members
                                </label>
                                <div className="flex flex-wrap gap-5">
                                    {[
                                        {
                                            id: "Senior Citizen",
                                            label: "Elderly",
                                        },
                                        { id: "Children", label: "Children" },
                                        { id: "Pregnant", label: "Pregnant" },
                                        { id: "PWD", label: "PWD" },
                                    ].map((vuln) => (
                                        <label
                                            key={vuln.id}
                                            className="flex items-center gap-2 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.vulnerable.includes(
                                                    vuln.id,
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        vuln.id,
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                {vuln.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white transition-colors"
                                >
                                    {editingId
                                        ? "Update Profile"
                                        : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
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

                    {/* BUTTON TO OPEN MODAL FOR NEW RECORD */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] w-full sm:w-auto transition-all shadow-sm"
                        style={{
                            background:
                                "linear-gradient(90deg, #0d9488, #0f766e)",
                        }}
                    >
                        <UserPlus size={15} />
                        Register Household
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
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
                                        className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
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
                                        className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No evacuee profiles found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((e) => (
                                    <tr
                                        key={e.id}
                                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-5 py-3 font-mono text-xs text-gray-500 dark:text-gray-400 font-medium">
                                            {e.id}
                                        </td>
                                        <td className="px-5 py-3 font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                                            {e.head}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300 text-center transition-colors">
                                            {e.members}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300 transition-colors">
                                            {e.barangay}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300 transition-colors">
                                            {e.center}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {e.vulnerable.length === 0 ? (
                                                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                                                        None
                                                    </span>
                                                ) : (
                                                    e.vulnerable.map((v) => (
                                                        <span
                                                            key={v}
                                                            className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${VULNERABLE_COLORS[v] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                                                        >
                                                            {v}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1.5">
                                                {/* EDIT TRIGGER BUTTON */}
                                                <button
                                                    onClick={() =>
                                                        handleEdit(e)
                                                    }
                                                    className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                {/* DELETE TRIGGER BUTTON */}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(e.id)
                                                    }
                                                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={14} />
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
                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    <span>
                        Showing {filtered.length} of {evacuees.length} entries
                    </span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Previous
                        </button>
                        <button className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
