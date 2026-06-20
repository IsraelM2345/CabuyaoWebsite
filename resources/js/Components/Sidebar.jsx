import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    Megaphone,
    Users,
    Package,
    Building2,
    Map as MapIcon,
    FileBarChart,
    UserCog,
    LogOut,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Bell,
    Moon,
    X,
    AlertCircle,
    Info,
    CheckCircle2,
} from "lucide-react";

// --- RESTORED EVACTECH NAVIGATION STRUCTURE ---
const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    {
        icon: Megaphone,
        label: "Announcements",
        href: "/announcements",
        subItems: [
            { label: "All Announcements", href: "/announcements" },
            { label: "Create New", href: "/announcements/create" },
        ],
    },
    {
        icon: Users,
        label: "Evacuee Profiles",
        href: "/evacuee-profiles",
        subItems: [
            { label: "Masterlist", href: "/evacuee-profiles" },
            {
                label: "Vulnerable Groups",
                href: "/evacuee-profiles/vulnerable",
            },
            { label: "Add Household", href: "/evacuee-profiles/add" },
        ],
    },
    {
        icon: Package,
        label: "Relief Distribution",
        href: "/relief-distribution",
        subItems: [
            {
                label: "Inventory Stock",
                href: "/relief-distribution/inventory",
            },
            { label: "Distribution Logs", href: "/relief-distribution/logs" },
        ],
    },
    {
        icon: Building2,
        label: "Evacuation Shelters",
        href: "/evacuation-shelters",
        subItems: [
            { label: "Active Centers", href: "/evacuation-shelters" },
            {
                label: "Capacity Tracking",
                href: "/evacuation-shelters/capacity",
            },
        ],
    },
    {
        icon: MapIcon,
        label: "Risk Heat Map",
        href: "/risk-heatmap",
    },
    {
        icon: FileBarChart,
        label: "System Reports",
        href: "/system-reports",
        subItems: [
            { label: "Generate Report", href: "/system-reports/generate" },
            { label: "Export History", href: "/system-reports/history" },
        ],
    },
    {
        icon: UserCog,
        label: "User Management",
        href: "/user-management",
        subItems: [
            { label: "Staff Roles", href: "/user-management/roles" },
            { label: "Activity Logs", href: "/user-management/logs" },
        ],
    },
];

