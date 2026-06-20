import { useState } from "react";
import { Layout } from "../../../Components/Sidebar";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";
import { Building2, Users, AlertTriangle, ArrowUpRight } from "lucide-react";

// Mock Data (Shared domain data)
const INITIAL_SHELTERS = [
    {
        id: 1,
        name: "Cabuyao City Hall",
        brgy: "Brgy. Sala",
        occupancy: 342,
        capacity: 500,
    },
    {
        id: 2,
        name: "Mamatid Elementary",
        brgy: "Brgy. Mamatid",
        occupancy: 750,
        capacity: 800,
    },
    {
        id: 3,
        name: "Marinig Covered Court",
        brgy: "Brgy. Marinig",
        occupancy: 120,
        capacity: 300,
    },
    {
        id: 4,
        name: "Bigaa Multi-purpose",
        brgy: "Brgy. Bigaa",
        occupancy: 0,
        capacity: 600,
    },
    {
        id: 5,
        name: "Banay-Banay Hall",
        brgy: "Brgy. Banay-Banay",
        occupancy: 420,
        capacity: 450,
    },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl shadow-lg">
                <p className="text-xs font-bold text-gray-900 dark:text-white mb-2">
                    {label}
                </p>
                <div className="space-y-1.5">
                    {payload.map((entry, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-[11px]"
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-gray-600 dark:text-gray-300 font-medium">
                                {entry.name}:{" "}
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {entry.value}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function CapacityTracking() {
    const [shelters] = useState(INITIAL_SHELTERS);

    // Compute aggregate metrics
    const totalCapacity = shelters.reduce(
        (acc, curr) => acc + curr.capacity,
        0,
    );
    const totalOccupancy = shelters.reduce(
        (acc, curr) => acc + curr.occupancy,
        0,
    );
    const availableSlots = totalCapacity - totalOccupancy;
    const overallPercentage = Math.round(
        (totalOccupancy / totalCapacity) * 100,
    );

    // Identify critical shelters (>= 90% full)
    const criticalShelters = shelters.filter(
        (s) => s.occupancy / s.capacity >= 0.9,
    );

    return (
        <Layout
            currentPage="Capacity Tracking"
            title="Capacity Analytics"
            subtitle="Monitor real-time occupancy limits across all designated safe zones."
        >
            {/* Top Aggregate Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 size={16} className="text-blue-500" />
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total Capacity
                        </p>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                        {totalCapacity.toLocaleString()}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-amber-500" />
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Current Occupancy
                        </p>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                        {totalOccupancy.toLocaleString()}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <ArrowUpRight size={16} className="text-green-500" />
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Available Slots
                        </p>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                        {availableSlots.toLocaleString()}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl p-5 shadow-sm text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-teal-100 uppercase tracking-wider mb-2">
                            Citywide Status
                        </p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-black">
                                {overallPercentage}%
                            </p>
                            <p className="text-sm font-medium text-teal-100">
                                Full
                            </p>
                        </div>
                    </div>
                    {/* Decorative background element */}
                    <div className="absolute -right-6 -bottom-6 opacity-20">
                        <Users size={100} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                        Occupancy vs. Capacity Comparison
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={shelters}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="currentColor"
                                    className="text-gray-100 dark:text-gray-700"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fontSize: 10,
                                        fill: "currentColor",
                                    }}
                                    className="text-gray-500 dark:text-gray-400"
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{
                                        fontSize: 11,
                                        fill: "currentColor",
                                    }}
                                    className="text-gray-500 dark:text-gray-400"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{
                                        fill: "currentColor",
                                        opacity: 0.04,
                                    }}
                                />
                                <Bar
                                    dataKey="occupancy"
                                    name="Current Occupancy"
                                    radius={[4, 4, 0, 0]}
                                >
                                    {shelters.map((entry, index) => {
                                        const pct =
                                            entry.occupancy / entry.capacity;
                                        // Color logic: Red if >= 90%, Teal otherwise
                                        const color =
                                            pct >= 0.9 ? "#ef4444" : "#0d9488";
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={color}
                                            />
                                        );
                                    })}
                                </Bar>
                                <Bar
                                    dataKey="capacity"
                                    name="Max Capacity"
                                    fill="#e5e7eb"
                                    className="dark:fill-gray-700"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Critical Alerts Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors flex flex-col">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-red-50/50 dark:bg-red-900/10 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-500" />
                        <h3 className="font-bold text-sm text-red-700 dark:text-red-400 uppercase tracking-wider">
                            Critical Bottlenecks
                        </h3>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto">
                        {criticalShelters.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-8">
                                <CheckCircle2
                                    size={32}
                                    className="text-teal-200 dark:text-teal-900 mb-3"
                                />
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    All shelters are operating
                                    <br />
                                    at safe capacity levels.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {criticalShelters.map((shelter) => {
                                    const pct = Math.round(
                                        (shelter.occupancy / shelter.capacity) *
                                            100,
                                    );
                                    return (
                                        <div
                                            key={shelter.id}
                                            className="p-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-white dark:bg-gray-800 shadow-sm transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                                                        {shelter.name}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
                                                        {shelter.brgy}
                                                    </p>
                                                </div>
                                                <span className="px-2 py-1 rounded text-[10px] font-black bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                    {pct}% FULL
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-3 mb-1">
                                                <div
                                                    className="bg-red-500 h-1.5 rounded-full"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-right mt-1.5">
                                                {shelter.capacity -
                                                    shelter.occupancy}{" "}
                                                slots remaining
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                            Shelters reaching 90% capacity are flagged as
                            critical. Consider redirecting incoming evacuees to
                            Standby centers.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
