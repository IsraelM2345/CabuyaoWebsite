import { Layout } from "../../../Components/Sidebar";
import { Link } from "@inertiajs/react";
import {
    Package,
    TrendingDown,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
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
    {
        id: 6,
        name: "First Aid Kits",
        category: "Medical",
        current: 80,
        distributed: 120,
        unit: "kits",
        status: "Low Stock",
    },
];

export default function ReliefOverview() {
    const totalItems = INITIAL_INVENTORY.length;
    const totalStock = INITIAL_INVENTORY.reduce(
        (a, b) => a + Number(b.current),
        0,
    );
    const totalDistributed = INITIAL_INVENTORY.reduce(
        (a, b) => a + Number(b.distributed),
        0,
    );
    const lowStockItems = INITIAL_INVENTORY.filter(
        (item) => item.status === "Low Stock",
    );

    return (
        <Layout
            currentPage="Relief Distribution"
            title="Relief Operations Overview"
            subtitle="High-level metrics and alerts for inventory and distributions."
        >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-colors">
                    <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/30 transition-colors">
                        <Package
                            size={24}
                            className="text-teal-600 dark:text-teal-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Total Items Tracked
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            {totalItems}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-colors">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 transition-colors">
                        <TrendingDown
                            size={24}
                            className="text-blue-600 dark:text-blue-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Current Stock
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            {totalStock.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-colors">
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 transition-colors">
                        <TrendingUp
                            size={24}
                            className="text-purple-600 dark:text-purple-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Total Distributed
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            {totalDistributed.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors flex flex-col">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-red-50/50 dark:bg-red-900/10">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertTriangle size={18} />
                            <h3 className="font-bold text-sm uppercase tracking-wider">
                                Low Stock Alerts
                            </h3>
                        </div>
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {lowStockItems.length} Items
                        </span>
                    </div>
                    <div className="p-2 flex-1">
                        {lowStockItems.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">
                                All inventory items are sufficiently stocked.
                            </p>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                {lowStockItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors rounded-lg"
                                    >
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {item.category}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-red-600 dark:text-red-400 font-bold">
                                                {item.current} {item.unit}
                                            </p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                                Remaining
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                        <Link
                            href="/relief-distribution/inventory"
                            className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors flex items-center justify-center gap-1.5 w-full"
                        >
                            Manage Inventory <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">
                        Quick Operations
                    </h3>
                    <div className="space-y-4">
                        <Link
                            href="/relief-distribution/inventory"
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-teal-300 dark:hover:border-teal-700 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                                        Receive New Stock
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        Add incoming donations or purchases to
                                        inventory.
                                    </p>
                                </div>
                            </div>
                            <ArrowRight
                                size={16}
                                className="text-gray-400 group-hover:text-teal-500 transition-colors"
                            />
                        </Link>

                        <Link
                            href="/relief-distribution/logs"
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                                        Distribute Relief Goods
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        Record distributions to evacuation
                                        centers.
                                    </p>
                                </div>
                            </div>
                            <ArrowRight
                                size={16}
                                className="text-gray-400 group-hover:text-blue-500 transition-colors"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
