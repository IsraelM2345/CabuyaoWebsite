import { useState, useEffect } from "react";
import { Layout } from "../../../Components/Sidebar";
import {
    Search,
    Plus,
    MapPin,
    Users,
    Pencil,
    Trash2,
    X,
    CheckCircle2,
} from "lucide-react";

const STATUS_STYLES = {
    Active: {
        badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        dot: "bg-green-500",
        bar: "#0d9488",
    },
    Critical: {
        badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        dot: "bg-red-500",
        bar: "#ef4444",
    },
    Standby: {
        badge: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
        dot: "bg-gray-400",
        bar: "#9ca3af",
    },
};

// Added IDs to initial data for CRUD tracking
const INITIAL_SHELTERS = [
    {
        id: 1,
        name: "Cabuyao City Hall",
        brgy: "Brgy. Sala",
        status: "Active",
        occupancy: 342,
        capacity: 500,
        manager: "Jose Dela Cruz",
    },
    {
        id: 2,
        name: "Mamatid Elementary",
        brgy: "Brgy. Mamatid",
        status: "Critical",
        occupancy: 750,
        capacity: 800,
        manager: "Maria Santos",
    },
    {
        id: 3,
        name: "Marinig Covered Court",
        brgy: "Brgy. Marinig",
        status: "Active",
        occupancy: 120,
        capacity: 300,
        manager: "Pedro Reyes",
    },
    {
        id: 4,
        name: "Bigaa Multi-purpose",
        brgy: "Brgy. Bigaa",
        status: "Standby",
        occupancy: 0,
        capacity: 600,
        manager: "Elena Gomez",
    },
];

const BARANGAYS = [
    "Brgy. Sala",
    "Brgy. Mamatid",
    "Brgy. Marinig",
    "Brgy. Bigaa",
    "Brgy. Banay-Banay",
    "Brgy. Gulod",
    "Brgy. Pulo",
    "Brgy. Casile",
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

// Updated ShelterCard to accept onEdit and onDelete props
function ShelterCard({ shelter, onEdit, onDelete }) {
    // Prevent division by zero if capacity is 0
    const pct = Math.round((shelter.occupancy / (shelter.capacity || 1)) * 100);
    const style = STATUS_STYLES[shelter.status] || STATUS_STYLES["Standby"];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base leading-tight transition-colors">
                        {shelter.name}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1 transition-colors">
                        <MapPin size={11} />
                        {shelter.brgy}
                    </p>
                </div>
                <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${style.badge}`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {shelter.status}
                </span>
            </div>

            {/* Occupancy */}
            <div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5 transition-colors">
                    <span className="flex items-center gap-1">
                        <Users size={11} /> Occupancy
                    </span>
                    <span className="font-medium text-gray-700 dark:text-gray-200 transition-colors">
                        {shelter.occupancy} / {shelter.capacity}
                    </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 transition-colors overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: style.bar,
                        }}
                    />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right transition-colors">
                    {pct}% Full
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-50 dark:border-gray-700 transition-colors">
                <div className="flex flex-col">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 transition-colors">
                        Manager
                    </p>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors truncate max-w-[100px]">
                        {shelter.manager}
                    </p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => onEdit(shelter)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit Shelter"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={() => onDelete(shelter.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete Shelter"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EvacuationShelters() {
    // 1. Data States
    const [shelters, setShelters] = useState(INITIAL_SHELTERS);
    const [search, setSearch] = useState("");

    // 2. UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // 3. Form State
    const defaultForm = {
        name: "",
        brgy: "Brgy. Sala",
        status: "Active",
        occupancy: 0,
        capacity: 100,
        manager: "",
    };
    const [formData, setFormData] = useState(defaultForm);

    // Filtering
    const filtered = shelters.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.brgy.toLowerCase().includes(search.toLowerCase()),
    );

    // Form Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(defaultForm);
    };

    const handleEdit = (shelter) => {
        setFormData({
            name: shelter.name,
            brgy: shelter.brgy,
            status: shelter.status,
            occupancy: shelter.occupancy,
            capacity: shelter.capacity,
            manager: shelter.manager,
        });
        setEditingId(shelter.id);
        setIsModalOpen(true);
    };

    // Action Handlers
    const handleSubmit = (e) => {
        e.preventDefault();

        // Auto-correct status based on occupancy logic if user enters mismatched data
        const pct = (formData.occupancy / formData.capacity) * 100;
        let finalStatus = formData.status;
        if (formData.occupancy === 0 && finalStatus !== "Standby")
            finalStatus = "Standby";
        if (pct >= 90 && finalStatus === "Active") finalStatus = "Critical";

        if (editingId) {
            // EDIT EXISTING
            setShelters(
                shelters.map((s) =>
                    s.id === editingId
                        ? {
                              ...s,
                              name: formData.name,
                              brgy: formData.brgy,
                              status: finalStatus,
                              occupancy: parseInt(formData.occupancy),
                              capacity: parseInt(formData.capacity),
                              manager: formData.manager,
                          }
                        : s,
                ),
            );
            setToastMessage("Shelter successfully updated.");
        } else {
            // ADD NEW
            const newId =
                shelters.length > 0
                    ? Math.max(...shelters.map((s) => s.id)) + 1
                    : 1;
            const newRecord = {
                id: newId,
                name: formData.name,
                brgy: formData.brgy,
                status: finalStatus,
                occupancy: parseInt(formData.occupancy),
                capacity: parseInt(formData.capacity),
                manager: formData.manager,
            };
            setShelters([newRecord, ...shelters]);
            setToastMessage("New shelter successfully registered.");
        }

        handleCloseModal();
    };

    const handleDelete = (idToRemove) => {
        if (window.confirm("Are you sure you want to remove this shelter?")) {
            setShelters(shelters.filter((s) => s.id !== idToRemove));
            setToastMessage("Shelter removed successfully.");
        }
    };

    return (
        <Layout
            currentPage="Evacuation Shelters"
            title="Evacuation Shelters"
            subtitle="Monitor capacity and status of all evacuation centers."
        >
            {/* Notification Toast */}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingId
                                    ? "Edit Evacuation Shelter"
                                    : "Register New Shelter"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Shelter Name
                                    </label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        placeholder="e.g. Cabuyao Central School"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Barangay Location
                                    </label>
                                    <select
                                        name="brgy"
                                        value={formData.brgy}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    >
                                        {BARANGAYS.map((b) => (
                                            <option key={b} value={b}>
                                                {b}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Operating Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Critical">
                                            Critical
                                        </option>
                                        <option value="Standby">Standby</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Maximum Capacity (Persons)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Current Occupancy
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        name="occupancy"
                                        value={formData.occupancy}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Assigned Manager / Point of Contact
                                    </label>
                                    <input
                                        required
                                        name="manager"
                                        value={formData.manager}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        placeholder="Enter name..."
                                    />
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
                                    {editingId ? "Save Changes" : "Add Shelter"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        size={15}
                    />
                    <input
                        type="text"
                        placeholder="Search shelters..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition w-64 shadow-sm"
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition hover:opacity-90 active:scale-[0.98] shadow-sm"
                    style={{
                        background: "linear-gradient(90deg, #0d9488, #0f766e)",
                    }}
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Add Shelter</span>
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {filtered.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        No shelters found matching your search.
                    </div>
                ) : (
                    filtered.map((s) => (
                        <ShelterCard
                            key={s.id}
                            shelter={s}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </Layout>
    );
}
