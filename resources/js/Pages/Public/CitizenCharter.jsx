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

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";
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
            <PublicHeader activePage="government" />

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
            <PublicFooter />
        </div>
    );
}
