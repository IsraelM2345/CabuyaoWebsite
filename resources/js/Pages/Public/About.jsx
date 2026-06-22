import React from "react";
import {
    Map,
    Eye,
    Target,
    Clock,
    MapPin,
    Phone,
    Mail,
    Globe,
} from "lucide-react";

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";

export default function About() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <PublicHeader activePage="city" />

            {/* 3. ABOUT HERO BANNER */}
            <div className="relative w-full h-[300px] md:h-[400px] flex items-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                        backgroundImage: "url('/images/cab-church.jpg')",
                    }}
                />
                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                        About Cabuyao
                    </h2>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-sm leading-relaxed">
                        Discover the rich history, vibrant culture, and
                        strategic vision of the Enterprise City of the
                        Philippines.
                    </p>
                </div>
            </div>

            {/* 4. CITY PROFILE SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="flex justify-center order-2 lg:order-1">
                        <img
                            src="/images/cab.png"
                            alt="City of Cabuyao Seal"
                            className="w-72 h-72 lg:w-96 lg:h-96 object-contain rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white p-4"
                            onError={(e) =>
                                (e.target.src =
                                    "https://via.placeholder.com/400?text=LOGO")
                            }
                        />
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="flex items-center gap-3 mb-6">
                            <Map
                                className="text-blue-700"
                                size={36}
                                strokeWidth={2}
                            />
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a]">
                                City Profile
                            </h2>
                        </div>
                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                            <p>
                                Cabuyao, officially the City of Cabuyao, is a
                                1st class component city in the province of
                                Laguna, Philippines. According to the 2020
                                census, it has a population of 354,495 people.
                            </p>
                            <p>
                                Known as the "Enterprise City of the
                                Philippines," Cabuyao is home to a large
                                populace of migrants working in the city's
                                industrial estates. It houses several major
                                industrial parks, making it a vital economic hub
                                in the CALABARZON region.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. VISION & MISSION SECTION */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#f0f5ff] rounded-3xl p-10 lg:p-12 relative overflow-hidden">
                        <Eye
                            className="absolute -right-8 -bottom-8 text-blue-600 opacity-10"
                            size={200}
                            strokeWidth={1}
                        />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-[#0e4b95] rounded-xl flex items-center justify-center mb-8 shadow-sm">
                                <Eye
                                    className="text-white"
                                    size={28}
                                    strokeWidth={2}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Our Vision
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                "A globally competitive, resilient, and
                                sustainable Enterprise City of the Philippines,
                                governed by transparent, accountable, and
                                dynamic leaders, with God-loving, empowered, and
                                healthy citizenry living in a safe and
                                ecologically-balanced environment."
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#fff1f2] rounded-3xl p-10 lg:p-12 relative overflow-hidden">
                        <Target
                            className="absolute -right-8 -bottom-8 text-red-600 opacity-10"
                            size={200}
                            strokeWidth={1}
                        />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-[#e11d48] rounded-xl flex items-center justify-center mb-8 shadow-sm">
                                <Target
                                    className="text-white"
                                    size={28}
                                    strokeWidth={2}
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Our Mission
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                "To provide effective and efficient public
                                services, promote inclusive economic growth,
                                ensure environmental sustainability, and build
                                disaster-resilient communities through active
                                citizen participation and digital innovation."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. HISTORY SECTION */}
            <div className="max-w-7xl mx-auto px-6 pb-32">
                <div className="flex items-center gap-3 mb-8">
                    <Clock
                        className="text-blue-700"
                        size={32}
                        strokeWidth={2}
                    />
                    <h2 className="text-3xl font-bold text-[#0f172a]">
                        History of Cabuyao
                    </h2>
                </div>
                <div className="text-gray-600 text-lg leading-relaxed space-y-6">
                    <p>
                        The town of Cabuyao was once the center of the province
                        of Laguna. It was formerly known as "Tabuco," a large
                        territory that included the present-day cities of San
                        Pedro, Biñan, Santa Rosa, and Calamba.
                    </p>
                    <p>
                        The name "Cabuyao" is derived from the "Kabuyao" tree
                        (Citrus macroptera), a citrus tree whose fruit was used
                        by the natives as shampoo. Franciscan priests who
                        arrived in the area noticed the abundance of these trees
                        and eventually named the place after it.
                    </p>
                    <p>
                        On August 4, 2012, Cabuyao was converted into a
                        component city by virtue of Republic Act No. 10163,
                        ratified through a plebiscite. Today, it stands as a
                        testament to rapid urbanization and industrialization
                        while maintaining its rich cultural heritage.
                    </p>
                </div>
            </div>

            {/* MAP SECTION */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="flex items-center gap-3 mb-8">
                    <MapPin
                        className="text-blue-700"
                        size={32}
                        strokeWidth={2}
                    />
                    <h2 className="text-3xl font-bold text-[#0f172a]">
                        Location Map
                    </h2>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg bg-white">
                    <img
                        src="/images/barangay/Map_of_Cabuyao.jpg"
                        alt="Map of Cabuyao City"
                        className="w-full h-auto"
                        onError={(e) =>
                            (e.target.src =
                                "https://via.placeholder.com/1200x600?text=Map+of+Cabuyao")
                        }
                    />
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
