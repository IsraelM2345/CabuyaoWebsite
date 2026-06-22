import React, { useState } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Menu,
    X,
    HelpCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";
// --- FAQS DATA ---
const FAQ_CATEGORIES = [
    {
        category: "General Information",
        items: [
            {
                id: "q1",
                question:
                    "What is the official E-Governance Portal of Cabuyao?",
                answer: "The E-Governance Portal is a centralized web platform designed to provide citizens with easy access to city information, public services, and disaster management updates. It serves as the primary digital touchpoint between the local government and Cabuyeños.",
            },
            {
                id: "q2",
                question: "Where is Cabuyao City Hall located?",
                answer: "Cabuyao City Hall is located at City Hall, Cabuyao City, Province of Laguna, Philippines 4025. Our standard operating hours are Monday to Friday, 8:00 AM to 5:00 PM.",
            },
        ],
    },
    {
        category: "Evacuation & Disaster Management",
        items: [
            {
                id: "q3",
                question: "How does the Evacuation Management System work?",
                answer: "The system tracks real-time data of evacuees, available resources, and shelter capacities across the city to ensure an organized and efficient disaster response.",
            },
            {
                id: "q4",
                question: "Can citizens access the Evacuation Portal?",
                answer: "The Evacuation Portal is accessible only to authorized city personnel, such as barangay encoders, evacuation center managers, and CDRRMO staff. Citizens can access public information including announcements, news, and DRRM updates.",
            },
            {
                id: "q5",
                question: "What should I bring during an evacuation?",
                answer: "We recommend bringing a 'Go Bag' containing essential items: 3 days' supply of non-perishable food and water, flashlights, batteries, a first aid kit, important documents in a waterproof container, and daily medications.",
            },
        ],
    },
    {
        category: "City Services",
        items: [
            {
                id: "q6",
                question: "How do I apply for a Business Permit?",
                answer: "You can apply for or renew your Business Permit online through the E-Services section on this portal. Simply create an account, submit the required digital documents, and wait for the BPLO evaluation.",
            },
            {
                id: "q7",
                question: "How can I request a Civil Registry document?",
                answer: "Requests for Birth, Marriage, and Death certificates can be initiated through our Civil Registry e-service link. You will need to provide basic verification details and can choose to pick up the document at City Hall.",
            },
        ],
    },
];

export default function FAQs() {
    // --- STATES ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Set the first question as open by default, matching the screenshot
    const [openFaqId, setOpenFaqId] = useState("q1");

    // State to track which mobile dropdown is currently open
    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

    const toggleFaq = (id) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    // --- HELPER FUNCTION FOR MOBILE ACCORDION ---
    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* 1. TOP BAR */}
            <PublicHeader activePage="faqs" />
            {/* 3. HERO BANNER */}
            <div className="relative w-full h-[250px] md:h-[350px] flex items-center bg-gray-900 overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                        backgroundImage: "url('/images/office.jpg')",
                    }}
                />

                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4 mb-4">
                        <HelpCircle
                            className="text-white"
                            size={40}
                            strokeWidth={2}
                        />
                        <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-md leading-relaxed ml-14">
                        Find answers to common questions about city services,
                        the e-governance portal, and disaster management.
                    </p>
                </div>
            </div>

            {/* 4. FAQS ACCORDION CONTENT */}
            <div className="max-w-4xl mx-auto px-6 py-20 bg-white min-h-[50vh]">
                {FAQ_CATEGORIES.map((categoryBlock, index) => (
                    <div key={index} className="mb-12">
                        {/* Category Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                            {categoryBlock.category}
                        </h3>

                        {/* Accordion Items */}
                        <div className="space-y-4">
                            {categoryBlock.items.map((item) => {
                                const isOpen = openFaqId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        className={`border border-gray-100 rounded-xl overflow-hidden transition-all duration-200 ${
                                            isOpen
                                                ? "shadow-md bg-white"
                                                : "shadow-sm bg-white"
                                        }`}
                                    >
                                        {/* Question Header */}
                                        <button
                                            onClick={() => toggleFaq(item.id)}
                                            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                        >
                                            <span className="font-bold text-gray-800 text-[15px]">
                                                {item.question}
                                            </span>
                                            {isOpen ? (
                                                <ChevronUp
                                                    size={20}
                                                    className="text-blue-600 flex-shrink-0 ml-4"
                                                />
                                            ) : (
                                                <ChevronDown
                                                    size={20}
                                                    className="text-gray-400 flex-shrink-0 ml-4"
                                                />
                                            )}
                                        </button>

                                        {/* Expanded Answer */}
                                        <div
                                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                                                isOpen
                                                    ? "max-h-96 pb-6 opacity-100"
                                                    : "max-h-0 opacity-0"
                                            }`}
                                        >
                                            <p className="text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* 5. SUPPORT / STILL HAVE QUESTIONS BLOCK */}
                <div className="mt-16 bg-[#f8fafc] rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                        Still have questions?
                    </h4>
                    <p className="text-gray-500 text-sm mb-6">
                        If you cannot find the answer to your question, please
                        feel free to contact us.
                    </p>
                    <button className="bg-[#0f4a96] hover:bg-[#0c3975] text-white text-sm font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm">
                        Contact Support
                    </button>
                </div>
            </div>

            {/* 6. FOOTER */}
            <footer className="bg-[#1E3A5F] text-white pt-16 pb-10 px-6 relative mt-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
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

                    {/* Quick Links */}
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

                    {/* Services */}
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

                    {/* Contact Us */}
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

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-700 text-xs text-gray-500">
                    <p className="text-[#60A5FA]">
                        © 2026 Municipality of Cabuyao. All rights reserved.
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
