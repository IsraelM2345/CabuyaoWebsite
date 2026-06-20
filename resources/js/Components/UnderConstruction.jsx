import React from "react";
import {
    Construction,
    ArrowLeft,
    Clock,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";

export default function UnderConstruction({
    pageTitle = "Service",
    serviceName = "Under Construction",
    description = "This page is currently being developed to serve you better.",
    expectedLaunch = null,
    contactEmail = "ciocabuyaoph@gmail.com",
    contactPhone = "(049) 554 9780",
}) {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <PublicHeader activePage="home" />

            {/* 1. HERO BANNER - Under Construction Theme */}
            <div className="relative w-full h-[280px] md:h-[380px] flex items-center bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-700 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="w-full h-full"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="relative">
                            <Construction
                                className="text-yellow-400 animate-pulse"
                                size={56}
                                strokeWidth={2.5}
                            />
                            <div className="absolute -inset-2 bg-yellow-400/20 rounded-full animate-ping" />
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
                            {serviceName}
                        </h2>
                    </div>
                    <p className="text-xl md:text-2xl text-yellow-100 max-w-3xl mx-auto drop-shadow-md font-medium">
                        {description}
                    </p>
                </div>
            </div>

            {/* 2. MAIN CONTENT - Under Construction */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Main Under Construction Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden">
                    {/* Top gradient bar */}
                    <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400" />

                    <div className="p-8 md:p-16 text-center">
                        {/* Construction Icon */}
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-amber-100 rounded-full animate-pulse" />
                            <div className="relative bg-amber-50 rounded-full p-8 inline-flex">
                                <Construction
                                    className="text-amber-600"
                                    size={80}
                                    strokeWidth={2}
                                />
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Under Construction
                        </h3>

                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                            We're working hard to bring you this service. Our
                            team is building something great for the people of
                            Cabuyao City.
                        </p>

                        {/* Expected Launch */}
                        {expectedLaunch && (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 inline-flex items-center gap-4 mb-12">
                                <Clock className="text-amber-600" size={24} />
                                <div className="text-left">
                                    <p className="text-lg font-bold text-amber-900">
                                        {expectedLaunch}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/"
                                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
                            >
                                <ArrowLeft size={20} />
                                Back to Home
                            </a>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg border-2 border-gray-200"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>

                {/* Additional Info Cards */}
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <Phone className="text-blue-600" size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">
                            Need Assistance?
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                            For urgent concerns, please contact our office
                            directly.
                        </p>
                        <a
                            href={`tel:${contactPhone}`}
                            className="text-blue-600 font-bold hover:underline text-sm"
                        >
                            {contactPhone}
                        </a>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <Mail className="text-green-600" size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">
                            Email Us
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                            Send us your questions and we'll respond promptly.
                        </p>
                        <a
                            href={`mailto:${contactEmail}`}
                            className="text-green-600 font-bold hover:underline text-sm"
                        >
                            {contactEmail}
                        </a>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <MapPin className="text-purple-600" size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">
                            Visit Our Office
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                            City Hall, Cabuyao City, Laguna 4025
                        </p>
                        <a
                            href="/contact"
                            className="text-purple-600 font-bold hover:underline text-sm"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
