import React, { useState, useEffect } from "react";
import {
    ArrowRight,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Globe,
    Briefcase,
    Building,
    FileText,
    HeartPulse,
    ShieldAlert,
    Users,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    PlaySquare,
    Camera,
    Hash,
    Menu,
    X,
    ChevronDown,
    BookOpen,
} from "lucide-react";

// --- HERO CAROUSEL IMAGES ---
const HERO_SLIDES = [
    "/images/cabs.png",
    "/images/cab-church.jpg",
    "/images/cab-city-hall.jpg",
    "/images/indakan.jpg",
    "/images/cabuyao-town_plaza.jpg",
];

// --- DUMMY DATA FOR THE SECTIONS ---
const SERVICES = [
    {
        title: "Business Permit",
        desc: "Apply or renew your business permit online",
        icon: Briefcase,
        color: "text-red-500",
        bg: "bg-red-50",
        link: "/bplo",
    },
    {
        title: "Job Openings",
        desc: "Browse available job opportunities in Cabuyao",
        icon: Users,
        color: "text-purple-500",
        bg: "bg-purple-50",
        link: "/peso",
    },
    {
        title: "Civil Registry",
        desc: "Birth, marriage, and death certificates",
        icon: FileText,
        color: "text-yellow-500",
        bg: "bg-yellow-50",
        link: "/registry",
    },
    {
        title: "Health Services",
        desc: "Access city health programs and services",
        icon: HeartPulse,
        color: "text-pink-500",
        bg: "bg-pink-50",
        link: "/health",
    },
    {
        title: "Real Property Tax",
        desc: "Pay your real property taxes conveniently",
        icon: Building,
        color: "text-blue-500",
        bg: "bg-blue-50",
        link: "#",
    },
    {
        title: "Community Tax Certificate",
        desc: "Get your cedula or community tax certificate",
        icon: FileText,
        color: "text-green-500",
        bg: "bg-green-50",
        link: "#",
    },
    {
        title: "Social Welfare",
        desc: "DSWD programs and assistance services",
        icon: Users,
        color: "text-cyan-500",
        bg: "bg-cyan-50",
        link: "#",
    },
    {
        title: "Disaster Preparedness",
        desc: "Emergency hotlines and disaster response",
        icon: ShieldAlert,
        color: "text-orange-500",
        bg: "bg-orange-50",
        link: "/drrm",
    },
    {
        title: "Citizen Charter",
        desc: "View and download our citizen charter",
        icon: BookOpen,
        color: "text-indigo-500",
        bg: "bg-indigo-50",
        link: "/citizen-charter",
    },
];

function usePublicNewsPreview() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/public/news?per_page=6&page=1`);
                const json = await res.json();
                if (!cancelled)
                    setItems(Array.isArray(json?.data) ? json.data : []);
            } catch (e) {
                // ignore; preview will be empty
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return { items, loading };
}

function usePublicAnnouncementsPreview() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/public/announcements?per_page=6&page=1`,
                );
                const json = await res.json();
                if (!cancelled)
                    setItems(Array.isArray(json?.data) ? json.data : []);
            } catch (e) {
                // ignore; preview will be empty
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return { items, loading };
}

const API_BASE_URL = "/api/public";

