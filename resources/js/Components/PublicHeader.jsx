import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import WeatherWidget from "./WeatherWidget";

/**
 * Navigation items configuration
 * Centralized for consistency across the site
 */
const NAV_ITEMS = {
    theCity: [
        { label: "About Cabuyao", href: "/about" },
        { label: "Accomplishments", href: "/accomplishments" },
        { label: "Tourism & Landmarks", href: "/tourism" },
        { label: "City Gallery", href: "/gallery" },
    ],
    government: [
        { label: "Office of the Mayor", href: "/mayor" },
        { label: "Sangguniang Panlungsod", href: "/council" },
        { label: "City Departments", href: "/departments" },
        { label: "Transparency Seal", href: "/transparency" },
        { label: "Citizen Charter", href: "/citizen-charter" },
    ],
    eServices: [
        { label: "Business Permits (BPLO)", href: "/bplo" },
        { label: "Job Openings (PESO)", href: "/peso" },
        { label: "Civil Registry", href: "/registry" },
        { label: "Health Services", href: "/health" },
    ],
};

/**
 * Dropdown menu item component for desktop navigation
 */
function DesktopDropdown({ label, items, active }) {
    return (
        <div className="relative group">
            <button
                className={`flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full transition ${
                    active
                        ? "text-red-600 bg-red-50"
                        : "text-gray-600 hover:text-red-600"
                }`}
            >
                {label}
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 group-hover:rotate-180 ${
                        active ? "text-red-600" : ""
                    }`}
                />
            </button>

            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                {items.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50 last:border-b-0"
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

/**
 * Mobile accordion menu item component
 */
function MobileAccordion({
    label,
    items,
    isOpen,
    onToggle,
    isActiveMenu,
    currentPath,
}) {
    return (
        <div>
            <button
                onClick={onToggle}
                className={`w-full px-6 py-4 flex items-center justify-between text-sm font-semibold transition-colors border-b border-gray-50 ${
                    isActiveMenu
                        ? "text-red-600 bg-red-50 border-l-4 border-red-600"
                        : "text-gray-800 hover:text-red-600 border-l-4 border-transparent"
                }`}
            >
                {label}
                <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-red-600" : "text-gray-400"
                    }`}
                />
            </button>
            {isOpen && (
                <div className="bg-gray-50 flex flex-col py-2 border-b border-gray-100 shadow-inner">
                    {items.map((item, idx) => {
                        const isSubItemActive = currentPath === item.href;
                        return (
                            <a
                                key={idx}
                                href={item.href}
                                className={`px-10 py-3 text-sm transition-colors ${
                                    isSubItemActive
                                        ? "text-red-600 font-bold bg-red-100/50"
                                        : "text-gray-600 hover:text-red-600"
                                }`}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/**
 * PublicHeader component
 * Reusable header for all public-facing pages
 */
export default function PublicHeader() {
    // 1. Auto-detect the current URL path
    const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/";

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    // 2. Helper functions to determine if links are active
    const isLinkActive = (path) => currentPath === path;
    const isDropdownActive = (items) => {
        return items.some(
            (item) =>
                currentPath === item.href ||
                currentPath.startsWith(item.href + "/"),
        );
    };

    return (
        <>
            {/* 1. TOP BAR */}
            <div
                className="w-full h-8 flex items-center justify-between px-6 text-white text-xs font-medium"
                style={{
                    background:
                        "linear-gradient(90deg, #4c1d95 0%, #dc2626 50%, #f59e0b 100%)",
                }}
            >
                <span>Republic of the Philippines</span>
                <WeatherWidget />
            </div>

            {/* STICKY CONTAINER */}
            <div className="sticky top-0 z-50 w-full shadow-sm bg-white">
                {/* 2. NAVIGATION BAR */}
                <nav className="w-full bg-white px-6 md:px-12 py-4 flex items-center justify-between">
                    <a
                        href="/"
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <img
                            src="/images/city-cab.png"
                            alt="Cabuyao Logo"
                            className="w-12 h-12 object-contain rounded-full border-2 border-red-500 p-0.5 bg-white group-hover:scale-110 transition-transform duration-300"
                            onError={(e) =>
                                (e.target.src =
                                    "https://via.placeholder.com/150?text=LOGO")
                            }
                        />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                                City of Cabuyao
                            </h1>
                            <p className="text-xs text-gray-500">
                                Official E-Governance Portal
                            </p>
                        </div>
                    </a>

                    {/* DESKTOP MENU */}
                    <div className="hidden xl:flex items-center gap-6">
                        <a
                            href="/"
                            className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                                isLinkActive("/")
                                    ? "text-red-600 bg-red-50"
                                    : "text-gray-600 hover:text-red-600"
                            }`}
                        >
                            Home
                        </a>

                        <DesktopDropdown
                            label="The City"
                            items={NAV_ITEMS.theCity}
                            active={isDropdownActive(NAV_ITEMS.theCity)}
                        />

                        <DesktopDropdown
                            label="Government"
                            items={NAV_ITEMS.government}
                            active={isDropdownActive(NAV_ITEMS.government)}
                        />

                        <DesktopDropdown
                            label="E-Services"
                            items={NAV_ITEMS.eServices}
                            active={isDropdownActive(NAV_ITEMS.eServices)}
                        />

                        <a
                            href="/drrm"
                            className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                                isLinkActive("/drrm")
                                    ? "text-red-600 bg-red-50"
                                    : "text-gray-600 hover:text-red-600"
                            }`}
                        >
                            DRRM
                        </a>
                        <a
                            href="/news"
                            className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                                isLinkActive("/news")
                                    ? "text-red-600 bg-red-50"
                                    : "text-gray-600 hover:text-red-600"
                            }`}
                        >
                            News
                        </a>
                        <a
                            href="/faqs"
                            className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                                isLinkActive("/faqs")
                                    ? "text-red-600 bg-red-50"
                                    : "text-gray-600 hover:text-red-600"
                            }`}
                        >
                            FAQs
                        </a>
                        <a
                            href="/contact"
                            className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                                isLinkActive("/contact")
                                    ? "text-red-600 bg-red-50"
                                    : "text-gray-600 hover:text-red-600"
                            }`}
                        >
                            Contact
                        </a>
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <div className="xl:hidden flex items-center">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="text-gray-800 hover:text-red-600 focus:outline-none transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X size={28} />
                            ) : (
                                <Menu size={28} />
                            )}
                        </button>
                    </div>
                </nav>

                {/* 3. MOBILE MENU */}
                {isMobileMenuOpen && (
                    <div className="w-full bg-white shadow-xl border-t border-gray-100 xl:hidden overflow-y-auto max-h-[calc(100vh-80px)]">
                        <a
                            href="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-6 py-4 text-sm font-semibold transition-colors border-b border-gray-50 ${
                                isLinkActive("/")
                                    ? "text-red-600 bg-red-50 border-l-4 border-red-600"
                                    : "text-gray-800 hover:text-red-600 border-l-4 border-transparent"
                            }`}
                        >
                            Home
                        </a>

                        <MobileAccordion
                            label="The City"
                            items={NAV_ITEMS.theCity}
                            isOpen={openMobileDropdown === "city"}
                            onToggle={() => toggleMobileDropdown("city")}
                            isActiveMenu={isDropdownActive(NAV_ITEMS.theCity)}
                            currentPath={currentPath}
                        />

                        <MobileAccordion
                            label="Government"
                            items={NAV_ITEMS.government}
                            isOpen={openMobileDropdown === "gov"}
                            onToggle={() => toggleMobileDropdown("gov")}
                            isActiveMenu={isDropdownActive(
                                NAV_ITEMS.government,
                            )}
                            currentPath={currentPath}
                        />

                        <MobileAccordion
                            label="E-Services"
                            items={NAV_ITEMS.eServices}
                            isOpen={openMobileDropdown === "services"}
                            onToggle={() => toggleMobileDropdown("services")}
                            isActiveMenu={isDropdownActive(NAV_ITEMS.eServices)}
                            currentPath={currentPath}
                        />

                        <a
                            href="/drrm"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-6 py-4 text-sm font-semibold transition-colors border-b border-gray-50 ${
                                isLinkActive("/drrm")
                                    ? "text-red-600 bg-red-50 border-l-4 border-red-600"
                                    : "text-gray-800 hover:text-red-600 border-l-4 border-transparent"
                            }`}
                        >
                            DRRM
                        </a>
                        <a
                            href="/news"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-6 py-4 text-sm font-semibold transition-colors border-b border-gray-50 ${
                                isLinkActive("/news")
                                    ? "text-red-600 bg-red-50 border-l-4 border-red-600"
                                    : "text-gray-800 hover:text-red-600 border-l-4 border-transparent"
                            }`}
                        >
                            News
                        </a>
                        <a
                            href="/faqs"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-6 py-4 text-sm font-semibold transition-colors border-b border-gray-50 ${
                                isLinkActive("/faqs")
                                    ? "text-red-600 bg-red-50 border-l-4 border-red-600"
                                    : "text-gray-800 hover:text-red-600 border-l-4 border-transparent"
                            }`}
                        >
                            FAQs
                        </a>
                        <a
                            href="/contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-6 py-4 text-sm font-semibold transition-colors ${
                                isLinkActive("/contact")
                                    ? "text-red-600 bg-red-50 border-l-4 border-red-600"
                                    : "text-gray-800 hover:text-red-600 border-l-4 border-transparent"
                            }`}
                        >
                            Contact
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
