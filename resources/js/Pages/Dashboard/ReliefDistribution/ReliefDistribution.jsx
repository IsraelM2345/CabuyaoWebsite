import { useState, useEffect } from "react";
import { Layout } from "../../../Components/Sidebar";
import {
    Search,
    Download,
    Plus,
    Package,
    TrendingDown,
    TrendingUp,
    Pencil,
    Trash2,
    X,
    CheckCircle2,
} from "lucide-react";

// Added IDs to the initial data for proper CRUD operations
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
    {
        id: 6,
        name: "First Aid Kits",
        category: "Medical",
        current: 80,
        distributed: 120,
        unit: "kits",
        status: "Low Stock",
    },
    {
        id: 7,
        name: "Blankets",
        category: "Non-Food",
        current: 200,
        distributed: 550,
        unit: "pieces",
        status: "Sufficient",
    },
    {
        id: 8,
        name: "Instant Noodles",
        category: "Food",
        current: 2506,
        distributed: 4000,
        unit: "packs",
        status: "Sufficient",
    },
];

const CATEGORIES = ["Food", "Water", "Non-Food", "Medical"];
const STATUSES = ["Sufficient", "Low Stock"];

const STATUS_STYLE = {
    "Low Stock": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    Sufficient:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
};

const CATEGORY_STYLE = {
    Food: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    Water: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    "Non-Food": "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    Medical: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
};

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

export default function ReliefDistribution() {
    // Data & UI States
    const [inventory, setInventory] = useState(INITIAL_INVENTORY);
    const [search, setSearch] = useState("");
    const [toastMessage, setToastMessage] = useState(null);

    // CRUD Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Distribute Modal States
    const [isDistributeOpen, setIsDistributeOpen] = useState(false);

    // Forms
    const defaultForm = {
        name: "",
        category: "Food",
        current: 0,
        distributed: 0,
        unit: "pieces",
        status: "Sufficient",
    };
    const [formData, setFormData] = useState(defaultForm);
    const [distributeData, setDistributeData] = useState({
        itemId: "",
        quantity: 1,
    });

    const filtered = inventory.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()),
    );

    // Computed Stats
    const totalItems = inventory.length;
    const totalStock = inventory.reduce((a, b) => a + Number(b.current), 0);
    const totalDistributed = inventory.reduce(
        (a, b) => a + Number(b.distributed),
        0,
    );

    // Handlers: CRUD
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

        // Auto-calculate status based on stock if you want, or just accept user input
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
            setToastMessage("New stock received and recorded.");
        }
        handleCloseModal();
    };

    const handleDelete = (idToRemove) => {
        if (
            window.confirm(
                "Are you sure you want to delete this item from inventory?",
            )
        ) {
            setInventory(inventory.filter((i) => i.id !== idToRemove));
            setToastMessage("Item deleted successfully.");
        }
    };

    // Handlers: Distribute
    const handleDistributeSubmit = (e) => {
        e.preventDefault();
        const itemToUpdate = inventory.find(
            (i) => i.id === parseInt(distributeData.itemId),
        );
        if (!itemToUpdate) return;

        const qtyToDeduct = parseInt(distributeData.quantity);
        if (itemToUpdate.current < qtyToDeduct) {
            alert("Not enough stock available to distribute!");
            return;
        }

        setInventory(
            inventory.map((i) => {
                if (i.id === itemToUpdate.id) {
                    const newCurrent = i.current - qtyToDeduct;
                    return {
                        ...i,
                        current: newCurrent,
                        distributed: i.distributed + qtyToDeduct,
                        status: newCurrent < 200 ? "Low Stock" : "Sufficient",
                    };
                }
                return i;
            }),
        );

        setIsDistributeOpen(false);
        setDistributeData({ itemId: "", quantity: 1 });
        setToastMessage(
            `Successfully distributed ${qtyToDeduct} ${itemToUpdate.unit} of ${itemToUpdate.name}.`,
        );
    };

    return (
        <Layout
            currentPage="Relief Distribution"
            title="Relief Distribution"
            subtitle="Monitor inventory and distribution of relief goods."
        >
            {/* Notification Toast */}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}

            {/* Distribute Goods Modal */}
            {isDistributeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Distribute Relief Goods
                            </h2>
                            <button
                                onClick={() => setIsDistributeOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleDistributeSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
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
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    >
                                        <option value="" disabled>
                                            -- Choose an item --
                                        </option>
                                        {inventory
                                            .filter((i) => i.current > 0)
                                            .map((item) => (
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
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
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
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-6 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDistributeOpen(false)}
                                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-teal-500 hover:bg-teal-600 text-white transition-colors"
                                >
                                    Confirm Distribution
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add / Edit Inventory Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingId
                                    ? "Edit Inventory Item"
                                    : "Receive New Stock"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Item Name
                                    </label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 transition-all"
                                        placeholder="e.g. Blankets, Bottled Water"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 transition-all"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Unit of Measurement
                                    </label>
                                    <input
                                        required
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 transition-all"
                                        placeholder="e.g. sacks, pieces, boxes"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Current Stock Available
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        name="current"
                                        value={formData.current}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                        Already Distributed
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        name="distributed"
                                        value={formData.distributed}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 transition-all"
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
                                    {editingId ? "Update Item" : "Add Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mb-5">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-teal-600 text-teal-600 dark:border-teal-500 dark:text-teal-400 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
                >
                    <Download size={15} />
                    Receive Stock
                </button>
                <button
                    onClick={() => setIsDistributeOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
                    style={{
                        background: "linear-gradient(90deg, #0d9488, #0f766e)",
                    }}
                >
                    <Plus size={15} />
                    Distribute
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/30 transition-colors">
                        <Package
                            size={20}
                            className="text-teal-600 dark:text-teal-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">
                            Total Items Tracked
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                            {totalItems}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/30 transition-colors">
                        <TrendingDown
                            size={20}
                            className="text-green-600 dark:text-green-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">
                            Total Stock Available
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                            {totalStock.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 transition-colors">
                        <TrendingUp
                            size={20}
                            className="text-purple-600 dark:text-purple-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">
                            Total Distributed
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                            {totalDistributed.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="relative max-w-sm">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            size={15}
                        />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-left transition-colors">
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
                                        No inventory items found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-5 py-4 font-medium text-gray-800 dark:text-gray-100 transition-colors">
                                            {item.name}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${CATEGORY_STYLE[item.category]}`}
                                            >
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                                            {item.current.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 transition-colors">
                                            {item.distributed.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 transition-colors">
                                            {item.unit}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${STATUS_STYLE[item.status]}`}
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
                                                    className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
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
            </div>
        </Layout>
    );
}
