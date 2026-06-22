import React, { useEffect, useState } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Menu,
    X,
    ChevronDown,
    Landmark,
    MessageCircle,
    HeartPulse,
    BookOpen,
    Briefcase,
    Target,
} from "lucide-react";

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";

export default function Mayor() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
    const [mayor, setMayor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMayorData = async () => {
            try {
                const res = await fetch("/api/public/executives", {
                    headers: { Accept: "application/json" },
                });
                const json = await res.json();

                if (json?.success && Array.isArray(json?.data)) {
                    // Find the mayor by checking if position contains "mayor" but not "vice mayor"
                    const mayorExecutive = json.data.find((e) => {
                        const pos = String(e?.position || "").toLowerCase();
                        return pos.includes("mayor") && !pos.includes("vice");
                    });
                    setMayor(mayorExecutive || null);
                }
            } catch (e) {
                console.error("Failed to fetch mayor data:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchMayorData();
    }, []);

    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    const AGENDA = [
        {
            title: "Public Health & Welfare",
            desc: "Expanding medical missions, free medicines, and upgrading the Cabuyao City Hospital facilities.",
            icon: HeartPulse,
            color: "text-red-500",
            bg: "bg-red-50",
        },
        {
            title: "Education for All",
            desc: "Increasing scholarship grants and providing better learning facilities for Cabuyeño youth.",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            title: "Economic Livelihood",
            desc: "Supporting local businesses and generating more job opportunities through PESO and local partnerships.",
            icon: Briefcase,
            color: "text-green-500",
            bg: "bg-green-50",
        },
        {
            title: "Infrastructure & Security",
            desc: "Building smart command centers, road widening projects, and comprehensive disaster response systems.",
            icon: Target,
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* 1. TOP BAR */}
            <PublicHeader activePage="government" />

            {/* 3. HERO BANNER */}
            <div className="relative w-full h-[250px] md:h-[350px] flex items-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                        backgroundImage: "url('/images/mayor-office.jpg')",
                    }}
                />
                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <Landmark
                            className="text-white"
                            size={40}
                            strokeWidth={2.5}
                        />
                        <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                            Office of the City Mayor
                        </h2>
                    </div>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-sm leading-relaxed ml-[56px]">
                        Dedicated to serving every Cabuyeño with transparency,
                        accountability, and dynamic leadership.
                    </p>
                </div>
            </div>

            {/* 4. MAYOR PROFILE SECTION */}
            <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative bg-white border border-gray-100">
                        {/* Image Section - Adjusted height for better proportion */}
                        <div
                            className="md:w-2/5 bg-[#1e293b] relative overflow-hidden"
                            style={{ minHeight: "500px", maxHeight: "650px" }}
                        >
                            <img
                                src={
                                    mayor?.photo ||
                                    (mayor?.photo_path
                                        ? `/storage/${mayor.photo_path}`
                                        : null) ||
                                    "/images/denha-mayor.png"
                                }
                                alt={
                                    mayor?.name || "Mayor Dennis Felipe C. Hain"
                                }
                                className="absolute inset-0 w-full h-full object-cover object-top"
                                style={{ objectPosition: "top center" }}
                                onError={(e) => {
                                    e.target.src = "/images/denha-mayor.png";
                                }}
                            />
                        </div>
                        {/* Content Section */}
                        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white">
                            {/* Badge */}
                            <span className="inline-block bg-red-50 text-red-600 text-xs font-bold px-4 py-1.5 rounded-full w-fit mb-4 shadow-sm border border-red-100 uppercase tracking-wide">
                                The Local Chief Executive
                            </span>

                            {/* Name and Title */}
                            <h2 className="text-3xl md:text-4xl font-black mb-1 text-gray-900 uppercase tracking-tight leading-tight">
                                {mayor?.name
                                    ? `${mayor.name.replace(/^Hon\.\s*/i, "").toUpperCase()}`
                                    : "MAYOR DENNIS FELIPE C. HAIN"}
                            </h2>
                            <h3 className="text-lg font-bold text-blue-700 mb-6">
                                City Mayor, Cabuyao City
                            </h3>

                            {/* Divider */}
                            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-red-600 mb-6 rounded-full"></div>

                            {/* Personal Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Education */}
                                {mayor?.education && (
                                    <div className="md:col-span-2">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                            Education
                                        </h4>
                                        <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                            {mayor.education}
                                        </p>
                                    </div>
                                )}

                                {/* Birthdate */}
                                {mayor?.birthdate && (
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                            Date of Birth
                                        </h4>
                                        <p className="text-sm text-gray-800 font-medium">
                                            {new Date(
                                                mayor.birthdate,
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                )}

                                {/* Election Date */}
                                {mayor?.election_date && (
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                            Date Elected
                                        </h4>
                                        <p className="text-sm text-gray-800 font-medium">
                                            {mayor.election_date}
                                        </p>
                                    </div>
                                )}

                                {/* Assumption Date */}
                                {mayor?.assumption_date && (
                                    <div className="md:col-span-2">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                            Date of Assumption
                                        </h4>
                                        <p className="text-sm text-gray-800 font-medium">
                                            {mayor.assumption_date}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-gray-200 my-6"></div>

                            {/* Quote */}
                            {mayor?.quote && (
                                <div className="mb-6 pl-4 py-2 border-l-4 border-red-500 bg-gray-50 rounded-r-lg">
                                    <p className="italic text-gray-700 text-sm leading-relaxed">
                                        "{mayor.quote}"
                                    </p>
                                </div>
                            )}

                            {/* Bio/Description */}
                            {/* Expertise */}
                            {mayor?.expertise && (
                                <div className="mb-8">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                        Areas of Expertise
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {String(mayor.expertise)
                                            .split("\n")
                                            .filter((e) => e.trim())
                                            .map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100"
                                                >
                                                    {item.trim()}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Social Media Links */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                                {mayor?.facebook_url ? (
                                    <a
                                        href={mayor.facebook_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#0f4a96] hover:bg-[#0c3975] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition w-full sm:w-auto shadow-md"
                                    >
                                        <MessageCircle size={16} />
                                        Official Facebook Page
                                    </a>
                                ) : (
                                    <a
                                        href="https://www.facebook.com/BagongCabuyao/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#0f4a96] hover:bg-[#0c3975] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition w-full sm:w-auto shadow-md"
                                    >
                                        <MessageCircle size={16} />
                                        Official Facebook Page
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 5. AGENDA GRID */}
            <div className="bg-gray-100 py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 inline-block relative">
                            Priority Programs & Agenda
                            <div className="flex h-1 w-24 absolute -bottom-4 left-1/2 -translate-x-1/2">
                                <div className="w-1/3 h-full bg-blue-600"></div>
                                <div className="w-1/3 h-full bg-yellow-400"></div>
                                <div className="w-1/3 h-full bg-red-600"></div>
                            </div>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {AGENDA.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex gap-6 items-start hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.bg}`}
                                >
                                    <item.icon
                                        className={item.color}
                                        size={32}
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-500 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. FOOTER */}
            <PublicFooter />
        </div>
    );
}
