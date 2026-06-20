import React, { useState, useEffect, useRef } from "react";

// Citizen view: submit contact -> show Reference ID -> poll reply status.
// Backend endpoints:
// - POST /api/public/contact
// - GET  /api/public/contact/{contactMessage}
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";

function Contact() {
    const mapRef = useRef(null);
    const [mapInstance, setMapInstance] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        department: "",
        subject: "",
        message: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [referenceId, setReferenceId] = useState(null);

    // Initialize Leaflet map
    useEffect(() => {
        // Coordinates for Cabuyao City Hall, Laguna
        const cabuyaoCoords = [14.5519, 121.0611];

        if (mapRef.current && !mapInstance) {
            // Create map instance
            const map = L.map(mapRef.current, {
                zoomControl: true,
                dragging: true,
                scrollWheelZoom: true,
            }).setView(cabuyaoCoords, 15);

            // Add OpenStreetMap tiles
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);

            // Create custom marker icon
            const customIcon = L.divIcon({
                html: `<div style="
                    background-color: #dc2626;
                    width: 40px;
                    height: 40px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                    border: 3px solid white;
                ">
                    <div style="
                        transform: rotate(45deg);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </div>
                </div>`,
                className: "custom-marker",
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
            });

            // Add marker for Cabuyao City Hall
            const marker = L.marker(cabuyaoCoords, { icon: customIcon }).addTo(
                map,
            );

            // Add popup
            marker
                .bindPopup(
                    `<div style="text-align: center; font-family: sans-serif;">
                        <strong style="font-size: 14px; color: #1e3a5f;">Cabuyao City Hall</strong><br>
                        <span style="font-size: 12px; color: #666;">F.B. Bailon Street, Brgy. Sala<br>Cabuyao City, Laguna 4025</span>
                    </div>`,
                )
                .openPopup();

            setMapInstance(map);
        }

        // Cleanup on unmount
        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, [mapInstance]);

    const pollRefIdRef = useRef(null);
    const [polling, setPolling] = useState(false);
    const [pollStatus, setPollStatus] = useState(null);
    const [pollReply, setPollReply] = useState(null);

    useEffect(() => {
        return () => {
            if (pollRefIdRef.current) {
                clearInterval(pollRefIdRef.current);
            }
        };
    }, []);

    const startPollingReply = (contactId) => {
        if (!contactId) return;
        if (pollRefIdRef.current) {
            clearInterval(pollRefIdRef.current);
        }

        setPolling(true);
        setPollStatus(null);
        setPollReply(null);

        pollRefIdRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/public/contact/${contactId}`, {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });

                const json = await res.json().catch(() => ({}));
                if (!res.ok) return;

                const data = json?.data;
                if (!data) return;

                const status = String(data.status || "").toLowerCase();
                const reply = data.reply || null;

                setPollStatus(status);
                setPollReply(reply);

                if (
                    status === "replied" ||
                    (reply && String(reply).trim().length > 0)
                ) {
                    if (pollRefIdRef.current) {
                        clearInterval(pollRefIdRef.current);
                    }
                    pollRefIdRef.current = null;
                    setPolling(false);

                    setSuccessMessage(
                        `Reply received successfully. Reference ID: ${contactId}`,
                    );
                }
            } catch (e) {
                // keep polling silently
            }
        }, 3000);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        setReferenceId(null);
        setShowSuccessModal(false);

        try {
            const payload = {
                name: form.name,
                email: form.email,
                department: form.department || null,
                subject: form.subject,
                message: form.message,
            };

            const res = await fetch("/api/public/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    json?.message || `Failed to send message (${res.status})`,
                );
            }

            setReferenceId(json?.message_id);
            setSuccessMessage("Message sent successfully.");
            setShowSuccessModal(true);
            setForm({
                name: "",
                email: "",
                department: "",
                subject: "",
                message: "",
            });
        } catch (e) {
            setErrorMessage(e?.message || "Unable to send your message.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <PublicHeader activePage="contact" />

            {/* 3. HERO BANNER */}
            <div className="relative w-full h-[250px] md:h-[350px] flex items-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{
                        backgroundImage: "url('/images/bagong_cabuyao.jpg')",
                    }}
                />

                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        Contact Us
                    </h2>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-md leading-relaxed">
                        Get in touch with the City Government of Cabuyao.{" "}
                        <br className="hidden md:block" /> We are here to assist
                        you.
                    </p>
                </div>
            </div>

            {/* 4. MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: INFO & MAP */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                City Hall Information
                            </h3>

                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm mb-1">
                                            Address
                                        </p>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            Cabuyao City Hall
                                            <br /> F.B. Bailon Street, Brgy.
                                            Sala
                                            <br /> City of Cabuyao, Laguna 4025
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm mb-1">
                                            Phone
                                        </p>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            (049) 531-2829
                                            <br /> Emergency: (049) 531-2222
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm mb-1">
                                            Email
                                        </p>
                                        <p className="text-blue-600 hover:underline text-sm leading-relaxed">
                                            info@cabuyao.gov.ph
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm mb-1">
                                            Office Hours
                                        </p>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            Monday - Friday
                                            <br /> 8:00 AM - 5:00 PM
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative h-72 lg:h-80">
                            <div
                                ref={mapRef}
                                className="w-full h-full"
                                style={{
                                    minHeight: "280px",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: CONTACT FORM */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 lg:p-10 border border-gray-100 shadow-sm h-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Send us a Message
                            </h3>

                            {successMessage && (
                                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800 font-bold">
                                    {successMessage}
                                </div>
                            )}

                            {errorMessage && (
                                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 font-bold">
                                    {errorMessage}
                                </div>
                            )}

                            <form
                                className="space-y-6"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Juan Dela Cruz"
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="juan@example.com"
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    email: e.target.value,
                                                }))
                                            }
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        Subject / Department *
                                    </label>
                                    <select
                                        value={form.subject}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setForm((p) => ({
                                                ...p,
                                                subject: v,
                                                department:
                                                    v === "other"
                                                        ? p.department
                                                        : p.department,
                                            }));
                                        }}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-800 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled>
                                            Select a subject...
                                        </option>
                                        <option value="general">
                                            General Inquiry
                                        </option>
                                        <option value="mayor">
                                            Office of the Mayor
                                        </option>
                                        <option value="bplo">
                                            Business Permits (BPLO)
                                        </option>
                                        <option value="drrmo">
                                            Disaster Management (CDRRMO)
                                        </option>
                                        <option value="health">
                                            City Health Office
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        Message *
                                    </label>
                                    <textarea
                                        rows="6"
                                        placeholder="How can we help you?"
                                        value={form.message}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                message: e.target.value,
                                            }))
                                        }
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-800 placeholder-gray-400 resize-none"
                                        required
                                    />
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-gray-500">
                                        * Required fields
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-[#0f4a96] hover:bg-[#0c3975] disabled:opacity-60 text-white text-sm font-medium px-8 py-3.5 rounded-xl transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 min-w-[180px]"
                                    >
                                        {submitting
                                            ? "Sending..."
                                            : "Send Message"}
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal (Reference ID + Polling) */}
            {showSuccessModal && referenceId && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={() => {
                        setShowSuccessModal(false);
                    }}
                >
                    <div
                        className="relative w-full max-w-xl mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="h-1 w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #16a34a, #15803d)",
                            }}
                        />
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Message Received
                                </h2>
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 transition"
                                >
                                    Close
                                </button>
                            </div>

                            <p className="text-sm text-gray-700 dark:text-gray-200">
                                Thank you for contacting us. We have received
                                your message.
                            </p>

                            {referenceId && (
                                <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700">
                                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wide">
                                        Tracking reference (keep this)
                                    </p>
                                    <p className="text-base font-bold text-blue-700 dark:text-blue-300 break-all">
                                        {referenceId}
                                    </p>
                                </div>
                            )}

                            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                                We will notify you once our staff responds.
                                <span className="block mt-1 text-xs text-gray-500 dark:text-slate-400">
                                    Checking for updates...
                                </span>
                            </p>

                            <div className="mt-4 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <PublicFooter />
        </div>
    );
}

export default Contact;
