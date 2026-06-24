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
    Camera,
    Edit2,
    Save,
    User,
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
    { icon: Mail, label: "Contact Inbox", href: "/staff/contact-inbox" },
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
            { label: "All Officials", href: "/staff/officials" },
            { label: "Mayor & Vice Mayor", href: "/staff/officials/executive" },
            { label: "Councilors", href: "/staff/officials/councilors" },
        ],
    },
    {
        icon: Building2,
        label: "Services",
        href: "/staff/services",
        subItems: [
            { label: "All Services", href: "/staff/services" },
            { label: "Departments", href: "/staff/services/departments" },
            { label: "E-Services", href: "/staff/services/e-services" },
        ],
    },
    { icon: UserCog, label: "User Management", href: "/staff/user-management" },
];

// ─── Logout Modal ─────────────────────────────────────────────────────────────
function LogoutModal({ onClose, onConfirm }) {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center transition-colors"
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
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 shadow-sm transition-colors">
                            <LogOut size={20} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-1 transition-colors">
                            Sign out of your account?
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
                            Are you sure you want to leave? Any unsaved changes
                            or active progress will be lost.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-all"
                        >
                            Cancel
                        </button>

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

    const filteredNavItems = NAV_ITEMS.filter((item) => {
        if (item.label === "User Management" && userRole !== "admin") {
            return false;
        }
        return true;
    });

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", collapsed.toString());
    }, [collapsed]);

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

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "_token";
        input.value = csrfToken;
        form.appendChild(input);

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
                className={`flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 shadow-sm z-20 relative no-scrollbar ${
                    collapsed ? "w-16" : "w-64"
                }`}
                style={{ overflow: 'hidden' }}
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

                <nav className={`flex-1 py-4 px-3 space-y-1 ${!collapsed ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`} style={{ overflowX: 'hidden' }}>
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

                <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1 transition-colors min-w-0" style={{ overflow: 'hidden' }}>
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
                        <span
                            className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                                collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                            }`}
                        >
                            Sign out
                        </span>
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
                        <span
                            className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap text-xs font-medium ${
                                collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                            }`}
                        >
                            Collapse Menu
                        </span>
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

    const [me, setMe] = useState(null);
    const [meLoading, setMeLoading] = useState(true);
    const [meError, setMeError] = useState("");

    // Modal & Form State
    const [isMeModalOpen, setIsMeModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
    const fileInputRef = useRef(null);

    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        position: "",
        department: "",
        profileImage: null,
        profileImageUrl: "",
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

    // Fetch logged-in user details for header avatar
    useEffect(() => {
        let cancelled = false;
        const fetchMe = async () => {
            try {
                setMeLoading(true);
                setMeError("");
                const res = await fetch("/api/staff/me", {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                });
                if (!res.ok) throw new Error("Failed to load user");
                const data = await res.json();
                if (cancelled) return;

                setMe(data.user || null);

                // Prefill form
                if (data.user) {
                    const nameParts = (data.user.name || "").split(" ");
                    setEditForm((prev) => ({
                        ...prev,
                        firstName: data.user.firstName || nameParts[0] || "",
                        lastName:
                            data.user.lastName ||
                            nameParts.slice(1).join(" ") ||
                            "",
                        middleName: data.user.middleName || "",
                        email: data.user.email || "",
                        position: data.user.position || "",
                        department: data.user.department || "",
                        profileImageUrl: data.user.avatar || "",
                    }));
                }
            } catch (e) {
                if (cancelled) return;
                setMeError(e?.message || "Failed to load user");
                setMe(null);
            } finally {
                if (cancelled) return;
                setMeLoading(false);
            }
        };
        fetchMe();
        return () => {
            cancelled = true;
        };
    }, []);

    const initials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || "?";
        const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
        return (first + second).toUpperCase();
    };

    const formatDept = (d) => {
        if (!d) return "—";
        const depts = {
            mayor: "Office of the Mayor",
            admin: "Administrative Office",
            it: "IT Department",
            hr: "Human Resources",
            finance: "Finance Office",
            planning: "Planning Office",
            public: "Public Information Office",
            drrm: "DRRM Office",
            health: "Health Office",
            engineering: "Engineering Office",
            other: "Other",
        };
        return depts[d] || d;
    };

    // --- Profile Editing Handlers ---
    const handleInputChange = (field) => (e) => {
        setEditForm({ ...editForm, [field]: e.target.value });
    };

    const handleImageClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Client-side validation: Check file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                setSaveMessage({
                    type: "error",
                    text: "Image size must be less than 10MB",
                });
                e.target.value = ""; // Clear the file input
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
            if (!allowedTypes.includes(file.type)) {
                setSaveMessage({
                    type: "error",
                    text: "Only JPG, PNG, WebP, GIF, and SVG images are allowed",
                });
                e.target.value = ""; // Clear the file input
                return;
            }

            setEditForm({
                ...editForm,
                profileImage: file,
                profileImageUrl: URL.createObjectURL(file),
            });
            setSaveMessage({ type: "", text: "" }); // Clear any previous error
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage({ type: "", text: "" });

        try {
            const formData = new FormData();
            // Always append all fields so backend can handle updates properly
            formData.append("firstName", editForm.firstName || "");
            formData.append("lastName", editForm.lastName || "");
            formData.append("middleName", editForm.middleName || "");
            formData.append("email", editForm.email || "");
            formData.append("position", editForm.position || "");
            formData.append("department", editForm.department || "");
            if (editForm.profileImage) {
                formData.append("avatar", editForm.profileImage);
            }

            const res = await fetch("/api/staff/profile/update", {
                method: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || errorData.errors ? Object.values(errorData.errors).flat().join(', ') : "Failed to update profile");
            }

            const updatedData = await res.json();
            setMe(updatedData.user);

            // Update edit form with new data from server
            if (updatedData.user) {
                setEditForm((prev) => ({
                    ...prev,
                    firstName: updatedData.user.firstName || "",
                    lastName: updatedData.user.lastName || "",
                    middleName: updatedData.user.middleName || "",
                    email: updatedData.user.email || "",
                    position: updatedData.user.position || "",
                    department: updatedData.user.department || "",
                    profileImageUrl: updatedData.user.avatar || "",
                }));
            }

            setSaveMessage({
                type: "success",
                text: "Profile updated successfully!",
            });
            setTimeout(() => {
                setIsEditing(false);
                setSaveMessage({ type: "", text: "" });
            }, 2000);
        } catch (error) {
            setSaveMessage({
                type: "error",
                text: error.message || "An error occurred.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {/* TOP HEADER COMPONENT */}
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
                        <div className="relative">
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                                }}
                                onClick={() => {
                                    setIsMeModalOpen(true);
                                    setIsEditing(false);
                                    setSaveMessage({ type: "", text: "" });
                                }}
                                title={me ? "View profile" : "Loading..."}
                                disabled={meLoading}
                            >
                                {meLoading ? (
                                    "..."
                                ) : me?.avatar ? (
                                    <img
                                        src={me.avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    initials(me?.name)
                                )}
                            </button>
                        </div>

                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                                {me ? me.name : "Loading..."}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 transition-colors">
                                {me
                                    ? `${me.position || ""}${me.department ? " • " + formatDept(me.department) : ""}`
                                    : "—"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEPARATED MODAL (Escapes z-10 Trap) */}
            {isMeModalOpen && (
                <div
                    id="staff-me-modal"
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                >
                    <div
                        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMeModalOpen(false)}
                    />

                    <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden">
                        <div
                            className="h-1.5 w-full flex-shrink-0"
                            style={{
                                background:
                                    "linear-gradient(90deg, #3b82f6, #1d4ed8, #eab308, #dc2626)",
                            }}
                        />

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {/* Header: Cleaned up, only X button remains */}
                            <div className="flex items-start justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {isEditing
                                        ? "Edit Profile"
                                        : "Staff Profile"}
                                </h2>

                                <button
                                    type="button"
                                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                                    onClick={() => setIsMeModalOpen(false)}
                                    title="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {saveMessage.text && (
                                <div
                                    className={`mb-4 p-3 rounded-xl flex items-start gap-2 text-sm ${
                                        saveMessage.type === "success"
                                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                    }`}
                                >
                                    {saveMessage.type === "success" ? (
                                        <CheckCircle2
                                            size={16}
                                            className="mt-0.5"
                                        />
                                    ) : (
                                        <AlertCircle
                                            size={16}
                                            className="mt-0.5"
                                        />
                                    )}
                                    <span>{saveMessage.text}</span>
                                </div>
                            )}

                            <form
                                onSubmit={handleSaveProfile}
                                className="space-y-6"
                            >
                                {/* Circular Profile Image */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`relative w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center text-white text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 ${isEditing ? "cursor-pointer group" : ""}`}
                                        onClick={handleImageClick}
                                    >
                                        {editForm.profileImageUrl || me?.avatar ? (
                                            <img
                                                src={editForm.profileImageUrl || me?.avatar}
                                                alt="Profile"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            initials(me?.name)
                                        )}

                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Camera
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml"
                                        className="hidden"
                                    />
                                    {isEditing && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Click to change photo (Max 10MB)
                                        </p>
                                    )}
                                    {!isEditing && (
                                        <div className="text-center mt-3">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {me?.name || "—"}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {me?.role || "Staff"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            First Name
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <User
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                                    size={14}
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.firstName}
                                                    onChange={handleInputChange(
                                                        "firstName",
                                                    )}
                                                    required
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-transparent">
                                                {editForm.firstName || "—"}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Last Name
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <User
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                                    size={14}
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.lastName}
                                                    onChange={handleInputChange(
                                                        "lastName",
                                                    )}
                                                    required
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-transparent">
                                                {editForm.lastName || "—"}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Middle Name
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <User
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                                    size={14}
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.middleName}
                                                    onChange={handleInputChange(
                                                        "middleName",
                                                    )}
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-transparent">
                                                {editForm.middleName || "—"}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Email Address
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                                    size={14}
                                                />
                                                <input
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={handleInputChange(
                                                        "email",
                                                    )}
                                                    required
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-transparent flex items-center gap-2">
                                                {editForm.email || "—"}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Position
                                        </label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <Building2
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                                                    size={14}
                                                />
                                                <select
                                                    value={editForm.position}
                                                    onChange={handleInputChange(
                                                        "position",
                                                    )}
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors appearance-none cursor-pointer"
                                                >
                                                    <option value="">
                                                        Select Position
                                                    </option>
                                                    <option value="Admin Officer">
                                                        Admin Officer
                                                    </option>
                                                    <option value="IT Specialist">
                                                        IT Specialist
                                                    </option>
                                                    <option value="HR Officer">
                                                        HR Officer
                                                    </option>
                                                    <option value="Finance Officer">
                                                        Finance Officer
                                                    </option>
                                                    <option value="Planning Officer">
                                                        Planning Officer
                                                    </option>
                                                    <option value="Public Information Officer">
                                                        Public Information Officer
                                                    </option>
                                                    <option value="DRRM Officer">
                                                        DRRM Officer
                                                    </option>
                                                    <option value="Health Officer">
                                                        Health Officer
                                                    </option>
                                                    <option value="Engineer">
                                                        Engineer
                                                    </option>
                                                    <option value="Clerk">Clerk</option>
                                                    <option value="Secretary">
                                                        Secretary
                                                    </option>
                                                    <option value="Supervisor">
                                                        Supervisor
                                                    </option>
                                                    <option value="Manager">
                                                        Manager
                                                    </option>
                                                    <option value="Director">
                                                        Director
                                                    </option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-transparent">
                                                {editForm.position || "—"}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Department
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editForm.department}
                                                onChange={handleInputChange(
                                                    "department",
                                                )}
                                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                            >
                                                <option value="">
                                                    Select Department
                                                </option>
                                                <option value="mayor">
                                                    Office of the Mayor
                                                </option>
                                                <option value="admin">
                                                    Administrative Office
                                                </option>
                                                <option value="it">
                                                    IT Department
                                                </option>
                                                <option value="hr">
                                                    Human Resources
                                                </option>
                                                <option value="finance">
                                                    Finance Office
                                                </option>
                                                <option value="planning">
                                                    Planning Office
                                                </option>
                                                <option value="public">
                                                    Public Information Office
                                                </option>
                                                <option value="drrm">
                                                    DRRM Office
                                                </option>
                                                <option value="health">
                                                    Health Office
                                                </option>
                                                <option value="engineering">
                                                    Engineering Office
                                                </option>
                                                <option value="other">
                                                    Other
                                                </option>
                                            </select>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-transparent">
                                                {formatDept(
                                                    editForm.department,
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {meError ? (
                                    <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                                        {meError}
                                    </p>
                                ) : null}

                                {/* Action Buttons: Consolidated at the bottom */}
                                <div className="pt-4 flex gap-3">
                                    {isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsEditing(false)
                                                }
                                                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all text-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm disabled:opacity-70"
                                            >
                                                <Save size={16} />
                                                {isSaving
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsEditing(true);
                                            }}
                                            className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                                        >
                                            <Edit2 size={16} />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
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
