import React, { useState } from "react";
import {
    ArrowLeft,
    Download,
    FileText,
    Eye,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Menu,
    X,
    ChevronDown as ChevronDownIcon,
    Building,
    Briefcase,
    HeartPulse,
    Hammer,
} from "lucide-react";

// Multiple Citizen Charters from different departments
const CITIZEN_CHARTERS = [
    {
        id: 1,
        title: "Treasury Citizen's Charter",
        department: "City Treasury Office",
        description:
            "Services related to tax collection, business permits, and treasury operations",
        pdfUrl: "/documents/treasury-citizens-charter.pdf",
        icon: "Building",
        color: "bg-blue-500",
    },
    {
        id: 2,
        title: "Mayor's Office Citizen's Charter",
        department: "Office of the Mayor",
        description: "Services and processes handled by the Mayor's Office",
        pdfUrl: "/documents/mayors-office-citizen-charter.pdf",
        icon: "FileText",
        color: "bg-red-500",
    },
    {
        id: 3,
        title: "2026 BPLO Citizen's Charter",
        department: "Business Permit & Licensing Office",
        description:
            "Business permit application, renewal, and licensing procedures",
        pdfUrl: "/documents/2026-cabuyao-bplo-citizens-charter.pdf",
        icon: "Briefcase",
        color: "bg-green-500",
    },
    {
        id: 4,
        title: "AICS Citizen's Charter",
        department: "Assistance to Individuals in Crisis Situation",
        description:
            "Financial and medical assistance programs for citizens in crisis",
        pdfUrl: "/documents/aics-mo-citizens-charter.pdf",
        icon: "HeartPulse",
        color: "bg-pink-500",
    },
    {
        id: 5,
        title: "Assessor Citizen's Charter",
        department: "City Assessor's Office",
        description:
            "Property assessment, real property tax declaration, and related services",
        pdfUrl: "/documents/assessor-citizens-charter.pdf",
        icon: "Building",
        color: "bg-purple-500",
    },
    {
        id: 6,
        title: "Engineering Citizen's Charter",
        department: "City Engineering Office",
        description:
            "Building permits, construction approvals, and engineering services",
        pdfUrl: "/documents/citizen-charter-engineering.pdf",
        icon: "Hammer",
        color: "bg-orange-500",
    },
];

// Common service sections for reference
const CHARTER_SECTIONS = [
    {
        id: 1,
        title: "Business Permit",
        description: "Apply or renew your business permit online",
        requirements: [
            "Valid ID",
            "Barangay Clearance",
            "Lease Contract or Proof of Ownership",
            "Previous Business Permit (for renewal)",
        ],
        processingTime: "5-7 working days",
        fee: "Varies based on business type and capital",
    },
    {
        id: 2,
        title: "Civil Registry Services",
        description: "Birth, marriage, and death certificates",
        requirements: ["Valid ID", "Supporting documents (as applicable)"],
        processingTime: "3-5 working days",
        fee: "₱50 - ₱150",
    },
    {
        id: 3,
        title: "Health Services",
        description: "Access city health programs and services",
        requirements: [
            "Valid ID",
            "Barangay Certificate of Indigency (if applicable)",
        ],
        processingTime: "Same day to 3 working days",
        fee: "Free to minimal",
    },
    {
        id: 4,
        title: "Social Welfare Services",
        description: "DSWD programs and assistance services",
        requirements: [
            "Valid ID",
            "Barangay Certificate of Indigency",
            "Supporting documents (as applicable)",
        ],
        processingTime: "Varies by program",
        fee: "Free",
    },
    {
        id: 5,
        title: "Community Tax Certificate (Cedula)",
        description: "Get your cedula or community tax certificate",
        requirements: ["Valid ID", "Proof of Income (if employed)"],
        processingTime: "Same day",
        fee: "₱5 basic + additional based on income",
    },
];

const PUBLIC_SERVICES_LINKS = [
    { name: "Business Permits (BPLO)", url: "/bplo" },
    { name: "Job Openings (PESO)", url: "/peso" },
    { name: "Civil Registry", url: "/registry" },
    { name: "Health Services", url: "/health" },
];

// Icon mapping for charters
const ICON_MAP = {
    Building: Building,
    FileText: FileText,
    Briefcase: Briefcase,
    HeartPulse: HeartPulse,
    Hammer: Hammer,
};

