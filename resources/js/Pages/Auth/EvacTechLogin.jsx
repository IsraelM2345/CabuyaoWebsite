// resources/js/Pages/Auth/Login.jsx
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email: form.email,
            password: form.password,
        };

        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content"),
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Login failed", text);
            alert("Login failed. Check email/password and try again.");
            return;
        }

        window.location.href = "/dashboard";
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
                {/* Background image overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage: "url('/images/evac.jpg')",
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
                            Evacuation Operations Management Platform
                        </h1>
                        <p className="text-teal-100 text-base leading-relaxed">
                            Streamlining disaster response, shelter monitoring,
                            and relief distribution for a resilient Cabuyao.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-teal-200 text-sm">
                    © 2026 City of Cabuyao DRRMO. All rights reserved.
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Sign in to the staff portal to continue.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-teal-600 text-xs hover:underline font-medium"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={16}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value,
                                        })
                                    }
                                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-2"
                            style={{
                                background:
                                    "linear-gradient(90deg, #0d9488, #0f766e)",
                            }}
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Don't have staff access?{" "}
                        <a
                            href="/register"
                            className="text-teal-600 font-medium hover:underline"
                        >
                            Request account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
