import React, { useState } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Menu,
    X,
    ChevronDown,
    Camera,
    Navigation,
} from "lucide-react";
import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";

// --- TOURISM DATA ---
const TOURISM_SPOTS = [
    {
        id: 1,
        title: "St. Polycarp Parish",
        desc: "A historical and beautifully preserved church in the heart of Cabuyao. Known for its peaceful ambiance and traditional architecture.",
        location: "Brgy. Poblacion Uno",
        image: "/images/cab-church.jpg",
    },
    {
        id: 2,
        title: "Cabuyao Town Plaza",
        desc: "The central gathering place for Cabuyeños. Features wide open spaces, historical monuments, and a vibrant community atmosphere.",
        location: "Brgy. Poblacion Uno",
        image: "/images/cabuyao-town_plaza.jpg",
    },
    {
        id: 3,
        title: "Batingan Shrine",
        desc: "A significant historical marker honoring the local heroes of Cabuyao. A place of reflection and community pride.",
        location: "Brgy. Batingan",
        image: "/images/batingan.jpg",
    },
    {
        id: 4,
        title: "Cabuyao River Walk",
        desc: "A scenic pathway perfect for morning jogs and evening strolls, offering beautiful views and a fresh breeze.",
        location: "Lakeshore District",
        image: "/images/river.jpg",
    },
];

export default function Tourism() {
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
            <PublicHeader activePage="city" />

            {/* 3. HERO BANNER */}
            <div className="relative w-full h-[300px] md:h-[400px] flex items-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                        backgroundImage: "url('/images/tourism.jpg')",
                    }}
                />
                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <Camera
                            className="text-white"
                            size={40}
                            strokeWidth={2.5}
                        />
                        <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
                            Tourism & Landmarks
                        </h2>
                    </div>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-sm leading-relaxed ml-[56px]">
                        Discover the heritage, culture, and beautiful
                        attractions of the Enterprise City of the Philippines.
                    </p>
                </div>
            </div>

            {/* 4. MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TOURISM_SPOTS.map((spot) => (
                        <div
                            key={spot.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                        >
                            <div className="w-full h-60 relative overflow-hidden bg-gray-200">
                                <img
                                    src={spot.image}
                                    alt={spot.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) =>
                                        (e.target.src =
                                            "https://images.unsplash.com/photo-1541888062973-2e061dd31fb8?auto=format&fit=crop&q=80&w=800")
                                    }
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-blue-600 mb-3">
                                    <MapPin size={16} strokeWidth={2.5} />
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        {spot.location}
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors">
                                    {spot.title}
                                </h4>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    {spot.desc}
                                </p>
                                <div className="mt-auto">
                                    <button className="text-gray-900 font-bold text-sm flex items-center gap-2 hover:text-blue-600 transition-colors w-max bg-gray-50 hover:bg-blue-50 px-4 py-2 rounded-lg">
                                        <Navigation size={16} /> Get Directions
                                    </button>
                                </div>
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
