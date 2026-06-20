import React from "react";
import { ArrowRight } from "lucide-react";

// List of all 18 Barangays in Cabuyao City
const BARANGAYS = [
    { id: 1, name: "Baclaran", image: "baclaran" },
    { id: 2, name: "Banaybanay", image: "banaybanay" },
    { id: 3, name: "Banlic", image: "banlic" },
    { id: 4, name: "Bigaa", image: "bigaa" },
    { id: 5, name: "Butong", image: "butong" },
    { id: 6, name: "Casile", image: "casile" },
    { id: 7, name: "Diezmo", image: "diezmo" },
    { id: 8, name: "Gulod", image: "gulod" },
    { id: 9, name: "Mamatid", image: "mamatid" },
    { id: 10, name: "Marinig", image: "marinig" },
    { id: 11, name: "Niugan", image: "niugan" },
    { id: 12, name: "Pittland", image: "pittland" },
    { id: 13, name: "Pulo", image: "pulo" },
    { id: 14, name: "Sala", image: "sala" },
    { id: 15, name: "San Isidro", image: "san-isidro" },
    { id: 16, name: "Barangay Uno", image: "barangay-uno" },
    { id: 17, name: "Barangay Dos", image: "barangay-dos" },
    { id: 18, name: "Barangay Tres", image: "barangay-tres" },
];

export default function BarangaysSection() {
    return (
        <section className="w-full py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        <span className="text-red-600">Barangays</span>
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {BARANGAYS.map((barangay) => (
                        <a
                            key={barangay.id}
                            href={`/about#barangay-${barangay.id}`}
                            className="group flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Fixed Structure: Borders removed. Clean circle with exact dimensions. */}
                            <div className="w-32 h-32 sm:w-40 sm:h-40 mb-4 rounded-full overflow-hidden bg-gray-100 relative shadow-md group-hover:shadow-xl transition-shadow duration-300">
                                <img
                                    src={`/images/barangay/${barangay.image}.jpg`}
                                    alt={barangay.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        // Fallback to UI Avatars with barangay initials
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            barangay.name,
                                        )}&background=0033A0&color=fff&size=200&bold=true&font-size=0.4`;
                                    }}
                                />
                                {/* Subtle hover overlay */}
                                <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>

                            {/* Centered Label underneath */}
                            <h3 className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-blue-700 transition-colors duration-300 leading-tight px-2 flex flex-col items-center">
                                {barangay.name}
                                {/* Decorative tri-color underline on hover */}
                                <div className="w-0 h-0.5 mt-1 group-hover:w-12 transition-all duration-300 rounded-full flex overflow-hidden">
                                    <div className="w-1/3 h-full bg-blue-600"></div>
                                    <div className="w-1/3 h-full bg-yellow-400"></div>
                                    <div className="w-1/3 h-full bg-red-600"></div>
                                </div>
                            </h3>
                        </a>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-16">
                    <a
                        href="/about#barangays"
                        className="inline-flex items-center gap-2 text-blue-800 font-bold hover:text-blue-600 transition-colors group bg-blue-50 px-6 py-3 rounded-full"
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
