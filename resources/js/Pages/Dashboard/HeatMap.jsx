import { useState } from "react";
import { Layout } from "../../Components/Sidebar";
import {
    Layers,
    Users,
    Building2,
    Package,
    Play,
    Pause,
    ExternalLink,
    TrendingUp,
    Clock,
    AlertTriangle,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    Download,
    Filter,
    MapPin,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

const MAP_ZONES = [
    {
        id: "z1",
        name: "Brgy. Mamatid",
        type: "Flood Prone Area",
        x: 65,
        y: 35,
        risk: "high",
        evacuees: 1245,
        trend: "+12%",
        activeCenters: 3,
        capacityMax: 4,
        capacityWarning: "85% Cap",
        reliefCoverage: "72%",
        reliefStatus: "Sufficient",
        chartData: [
            { val: 600 },
            { val: 750 },
            { val: 880 },
            { val: 1000 },
            { val: 1100 },
            { val: 1180 },
            { val: 1245 },
        ],
        alerts: [
            {
                level: "red",
                title: "Capacity warning",
                desc: "3 of 4 centers at 85%+ capacity.",
                time: "10 mins ago",
            },
            {
                level: "amber",
                title: "New arrivals surge",
                desc: "+12% increase in last 6 hours.",
                time: "1 hour ago",
            },
            {
                level: "teal",
                title: "Relief delivery en route",
                desc: "500 packs dispatched from hub.",
                time: "2 hours ago",
            },
        ],
    },
    {
        id: "z2",
        name: "Banlic Center Area",
        type: "Evacuation Hub",
        x: 42,
        y: 58,
        risk: "medium",
        evacuees: 850,
        trend: "+5%",
        activeCenters: 2,
        capacityMax: 2,
        capacityWarning: "95% Cap",
        reliefCoverage: "88%",
        reliefStatus: "Adequate",
        chartData: [
            { val: 400 },
            { val: 500 },
            { val: 600 },
            { val: 700 },
            { val: 780 },
            { val: 820 },
            { val: 850 },
        ],
        alerts: [
            {
                level: "red",
                title: "At full capacity",
                desc: "Both centers at 95%+.",
                time: "5 mins ago",
            },
            {
                level: "amber",
                title: "Overflow risk",
                desc: "Consider redirecting evacuees.",
                time: "30 mins ago",
            },
        ],
    },
    {
        id: "z3",
        name: "Brgy. Marinig",
        type: "Coastal Zone",
        x: 80,
        y: 22,
        risk: "high",
        evacuees: 2100,
        trend: "+25%",
        activeCenters: 4,
        capacityMax: 5,
        capacityWarning: "92% Cap",
        reliefCoverage: "65%",
        reliefStatus: "Low",
        chartData: [
            { val: 1000 },
            { val: 1200 },
            { val: 1450 },
            { val: 1700 },
            { val: 1850 },
            { val: 2000 },
            { val: 2100 },
        ],
        alerts: [
            {
                level: "red",
                title: "Critical zone",
                desc: "Highest evacuee count citywide.",
                time: "Now",
            },
            {
                level: "red",
                title: "Relief shortage",
                desc: "Only 65% coverage. Request resupply.",
                time: "20 mins ago",
            },
            {
                level: "amber",
                title: "Storm surge risk",
                desc: "Signal No. 2 in coastal barangays.",
                time: "1 hour ago",
            },
        ],
    },
    {
        id: "z4",
        name: "Brgy. Sala",
        type: "Safe Zone",
        x: 28,
        y: 42,
        risk: "low",
        evacuees: 150,
        trend: "-2%",
        activeCenters: 1,
        capacityMax: 3,
        capacityWarning: "40% Cap",
        reliefCoverage: "100%",
        reliefStatus: "Full",
        chartData: [
            { val: 200 },
            { val: 190 },
            { val: 180 },
            { val: 170 },
            { val: 165 },
            { val: 155 },
            { val: 150 },
        ],
        alerts: [
            {
                level: "teal",
                title: "Zone stable",
                desc: "No capacity issues detected.",
                time: "1 hour ago",
            },
        ],
    },
];

const LAYERS = [
    {
        key: "density",
        label: "Evacuee density",
        sub: "Heatmap visualization",
        Icon: Users,
        color: "red",
    },
    {
        key: "occupancy",
        label: "Center occupancy",
        sub: "Intensity markers",
        Icon: Building2,
        color: "amber",
    },
    {
        key: "relief",
        label: "Relief coverage",
        sub: "Distribution zones",
        Icon: Package,
        color: "blue",
    },
];

const riskColors = {
    high: {
        dot: "bg-red-500",
        ring: "bg-red-500",
        text: "text-red-500 dark:text-red-400",
        border: "border-red-500/30",
        label: "High",
    },
    medium: {
        dot: "bg-amber-500",
        ring: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/30",
        label: "Medium",
    },
    low: {
        dot: "bg-teal-500",
        ring: "bg-teal-500",
        text: "text-teal-600 dark:text-teal-400",
        border: "border-teal-500/30",
        label: "Low",
    },
};

const alertColors = {
    red: "bg-red-500",
    amber: "bg-amber-500",
    teal: "bg-teal-500",
};

const layerToggleColor = {
    red: "bg-red-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
};

export default function HeatMap() {
    const [layers, setLayers] = useState({
        density: true,
        occupancy: true,
        relief: false,
    });
    const [activeZone, setActiveZone] = useState(MAP_ZONES[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleLayer = (key) =>
        setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <Layout
            currentPage="Risk Heat Map"
            title="Geospatial Analysis"
            subtitle="Interactive heat map and live spatial data of Cabuyao City."
        >
            {/* Page Header Actions - Aligned to the right since TopBar handles the title */}
            <div className="flex items-center justify-end mb-4">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors">
                        <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors">
                        <Download size={14} /> Export
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-[#1db8a4] hover:bg-teal-600 rounded-xl shadow-sm transition-colors">
                        <RefreshCw size={14} /> Live
                    </button>
                </div>
            </div>

            {/* Main 3-column layout */}
            <div
                className="grid gap-0 rounded-2xl overflow-hidden border border-gray-200 dark:border-[#1e3a5f] shadow-sm bg-white dark:bg-[#0b192c]"
                style={{
                    gridTemplateColumns: "260px 1fr 300px",
                    minHeight: "660px",
                }}
            >
                {/* ── LEFT PANEL ── */}
                <div className="border-r border-gray-200 dark:border-[#1e3a5f] flex flex-col z-10">
                    {/* Map Layers */}
                    <div className="p-4 border-b border-gray-200 dark:border-[#1e3a5f]">
                        <div className="flex items-center gap-2 mb-3">
                            <Layers
                                size={15}
                                className="text-gray-500 dark:text-gray-400"
                            />
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Map Layers
                            </p>
                        </div>
                        <div className="space-y-2">
                            {LAYERS.map(({ key, label, sub, Icon, color }) => (
                                <div
                                    key={key}
                                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#132840]/50 border border-slate-100 dark:border-[#1e3a5f]/50"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`p-1.5 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}
                                        >
                                            <Icon size={13} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                                {label}
                                            </p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                                {sub}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => toggleLayer(key)}
                                        className={`w-9 h-5 flex items-center rounded-full px-0.5 cursor-pointer transition-colors duration-200 ${
                                            layers[key]
                                                ? layerToggleColor[color]
                                                : "bg-gray-200 dark:bg-[#1e3a5f]"
                                        }`}
                                    >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                                                layers[key]
                                                    ? "translate-x-4"
                                                    : "translate-x-0"
                                            }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Density Legend */}
                    <div className="p-4 border-b border-gray-200 dark:border-[#1e3a5f]">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Density Legend
                        </p>
                        <div className="h-2 w-full rounded-full bg-gradient-to-r from-[#1db8a4] via-amber-400 to-red-500 mb-2 shadow-inner" />
                        <div className="flex justify-between text-[10px] font-medium text-gray-500 dark:text-gray-400">
                            <span>Low (0–50)</span>
                            <span>Med (51–200)</span>
                            <span>High (200+)</span>
                        </div>
                    </div>

                    {/* Zones List */}
                    <div className="p-4 flex-1 overflow-y-auto bg-white dark:bg-transparent">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                            Zones Overview
                        </p>
                        <div className="space-y-1.5">
                            {MAP_ZONES.map((zone) => {
                                const c = riskColors[zone.risk];
                                const isActive = activeZone?.id === zone.id;
                                return (
                                    <button
                                        key={zone.id}
                                        onClick={() => setActiveZone(zone)}
                                        className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all border ${
                                            isActive
                                                ? "bg-teal-50 dark:bg-[#132840] border-teal-200 dark:border-[#1e3a5f]"
                                                : "bg-slate-50 dark:bg-transparent border-transparent hover:border-gray-200 dark:hover:bg-[#132840]/50"
                                        }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                {zone.name}
                                            </p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                                {zone.type}
                                            </p>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex-shrink-0">
                                            {zone.evacuees.toLocaleString()}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── MAP AREA ── */}
                <div className="bg-slate-50 dark:bg-[#060e1a] relative overflow-hidden flex flex-col transition-colors">
                    {/* Light Mode Grid */}
                    <div
                        className="absolute inset-0 pointer-events-none z-0 block dark:hidden opacity-50"
                        style={{
                            backgroundImage:
                                "radial-gradient(#cbd5e1 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    {/* Dark Mode Grid */}
                    <div
                        className="absolute inset-0 pointer-events-none z-0 hidden dark:block opacity-40"
                        style={{
                            backgroundImage:
                                "radial-gradient(#1e3a5f 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />

                    {/* Map label */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-[#0f2035]/90 backdrop-blur-sm border border-slate-200 dark:border-[#1e3a5f] shadow-sm rounded-lg px-3 py-1.5 transition-colors">
                        <MapPin size={12} className="text-[#1db8a4]" />
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                            Cabuyao City, Laguna
                        </span>
                    </div>

                    {/* Risk legend (map overlay docked just above timeline) */}
                    <div className="absolute bottom-[104px] right-4 z-10 bg-white/90 dark:bg-[#12263f]/95 backdrop-blur-md border border-slate-200 dark:border-[#1e3a5f] shadow-lg rounded-xl p-3 space-y-2 transition-colors">
                        {["high", "medium", "low"].map((r) => (
                            <div key={r} className="flex items-center gap-2.5">
                                <div
                                    className={`w-2.5 h-2.5 rounded-full ${riskColors[r].dot}`}
                                />
                                <span className="text-xs text-slate-600 dark:text-slate-300 capitalize font-semibold">
                                    {riskColors[r].label} Risk
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Hotspots */}
                    <div className="flex-1 relative">
                        {MAP_ZONES.map((zone) => {
                            const c = riskColors[zone.risk];
                            const isActive = activeZone?.id === zone.id;
                            const ringSize =
                                zone.risk === "high"
                                    ? "w-16 h-16"
                                    : zone.risk === "medium"
                                      ? "w-12 h-12"
                                      : "w-8 h-8";
                            return (
                                <div
                                    key={zone.id}
                                    onClick={() => setActiveZone(zone)}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                                    style={{
                                        left: `${zone.x}%`,
                                        top: `${zone.y}%`,
                                    }}
                                >
                                    {layers.density && (
                                        <div
                                            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${ringSize} ${c.ring} opacity-20 dark:opacity-15 animate-ping`}
                                        />
                                    )}
                                    <div
                                        className={`relative w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0a1628] shadow-sm transition-all duration-200 ${c.dot} ${
                                            isActive
                                                ? "scale-150 ring-2 ring-black/10 dark:ring-white/30"
                                                : "hover:scale-125"
                                        }`}
                                    />
                                    <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-700 text-white text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-xl">
                                        {zone.name}
                                        <div
                                            className={`text-[9px] text-${zone.risk === "high" ? "red" : zone.risk === "medium" ? "amber" : "teal"}-400 font-bold`}
                                        >
                                            {zone.evacuees.toLocaleString()}{" "}
                                            evacuees
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Timeline Bar */}
                    <div className="border-t border-slate-200 dark:border-[#1e3a5f] bg-white/90 dark:bg-[#0d1b2a]/95 backdrop-blur-md px-5 py-4 flex items-center gap-5 z-10 transition-colors">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-[42px] h-[42px] rounded-full bg-[#1db8a4] hover:bg-[#14b8a6] text-white flex items-center justify-center flex-shrink-0 shadow-md transition-colors"
                        >
                            {isPlaying ? (
                                <Pause size={18} className="fill-current" />
                            ) : (
                                <Play size={18} className="ml-1 fill-current" />
                            )}
                        </button>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-end mb-2.5">
                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] flex items-center gap-1.5">
                                    <Clock size={13} /> TIMELINE PLAYBACK
                                </span>
                                <span className="text-[11px] font-bold text-teal-700 dark:text-[#1db8a4] bg-teal-50 dark:bg-[#122e3a] border border-teal-100 dark:border-transparent px-3 py-1 rounded-md shadow-sm">
                                    Oct 24, 14:00 PHT
                                </span>
                            </div>
                            <div className="relative w-full h-1.5 bg-slate-200 dark:bg-[#1e3a5f] rounded-full overflow-visible transition-colors">
                                <div className="absolute top-0 left-0 h-full bg-[#1db8a4] rounded-full w-[70%]" />
                                <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#1db8a4] cursor-pointer shadow-md" />
                            </div>
                            <div className="flex justify-between mt-2.5 text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
                                <span>Oct 22</span>
                                <span>Oct 23</span>
                                <span>Oct 24</span>
                                <span>Now</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="border-l border-gray-200 dark:border-[#1e3a5f] flex flex-col overflow-y-auto z-10">
                    {activeZone ? (
                        <>
                            <div className="flex-1 flex flex-col">
                                {/* Zone Header */}
                                <div className="p-4 border-b border-gray-200 dark:border-[#1e3a5f]">
                                    <span className="inline-block px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-900/30 text-[#1db8a4] border border-teal-100 dark:border-transparent text-[10px] font-bold uppercase tracking-widest mb-2">
                                        Active Zone
                                    </span>
                                    <h2 className="text-[17px] font-bold text-gray-900 dark:text-white leading-tight">
                                        {activeZone.name}
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {activeZone.type} ·{" "}
                                        <span
                                            className={
                                                riskColors[activeZone.risk].text
                                            }
                                        >
                                            {riskColors[activeZone.risk].label}{" "}
                                            risk
                                        </span>
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-2.5 p-4 border-b border-gray-200 dark:border-[#1e3a5f]">
                                    <div className="bg-slate-50 dark:bg-[#132840]/50 border border-slate-100 dark:border-transparent rounded-xl p-3">
                                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            Total Evacuees
                                        </p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">
                                            {activeZone.evacuees.toLocaleString()}
                                        </p>
                                        <p
                                            className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${riskColors[activeZone.risk].text}`}
                                        >
                                            <TrendingUp size={11} />{" "}
                                            {activeZone.trend}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-[#132840]/50 border border-slate-100 dark:border-transparent rounded-xl p-3">
                                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            Centers Active
                                        </p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">
                                            {activeZone.activeCenters}
                                            <span className="text-[13px] font-medium text-gray-400">
                                                /{activeZone.capacityMax}
                                            </span>
                                        </p>
                                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 mt-1.5 flex items-center gap-1">
                                            <AlertTriangle size={11} />{" "}
                                            {activeZone.capacityWarning}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-[#132840]/50 border border-slate-100 dark:border-transparent rounded-xl p-3">
                                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            Relief Coverage
                                        </p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">
                                            {activeZone.reliefCoverage}
                                        </p>
                                        <p className="text-[10px] font-bold text-[#1db8a4] mt-1.5 flex items-center gap-1">
                                            <CheckCircle size={11} />{" "}
                                            {activeZone.reliefStatus}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-[#132840]/50 border border-slate-100 dark:border-transparent rounded-xl p-3">
                                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                            Risk Level
                                        </p>
                                        <p
                                            className={`text-[17px] leading-tight font-black mt-1 ${riskColors[activeZone.risk].text}`}
                                        >
                                            {riskColors[activeZone.risk].label}
                                        </p>
                                        <p
                                            className={`text-[10px] font-bold mt-1.5 flex items-center gap-1 ${riskColors[activeZone.risk].text}`}
                                        >
                                            <AlertCircle size={11} /> Monitor
                                        </p>
                                    </div>
                                </div>

                                {/* Zone Alerts */}
                                <div className="p-4 flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                                        Zone Alerts
                                    </p>
                                    <div className="space-y-0 divide-y divide-gray-100 dark:divide-[#1e3a5f]/60">
                                        {activeZone.alerts.map((alert, i) => (
                                            <div
                                                key={i}
                                                className="flex gap-3 py-3"
                                            >
                                                <div
                                                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alertColors[alert.level]}`}
                                                />
                                                <div>
                                                    <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                                                        {alert.title}
                                                    </p>
                                                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 leading-snug">
                                                        {alert.desc}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">
                                                        {alert.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="p-4 border-t border-gray-200 dark:border-[#1e3a5f] mt-auto">
                                <button className="w-full bg-[#1db8a4] hover:bg-[#14b8a6] text-white text-[13px] font-bold py-[14px] rounded-xl transition-colors flex items-center justify-center gap-2 group shadow-sm">
                                    View Full Details
                                    <ExternalLink
                                        size={15}
                                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                    />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-transparent">
                            <div className="text-center">
                                <MapPin
                                    size={28}
                                    className="text-gray-300 dark:text-gray-600 mx-auto mb-2"
                                />
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Select a zone on the map
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
