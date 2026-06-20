// resources/js/Pages/Auth/Register.jsx
import { useState } from "react";
import { Mail, Lock } from "lucide-react";

const ROLES = ["Barangay Encoder", "CDRRMO Staff", "City Admin"];

const BARANGAYS = [
    "Barangay Banay-Banay",
    "Barangay Bigaa",
    "Barangay Bucal",
    "Barangay Burol",
    "Barangay Casile",
    "Barangay Gulod",
    "Barangay Lawa",
    "Barangay Mamatid",
    "Barangay Marinig",
    "Barangay Niugan",
    "Barangay Pittland",
    "Barangay Pulo",
    "Barangay Sala",
    "Barangay San Isidro",
    "Barangay Tambo",
    "Barangay Uno",
];

export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        barangay: "",
        password: "",
        confirmPassword: "",
        agreed: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic client-side guard
        if (!form.agreed) {
            alert("Please confirm the information agreement.");
            return;
        }

        // Laravel expects password_confirmation field when using `confirmed` rule
        const payload = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            password_confirmation: form.confirmPassword,
            // role/barangay are not persisted yet in backend; kept for future expansion
            role: form.role,
            barangay: form.barangay,
        };

        const res = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                // CSRF token
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content"),
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Register failed", text);
            alert("Registration failed. Check input and try again.");
            return;
        }

        // After successful registration, go to login.
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Panel */}
            <div
                className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(160deg, #0d9488 0%, #0f766e 40%, #1d4ed8 100%)",
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage: "url('/images/evacuation.jpg')",
                    }}
                />
                <div className="relative z-10">
                    {/* Logo */}
                    <div className="flex items-center mb-16">
                        {}
                        <img
                            src="/images/evactech-logo.png"
                            alt="EvacTech Logo"
                            className="w-[60px] h-[60px] object-contain rounded-xl"
                        />

                        {}
                        <div className="font-bold text-3xl tracking-wide">
                            <span style={{ color: "#0AEDF8" }}>Evac</span>
                            <span style={{ color: "#AFE6E7" }}>Tech</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                            Join the Response Team
                        </h1>
                        <p className="text-teal-100 text-base leading-relaxed">
                            Register for a staff account to access the
                            Evacuation Operations Management Platform. All
                            accounts require admin approval.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-teal-200 text-sm">
                    © 2026 City of Cabuyao DRRMO.
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center bg-white px-8 py-12 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Staff Registration
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Fill out your details to request access.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Juan"
                                    value={form.firstName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            firstName: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Dela Cruz"
                                    value={form.lastName}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            lastName: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={16}
                                />
                                <input
                                    type="email"
                                    placeholder="name@cabuyao.gov.ph"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Role / Designation
                            </label>
                            <select
                                value={form.role}
                                onChange={(e) =>
                                    setForm({ ...form, role: e.target.value })
                                }
                                className="w-full px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition appearance-none bg-white"
                            >
                                <option value="">Select role</option>
                                {ROLES.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Barangay */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Assigned Barangay / Center
                            </label>
                            <select
                                value={form.barangay}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        barangay: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition appearance-none bg-white"
                            >
                                <option value="">Select location</option>
                                {BARANGAYS.map((b) => (
                                    <option key={b} value={b}>
                                        {b}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Account Security */}
                        <div className="pt-1">
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                Account Security
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={16}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Create a password"
                                            value={form.password}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            size={16}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm your password"
                                            value={form.confirmPassword}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    confirmPassword:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agreement */}
                        <div className="flex items-start gap-3 pt-1">
                            <input
                                type="checkbox"
                                id="agree"
                                checked={form.agreed}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        agreed: e.target.checked,
                                    })
                                }
                                className="mt-0.5 accent-teal-600"
                            />
                            <label
                                htmlFor="agree"
                                className="text-xs text-gray-500 leading-relaxed"
                            >
                                I confirm that the information provided is
                                accurate and I agree to the DRRMO data privacy
                                guidelines for handling evacuee information.
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                            style={{
                                background:
                                    "linear-gradient(90deg, #0d9488, #0f766e)",
                            }}
                        >
                            Submit Registration Request
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-5">
                        Already have an account?{" "}
                        <a
                            href="/login"
                            className="text-teal-600 font-medium hover:underline"
                        >
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
