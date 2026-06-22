import React, { useState } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Menu,
    X,
    ChevronDown,
    ShieldAlert,
    PhoneCall,
    AlertTriangle,
    HeartPulse,
    Shield,
    Users,
    Activity,
    Package,
} from "lucide-react";

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";
// --- DRRM DATA ---
const HOTLINES = [
    {
        id: "cdrrmo",
        title: "CDRRMO Command Center",
        number: "(049) 531-2829",
        icon: ShieldAlert,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
    },
    {
        id: "pnp",
        title: "Philippine National Police (PNP)",
        number: "(049) 531-2222",
        icon: PhoneCall,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
    },
    {
        id: "bfp",
        title: "Bureau of Fire Protection (BFP)",
        number: "(049) 531-3333",
        icon: AlertTriangle,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
    },
    {
        id: "cho",
        title: "City Health Office / Ambulance",
        number: "(049) 531-4444",
        icon: HeartPulse,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
    },
];

const CAPABILITIES = [
    {
        id: "cap1",
        title: "Household Profiling",
        desc: "Digital registration of evacuees by household, including identification of vulnerable groups (children, seniors, PWDs).",
        icon: Users,
    },
    {
        id: "cap2",
        title: "Real-time Monitoring",
        desc: "Live tracking of evacuation center occupancy, capacity limits, and population movement across barangays.",
        icon: Activity,
    },
    {
        id: "cap3",
        title: "Relief Distribution",
        desc: "Systematic recording and monitoring of relief goods receiving and distribution to ensure fair allocation.",
        icon: Package,
    },
];

const EVACUATION_CENTERS = [
    {
        name: "Cabuyao City Hall Covered Court",
        brgy: "Sala",
        capacity: "500 families",
        status: "Standby",
    },
    {
        name: "Banay-Banay National High School",
        brgy: "Banay-Banay",
        capacity: "300 families",
        status: "Standby",
    },
    {
        name: "Bigaa Elementary School",
        brgy: "Bigaa",
        capacity: "250 families",
        status: "Standby",
    },
    {
        name: "Mamatid Covered Court",
        brgy: "Mamatid",
        capacity: "400 families",
        status: "Standby",
    },
];

