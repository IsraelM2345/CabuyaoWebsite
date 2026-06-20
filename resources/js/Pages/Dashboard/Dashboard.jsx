import { useState } from "react";
import { Layout } from "../../Components/Sidebar";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend,
    AreaChart,
    Area,
    CartesianGrid,
} from "recharts";
import {
    Users,
    Home,
    Package,
    Activity,
    X,
    Search,
    Filter,
    AlertTriangle,
    Download,
    Plus,
    UserPlus,
    Box,
    Megaphone,
    ShieldAlert,
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────
const dailyArrivalsData = [
    { day: "Mon", arrivals: 120, departures: 0 },
    { day: "Tue", arrivals: 250, departures: 20 },
    { day: "Wed", arrivals: 400, departures: 50 },
    { day: "Thu", arrivals: 350, departures: 100 },
    { day: "Fri", arrivals: 200, departures: 150 },
    { day: "Sat", arrivals: 100, departures: 300 },
    { day: "Sun", arrivals: 50, departures: 200 },
];

const occupancyTrendData = [
    { day: "Day 1", occupancy: 30 },
    { day: "Day 2", occupancy: 45 },
    { day: "Day 3", occupancy: 60 },
    { day: "Day 4", occupancy: 85 },
    { day: "Day 5", occupancy: 95 },
    { day: "Day 6", occupancy: 78 },
    { day: "Day 7", occupancy: 75 },
];

const vulnerableData = [
    { name: "Senior Citizens", value: 35, color: "#3b82f6" },
    { name: "Children", value: 40, color: "#0d9488" },
    { name: "Pregnant", value: 15, color: "#f97316" },
    { name: "PWD", value: 10, color: "#a855f7" },
];

const shelterCapacityData = [
    { name: "Banlic Center", current: 950, max: 1000, status: "critical" },
    { name: "Sala Elem. School", current: 420, max: 500, status: "warning" },
    { name: "Mamatid Hall", current: 150, max: 400, status: "safe" },
];

const INITIAL_RISK_MAP = [
    { name: "Marinig", risk: "high" },
    { name: "Bigaa", risk: "high" },
    { name: "Butong", risk: "high" },
    { name: "Gulod", risk: "high" },
    { name: "Mamatid", risk: "medium" },
    { name: "Banlic", risk: "medium" },
    { name: "Pulo", risk: "medium" },
    { name: "San Isidro", risk: "medium" },
    { name: "Sala", risk: "medium" },
    { name: "Niugan", risk: "medium" },
    { name: "Banay-Banay", risk: "low" },
    { name: "Tres Cruses", risk: "low" },
    { name: "Casile", risk: "low" },
    { name: "Pittland", risk: "low" },
    { name: "Diezmo", risk: "low" },
];

const INITIAL_LOGS = [
    {
        id: 1,
        color: "#0d9488",
        category: "Registration",
        text: "New household registered (5 members) at Sala Center",
        time: "10 mins ago",
    },
    {
        id: 2,
        color: "#0d9488",
        category: "Logistics",
        text: "Relief distribution completed at Bigaa Center",
        time: "45 mins ago",
    },
    {
        id: 3,
        color: "#ef4444",
        category: "Alerts",
        text: "Capacity warning: Banlic Center at 95%",
        time: "2 hours ago",
    },
    {
        id: 4,
        color: "#3b82f6",
        category: "System",
        text: "System report exported by Admin User",
        time: "3 hours ago",
    },
];

const riskColors = {
    high: { bg: "#ef4444", label: "text-white" },
    medium: { bg: "#f59e0b", label: "text-white" },
    low: { bg: "#22c55e", label: "text-white" },
};

// ── Custom Tooltip for Recharts (Adapts to Dark Mode) ─────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-xl shadow-lg">
                {label && (
                    <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 mb-2">
                        {label}
                    </p>
                )}
                <div className="space-y-1">
                    {payload.map((entry, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-[11px]"
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-gray-600 dark:text-slate-300">
                                {entry.name}:{" "}
                                <span className="font-semibold text-gray-900 dark:text-slate-100">
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

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    iconBg,
    subColor = "text-teal-600 dark:text-teal-400",
}) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 flex items-start gap-4 transition-colors">
            <div className={`p-3 rounded-xl ${iconBg}`}>
                <Icon size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mb-0.5">
                    {label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
                {sub && (
                    <p
                        className={`text-xs font-medium mt-0.5 flex items-center gap-1 ${subColor}`}
                    >
                        {sub}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [riskMap, setRiskMap] = useState(INITIAL_RISK_MAP);
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
    const [logSearch, setLogSearch] = useState("");
    const [logFilter, setLogFilter] = useState("All");

    const handleSimulateEvent = () => {
        const events = [
            {
                category: "Alerts",
                color: "#ef4444",
                text: "Emergency alert triggered in Brgy. Pulo!",
            },
            {
                category: "Logistics",
                color: "#0d9488",
                text: "New batch of hygiene kits arrived.",
            },
            {
                category: "Registration",
                color: "#0d9488",
                text: "New evacuee profile created in Marinig.",
            },
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const newEvent = {
            id: Date.now(),
            color: randomEvent.color,
            category: randomEvent.category,
            text: randomEvent.text,
            time: "Just now",
        };
        setLogs((prev) => [newEvent, ...prev]);
    };

    const handleToggleRisk = (nameToToggle) => {
        setRiskMap((prevMap) =>
            prevMap.map((brgy) => {
                if (brgy.name === nameToToggle) {
                    const nextRisk =
                        brgy.risk === "low"
                            ? "medium"
                            : brgy.risk === "medium"
                              ? "high"
                              : "low";
                    return { ...brgy, risk: nextRisk };
                }
                return brgy;
            }),
        );
    };

    const filteredLogs = logs.filter((log) => {
        const matchesSearch = log.text
            .toLowerCase()
            .includes(logSearch.toLowerCase());
        const matchesFilter = logFilter === "All" || log.category === logFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <Layout
            currentPage="Dashboard"
            title="Overview Dashboard"
            subtitle="Real-time status of disaster response operations."
        >
            {/* Top Action Bar & Role Indicator */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full border border-teal-100 dark:border-teal-800 transition-colors">
                        <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                        Live Updates Active
                    </span>
                    <span className="text-xs font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors">
                        <ShieldAlert size={12} />
                        Admin View
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm">
                        <Download size={16} /> Export Report
                    </button>
                    <button className="flex items-center gap-2 bg-[#0d9488] hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                        <Plus size={16} /> New Action
                    </button>
                </div>
            </div>

            {/* Alert Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 mb-6 flex items-start gap-4 shadow-sm transition-colors">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
                    <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="text-blue-900 dark:text-blue-100 font-bold text-sm">
                        Active Typhoon Alert: Signal No. 2
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-0.5">
                        Pre-emptive evacuation is ongoing in coastal barangays.
                        3 centers are nearing capacity.
                    </p>
                </div>
                <button className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap">
                    View Details
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={Users}
                    label="Total Evacuees"
                    value="4,285"
                    sub="+12% this week"
                    iconBg="bg-teal-500"
                />
                <StatCard
                    icon={Home}
                    label="Registered Households"
                    value="1,142"
                    sub="+5% today"
                    iconBg="bg-blue-500"
                    subColor="text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    icon={Activity}
                    label="Occupied Capacity"
                    value="78.5%"
                    sub="12 Active Centers"
                    iconBg="bg-amber-500"
                    subColor="text-amber-600 dark:text-amber-400"
                />
                <StatCard
                    icon={Package}
                    label="Relief Packs Distributed"
                    value="3,450"
                    sub="Updated Today"
                    iconBg="bg-emerald-500"
                    subColor="text-emerald-600 dark:text-emerald-400"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Daily Arrivals Chart */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    Daily Arrivals & Departures
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                    Evacuee flow over the last 7 days
                                </p>
                            </div>
                            <select className="text-xs border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md px-2 py-1 text-gray-600 dark:text-slate-300 outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-colors">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div style={{ width: "100%", height: 240 }}>
                            <ResponsiveContainer>
                                <BarChart data={dailyArrivalsData} barSize={20}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="currentColor"
                                        className="text-gray-100 dark:text-slate-700"
                                    />
                                    <XAxis
                                        dataKey="day"
                                        tick={{
                                            fontSize: 11,
                                            fill: "currentColor",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                        className="text-gray-500 dark:text-slate-400"
                                    />
                                    <YAxis
                                        tick={{
                                            fontSize: 11,
                                            fill: "currentColor",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                        dx={-10}
                                        className="text-gray-500 dark:text-slate-400"
                                    />
                                    <Tooltip
                                        content={<CustomTooltip />}
                                        cursor={{
                                            fill: "currentColor",
                                            opacity: 0.05,
                                        }}
                                        className="text-gray-900 dark:text-slate-100"
                                    />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{
                                            fontSize: "11px",
                                            paddingTop: "10px",
                                        }}
                                        className="text-gray-600 dark:text-slate-400"
                                    />
                                    <Bar
                                        dataKey="arrivals"
                                        name="Arrivals"
                                        fill="#0d9488"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="departures"
                                        name="Departures"
                                        fill="#94a3b8"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Center Occupancy Trends */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                Center Occupancy Trends
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 mb-4">
                                Capacity vs Actual usage
                            </p>
                            <div style={{ width: "100%", height: 180 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={occupancyTrendData}>
                                        <defs>
                                            <linearGradient
                                                id="colorOcc"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#0d9488"
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#0d9488"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="day" hide />
                                        <YAxis hide domain={[0, 100]} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="occupancy"
                                            stroke="#0d9488"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorOcc)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Vulnerable Groups */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                                Vulnerable Groups
                            </h3>
                            <div style={{ width: "100%", height: 180 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={vulnerableData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={75}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {vulnerableData.map((entry, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={entry.color}
                                                    className="stroke-white dark:stroke-slate-800 transition-colors"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={(value) => (
                                                <span className="text-[11px] text-gray-500 dark:text-slate-400">
                                                    {value}
                                                </span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shelter Capacity Bars */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">
                                Shelter Capacity Status
                            </h3>
                            <div className="space-y-4">
                                {shelterCapacityData.map((shelter, idx) => {
                                    const percent =
                                        (shelter.current / shelter.max) * 100;
                                    const barColor =
                                        percent > 90
                                            ? "bg-red-500"
                                            : percent > 75
                                              ? "bg-amber-500"
                                              : "bg-teal-500";
                                    return (
                                        <div key={idx}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium text-gray-700 dark:text-slate-200">
                                                    {shelter.name}
                                                </span>
                                                <span className="text-gray-500 dark:text-slate-400">
                                                    {shelter.current} /{" "}
                                                    {shelter.max}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 transition-colors">
                                                <div
                                                    className={`${barColor} h-2 rounded-full`}
                                                    style={{
                                                        width: `${percent}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Disaster Risk Heat Map */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    Disaster Risk Heat Map
                                </h3>
                            </div>
                            <div className="grid grid-cols-5 gap-1.5">
                                {riskMap.map(({ name, risk }) => (
                                    <button
                                        key={name}
                                        onClick={() => handleToggleRisk(name)}
                                        className="rounded px-1 py-2 flex items-center justify-center text-center transition-opacity hover:opacity-80"
                                        style={{
                                            backgroundColor:
                                                riskColors[risk].bg,
                                        }}
                                        title={`${name} - ${risk} risk`}
                                    >
                                        <span className="text-white text-[9px] font-bold truncate w-full shadow-sm">
                                            {name.substring(0, 3)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-3 text-center">
                                *Click to toggle area risk levels
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column (Actions & Activity) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Actions Panel */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 p-2 rounded-md group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                        <UserPlus size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                                            Add Household
                                        </p>
                                        <p className="text-[10px] text-gray-500 dark:text-slate-400">
                                            Register new evacuees
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 p-2 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Box size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                                            Log Distribution
                                        </p>
                                        <p className="text-[10px] text-gray-500 dark:text-slate-400">
                                            Record relief goods given
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 p-2 rounded-md group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                        <Megaphone size={16} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                                            Create Announcement
                                        </p>
                                        <p className="text-[10px] text-gray-500 dark:text-slate-400">
                                            Broadcast to public portal
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col flex-1 transition-colors">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                Recent Activity
                            </h3>
                            <button
                                onClick={handleSimulateEvent}
                                className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-medium transition-colors"
                            >
                                Simulate Log
                            </button>
                        </div>

                        <div className="space-y-5 flex-1">
                            {logs
                                .slice(0, 5)
                                .map(({ id, color, text, time }) => (
                                    <div
                                        key={id}
                                        className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
                                    >
                                        <div
                                            className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                                            style={{ backgroundColor: color }}
                                        />
                                        <div>
                                            <p className="text-xs font-medium text-gray-800 dark:text-slate-200 leading-snug">
                                                {text}
                                            </p>
                                            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">
                                                {time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <button
                            onClick={() => setIsLogsModalOpen(true)}
                            className="mt-6 text-xs text-teal-600 dark:text-teal-400 font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 w-full text-center py-2.5 rounded-lg border border-teal-100 dark:border-teal-800 transition-colors"
                        >
                            View All Logs
                        </button>
                    </div>
                </div>
            </div>

            {/* FULL LOGS MODAL */}
            {isLogsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-slate-900/80 backdrop-blur-sm transition-all">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Activity
                                    size={20}
                                    className="text-teal-600 dark:text-teal-400"
                                />
                                System Activity Logs
                            </h2>
                            <button
                                onClick={() => setIsLogsModalOpen(false)}
                                className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 transition-colors">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                                    size={15}
                                />
                                <input
                                    type="text"
                                    placeholder="Search logs..."
                                    value={logSearch}
                                    onChange={(e) =>
                                        setLogSearch(e.target.value)
                                    }
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 transition-colors">
                                <Filter
                                    size={14}
                                    className="text-gray-400 dark:text-slate-500"
                                />
                                <select
                                    value={logFilter}
                                    onChange={(e) =>
                                        setLogFilter(e.target.value)
                                    }
                                    className="text-sm text-gray-600 dark:text-slate-300 focus:outline-none bg-transparent cursor-pointer"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Alerts">Alerts</option>
                                    <option value="Logistics">Logistics</option>
                                    <option value="Registration">
                                        Registration
                                    </option>
                                    <option value="System">System</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {filteredLogs.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-slate-400 py-10">
                                    No logs found matching your criteria.
                                </p>
                            ) : (
                                filteredLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <div
                                            className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                                            style={{
                                                backgroundColor: log.color,
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
                                                    {log.text}
                                                </p>
                                                <span className="text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap ml-4">
                                                    {log.time}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-300 transition-colors">
                                                {log.category}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
