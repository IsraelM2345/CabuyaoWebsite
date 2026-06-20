import { useState, useEffect } from "react";
import { Layout } from "../../../Components/Sidebar";
import {
    Search,
    Filter,
    Plus,
    Pencil,
    Trash2,
    X,
    CheckCircle2,
} from "lucide-react";

const INITIAL_INVENTORY = [
    {
        id: 1,
        name: "Rice (50kg Sack)",
        category: "Food",
        current: 150,
        distributed: 350,
        unit: "sacks",
        status: "Low Stock",
    },
    {
        id: 2,
        name: "Canned Goods Assorted",
        category: "Food",
        current: 1200,
        distributed: 2600,
        unit: "pieces",
        status: "Sufficient",
    },
    {
        id: 3,
        name: "Bottled Water (1L)",
        category: "Water",
        current: 800,
        distributed: 1500,
        unit: "bottles",
        status: "Sufficient",
    },
    {
        id: 4,
        name: "Hygiene Kits",
        category: "Non-Food",
        current: 300,
        distributed: 450,
        unit: "kits",
        status: "Sufficient",
    },
    {
        id: 5,
        name: "Sleeping Mats",
        category: "Non-Food",
        current: 150,
        distributed: 600,
        unit: "pieces",
        status: "Low Stock",
    },
];

const CATEGORIES = ["All Categories", "Food", "Water", "Non-Food", "Medical"];

const STATUS_STYLE = {
    "Low Stock": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    Sufficient:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
};

const CATEGORY_STYLE = {
    Food: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-800/50",
    Water: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50",
    "Non-Food":
        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600",
    Medical:
        "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 border border-pink-100 dark:border-pink-800/50",
};

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

export default function InventoryStock() {
    const [inventory, setInventory] = useState(INITIAL_INVENTORY);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [toastMessage, setToastMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const defaultForm = {
        name: "",
        category: "Food",
        current: 0,
        distributed: 0,
        unit: "pieces",
    };
    const [formData, setFormData] = useState(defaultForm);

    const filtered = inventory.filter((i) => {
        const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            categoryFilter === "All Categories" ||
            i.category === categoryFilter;
        return matchSearch && matchCategory;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData(defaultForm);
    };

    const handleEdit = (item) => {
        setFormData({ ...item });
        setEditingId(item.id);
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentCount = parseInt(formData.current);
        const finalStatus = currentCount < 200 ? "Low Stock" : "Sufficient";

        if (editingId) {
            setInventory(
                inventory.map((i) =>
                    i.id === editingId
                        ? {
                              ...formData,
                              current: currentCount,
                              distributed: parseInt(formData.distributed),
                              status: finalStatus,
                          }
                        : i,
                ),
            );
            setToastMessage("Inventory item updated.");
        } else {
            const newId =
                inventory.length > 0
                    ? Math.max(...inventory.map((i) => i.id)) + 1
                    : 1;
            setInventory([
                {
                    ...formData,
                    id: newId,
                    current: currentCount,
                    distributed: parseInt(formData.distributed),
                    status: finalStatus,
                },
                ...inventory,
            ]);
            setToastMessage("New stock successfully recorded.");
        }
        handleCloseModal();
    };

    const handleDelete = (idToRemove) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            setInventory(inventory.filter((i) => i.id !== idToRemove));
            setToastMessage("Item deleted successfully.");
        }
    };

    return (
        <Layout
            currentPage="Inventory Stock"
            title="Inventory Management"
            subtitle="Manage relief goods, update stock levels, and monitor availability."
        >
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-gray-700">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingId
                                    ? "Edit Inventory Item"
                                    : "Receive New Stock"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        Item Name
                                    </label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-gray-400"
                                        placeholder="e.g. Blankets, Bottled Water"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Category
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                                        >
                                            {CATEGORIES.filter(
                                                (c) => c !== "All Categories",
                                            ).map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Unit
                                        </label>
                                        <input
                                            required
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-gray-400"
                                            placeholder="e.g. sacks, boxes"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Current Stock
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            name="current"
                                            value={formData.current}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                            Already Distributed
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            name="distributed"
                                            value={formData.distributed}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsDistributeOpen(false)}
                                    className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white border border-transparent dark:bg-red-600 dark:hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:opacity-90 active:scale-[0.98]"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #0d9488, #0f766e)",
                                    }}
                                >
                                    {editingId ? "Update Item" : "Add Item"}
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
                                placeholder="Search inventory..."
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
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(e.target.value)
                                }
                                className="text-sm font-medium text-gray-600 dark:text-gray-300 focus:outline-none bg-transparent w-full cursor-pointer"
                            >
                                {CATEGORIES.map((c) => (
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
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] w-full sm:w-auto transition-all shadow-sm"
                        style={{
                            background:
                                "linear-gradient(90deg, #0d9488, #0f766e)",
                        }}
                    >
                        <Plus size={16} /> Receive Stock
                    </button>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left transition-colors border-b border-gray-100 dark:border-gray-700">
                                {[
                                    "Item Name",
                                    "Category",
                                    "Current Stock",
                                    "Distributed",
                                    "Unit",
                                    "Status",
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
                                        No inventory items found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 font-bold text-gray-800 dark:text-gray-100">
                                            {item.name}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${CATEGORY_STYLE[item.category]}`}
                                            >
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-black text-gray-900 dark:text-white">
                                            {item.current.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                            {item.distributed.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">
                                            {item.unit}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${STATUS_STYLE[item.status]}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                    className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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

                <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/20">
                    <span className="font-medium">
                        Showing {filtered.length} of {inventory.length} items
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
