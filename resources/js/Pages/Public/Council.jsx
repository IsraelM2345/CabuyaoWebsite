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

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";

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
            <PublicHeader activePage="government" />

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
                                address: viceMayor.address || "",
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
                                    {selectedCouncilor.address && (
                                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
                                            <MapPin
                                                size={16}
                                                className="text-blue-500 flex-shrink-0"
                                            />
                                            <span className="font-medium text-sm text-gray-700">
                                                {selectedCouncilor.address}
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

                                {/* Education */}
                                {selectedCouncilor.education && (
                                    <div className="bg-gray-50 rounded-2xl p-5">
                                        <h4 className="flex items-center gap-3 font-bold text-gray-900 mb-4 text-lg">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <GraduationCap
                                                    size={20}
                                                    className="text-blue-600"
                                                />
                                            </div>
                                            Educational Background
                                        </h4>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {Array.isArray(
                                                selectedCouncilor.education,
                                            )
                                                ? selectedCouncilor.education.map(
                                                      (edu, idx) => (
                                                          <li
                                                              key={idx}
                                                              className="flex items-start gap-2.5 bg-white rounded-lg px-3.5 py-2.5 shadow-sm border border-gray-100"
                                                          >
                                                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                                              <span className="text-gray-700 text-sm font-medium leading-relaxed">
                                                                  {edu}
                                                              </span>
                                                          </li>
                                                      ),
                                                  )
                                                : selectedCouncilor.education
                                                      .split("\n")
                                                      .filter((e) => e.trim())
                                                      .map((edu, idx) => (
                                                          <li
                                                              key={idx}
                                                              className="flex items-start gap-2.5 bg-white rounded-lg px-3.5 py-2.5 shadow-sm border border-gray-100"
                                                          >
                                                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                                              <span className="text-gray-700 text-sm font-medium leading-relaxed">
                                                                  {edu.trim()}
                                                              </span>
                                                          </li>
                                                      ))}
                                        </ul>
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
            <PublicFooter />
        </div>
    );
}
