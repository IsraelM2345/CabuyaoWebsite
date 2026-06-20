import React from "react";
import { MapPin, ArrowRight } from "lucide-react";

// List of all 18 Barangays in Cabuyao City
const BARANGAYS = [
    { id: 1, name: "Banlic", image: "banlic" },
    { id: 2, name: "Batingan", image: "batingan" },
    { id: 3, name: "Bayugo", image: "bayugo" },
    { id: 4, name: "Butong", image: "butong" },
    { id: 5, name: "Caingin", image: "caingin" },
    { id: 6, name: "Casile", image: "casile" },
    { id: 7, name: "Diezmo", image: "diezmo" },
    { id: 8, name: "Don Jose", image: "don-jose" },
    { id: 9, name: "Gulod", image: "gulod" },
    { id: 10, name: "Hornalan", image: "hornalan" },
    { id: 11, name: "La Mesa", image: "la-mesa" },
    { id: 12, name: "Magdiwang", image: "magdiwang" },
    { id: 13, name: "Malaban", image: "malaban" },
    { id: 14, name: "Niugan", image: "niugan" },
    { id: 15, name: "Paciano Rizal", image: "paciano-rizal" },
    { id: 16, name: "Poblacion", image: "poblacion" },
    { id: 17, name: "Sala", image: "sala" },
    { id: 18, name: "San Isidro", image: "san-isidro" },
];

export default function BarangaysSection() {
    return (
        <section className="w-full py-20 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our <span className="text-red-600">Barangays</span>
                    </h2>
                    <div className="flex justify-center mb-6">
                        <div className="flex h-1 w-24">
                            <div className="w-1/3 h-full bg-blue-600"></div>
                            <div className="w-1/3 h-full bg-yellow-400"></div>
                            <div className="w-1/3 h-full bg-red-600"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Cabuyao City is composed of 18 barangays, each
                        contributing to the city's progress and vibrant
                        community life.
                    </p>
                </div>

                {/* Barangays Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {BARANGAYS.map((barangay) => (
                        <a
                            key={barangay.id}
                            href={`/about#barangay-${barangay.id}`}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 flex flex-col"
                        >
                            {/* Barangay Image */}
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                <img
                                    src={`/images/barangays/${barangay.image}.jpg`}
                                    alt={barangay.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        // Fallback to a generic barangay image or gradient
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(barangay.name)}&background=DC2626&color=fff&size=200&bold=true`;
                                    }}
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Barangay Name */}
                            <div className="p-3 text-center flex-grow flex flex-col justify-center">
                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <MapPin
                                        size={14}
                                        className="text-red-500 group-hover:text-red-600"
                                    />
                                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-red-600 transition-colors">
                                        {barangay.name}
                                    </h3>
                                </div>
                                <p className="text-[10px] text-gray-500">
                                    Barangay
                                </p>
                            </div>

                            {/* Hover arrow indicator */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                                    <ArrowRight
                                        size={14}
                                        className="text-white"
                                    />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <a
                        href="/about#barangays"
                        className="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors group"
                    >
                        <span>Learn more about our barangays</span>
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
}
