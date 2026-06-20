import { useState, useEffect, useRef } from "react";
import {
    LayoutDashboard,
    FileText,
    Megaphone,
    Edit3,
    Mail,
    Image as ImageIcon,
    Users,
    Building2,
    UserCog,
    LogOut,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Moon,
    Sun,
    X,
    AlertCircle,
    CheckCircle2,
    Info,
    Bell,
} from "lucide-react";

// --- STAFF PORTAL CMS NAVIGATION STRUCTURE ---
const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/staff/dashboard" },
    {
        icon: FileText,
        label: "News Manager",
        href: "/staff/news-manager",
        subItems: [
            { label: "All News", href: "/staff/news-manager" },
            { label: "Create New", href: "/staff/news-manager/create" },
        ],
    },
    {
        icon: Megaphone,
        label: "Announcements",
        href: "/staff/announcements-manager",
        subItems: [
            {
                label: "All Announcements",
                href: "/staff/announcements-manager",
            },
            {
                label: "Create New",
                href: "/staff/announcements-manager/create",
            },
        ],
    },
    {
        icon: Edit3,
        label: "Page Editor",
        href: "/staff/page-editor",
        subItems: [
            { label: "Home Page", href: "/staff/page-editor/home" },
            { label: "About Page", href: "/staff/page-editor/about" },
            { label: "Services", href: "/staff/page-editor/services" },
        ],
    },
    {
        icon: Mail,
        label: "Contact Inbox",
        href: "/staff/contact-inbox",
    },
    {
        icon: ImageIcon,
        label: "Gallery Manager",
        href: "/staff/media-manager",
        subItems: [
            { label: "All Gallery Images", href: "/staff/media-manager" },
            { label: "Upload Images", href: "/staff/media-manager/upload" },
        ],
    },
    {
        icon: Users,
        label: "Officials",
        href: "/staff/officials",
        subItems: [
            { label: "Mayor & Vice Mayor", href: "/staff/officials/executive" },
            { label: "Councilors", href: "/staff/officials/councilors" },
        ],
    },
    {
        icon: Building2,
        label: "Services",
        href: "/staff/services",
        subItems: [
            { label: "Departments", href: "/staff/services/departments" },
            { label: "E-Services", href: "/staff/services/e-services" },
        ],
    },
    {
        icon: UserCog,
        label: "User Management",
        href: "/staff/user-management",
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
                    border: "1px solid rgba(59, 130, 246, 0.12)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
                }}
            >
                {/* Top accent bar - Updated to Cabuyao Blue & Yellow */}
                <div
                    className="h-1 w-full"
                    style={{
                        background:
                            "linear-gradient(90deg, #3b82f6, #1d4ed8, #eab308)",
                    }}
                />

                <button
                    onClick={onClose}
                    className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                    <X size={13} strokeWidth={2.5} />
                </button>

                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-xl max-w-sm w-full mx-auto transition-all">
                    {/* Destructive Warning Icon Container */}
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 shadow-sm transition-colors">
                            <LogOut size={20} strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-1 transition-colors">
                            Sign out of your account?
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
                            Are you sure you want to leave? Any unsaved changes
                            or active progress will be lost.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* IMPROVED: Secondary Cancel Action (Soft Fill) */}
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-all"
                        >
                            Cancel
                        </button>

                        {/* Primary Destructive Action */}
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-red-600/10 dark:shadow-none active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all"
                        >
                            <LogOut size={15} strokeWidth={2.5} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Staff Portal Sidebar ──────────────────────────────────────────────────────────────────
export function StaffSidebar({ currentPage = "Dashboard", userRole = "user" }) {
    const [collapsed, setCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebarCollapsed");
        return saved === "true";
    });
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState("");

    // Filter nav items based on user role
    const filteredNavItems = NAV_ITEMS.filter((item) => {
        // Only show User Management to admin users
        if (item.label === "User Management" && userRole !== "admin") {
            return false;
        }
        return true;
    });

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", collapsed.toString());
    }, [collapsed]);

    // LOGOUT LOGIC PERFECTED
    const handleLogoutConfirm = () => {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/logout";

        if (!csrfToken) {
            console.error("CSRF token not found for logout");
            return;
        }

        // 1. Append CSRF token
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "_token";
        input.value = csrfToken;
        form.appendChild(input);

        // 2. Append Custom Flag for Staff Redirect
        const sourceInput = document.createElement("input");
        sourceInput.type = "hidden";
        sourceInput.name = "from_staff";
        sourceInput.value = "true";
        form.appendChild(sourceInput);

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
                        src="/images/cab-logo1.png"
                        alt="Cabuyao Logo"
                        className="w-10 h-10 object-contain flex-shrink-0"
                    />

                    {!collapsed && (
                        <div className="font-bold text-base tracking-tight whitespace-nowrap ml-1">
                            <span className="text-blue-600 dark:text-blue-400">
                                Cabuyao
                            </span>
                            <span className="text-yellow-500 dark:text-yellow-400 ml-1">
                                E-Gov
                            </span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {filteredNavItems.map(
                        ({ icon: Icon, label, href, subItems }) => {
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
                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200"
                                        }`}
                                        title={collapsed ? label : ""}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon
                                                size={18}
                                                className={`flex-shrink-0 ${
                                                    isActive
                                                        ? "text-blue-600 dark:text-blue-400"
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
                                                        className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 py-1.5 transition-colors block truncate"
                                                    >
                                                        {sub.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        },
                    )}
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

// ─── Staff Portal Top Header Bar ───────────────────────────────────────────────────────────
export function StaffTopBar({ title, subtitle }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme");
        return saved || "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
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

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Toggle Theme"
                >
                    {theme === "dark" ? (
                        <Sun size={18} className="text-yellow-400" />
                    ) : (
                        <Moon size={18} />
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                        style={{
                            background:
                                "linear-gradient(135deg, #1d4ed8, #3b82f6)",
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

// ─── Staff Portal Layout Wrapper ───────────────────────────────────────────────────────────
export function StaffLayout({
    children,
    currentPage,
    title,
    subtitle,
    userRole = "user",
}) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden transition-colors">
            <StaffSidebar currentPage={currentPage} userRole={userRole} />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <StaffTopBar title={title} subtitle={subtitle} />
                <main className="flex-1 overflow-y-auto p-6 bg-transparent dark:text-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
