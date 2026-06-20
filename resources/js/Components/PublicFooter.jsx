import React from "react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

/**
 * Footer quick links configuration
 */
const QUICK_LINKS = ["Home", "The City", "Departments", "News", "DRRM", "FAQs"];

const SERVICES_LINKS = [
    "Business Permit",
    "Real Property Tax",
    "Job Openings",
    "Civil Registry",
    "Health Services",
    "Social Welfare",
];

const SOCIAL_LINKS = [
    {
        name: "Facebook",
        href: "https://www.facebook.com/BagongCabuyao/",
        image: "/images/fb-logo.png",
    },
    {
        name: "YouTube",
        href: "https://www.youtube.com/@mayordenha",
        image: "/images/yout.png",
    },
    {
        name: "X/Twitter",
        href: "#",
        image: "/images/x.png",
    },
    {
        name: "Instagram",
        href: "#",
        image: "/images/instagram.png",
    },
];

/**
 * PublicFooter component
 * Reusable footer for all public-facing pages
 */
export default function PublicFooter() {
    return (
        <footer className="bg-[#1E3A5F] text-white pt-16 pb-10 px-6 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                {/* Brand Section */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src="/images/cab.png"
                            alt="Cabuyao Logo"
                            className="w-12 h-12 object-contain rounded-full border-2 border-red-500 p-0.5 bg-white"
                            onError={(e) => (e.target.style.display = "none")}
                        />
                        <h2 className="text-xl font-bold">
                            City of
                            <br />
                            Cabuyao
                        </h2>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                        Province of Laguna. Committed to transparent governance
                        and public service. Building a progressive and
                        sustainable community for every Cabuyeño.
                    </p>
                    <div className="flex items-center gap-3">
                        {SOCIAL_LINKS.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 hover:opacity-80 transition overflow-hidden rounded-full"
                                aria-label={social.name}
                            >
                                <img
                                    src={social.image}
                                    alt={social.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        (e.target.style.display = "none")
                                    }
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        {QUICK_LINKS.map((link) => (
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
                        {SERVICES_LINKS.map((link) => (
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

            {/* Bottom Copyright Bar */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-700 text-xs text-gray-500">
                <p className="text-[#60A5FA]">
                    © {new Date().getFullYear()} City of Cabuyao. All rights
                    reserved.
                </p>
                <p className="text-[#60A5FA]">
                    Powered by{" "}
                    <span className="text-red-400 font-medium">
                        City Information Office
                    </span>
                </p>
            </div>

            {/* Bottom Color Bar (Philippine flag colors) */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 flex">
                <div className="w-1/3 h-full bg-blue-600"></div>
                <div className="w-1/3 h-full bg-yellow-400"></div>
                <div className="w-1/3 h-full bg-red-600"></div>
            </div>
        </footer>
    );
}