export default function CitizenCharter() {
    const [expandedSection, setExpandedSection] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

    const toggleSection = (id) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    // PDF URL - Update this with your actual PDF path
    const pdfUrl = "/documents/citizen-charter.pdf";

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* TOP BAR */}
            <div
                className="w-full h-8 flex items-center px-6 text-white text-xs font-medium"
                style={{
                    background:
                        "linear-gradient(90deg, #4c1d95 0%, #dc2626 50%, #f59e0b 100%)",
                }}
            >
                Republic of the Philippines
            </div>

            {/* NAVIGATION BAR */}
            <nav className="w-full bg-white px-6 md:px-12 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <a href="/" className="flex items-center gap-3">
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
                </a>

                {/* DESKTOP MENU */}
                <div className="hidden xl:flex items-center gap-6">
                    <a
                        href="/"
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                    >
                        Home
                    </a>

                    <div className="relative group py-4">
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                            The City <ChevronDownIcon size={14} />
                        </button>
                        <div className="absolute top-full left-0 mt-0 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                            <a
                                href="/about"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                About Cabuyao
                            </a>
                            <a
                                href="/accomplishments"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                Accomplishments
                            </a>
                            <a
                                href="/tourism"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                Tourism & Landmarks
                            </a>
                            <a
                                href="/gallery"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                City Gallery
                            </a>
                            <a
                                href="/citizen-charter"
                                className="block px-4 py-3 text-sm text-red-600 bg-red-50 font-semibold"
                            >
                                Citizen Charter
                            </a>
                        </div>
                    </div>

                    <div className="relative group py-4">
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                            Government <ChevronDownIcon size={14} />
                        </button>
                        <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                            <a
                                href="/mayor"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                Office of the Mayor
                            </a>
                            <a
                                href="/council"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                Sangguniang Panlungsod
                            </a>
                            <a
                                href="/departments"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                City Departments
                            </a>
                            <a
                                href="/transparency"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
                            >
                                Transparency Seal
                            </a>
                            <a
                                href="/citizen-charter"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
                            >
                                Citizen Charter
                            </a>
                        </div>
                    </div>

                    <div className="relative group py-4">
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                            E-Services <ChevronDownIcon size={14} />
                        </button>
                        <div className="absolute top-full left-0 mt-0 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                            <a
                                href="/bplo"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                Business Permits (BPLO)
                            </a>
                            <a
                                href="/peso"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                Job Openings (PESO)
                            </a>
                            <a
                                href="/registry"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                Civil Registry
                            </a>
                            <a
                                href="/health"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                Health Services
                            </a>
                        </div>
                    </div>

                    <a
                        href="/drrm"
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                    >
                        DRRM
                    </a>
                    <a
                        href="/news"
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                    >
                        News
                    </a>
                    <a
                        href="/contact"
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                    >
                        Contact
                    </a>
                </div>

                {/* MOBILE MENU BUTTON */}
                <div className="xl:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-800 hover:text-red-600 focus:outline-none transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X size={28} />
                        ) : (
                            <Menu size={28} />
                        )}
                    </button>
                </div>
            </nav>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col xl:hidden z-50 max-h-[85vh] overflow-y-auto">
                    <a
                        href="/"
                        className="px-6 py-4 text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors border-b border-gray-50"
                    >
                        Home
                    </a>

                    <div>
                        <button
                            onClick={() => toggleMobileDropdown("city")}
                            className="w-full px-6 py-4 flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors border-b border-gray-50"
                        >
                            The City
                            <ChevronDownIcon
                                size={18}
                                className={`transition-transform duration-300 ${
                                    openMobileDropdown === "city"
                                        ? "rotate-180 text-red-600"
                                        : "text-gray-400"
                                }`}
                            />
                        </button>
                        {openMobileDropdown === "city" && (
                            <div className="bg-gray-50 flex flex-col py-2 border-b border-gray-100 shadow-inner">
                                <a
                                    href="/about"
                                    className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    About Cabuyao
                                </a>
                                <a
                                    href="/accomplishments"
                                    className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    Accomplishments
                                </a>
                                <a
                                    href="/tourism"
                                    className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    Tourism & Landmarks
                                </a>
                                <a
                                    href="/gallery"
                                    className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    City Gallery
                                </a>
                                <a
                                    href="/citizen-charter"
                                    className="px-10 py-3 text-sm text-red-600 bg-red-50 font-semibold transition-colors"
                                >
                                    Citizen Charter
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Government & E-Services dropdowns similar to Home.jsx */}
                    {/* ... (add similar mobile dropdowns for Government and E-Services) */}

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
                        href="/contact"
                        className="px-6 py-4 text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors"
                    >
                        Contact
                    </a>
                </div>
            )}

            {/* PAGE HEADER WITH BANNER */}
            <div className="relative w-full h-[400px] bg-gray-900 overflow-hidden">
                {/* Banner Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                        backgroundImage: "url('/images/charter.jpg')",
                    }}
                />
                {/* Gradient Overlay */}
                <div />

                {/* Content */}
                <div className="relative z-10 h-full flex items-center px-6">
                    <div className="max-w-6xl mx-auto w-full">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                <FileText size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white">
                                    Citizen Charter
                                </h1>
                                <p className="text-white/80 mt-1">
                                    Your guide to city services and processes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* CHARTER GRID SECTION */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                        Department Citizen's Charters
                    </h2>
                    <p className="text-gray-500 text-center mb-12">
                        Select a department to view and download their citizen's
                        charter
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {CITIZEN_CHARTERS.map((charter) => {
                            const IconComponent =
                                ICON_MAP[charter.icon] || FileText;
                            return (
                                <div
                                    key={charter.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-red-200 transition-all duration-300 group"
                                >
                                    {/* Charter Header with Color */}
                                    <div
                                        className={`${charter.color} p-6 text-white`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                                                <IconComponent size={24} />
                                            </div>
                                            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                                                Department
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">
                                            {charter.title}
                                        </h3>
                                        <p className="text-sm text-white/90">
                                            {charter.department}
                                        </p>
                                    </div>

                                    {/* Charter Body */}
                                    <div className="p-6">
                                        <p className="text-sm text-gray-600 mb-6">
                                            {charter.description}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <a
                                                href={charter.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition font-medium text-sm"
                                            >
                                                <Eye size={16} />
                                                View PDF
                                            </a>
                                            <a
                                                href={charter.pdfUrl}
                                                download
                                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition font-medium text-sm"
                                            >
                                                <Download size={16} />
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CHARTER SUMMARY SECTION */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Service Standards
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <FileText className="text-red-600" size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Transparent
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Clear processes and requirements for all
                                services
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                <Eye className="text-blue-600" size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Accessible
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Easy access to government services for all
                                citizens
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <Download
                                    className="text-green-600"
                                    size={24}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Downloadable
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Access the full charter document anytime,
                                anywhere
                            </p>
                        </div>
                    </div>
                </div>

                {/* EXPANDABLE SERVICE SECTIONS */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Common Services
                    </h2>
                    <div className="space-y-4">
                        {CHARTER_SECTIONS.map((section) => (
                            <div
                                key={section.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                                >
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {section.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {section.description}
                                        </p>
                                    </div>
                                    {expandedSection === section.id ? (
                                        <ChevronUp
                                            size={20}
                                            className="text-gray-400"
                                        />
                                    ) : (
                                        <ChevronDown
                                            size={20}
                                            className="text-gray-400"
                                        />
                                    )}
                                </button>
                                {expandedSection === section.id && (
                                    <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">
                                                    Requirements
                                                </h4>
                                                <ul className="space-y-1">
                                                    {section.requirements.map(
                                                        (req, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="text-sm text-gray-600 flex items-center gap-2"
                                                            >
                                                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0" />
                                                                {req}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                                        Processing Time
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {section.processingTime}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                                        Fee
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {section.fee}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* QUICK LINKS TO E-SERVICES */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Access E-Services
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PUBLIC_SERVICES_LINKS.map((service, idx) => (
                            <a
                                key={idx}
                                href={service.url}
                                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-red-200 transition group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Click to access
                                        </p>
                                    </div>
                                    <ExternalLink
                                        size={20}
                                        className="text-gray-400 group-hover:text-red-600 transition"
                                    />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* CONTACT INFO */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Need Assistance?
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        If you have questions about any of our services or need
                        help with your application, our customer service team is
                        ready to assist you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/contact"
                            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition flex items-center gap-2"
                        >
                            Contact Us
                        </a>
                        <a
                            href="/faqs"
                            className="bg-white text-red-600 px-8 py-3 rounded-xl font-bold border-2 border-red-600 hover:bg-red-50 transition flex items-center gap-2"
                        >
                            View FAQs
                        </a>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-[#1E3A5F] text-white pt-16 pb-10 px-6 relative mt-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src="/images/cab.png"
                                alt="Cabuyao Logo"
                                className="w-12 h-12 object-contain rounded-full border-2 border-red-500 p-0.5 bg-white"
                                onError={(e) =>
                                    (e.target.style.display = "none")
                                }
                            />
                            <h2 className="text-xl font-bold">
                                City of
                                <br />
                                Cabuyao
                            </h2>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Province of Laguna. Committed to transparent
                            governance and public service.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="/"
                                    className="text-sm text-gray-400 hover:text-white transition"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about"
                                    className="text-sm text-gray-400 hover:text-white transition"
                                >
                                    About Cabuyao
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/citizen-charter"
                                    className="text-sm text-white font-semibold transition"
                                >
                                    Citizen Charter
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="text-sm text-gray-400 hover:text-white transition"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Services</h4>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="/bplo"
                                    className="text-sm text-gray-400 hover:text-white transition"
                                >
                                    Business Permit
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/registry"
                                    className="text-sm text-gray-400 hover:text-white transition"
                                >
                                    Civil Registry
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/health"
                                    className="text-sm text-gray-400 hover:text-white transition"
                                >
                                    Health Services
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-sm text-gray-400">
                                <span>
                                    City Hall, Cabuyao City
                                    <br />
                                    Province of Laguna, Philippines 4025
                                </span>
                            </li>
                            <li className="flex items-center gap-4 text-sm text-gray-400">
                                <span>(049) 554 9780 LOC. 303</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm text-gray-400">
                                <span>ciocabuyaoph@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-700 text-xs text-gray-500">
                    <p className="text-[#60A5FA]">
                        © 2026 City of Cabuyao. All rights reserved.
                    </p>
                    <p className="text-[#60A5FA]">
                        Powered by{" "}
                        <span className="text-red-400 font-medium">
                            City Information Office
                        </span>
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1.5 flex">
                    <div className="w-1/3 h-full bg-blue-600"></div>
                    <div className="w-1/3 h-full bg-yellow-400"></div>
                    <div className="w-1/3 h-full bg-red-600"></div>
                </div>
            </footer>
        </div>
    );
}
