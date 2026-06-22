import React, { useState, useEffect, useMemo } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Menu,
    X,
    ChevronDown,
    Image as ImageIcon,
} from "lucide-react";

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";

const CATEGORIES = ["All", "Festivals", "Government", "Tourism", "Community"];

// Helper function to normalize category from database to display categories
function normalizeCategory(category, path) {
    if (category && typeof category === "string") {
        const cat = category.toLowerCase().trim();
        if (
            [
                "festivals",
                "festival",
                "events",
                "celebrations",
                "indakan",
            ].includes(cat)
        )
            return "Festivals";
        if (
            [
                "government",
                "city hall",
                "official",
                "mayor",
                "council",
            ].includes(cat)
        )
            return "Government";
        if (
            [
                "tourism",
                "tourist",
                "landmarks",
                "batingan",
                "church",
                "tours",
            ].includes(cat)
        )
            return "Tourism";
        if (["community", "people", "local", "residents"].includes(cat))
            return "Community";
        if (
            ["Festivals", "Government", "Tourism", "Community"].includes(
                category,
            )
        )
            return category;
    }
    const p = (path || "").toLowerCase();
    if (p.includes("indakan")) return "Festivals";
    if (p.includes("city-hall") || p.includes("city") || p.includes("seal"))
        return "Government";
    if (p.includes("batingan") || p.includes("church") || p.includes("tour"))
        return "Tourism";
    return "Community";
}

// Helper function to build image URL
function publicImageUrl(media) {
    if (media?.url) return media.url;
    if (media?.path) {
        return media.path.startsWith("http")
            ? media.path
            : `/storage/${media.path}`;
    }
    if (media?.file_name) {
        return `/storage/media/${media.file_name}`;
    }
    return null;
}

export default function Gallery() {
    // --- STATES ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
    const [loading, setLoading] = useState(true);
    const [galleryImages, setGalleryImages] = useState([]);

    // Fetch images from API
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                const res = await fetch(
                    "/api/public/media?type=image&per_page=1000",
                    {
                        headers: {
                            Accept: "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                        },
                        credentials: "same-origin",
                    },
                );

                if (!res.ok)
                    throw new Error(`Failed to load media (${res.status})`);

                const json = await res.json();
                const list = Array.isArray(json?.data) ? json.data : [];

                const normalized = list
                    .map((m, idx) => {
                        const url = publicImageUrl(m);
                        if (!url) return null;

                        return {
                            id: m.id ?? idx,
                            title:
                                m.label ||
                                m.original_name ||
                                m.file_name ||
                                `Media #${idx + 1}`,
                            description: m.description || null,
                            category: normalizeCategory(
                                m.category,
                                m.path || m.file_name,
                            ),
                            image: url,
                        };
                    })
                    .filter(Boolean);

                if (!cancelled) setGalleryImages(normalized);
            } catch (e) {
                console.error("Error loading gallery:", e);
                if (!cancelled) setGalleryImages([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // Filter images based on selected tab
    const filteredImages = useMemo(() => {
        if (activeCategory === "All") return galleryImages;
        return galleryImages.filter((img) => img.category === activeCategory);
    }, [activeCategory, galleryImages]);

    // --- HELPER FUNCTION FOR MOBILE ACCORDION ---
    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <PublicHeader activePage="city" />

            {/* 3. HERO BANNER */}
            <div className="relative w-full h-[250px] md:h-[350px] flex items-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: "url('/images/indakan.jpg')" }}
                />
                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <ImageIcon
                            className="text-white"
                            size={40}
                            strokeWidth={2.5}
                        />
                        <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                            City Gallery
                        </h2>
                    </div>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-sm leading-relaxed ml-[56px]">
                        A visual journey through the events, people, and daily
                        life in Cabuyao.
                    </p>
                </div>
            </div>

            {/* 4. MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                {/* Category Filters */}
                <div className="flex overflow-x-auto gap-3 pb-4 justify-center no-scrollbar mb-10">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors shadow-sm ${
                                activeCategory === cat
                                    ? "bg-[#0f4a96] text-white border border-[#0f4a96]"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry-style / Uniform Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((item) => (
                        <div
                            key={item.id}
                            className="relative rounded-2xl overflow-hidden shadow-sm group aspect-video cursor-pointer border border-gray-100 bg-gray-200"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                onError={(e) =>
                                    (e.target.src =
                                        "https://images.unsplash.com/photo-1541888062973-2e061dd31fb8?auto=format&fit=crop&q=80&w=800")
                                }
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                                    {item.category}
                                </span>
                                <h3 className="text-white font-bold text-lg leading-tight">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. FOOTER */}
            <PublicFooter />
        </div>
    );
}