export default function DRRM() {
    // --- STATES ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State to track which mobile dropdown is currently open
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

    // --- HELPER FUNCTION FOR MOBILE ACCORDION ---
    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* 1. TOP BAR */}
            <PublicHeader activePage="drrm" />

            {/* 3. HERO BANNER */}
            <div className="relative w-full h-[250px] md:h-[350px] flex items-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                        backgroundImage: "url('/images/drrm.jpg')",
                    }}
                />

                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <ShieldAlert
                            className="text-white"
                            size={40}
                            strokeWidth={2}
                        />
                        <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                            Disaster Risk Reduction & Management
                        </h2>
                    </div>
                    <p className="text-lg md:text-xl text-gray-100 max-w-3xl drop-shadow-md leading-relaxed ml-[56px]">
                        Official portal for emergency response, evacuation
                        management, and disaster preparedness in the City of
                        Cabuyao.
                    </p>
                </div>
            </div>

            {/* 4. MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 space-y-16">
                {/* TOP GRID: Hotlines & Portal Access */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side: Emergency Hotlines */}
                    <div className="lg:w-2/3 bg-[#fff5f5] rounded-3xl p-8 border border-red-50">
                        <div className="flex items-center gap-3 mb-8">
                            <PhoneCall
                                className="text-red-600"
                                size={24}
                                strokeWidth={2.5}
                            />
                            <h3 className="text-xl font-bold text-red-600">
                                Emergency Hotlines
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {HOTLINES.map((hotline) => (
                                <div
                                    key={hotline.id}
                                    className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center border border-white"
                                >
                                    <div className="flex items-center gap-5">
                                        <div
                                            className={`w-12 h-12 rounded-full ${hotline.iconBg} flex items-center justify-center flex-shrink-0`}
                                        >
                                            <hotline.icon
                                                size={24}
                                                className={hotline.iconColor}
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">
                                                {hotline.title}
                                            </p>
                                            <p className="text-xl font-black text-gray-900">
                                                {hotline.number}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Portal Login Card */}
                    <div className="lg:w-1/3 bg-[#0f172a] rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-lg border border-slate-800">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-white max-w-[150px] leading-tight">
                                    Evacuation Management System
                                </h3>
                                <div className="w-16 h-16 border border-slate-600 rounded-2xl flex items-center justify-center bg-slate-800/50">
                                    <Shield
                                        size={32}
                                        className="text-white"
                                        strokeWidth={1.5}
                                    />
                                </div>
                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                                Authorized personnel portal for evacuee
                                profiling, center monitoring, and relief
                                distribution tracking.
                            </p>

                            <a
                                href="/login"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md mb-4 text-center inline-block"
                            >
                                Access Portal Login
                            </a>

                            <p className="text-[10px] text-slate-500 text-center uppercase tracking-wide font-medium">
                                *For authorized CDRRMO and Barangay personnel
                                only.
                            </p>
                        </div>
                    </div>
                </div>

                {/* MIDDLE SECTION: Portal Capabilities */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">
                        Portal Capabilities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CAPABILITIES.map((cap) => (
                            <div
                                key={cap.id}
                                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                    <cap.icon size={24} strokeWidth={2} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-3">
                                    {cap.title}
                                </h4>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {cap.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM SECTION: Evacuation Centers Table */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <MapPin
                            className="text-blue-700"
                            size={28}
                            strokeWidth={2.5}
                        />
                        <h3 className="text-2xl font-bold text-gray-900">
                            Designated Evacuation Centers
                        </h3>
                    </div>

                    <div className="w-full">
                        {/* Table Header (Hidden on small screens) */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 pb-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-4">
                            <div className="col-span-5">Facility Name</div>
                            <div className="col-span-3">Barangay</div>
                            <div className="col-span-2">Max Capacity</div>
                            <div className="col-span-2 text-right">
                                Current Status
                            </div>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-3">
                            {EVACUATION_CENTERS.map((center, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 px-8 md:grid md:grid-cols-12 gap-4 items-center hover:border-blue-100 transition-colors"
                                >
                                    <div className="col-span-5 font-bold text-gray-900 mb-1 md:mb-0 text-sm">
                                        {center.name}
                                    </div>
                                    <div className="col-span-3 text-sm text-gray-500 mb-1 md:mb-0">
                                        {center.brgy}
                                    </div>
                                    <div className="col-span-2 text-sm text-gray-500 mb-3 md:mb-0">
                                        {center.capacity}
                                    </div>
                                    <div className="col-span-2 md:text-right">
                                        <span className="bg-green-100 text-green-700 border border-green-200 text-[11px] font-bold px-3 py-1.5 rounded-full inline-block uppercase tracking-wider shadow-sm">
                                            {center.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. FOOTER */}
            <footer className="bg-[#1E3A5F] text-white pt-16 pb-10 px-6 relative mt-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
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
                            governance and public service. Building a
                            progressive and sustainable community for every
                            Cabuyeño.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.facebook.com/BagongCabuyao/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 hover:opacity-80 transition overflow-hidden rounded-full"
                            >
                                <img
                                    src="/images/fb-logo.png"
                                    alt="Facebook"
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        (e.target.style.display = "none")
                                    }
                                />
                            </a>
                            <a
                                href="https://www.youtube.com/@mayordenha"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 hover:opacity-80 transition overflow-hidden rounded-full"
                            >
                                <img
                                    src="/images/yout.png"
                                    alt="YouTube"
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        (e.target.style.display = "none")
                                    }
                                />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 hover:opacity-80 transition overflow-hidden rounded-full"
                            >
                                <img
                                    src="/images/x.png"
                                    alt="X/Twitter"
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        (e.target.style.display = "none")
                                    }
                                />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 hover:opacity-80 transition overflow-hidden rounded-full"
                            >
                                <img
                                    src="/images/instagram.png"
                                    alt="Instagram"
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        (e.target.style.display = "none")
                                    }
                                />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {[
                                "Home",
                                "The City",
                                "Departments",
                                "News",
                                "DRRM",
                                "FAQs",
                            ].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-gray-400 hover:text-white transition"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Services</h4>
                        <ul className="space-y-4">
                            {[
                                "Business Permit",
                                "Real Property Tax",
                                "Job Openings",
                                "Civil Registry",
                                "Health Services",
                                "Social Welfare",
                            ].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-sm text-gray-400 hover:text-white transition"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-sm text-gray-400">
                                <MapPin
                                    size={20}
                                    className="text-red-500 mt-0.5 flex-shrink-0"
                                />
                                <span>
                                    City Hall, Cabuyao City
                                    <br />
                                    Province of Laguna, Philippines 4025
                                </span>
                            </li>
                            <li className="flex items-center gap-4 text-sm text-gray-400">
                                <Phone
                                    size={20}
                                    className="text-green-500 flex-shrink-0"
                                />
                                <span>(049) 554 9780 LOC. 303</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm text-gray-400">
                                <Mail
                                    size={20}
                                    className="text-yellow-500 flex-shrink-0"
                                />
                                <span>ciocabuyaoph@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm text-gray-400">
                                <Globe
                                    size={20}
                                    className="text-blue-500 flex-shrink-0"
                                />
                                <span>www.cabuyao.gov.ph</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-700 text-xs text-gray-500">
                    <p className="text-[#60A5FA]">
                        © 2026 Municipality of Cabuyao. All rights reserved.
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