export default function Home() {
    // --- STATES ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [viceMayor, setViceMayor] = useState(null);
    const [councilors, setCouncilors] = useState([]);
    const [loadingOfficials, setLoadingOfficials] = useState(true);

    // NEW: State to track which mobile dropdown is currently open
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

    // --- HERO CAROUSEL LOGIC ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) =>
                prev === HERO_SLIDES.length - 1 ? 0 : prev + 1,
            );
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () =>
        setCurrentSlide((prev) =>
            prev === HERO_SLIDES.length - 1 ? 0 : prev + 1,
        );
    const prevSlide = () =>
        setCurrentSlide((prev) =>
            prev === 0 ? HERO_SLIDES.length - 1 : prev - 1,
        );

    // --- HELPER FUNCTION FOR MOBILE ACCORDION ---
    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    // --- SCROLL TO SERVICES FUNCTION ---
    const scrollToServices = () => {
        const servicesSection = document.getElementById("services-section");
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const { items: newsPreview } = usePublicNewsPreview();

    // Fetch Vice Mayor and Councilors from API
    useEffect(() => {
        const fetchOfficials = async () => {
            try {
                // Fetch executives for Vice Mayor
                const execRes = await fetch(`${API_BASE_URL}/executives`, {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                });
                const execJson = await execRes.json();
                if (execJson.success) {
                    const vp = execJson.data.find(
                        (exec) => exec.position === "Vice Mayor",
                    );
                    if (vp) setViceMayor(vp);
                }

                // Fetch councilors
                const councilRes = await fetch(`${API_BASE_URL}/councilors`, {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "same-origin",
                });
                const councilJson = await councilRes.json();
                if (councilJson.success) {
                    setCouncilors(councilJson.data);
                }
            } catch (e) {
                console.error("Failed to load officials:", e);
            } finally {
                setLoadingOfficials(false);
            }
        };

        fetchOfficials();
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
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

                {/* DESKTOP MENU (WITH DROPDOWNS) */}
                <div className="hidden xl:flex items-center gap-6">
                    <a
                        href="/"
                        className="text-sm font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-full"
                    >
                        Home
                    </a>

                    <div className="relative group py-4">
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition">
                            The City <ChevronDown size={14} />
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
                        </div>
                    </div>

                    <div className="relative group py-4">
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-red-600 transition">
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
                                className="block px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 border-b border-gray-50"
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
                        href="/faqs"
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                    >
                        FAQs
                    </a>
                    <a
                        href="/contact"
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
                    >
                        Contact
                    </a>
                </div>

                {/* MOBILE MENU BUTTON (Hidden on desktop) */}
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

                {/* MOBILE MENU DROPDOWN (ACCORDION STYLE) */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col xl:hidden z-50 max-h-[85vh] overflow-y-auto">
                        <a
                            href="/"
                            className="px-6 py-4 text-sm font-bold text-red-600 bg-red-50 border-l-4 border-red-600 transition-colors"
                        >
                            Home
                        </a>

                        {/* Expandable: The City */}
                        <div>
                            <button
                                onClick={() => toggleMobileDropdown("city")}
                                className="w-full px-6 py-4 flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors border-b border-gray-50"
                            >
                                The City
                                <ChevronDown
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
                                </div>
                            )}
                        </div>

                        {/* Expandable: Government */}
                        <div>
                            <button
                                onClick={() => toggleMobileDropdown("gov")}
                                className="w-full px-6 py-4 flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors border-b border-gray-50"
                            >
                                Government
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${
                                        openMobileDropdown === "gov"
                                            ? "rotate-180 text-red-600"
                                            : "text-gray-400"
                                    }`}
                                />
                            </button>
                            {openMobileDropdown === "gov" && (
                                <div className="bg-gray-50 flex flex-col py-2 border-b border-gray-100 shadow-inner">
                                    <a
                                        href="/mayor"
                                        className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Office of the Mayor
                                    </a>
                                    <a
                                        href="/council"
                                        className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Sangguniang Panlungsod
                                    </a>
                                    <a
                                        href="/departments"
                                        className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        City Departments
                                    </a>
                                    <a
                                        href="/transparency"
                                        className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Transparency Seal
                                    </a>
                                    <a
                                        href="/citizen-charter"
                                        className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Citizen Charter
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Expandable: E-Services */}
                        <div>
                            <button
                                onClick={() => toggleMobileDropdown("services")}
                                className="w-full px-6 py-4 flex items-center justify-between text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors border-b border-gray-50"
                            >
                                E-Services
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${
                                        openMobileDropdown === "services"
                                            ? "rotate-180 text-red-600"
                                            : "text-gray-400"
                                    }`}
                                />
                            </button>
                            {openMobileDropdown === "services" && (
                                <div className="bg-gray-50 flex flex-col py-2 border-b border-gray-100 shadow-inner">
                                    <a
                                        href="/bplo"
                                        className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Business Permits (BPLO)
                                    </a>
                                    <a
                                        href="/peso"
                                        className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Job Openings (PESO)
                                    </a>
                                    <a
                                        href="/registry"
                                        className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Civil Registry
                                    </a>
                                    <a
                                        href="/health"
                                        className="px-10 py-3 text-sm text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        Health Services
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Standalone Links */}
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
            </nav>

            {/* 3. HERO SECTION (DYNAMIC CAROUSEL) */}
            <div className="relative w-full h-[650px] bg-gray-900 flex items-center justify-center overflow-hidden group">
                {/* DYNAMIC BACKGROUND IMAGES */}
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide
                                ? "opacity-50 z-0"
                                : "opacity-0 -z-10"
                        }`}
                        style={{ backgroundImage: `url('${slide}')` }}
                    />
                ))}

                {/* LEFT ARROW */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 md:left-6 top-[40%] md:top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-all z-30 opacity-100 md:opacity-0 group-hover:opacity-100 focus:outline-none"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft
                        size={24}
                        strokeWidth={2.5}
                        className="mr-0.5"
                    />
                </button>

                {/* RIGHT ARROW */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 md:right-6 top-[40%] md:top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-all z-30 opacity-100 md:opacity-0 group-hover:opacity-100 focus:outline-none"
                    aria-label="Next Slide"
                >
                    <ChevronRight
                        size={24}
                        strokeWidth={2.5}
                        className="ml-0.5"
                    />
                </button>

                {/* STATIC HERO TEXT */}
                <div className="relative z-20 text-center px-4 max-w-4xl pointer-events-none mt-[-40px] md:mt-0">
                    <span className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs md:text-sm font-semibold border border-white/20 mb-6 uppercase tracking-wider">
                        Bagong Cabuyao
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                        Welcome to the <br />
                        <span className="text-yellow-400">City of Cabuyao</span>
                    </h2>
                    <p className="text-base md:text-lg text-gray-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
                        Pera ng Bayan, Ibalik sa Mamamayan — Building a
                        progressive and sustainable community for every
                        Cabuyeño.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
                        <button
                            onClick={scrollToServices}
                            className="bg-white text-red-600 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 shadow-xl w-full sm:w-auto"
                        >
                            Explore Services{" "}
                            <ArrowRight size={18} strokeWidth={2.5} />
                        </button>
                        <a
                            href="/about"
                            className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition w-full sm:w-auto backdrop-blur-sm"
                        >
                            Learn More
                        </a>
                    </div>
                </div>

                {/* CLICKABLE DOT INDICATORS */}
                <div className="absolute bottom-20 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {HERO_SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 shadow-md ${
                                index === currentSlide
                                    ? "w-10 bg-white"
                                    : "w-2.5 bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* WHITE CURVE AT BOTTOM */}
                <div className="absolute bottom-0 w-full h-12 md:h-16 bg-white rounded-t-[100%] scale-110 translate-y-6 md:translate-y-8 z-10" />
            </div>

            {/* 4. E-SERVICES & QUICK LINKS */}
            <div id="services-section" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold text-red-600 mb-4">
                        E-Services & Quick Links
                    </h3>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Access government services online. Fast, convenient, and
                        hassle-free transactions for every Cabuyeño.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SERVICES.map((s, i) => (
                        <div
                            key={i}
                            className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 group flex flex-col"
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${s.bg}`}
                            >
                                <s.icon className={s.color} size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                                {s.title}
                            </h4>
                            <p className="text-sm text-gray-500 mb-8 flex-grow">
                                {s.desc}
                            </p>
                            <a
                                href={s.link}
                                className="text-red-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all mt-auto"
                            >
                                Access Service <ArrowRight size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. NEWS & ANNOUNCEMENTS */}
            <div className="bg-gray-50 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-red-600 mb-2 inline-block relative">
                            News and Announcements
                            <div className="flex h-1 w-24 absolute -bottom-3 left-1/2 -translate-x-1/2">
                                <div className="w-1/3 h-full bg-blue-600"></div>
                                <div className="w-1/3 h-full bg-yellow-400"></div>
                                <div className="w-1/3 h-full bg-red-600"></div>
                            </div>
                        </h3>
                    </div>

                    {(() => {
                        const { items: newsItems } = usePublicNewsPreview();
                        const { items: announcementItems } =
                            usePublicAnnouncementsPreview();

                        const combined = [
                            ...(newsItems || []).map((n) => ({
                                kind: "news",
                                ...n,
                            })),
                            ...(announcementItems || []).map((a) => ({
                                kind: "announcement",
                                ...a,
                            })),
                        ]
                            .sort((a, b) => {
                                const da = new Date(
                                    a.published_at || a.date || 0,
                                );
                                const db = new Date(
                                    b.published_at || b.date || 0,
                                );
                                return db - da;
                            })
                            .slice(0, 6);

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {combined.map((item) => (
                                    <div
                                        key={`${item.kind}-${item.id}`}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100 flex flex-col group cursor-pointer"
                                    >
                                        <div className="h-48 flex items-center justify-center relative overflow-hidden bg-gray-100">
                                            <img
                                                src={
                                                    item.image_path
                                                        ? item.image_path.startsWith(
                                                              "http",
                                                          )
                                                            ? item.image_path
                                                            : `/storage/${item.image_path}`
                                                        : "/images/news.jpg"
                                                }
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) =>
                                                    (e.currentTarget.src =
                                                        "/images/news.jpg")
                                                }
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-3 font-medium">
                                                <Calendar size={14} />{" "}
                                                {item.published_at ||
                                                    item.date ||
                                                    ""}
                                            </p>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                    {item.kind === "news"
                                                        ? "News"
                                                        : "Announcement"}
                                                </span>
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-red-600 transition-colors">
                                                {item.title}
                                            </h4>
                                            <a
                                                href={
                                                    item.kind === "news"
                                                        ? `/news/${item.id}`
                                                        : `/announcements/${item.id}`
                                                }
                                                className="text-red-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto"
                                            >
                                                Read More{" "}
                                                <ArrowRight size={16} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    <div className="text-center">
                        <a
                            href="/news"
                            className="inline-flex bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-md items-center gap-2 mx-auto"
                        >
                            View All News <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </div>

            {/* 6. CITY OFFICIALS */}
            <div className="py-24 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16 flex flex-col items-center">
                    <h3 className="text-3xl font-bold text-red-600 mb-3">
                        City Officials
                    </h3>
                    <div className="flex h-1 w-24">
                        <div className="w-1/3 h-full bg-blue-600"></div>
                        <div className="w-1/3 h-full bg-yellow-400"></div>
                        <div className="w-1/3 h-full bg-red-600"></div>
                    </div>
                </div>
                {/* --- MAYOR CARD --- */}
                <div className="rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-w-5xl mx-auto mb-40">
                    <div className="md:w-5/12 bg-[#1e293b] min-h-[450px] md:min-h-[500px] relative overflow-hidden">
                        {/* ACTUAL MAYOR IMAGE */}
                        <img
                            src="/images/mayor.png"
                            alt="Hon. Dennis DenHa Hain"
                            className="absolute inset-0 w-full h-full object-cover object-top"
                            onError={(e) =>
                                (e.target.src =
                                    "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600")
                            }
                        />
                    </div>
                    <div className="md:w-7/12 bg-red-600 p-10 md:p-16 text-white flex flex-col justify-center">
                        <span className="bg-yellow-400 text-red-900 text-xs font-bold px-4 py-1.5 rounded-full w-fit mb-4 shadow-sm">
                            City Mayor
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">
                            Hon. Dennis "DenHa" Hain
                        </h2>
                        <p className="text-red-100 mb-8 leading-relaxed text-lg">
                            Leading Cabuyao towards progress and prosperity.
                            Committed to transparent governance and public
                            service.
                        </p>
                        <p className="font-bold text-yellow-400 italic mb-10 text-xl">
                            "Pera ng Bayan, Ibalik sa Mamamayan"
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://www.facebook.com/DenHa2022/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition w-full sm:w-auto"
                            >
                                <MessageCircle size={18} /> @MayorDenHa
                            </a>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition w-full sm:w-auto">
                                <Mail size={18} /> Contact
                            </button>
                        </div>
                    </div>
                </div>
                {/* --- VICE MAYOR CARD --- */}
                {viceMayor ? (
                    <a
                        href="/council"
                        className="flex flex-col items-center bg-white rounded-2xl shadow-xl border
                    border-gray-100 px-6 pb-12 pt-8 max-w-3xl mx-auto text-center w-full flex-shrink-0 group/card hover:shadow-2xl transition-all duration-300 mb-24"
                    >
                        <div className="w-48 h-48 rounded-full bg-gray-50 border-2 border-transparent group-hover/card:border-red-500 transition-all p-2 mb-6 shadow-xl overflow-hidden">
                            <img
                                src={
                                    viceMayor.photo ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(viceMayor.name)}&background=0D9488&color=fff&size=400`
                                }
                                alt={viceMayor.name}
                                className="w-full h-full rounded-full object-cover object-top group-hover/card:scale-110 transition-transform duration-500"
                                onError={(e) =>
                                    (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(viceMayor.name)}&background=0D9488&color=fff&size=400`)
                                }
                            />
                        </div>
                        <span className="bg-red-50 text-red-600 text-xs font-bold px-6 py-2 rounded-full mb-3 inline-block border border-red-100 uppercase tracking-wide">
                            Vice Mayor
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                            {viceMayor.name}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Presiding Officer, Sangguniang Panlungsod
                        </p>
                    </a>
                ) : (
                    <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl border border-gray-100 px-6 pb-12 pt-8 max-w-3xl mx-auto text-center w-full flex-shrink-0 mb-24">
                        <div className="w-48 h-48 rounded-full bg-gray-50 border-2 border-gray-200 transition-all p-2 mb-6 shadow-xl overflow-hidden">
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                <Users size={48} className="text-gray-400" />
                            </div>
                        </div>
                        <p className="text-gray-500">
                            Vice Mayor information will be updated soon.
                        </p>
                    </div>
                )}
                {/* Councilors */}
                <div className="text-center mb-12 mt-30">
                    <h3 className="text-2xl font-bold text-gray-900 inline-block relative">
                        Sangguniang Panlungsod Members
                        <div className="flex h-1 w-24 absolute -bottom-3 left-1/2 -translate-x-1/2">
                            <div className="w-1/3 h-full bg-blue-600"></div>
                            <div className="w-1/3 h-full bg-yellow-400"></div>
                            <div className="w-1/3 h-full bg-red-600"></div>
                        </div>
                    </h3>
                </div>
                <div className="relative max-w-7xl mx-auto px-12 md:px-16">
                    {/* Left Arrow */}
                    <button
                        id="btn-prev-councilor"
                        onClick={() => {
                            const slider =
                                document.getElementById("councilor-slider");
                            slider.scrollBy({
                                left: -slider.offsetWidth,
                                behavior: "smooth",
                            });
                        }}
                        className="absolute left-0 md:left-2 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#1e293b] shadow-xl border-2 border-white flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 hover:scale-110 transition-all duration-300 focus:outline-none opacity-0 pointer-events-none"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft
                            size={24}
                            strokeWidth={2.5}
                            className="mr-0.5"
                        />
                    </button>

                    {/* Slider Track */}
                    <div
                        id="councilor-slider"
                        className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory scroll-smooth w-full"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                        onScroll={(e) => {
                            const slider = e.target;
                            const prevBtn =
                                document.getElementById("btn-prev-councilor");
                            const nextBtn =
                                document.getElementById("btn-next-councilor");

                            if (slider.scrollLeft <= 10) {
                                prevBtn.classList.add(
                                    "opacity-0",
                                    "pointer-events-none",
                                );
                            } else {
                                prevBtn.classList.remove(
                                    "opacity-0",
                                    "pointer-events-none",
                                );
                            }

                            if (
                                slider.scrollLeft + slider.clientWidth >=
                                slider.scrollWidth - 10
                            ) {
                                nextBtn.classList.add(
                                    "opacity-0",
                                    "pointer-events-none",
                                );
                            } else {
                                nextBtn.classList.remove(
                                    "opacity-0",
                                    "pointer-events-none",
                                );
                            }
                        }}
                    >
                        <style
                            dangerouslySetInnerHTML={{
                                __html: `#councilor-slider::-webkit-scrollbar { display: none; }`,
                            }}
                        />
                        {loadingOfficials ? (
                            <div className="flex items-center justify-center w-full py-12">
                                <div className="text-gray-500">
                                    Loading councilors...
                                </div>
                            </div>
                        ) : councilors.length === 0 ? (
                            <div className="flex items-center justify-center w-full py-12">
                                <div className="text-gray-500">
                                    No councilors available at this time.
                                </div>
                            </div>
                        ) : (
                            councilors.map((councilor) => (
                                <a
                                    key={councilor.id}
                                    href="/council"
                                    className="flex flex-col items-center text-center w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)] flex-shrink-0 snap-start group/card hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="w-28 h-28 rounded-full bg-gray-50 border-2 border-transparent group-hover/card:border-red-500 transition-all p-1.5 mb-4 shadow-md overflow-hidden">
                                        <img
                                            src={
                                                councilor.photo ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(councilor.name)}&background=0D9488&color=fff&size=200`
                                            }
                                            alt={councilor.name}
                                            className="w-full h-full rounded-full object-cover object-top group-hover/card:scale-110 transition-transform duration-500"
                                            onError={(e) =>
                                                (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(councilor.name)}&background=0D9488&color=fff&size=200`)
                                            }
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 px-2">
                                        {councilor.name}
                                    </h4>
                                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                                        Councilor
                                    </p>
                                </a>
                            ))
                        )}
                    </div>

                    {/* Right Arrow */}
                    <button
                        id="btn-next-councilor"
                        onClick={() => {
                            const slider =
                                document.getElementById("councilor-slider");
                            slider.scrollBy({
                                left: slider.offsetWidth,
                                behavior: "smooth",
                            });
                        }}
                        className="absolute right-0 md:right-2 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#1e293b] shadow-xl border-2 border-white flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 hover:scale-110 transition-all duration-300 focus:outline-none"
                        aria-label="Scroll right"
                    >
                        <ChevronRight
                            size={24}
                            strokeWidth={2.5}
                            className="ml-0.5"
                        />
                    </button>
                </div>
            </div>

            {/* 7. ABOUT SECTION */}
            <div className="bg-gray-50 pt-24 pb-36 border-t border-gray-200 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* --- LEFT SIDE: SINGLE TALL IMAGE --- */}
                    <div className="rounded-3xl overflow-hidden relative shadow-lg h-[400px] lg:h-[650px] w-full bg-gray-200">
                        {/* ACTUAL ABOUT IMAGE */}
                        <img
                            src="/images/about-cabuyao.jpg"
                            className="w-full h-full object-fill object-center hover:scale-105 transition-transform duration-700"
                            alt="City of Cabuyao Landmarks"
                            onError={(e) =>
                                (e.target.src =
                                    "https://images.unsplash.com/photo-1541888062973-2e061dd31fb8?auto=format&fit=crop&q=80&w=800")
                            }
                        />
                    </div>

                    {/* --- RIGHT SIDE: TEXT & STATS --- */}
                    <div>
                        <span className="bg-red-50 text-red-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6 inline-block">
                            About Cabuyao
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            The City of{" "}
                            <span className="text-red-600">Cabuyao</span>
                        </h2>
                        <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                            Cabuyao is a first-class component city in the
                            province of Laguna, Philippines. Known as the
                            "Gateway to CALABARZON," it is one of the most
                            progressive cities in the region, home to numerous
                            industrial parks and economic zones.
                        </p>
                        <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                            Under the leadership of Mayor Dennis "DenHa" Hain,
                            the city continues to pursue sustainable development
                            while ensuring that the benefits of progress reach
                            every Cabuyeño through the "Pera ng Bayan, Ibalik sa
                            Mamamayan" program.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-red-500 mb-2">
                                    <Users size={20} />{" "}
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Population
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-gray-900">
                                    355,330+
                                </p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-blue-500 mb-2">
                                    <MapPin size={20} />{" "}
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Land Area
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-gray-900">
                                    43.40 km²
                                </p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-green-500 mb-2">
                                    <Building size={20} />{" "}
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Barangays
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-gray-900">
                                    18
                                </p>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-purple-500 mb-2">
                                    <Mail size={20} />{" "}
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Zip Code
                                    </span>
                                </div>
                                <p className="text-3xl font-black text-gray-900">
                                    4025
                                </p>
                            </div>
                        </div>

                        <a
                            href="/about"
                            className="inline-flex bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition shadow-md items-center justify-center w-full sm:w-auto gap-2 text-lg"
                        >
                            Learn More About Cabuyao <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* 8. CITY INFORMATION OFFICE BANNER */}
            <div className="relative z-20 px-6 -mt-20 mb-24 w-full flex justify-center">
                <div className="w-full max-w-5xl group">
                    <img
                        src="/images/city-office-info.png"
                        alt="City Information Office Banner"
                        className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white object-cover hover:-translate-y-2 transition-transform duration-300 ease-out bg-white"
                        onError={(e) => (e.target.style.display = "none")}
                    />
                </div>
            </div>

            {/* 9. FOOTER */}
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