// ─── Logout Modal ─────────────────────────────────────────────────────────────
function LogoutModal({ onClose, onConfirm }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center transition-colors"
            style={{
                backgroundColor: "rgba(15,23,42,0.6)",
                backdropFilter: "blur(6px)",
            }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-xs mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors"
                onClick={(e) => e.stopPropagation()}
                style={{
                    border: "1px solid rgba(13,148,136,0.12)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
                }}
            >
                {/* Top accent bar */}
                <div
                    className="h-1 w-full"
                    style={{
                        background:
                            "linear-gradient(90deg, #0d9488, #0f766e, #1d4ed8)",
                    }}
                />

                <button
                    onClick={onClose}
                    className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                    <X size={13} strokeWidth={2.5} />
                </button>

                <div className="px-6 pt-6 pb-6">
                    <div className="flex justify-center mb-4">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center dark:bg-red-900/20"
                            style={{
                                background:
                                    "linear-gradient(135deg, #fff1f2, #ffe4e6)",
                                border: "1.5px solid #fecdd3",
                                boxShadow: "0 4px 12px rgba(239,68,68,0.1)",
                            }}
                        >
                            <LogOut
                                size={22}
                                className="text-red-500"
                                strokeWidth={2}
                            />
                        </div>
                    </div>

                    <div className="text-center mb-5">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 transition-colors">
                            Sign out?
                        </h2>
                        <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
                            Are you sure you want to leave? Any unsaved changes
                            will be lost.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-[13px] font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all active:scale-[0.98]"
                        >
                            Stay signed in
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] hover:opacity-90"
                            style={{
                                background:
                                    "linear-gradient(135deg, #dc2626, #b91c1c)",
                                boxShadow: "0 4px 12px rgba(220,38,38,0.25)",
                            }}
                        >
                            <LogOut size={13} strokeWidth={2.5} />
                            Yes, sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({ currentPage = "Dashboard" }) {
    const [collapsed, setCollapsed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState("");

    const handleLogoutConfirm = () => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/logout";
        if (csrfToken) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "_token";
            input.value = csrfToken;
            form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
    };

    const toggleSubMenu = (label) => {
        setExpandedMenu(expandedMenu === label ? "" : label);
    };

    return (
        <>
            {showLogoutModal && (
                <LogoutModal
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={handleLogoutConfirm}
                />
            )}

            <div
                className={`flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 shadow-sm z-20 relative ${
                    collapsed ? "w-16" : "w-64"
                }`}
            >
                <div className="flex items-center gap-1 px-4 py-5">
                    <img
                        src="/images/evactech-logo.png"
                        alt="EvacTech Logo"
                        className="w-8 h-8 object-contain flex-shrink-0"
                    />

                    {!collapsed && (
                        <div className="font-bold text-base tracking-tight whitespace-nowrap ml-1">
                            <span className="text-[#00ADB5]">Evac</span>
                            <span className="text-[#444748] dark:text-gray-200 transition-colors">
                                Tech
                            </span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {NAV_ITEMS.map(({ icon: Icon, label, href, subItems }) => {
                        const isActive = currentPage === label;
                        const isExpanded = expandedMenu === label;
                        const hasSubItems = subItems && subItems.length > 0;

                        return (
                            <div key={label} className="flex flex-col">
                                <button
                                    onClick={() => {
                                        if (hasSubItems && !collapsed) {
                                            toggleSubMenu(label);
                                        } else {
                                            window.location.href = href;
                                        }
                                    }}
                                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                                        isActive
                                            ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200"
                                    }`}
                                    title={collapsed ? label : ""}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            size={18}
                                            className={`flex-shrink-0 ${
                                                isActive
                                                    ? "text-teal-600 dark:text-teal-400"
                                                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                            }`}
                                        />
                                        {!collapsed && (
                                            <span className="truncate">
                                                {label}
                                            </span>
                                        )}
                                    </div>

                                    {!collapsed &&
                                        hasSubItems &&
                                        (isExpanded ? (
                                            <ChevronUp
                                                size={16}
                                                className="text-gray-400 dark:text-gray-500"
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={16}
                                                className="text-gray-400 dark:text-gray-500"
                                            />
                                        ))}
                                </button>

                                {/* Accordion Sub-menu */}
                                {!collapsed && hasSubItems && (
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            isExpanded
                                                ? "max-h-48 opacity-100 mt-1"
                                                : "max-h-0 opacity-0"
                                        }`}
                                    >
                                        <div className="pl-10 pr-3 py-1 flex flex-col space-y-1 border-l-2 border-gray-100 dark:border-gray-800 ml-5">
                                            {subItems.map((sub, idx) => (
                                                <a
                                                    key={idx}
                                                    href={sub.href}
                                                    className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 py-1.5 transition-colors block truncate"
                                                >
                                                    {sub.label}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1 transition-colors">
                    <button
                        type="button"
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center justify-center sm:justify-start gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 w-full transition-all group"
                        title={collapsed ? "Sign out" : ""}
                    >
                        <LogOut
                            size={18}
                            className="text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 flex-shrink-0 transition-colors"
                        />
                        {!collapsed && <span>Sign out</span>}
                    </button>

                    <button
                        onClick={() => {
                            setCollapsed(!collapsed);
                            if (!collapsed) setExpandedMenu("");
                        }}
                        className="flex items-center justify-center sm:justify-start gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 w-full transition-all"
                        title={collapsed ? "Expand" : ""}
                    >
                        <ChevronLeft
                            size={18}
                            className={`flex-shrink-0 transition-transform duration-300 ${
                                collapsed ? "rotate-180" : ""
                            }`}
                        />
                        {!collapsed && (
                            <span className="text-xs font-medium">
                                Collapse Menu
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Top Header Bar ───────────────────────────────────────────────────────────
function SunIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-yellow-400"
        >
            <path
                d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M12 2v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M12 20v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M4.93 4.93l1.41 1.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M17.66 17.66l1.41 1.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M2 12h2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M20 12h2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M4.93 19.07l1.41-1.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M17.66 6.34l1.41-1.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function TopBar({ title, subtitle }) {
    const [theme, setTheme] = useState("light");

    // Notification States
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Critical Capacity Alert",
            desc: "Mamatid Elem. School has reached 90% capacity.",
            time: "10 mins ago",
            type: "alert",
            unread: true,
        },
        {
            id: 2,
            title: "New Registration",
            desc: "Family of 5 registered at Banlic Covered Court.",
            time: "1 hr ago",
            type: "info",
            unread: true,
        },
        {
            id: 3,
            title: "Report Generated",
            desc: "Daily Operations report was successfully downloaded.",
            time: "3 hrs ago",
            type: "success",
            unread: false,
        },
    ]);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const prefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme =
            saved === "dark" || saved === "light"
                ? saved
                : prefersDark
                  ? "dark"
                  : "light";

        setTheme(initialTheme);
        if (initialTheme === "dark") {
            document.documentElement.classList.add("dark");
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const applyTheme = (nextTheme) => {
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);

        if (nextTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const toggleTheme = () => {
        applyTheme(theme === "dark" ? "light" : "dark");
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    };

    const unreadCount = notifications.filter((n) => n.unread).length;

    const getNotificationIcon = (type) => {
        switch (type) {
            case "alert":
                return (
                    <AlertCircle
                        size={16}
                        className="text-red-500 dark:text-red-400"
                    />
                );
            case "success":
                return (
                    <CheckCircle2
                        size={16}
                        className="text-green-500 dark:text-green-400"
                    />
                );
            default:
                return (
                    <Info
                        size={16}
                        className="text-blue-500 dark:text-blue-400"
                    />
                );
        }
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b transition-colors bg-white border-gray-100 dark:bg-gray-900 dark:border-gray-800 z-10 relative">
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 transition-colors">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 rounded-lg transition hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800 dark:text-gray-300"
                    aria-label="Toggle dark mode"
                    title="Toggle theme"
                >
                    {theme === "dark" ? <SunIcon /> : <Moon size={18} />}
                </button>

                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2 rounded-lg transition relative ${
                            showNotifications
                                ? "bg-gray-100 dark:bg-gray-800 text-teal-600 dark:text-teal-400"
                                : "hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800 dark:text-gray-300"
                        }`}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 transition-colors" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[320px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No recent notifications.
                                    </p>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`p-4 border-b border-gray-50 dark:border-gray-700/50 flex gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                                                n.unread
                                                    ? "bg-teal-50/30 dark:bg-teal-900/10"
                                                    : ""
                                            }`}
                                        >
                                            <div className="mt-0.5">
                                                {getNotificationIcon(n.type)}
                                            </div>
                                            <div className="flex-1">
                                                <p
                                                    className={`text-sm mb-0.5 ${
                                                        n.unread
                                                            ? "font-semibold text-gray-900 dark:text-gray-100"
                                                            : "font-medium text-gray-700 dark:text-gray-300"
                                                    }`}
                                                >
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mb-1.5">
                                                    {n.desc}
                                                </p>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                                    {n.time}
                                                </p>
                                            </div>
                                            {n.unread && (
                                                <div className="w-2 h-2 rounded-full bg-teal-500 self-center flex-shrink-0" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-center">
                                <button className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-1">
                                    View Activity Logs
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 ml-1">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                        style={{
                            background:
                                "linear-gradient(135deg, #0d9488, #1d4ed8)",
                        }}
                    >
                        AU
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                            Admin User
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 transition-colors">
                            Super Admin
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Layout Wrapper ───────────────────────────────────────────────────────────
export function Layout({ children, currentPage, title, subtitle }) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden transition-colors">
            <Sidebar currentPage={currentPage} />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <TopBar title={title} subtitle={subtitle} />
                <main className="flex-1 overflow-y-auto p-6 bg-transparent dark:text-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
