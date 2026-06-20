import React, { useState, useEffect } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Menu,
    X,
    ChevronDown,
    Gavel,
    Scale,
    GraduationCap,
    Calendar,
    Award,
    Users,
    User,
} from "lucide-react";

const API_BASE_URL = "/api/public";

// Helper function to format dates in a readable format (e.g., "July 1, 2025")
const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return date.toLocaleDateString("en-US", options);
    } catch (e) {
        return dateString;
    }
};

export default function Council() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
    const [selectedCouncilor, setSelectedCouncilor] = useState(null);
    const [councilors, setCouncilors] = useState([]);
    const [viceMayor, setViceMayor] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch councilors and vice mayor from API
    useEffect(() => {
        fetchCouncilors();
        fetchViceMayor();
    }, []);

    const fetchCouncilors = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/councilors`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
            });

            if (!res.ok) {
                throw new Error(`Failed to load councilors (${res.status})`);
            }

            const json = await res.json();
            if (json.success) {
                setCouncilors(json.data);
            }
        } catch (e) {
            console.error("Failed to load councilors:", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchViceMayor = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/executives`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
            });

            if (!res.ok) {
                throw new Error(`Failed to load executives (${res.status})`);
            }

            const json = await res.json();
            if (json.success) {
                const vp = json.data.find(
                    (exec) => exec.position === "Vice Mayor",
                );
                if (vp) {
                    setViceMayor(vp);
                }
            }
        } catch (e) {
            console.error("Failed to load vice mayor:", e);
        }
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedCouncilor) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedCouncilor]);

    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    // Fallback image handler
    const handleImageError = (e, fallbackName) => {
        // Use a default avatar from Unsplash or a placeholder
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || "Councilor")}&background=0D9488&color=fff&size=200`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading councilors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* 1. TOP BAR */}
            <div
                className="w-full h-8 flex items-center px-6 text-white text-xs font-medium"
                style={{
                    background:
                        "linear-gradient(90deg, #4c1d95 0%, #dc2626 50%, #f59e0b 100%)",
                }}
            >
                Republic of the Philippines
            </div>

            {/* 2. NAVIGATION BAR */}
            <nav className="w-full bg-white px-6 md:px-12 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <img
                        src="/images/cab.png"
                        alt="City Logo"
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
                <div className="hidden xl:flex items-center gap-8">
                    <a
                        href="/"
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                    >
                        Home
                    </a>

                    {/* Dropdown: The City */}
                    <div className="relative group py-4">
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                            The City <ChevronDown size={14} />
                        </button>
                        <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
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
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
                            >
                                City Gallery
                            </a>
                        </div>
                    </div>

                    {/* Dropdown: Government (ACTIVE) */}
                    <div className="relative group py-4">
                        <button className="flex items-center gap-1 text-sm font-bold text-red-600 transition">
                            Government <ChevronDown size={14} />
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
                                className="block px-4 py-3 text-sm font-bold text-red-600 bg-red-50"
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

                    {/* Dropdown: E-Services */}
                    <div className="relative group py-4">
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                            E-Services <ChevronDown size={14} />
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
                            <a
                                href="/services"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
                            >
                                View All Services
                            </a>
                        </div>
                    </div>

                    {/* News & Updates Dropdown */}
                    <div className="relative group py-4">
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                            News <ChevronDown size={14} />
                        </button>
                        <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                            <a
                                href="/news"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
                            >
                                News Articles
                            </a>
                            <a
                                href="/announcements"
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600"
                            >
                                Announcements
                            </a>
                        </div>
                    </div>

                    <a
                        href="/contact"
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                    >
                        Contact
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="xl:hidden p-2 text-gray-600 hover:text-red-600 transition"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="xl:hidden bg-white border-t border-gray-100 shadow-lg">
                    <div className="px-6 py-4 space-y-4">
                        <a
                            href="/"
                            className="block py-2 text-sm font-medium text-gray-600 hover:text-red-600"
                        >
                            Home
                        </a>
                        <div>
                            <button
                                onClick={() => toggleMobileDropdown("the-city")}
                                className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-600 hover:text-red-600"
                            >
                                The City
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${openMobileDropdown === "the-city" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openMobileDropdown === "the-city" && (
                                <div className="pl-4 mt-2 space-y-2">
                                    <a
                                        href="/about"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        About Cabuyao
                                    </a>
                                    <a
                                        href="/accomplishments"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        Accomplishments
                                    </a>
                                    <a
                                        href="/tourism"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        Tourism & Landmarks
                                    </a>
                                    <a
                                        href="/gallery"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        City Gallery
                                    </a>
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() =>
                                    toggleMobileDropdown("government")
                                }
                                className="flex items-center justify-between w-full py-2 text-sm font-bold text-red-600"
                            >
                                Government
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${openMobileDropdown === "government" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openMobileDropdown === "government" && (
                                <div className="pl-4 mt-2 space-y-2">
                                    <a
                                        href="/mayor"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        Office of the Mayor
                                    </a>
                                    <a
                                        href="/council"
                                        className="block py-1.5 text-sm font-bold text-red-600"
                                    >
                                        Sangguniang Panlungsod
                                    </a>
                                    <a
                                        href="/departments"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        City Departments
                                    </a>
                                    <a
                                        href="/transparency"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        Transparency Seal
                                    </a>
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() =>
                                    toggleMobileDropdown("e-services")
                                }
                                className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-600 hover:text-red-600"
                            >
                                E-Services
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${openMobileDropdown === "e-services" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openMobileDropdown === "e-services" && (
                                <div className="pl-4 mt-2 space-y-2">
                                    <a
                                        href="/bplo"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        Business Permits (BPLO)
                                    </a>
                                    <a
                                        href="/peso"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        Job Openings (PESO)
                                    </a>
                                    <a
                                        href="/registry"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        Civil Registry
                                    </a>
                                    <a
                                        href="/health"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        Health Services
                                    </a>
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                onClick={() => toggleMobileDropdown("news")}
                                className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-600 hover:text-red-600"
                            >
                                News & Updates
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform ${openMobileDropdown === "news" ? "rotate-180" : ""}`}
                                />
                            </button>
                            {openMobileDropdown === "news" && (
                                <div className="pl-4 mt-2 space-y-2">
                                    <a
                                        href="/news"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        News Articles
                                    </a>
                                    <a
                                        href="/announcements"
                                        className="block py-1.5 text-sm text-gray-500"
                                    >
                                        Announcements
                                    </a>
                                </div>
                            )}
                        </div>
                        <a
                            href="/contact"
                            className="block py-2 text-sm font-medium text-gray-600 hover:text-red-600"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            )}

            {/* HERO SECTION */}
            <div className="relative w-full h-[250px] md:h-[350px] flex items-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: "url('/images/councilor.jpg')" }}
                />
                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <Gavel
                            className="text-white"
                            size={40}
                            strokeWidth={2.5}
                        />
                        <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                            Sangguniang Panlungsod
                        </h2>
                    </div>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-sm leading-relaxed ml-[56px]">
                        The local legislative body of the City of Cabuyao,
                        enacting ordinances and resolutions for the public good.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 mb-16 flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Scale size={40} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Legislative Mandate
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            The Sangguniang Panlungsod (City Council) is
                            responsible for the enactment of local ordinances,
                            approval of resolutions, appropriation of funds, and
                            the formulation of policies that promote the general
                            welfare of the city and its inhabitants.
                        </p>
                    </div>
                </div>

                <div className="text-center mb-12 flex flex-col items-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        Presiding Officer
                    </h3>
                    <div className="flex h-1 w-24">
                        <div className="w-1/3 h-full bg-blue-600"></div>
                        <div className="w-1/3 h-full bg-yellow-400"></div>
                        <div className="w-1/3 h-full bg-red-600"></div>
                    </div>
                </div>

                {viceMayor ? (
                    <div
                        className="bg-white rounded-3xl shadow-lg border border-gray-100 max-w-3xl mx-auto flex flex-col md:flex-row items-center p-6 md:p-8 mb-20 group cursor-pointer"
                        onClick={() =>
                            setSelectedCouncilor({
                                id: viceMayor.id,
                                name: viceMayor.name,
                                position: viceMayor.position,
                                photo:
                                    viceMayor.photo ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(viceMayor.name)}&background=0D9488&color=fff&size=400`,
                                education: viceMayor.education || "",
                                birthday: "",
                                election_date: viceMayor.election_date,
                                assumption_date: viceMayor.assumption_date,
                                chairmanships: [],
                                memberships: [],
                                bio: viceMayor.bio || "",
                                expertise: viceMayor.expertise || "",
                                quote: viceMayor.quote || "",
                            })
                        }
                    >
                        <div className="w-56 h-56 md:w-64 md:h-64 relative rounded-full overflow-hidden flex-shrink-0 mb-6 md:mb-0 mx-auto md:mx-0 shadow-sm border-2 border-gray-50 group-hover:border-red-500">
                            <img
                                src={
                                    viceMayor.photo ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(viceMayor.name)}&background=0D9488&color=fff&size=400`
                                }
                                alt={viceMayor.name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                onError={(e) =>
                                    handleImageError(e, "Vice Mayor")
                                }
                            />
                        </div>
                        <div className="flex-1 md:pl-10 flex flex-col justify-center text-center md:text-left">
                            <span className="bg-red-50 text-red-600 text-xs font-bold px-4 py-1.5 rounded-full mb-4 inline-block w-max mx-auto md:mx-0 border border-red-100 uppercase tracking-wide">
                                City Vice Mayor
                            </span>
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                {viceMayor.name}
                            </h3>
                            <p className="text-gray-500 mb-3">
                                Presiding Officer of the Sangguniang Panlungsod
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                {viceMayor.election_date && (
                                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
                                        <Award
                                            size={14}
                                            className="text-red-500 flex-shrink-0"
                                        />
                                        <span className="font-medium text-xs text-gray-700">
                                            Elected as Cabuyao City Councilor
                                            last {viceMayor.election_date}
                                        </span>
                                    </div>
                                )}
                                {viceMayor.assumption_date && (
                                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
                                        <Users
                                            size={14}
                                            className="text-purple-500 flex-shrink-0"
                                        />
                                        <span className="font-medium text-xs text-gray-700">
                                            Date of Assumption:{" "}
                                            {viceMayor.assumption_date}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-4 md:mt-6">
                                View Full Profile
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 max-w-3xl mx-auto flex flex-col md:flex-row items-center p-6 md:p-8 mb-20">
                        <div className="text-center text-gray-500">
                            <p className="text-lg">
                                Vice Mayor information will be updated soon.
                            </p>
                        </div>
                    </div>
                )}

                <div className="text-center mb-12 flex flex-col items-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                        City Councilors
                    </h3>
                    <div className="flex h-1 w-24">
                        <div className="w-1/3 h-full bg-blue-600"></div>
                        <div className="w-1/3 h-full bg-yellow-400"></div>
                        <div className="w-1/3 h-full bg-red-600"></div>
                    </div>
                </div>

                {councilors.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No councilors available at this time.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {councilors.map((councilor) => (
                            <div
                                key={councilor.id}
                                onClick={() => setSelectedCouncilor(councilor)}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-red-200 cursor-pointer transition-all duration-300 p-6 flex flex-col items-center text-center group"
                            >
                                <div className="w-32 h-32 rounded-full overflow-hidden mb-5 border-2 border-gray-50 group-hover:border-red-500 transition-colors shadow-sm">
                                    <img
                                        src={
                                            councilor.photo ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(councilor.name)}&background=0D9488&color=fff&size=200`
                                        }
                                        alt={councilor.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) =>
                                            handleImageError(e, councilor.name)
                                        }
                                    />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1 leading-tight group-hover:text-red-600 transition-colors">
                                    {councilor.name}
                                </h4>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-2">
                                    View Profile
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Councilor Detail Modal */}
            {selectedCouncilor && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={() => setSelectedCouncilor(null)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedCouncilor(null)}
                            className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 rounded-full text-gray-600 transition-colors shadow-md z-10"
                        >
                            <X size={22} />
                        </button>

                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 rounded-t-3xl px-8 pt-8 pb-4">
                            <div className="flex flex-col items-center">
                                {/* Resume-style portrait profile picture */}
                                <div className="relative mb-6 group">
                                    <div className="w-40 h-52 sm:w-48 sm:h-60 rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                                        <img
                                            src={
                                                selectedCouncilor.photo ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCouncilor.name)}&background=0D9488&color=fff&size=400`
                                            }
                                            alt={selectedCouncilor.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) =>
                                                handleImageError(
                                                    e,
                                                    selectedCouncilor.name,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Position Badge */}
                                <div className="mb-4">
                                    <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg uppercase tracking-wide">
                                        {selectedCouncilor.position ||
                                            "City Councilor"}
                                    </span>
                                </div>

                                {/* Name */}
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-5 leading-tight">
                                    {selectedCouncilor.name}
                                </h2>

                                {/* Info Pills - Centered */}
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {selectedCouncilor.education && (
                                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
                                            <GraduationCap
                                                size={16}
                                                className="text-blue-500 flex-shrink-0"
                                            />
                                            <span className="font-medium text-sm text-gray-700">
                                                {selectedCouncilor.education}
                                            </span>
                                        </div>
                                    )}
                                    {selectedCouncilor.birthday && (
                                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
                                            <Calendar
                                                size={16}
                                                className="text-green-500 flex-shrink-0"
                                            />
                                            <span className="font-medium text-sm text-gray-700">
                                                Born on{" "}
                                                {formatDate(
                                                    selectedCouncilor.birthday,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {selectedCouncilor.election_date && (
                                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
                                            <Award
                                                size={16}
                                                className="text-red-500 flex-shrink-0"
                                            />
                                            <span className="font-medium text-sm text-gray-700">
                                                Elected as Cabuyao City
                                                Councilor last{" "}
                                                {formatDate(
                                                    selectedCouncilor.election_date,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {selectedCouncilor.assumption_date && (
                                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
                                            <Users
                                                size={16}
                                                className="text-purple-500 flex-shrink-0"
                                            />
                                            <span className="font-medium text-sm text-gray-700">
                                                Date of Assumption:{" "}
                                                {formatDate(
                                                    selectedCouncilor.assumption_date,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-6 sm:p-8">
                            <div className="space-y-6">
                                {/* Quote */}
                                {selectedCouncilor.quote && (
                                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border-l-4 border-red-500">
                                        <p className="text-lg text-gray-700 italic font-medium leading-relaxed">
                                            "{selectedCouncilor.quote}"
                                        </p>
                                    </div>
                                )}

                                {/* Biography */}
                                {selectedCouncilor.bio && (
                                    <div className="bg-gray-50 rounded-2xl p-5">
                                        <h4 className="flex items-center gap-3 font-bold text-gray-900 mb-3 text-lg">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <User
                                                    size={20}
                                                    className="text-purple-600"
                                                />
                                            </div>
                                            About
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed">
                                            {selectedCouncilor.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Expertise */}
                                {selectedCouncilor.expertise && (
                                    <div className="bg-gray-50 rounded-2xl p-5">
                                        <h4 className="flex items-center gap-3 font-bold text-gray-900 mb-4 text-lg">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Award
                                                    size={20}
                                                    className="text-green-600"
                                                />
                                            </div>
                                            Expertise & Focus Areas
                                        </h4>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {Array.isArray(
                                                selectedCouncilor.expertise,
                                            )
                                                ? selectedCouncilor.expertise.map(
                                                      (exp, idx) => (
                                                          <li
                                                              key={idx}
                                                              className="flex items-start gap-2.5 bg-white rounded-lg px-3.5 py-2.5 shadow-sm border border-gray-100"
                                                          >
                                                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                                                              <span className="text-gray-700 text-sm font-medium leading-relaxed">
                                                                  {exp}
                                                              </span>
                                                          </li>
                                                      ),
                                                  )
                                                : selectedCouncilor.expertise
                                                      .split("\n")
                                                      .filter((e) => e.trim())
                                                      .map((exp, idx) => (
                                                          <li
                                                              key={idx}
                                                              className="flex items-start gap-2.5 bg-white rounded-lg px-3.5 py-2.5 shadow-sm border border-gray-100"
                                                          >
                                                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                                                              <span className="text-gray-700 text-sm font-medium leading-relaxed">
                                                                  {exp.trim()}
                                                              </span>
                                                          </li>
                                                      ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Chairmanships */}
                                {selectedCouncilor.chairmanships &&
                                    selectedCouncilor.chairmanships.length >
                                        0 && (
                                        <div className="bg-gray-50 rounded-2xl p-5">
                                            <h4 className="flex items-center gap-3 font-bold text-gray-900 mb-4 text-lg">
                                                <div className="p-2 bg-yellow-100 rounded-lg">
                                                    <Award
                                                        size={20}
                                                        className="text-yellow-600"
                                                    />
                                                </div>
                                                Committee Chairmanships
                                            </h4>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {selectedCouncilor.chairmanships.map(
                                                    (com, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2.5 bg-white rounded-lg px-3.5 py-2.5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                                                            <span className="text-gray-700 text-sm font-medium leading-relaxed break-words">
                                                                {com}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                {/* Memberships */}
                                {selectedCouncilor.memberships &&
                                    selectedCouncilor.memberships.length >
                                        0 && (
                                        <div className="bg-gray-50 rounded-2xl p-5">
                                            <h4 className="flex items-center gap-3 font-bold text-gray-900 mb-4 text-lg">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Users
                                                        size={20}
                                                        className="text-blue-600"
                                                    />
                                                </div>
                                                Committee Memberships
                                            </h4>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {selectedCouncilor.memberships.map(
                                                    (com, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2.5 bg-white rounded-lg px-3.5 py-2.5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                                            <span className="text-gray-700 text-sm font-medium leading-relaxed break-words">
                                                                {com}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                {/* Empty State */}
                                {(!selectedCouncilor.chairmanships ||
                                    selectedCouncilor.chairmanships.length ===
                                        0) &&
                                    (!selectedCouncilor.memberships ||
                                        selectedCouncilor.memberships.length ===
                                            0) && (
                                        <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <p className="text-base">
                                                Committee assignments will be
                                                updated soon.
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="bg-[#1E3A5F] text-white pt-16 pb-10 px-6 relative">
                {/* --- FLOATING BANNER LOGOS --- */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            {/* ACTUAL FOOTER LOGO */}
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

                    {/* RESTORED Quick Links */}
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

                    {/* RESTORED Services */}
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

                    {/* Contact Us Section */}
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

                {/* Bottom Copyright Bar */}
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
