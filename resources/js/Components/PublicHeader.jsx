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
        <div className="relative group py-4">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                {label} <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
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
function MobileAccordion({ label, items, isOpen, onToggle }) {
    return (
        <div>
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors border-b border-gray-50"
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
                    {items.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.href}
                            className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * PublicHeader component
 * Reusable header for all public-facing pages
 */
export default function PublicHeader({ activePage = "home" }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    const isActive = (page) => activePage === page;

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

            {/* 2. NAVIGATION BAR */}
            <nav className="w-full bg-white px-6 md:px-12 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img
                        src="/images/city-cab.png"
                        alt="Cabuyao Logo"
                        className="w-12 h-12 object-contain rounded-full border-2 border-red-500 p-0.5 bg-white"
                        onError={(e) =>
                            (e.target.src =
                                "https://via.placeholder.com/150?text=LOGO")
                        }
                    />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">
                            City of Cabuyao
                        </h1>
                        <p className="text-xs text-gray-500">
                            Official E-Governance Portal
                        </p>
                    </div>
                </div>

                {/* DESKTOP MENU */}
                <div className="hidden xl:flex items-center gap-6">
                    <a
                        href="/"
                        className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                            isActive("home")
                                ? "text-red-600 bg-red-50"
                                : "text-gray-600 hover:text-red-600"
                        }`}
                    >
                        Home
                    </a>

                    <DesktopDropdown
                        label="The City"
                        items={NAV_ITEMS.theCity}
                        active={isActive("city")}
                    />

                    <DesktopDropdown
                        label="Government"
                        items={NAV_ITEMS.government}
                        active={isActive("government")}
                    />

                    <DesktopDropdown
                        label="E-Services"
                        items={NAV_ITEMS.eServices}
                        active={isActive("services")}
                    />

                    <a
                        href="/drrm"
                        className={`text-sm font-medium transition ${
                            isActive("drrm")
                                ? "text-red-600"
                                : "text-gray-600 hover:text-red-600"
                        }`}
                    >
                        DRRM
                    </a>
                    <a
                        href="/news"
                        className={`text-sm font-medium transition ${
                            isActive("news")
                                ? "text-red-600"
                                : "text-gray-600 hover:text-red-600"
                        }`}
                    >
                        News
                    </a>
                    <a
                        href="/faqs"
                        className={`text-sm font-medium transition ${
                            isActive("faqs")
                                ? "text-red-600"
                                : "text-gray-600 hover:text-red-600"
                        }`}
                    >
                        FAQs
                    </a>
                    <a
                        href="/contact"
                        className={`text-sm font-medium transition ${
                            isActive("contact")
                                ? "text-red-600"
                                : "text-gray-600 hover:text-red-600"
                        }`}
                    >
                        Contact
                    </a>
                </div>

                {/* MOBILE MENU BUTTON */}
                <div className="xl:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

            {/* MOBILE MENU DROPDOWN (ACCORDION STYLE) */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col xl:hidden z-50 max-h-[85vh] overflow-y-auto">
                    <a
                        href="/"
                        className={`px-6 py-4 text-sm font-bold transition-colors ${
                            isActive("home")
                                ? "text-red-600 bg-red-50 border-l-4 border-red-600"
                                : "text-gray-800 hover:text-red-600"
                        }`}
                    >
                        Home
                    </a>

                    <MobileAccordion
                        label="The City"
                        items={NAV_ITEMS.theCity}
                        isOpen={openMobileDropdown === "city"}
                        onToggle={() => toggleMobileDropdown("city")}
                    />

                    <MobileAccordion
                        label="Government"
                        items={NAV_ITEMS.government}
                        isOpen={openMobileDropdown === "gov"}
                        onToggle={() => toggleMobileDropdown("gov")}
                    />

                    <MobileAccordion
                        label="E-Services"
                        items={NAV_ITEMS.eServices}
                        isOpen={openMobileDropdown === "services"}
                        onToggle={() => toggleMobileDropdown("services")}
                    />

                    <a
                        href="/drrm"
                        className="px-6 py-4 text-sm font-semibold text-gray-800 hover:text-red-600 border-b border-gray-50 transition-colors"
                    >
                        DRRM
                    </a>
                    <a
                        href="/news"
                        className="px-6 py-4 text-sm font-semibold text-gray-800 hover:text-red-600 border-b border-gray-50 transition-colors"
                    >
                        News
                    </a>
                    <a
                        href="/faqs"
                        className="px-6 py-4 text-sm font-semibold text-gray-800 hover:text-red-600 border-b border-gray-50 transition-colors"
                    >
                        FAQs
                    </a>
                    <a
                        href="/contact"
                        className="px-6 py-4 text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors"
                    >
                        Contact
                    </a>
                </div>
            )}
        </>
    );
}
