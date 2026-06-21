import { useState } from "react";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Shield,
    Building2,
    CheckCircle2,
    AlertCircle,
    X,
} from "lucide-react";

import { useEffect } from "react";

export default function StaffLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        // Check for success message from registration redirect
        const params = new URLSearchParams(window.location.search);
        if (params.get("registered") === "true") {
            setSuccess(
                "Account created successfully! Please sign in with your credentials.",
            );
            // Clean up URL
            window.history.replaceState({}, document.title, "/staff/login");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent double submission
        if (isLoggingIn || isRedirecting) {
            return;
        }

        setError("");
        setIsLoggingIn(true);

        const payload = {
            email: form.email,
            password: form.password,
        };

        try {
            const res = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Login failed", data);
                setError(
                    data.message ||
                        "Invalid credentials. Please check your email and password.",
                );
                setIsLoggingIn(false);
                return;
            }

            // Login successful - show success modal
            setLoginSuccess(true);
            setIsLoggingIn(false);

            // Auto-redirect after showing success modal
            setTimeout(() => {
                if (loginSuccess) {
                    handleRedirectAfterSuccess();
                }
            }, 2000);
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
            setIsLoggingIn(false);
        }
    };

    const handleRedirectAfterSuccess = () => {
        if (isRedirecting) return;
        setIsRedirecting(true);
        setLoginSuccess(false);
        window.location.href = "/staff/dashboard";
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Panel - Branding with Bagong Cabuyao colors */}
            <div
                className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(160deg, #dc2626 0%, #b91c1c 30%, #1e40af 70%, #1e3a8a 100%)",
                }}
            >
                {/* Background image overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-15"
                    style={{
                        backgroundImage: "url('/images/cabs.png')",
                    }}
                />

                <div className="relative z-10">
                    {/* Logo & Branding */}
                    <div className="flex items-center mb-12">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-yellow-400 p-0.5">
                            <img
                                src="/images/cab-logo1.png"
                                alt="Cabuyao City Logo"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="ml-3">
                            <div className="font-bold text-2xl tracking-wide text-white">
                                City of Cabuyao
                            </div>
                            <div className="text-yellow-400 text-xs font-medium">
                                Official Staff Portal
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <p className="text-red-100 text-base leading-relaxed mb-6">
                            Secure access to the City of Cabuyao's internal
                            management system. Manage operations, services, and
                            citizen engagement from a unified dashboard.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-red-100 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <span>Secure government authentication</span>
                            </div>
                            <div className="flex items-center gap-3 text-red-100 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="18"
                                            rx="2"
                                        />
                                        <path d="M3 9h18" />
                                        <path d="M9 21V9" />
                                    </svg>
                                </div>
                                <span>Real-time operations dashboard</span>
                            </div>
                            <div className="flex items-center gap-3 text-red-100 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <span>Team collaboration tools</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom accent bar with flag colors */}
                <div className="relative z-10">
                    <div className="flex h-1 w-24 mb-4">
                        <div className="w-1/3 h-full bg-blue-500"></div>
                        <div className="w-1/3 h-full bg-yellow-400"></div>
                        <div className="w-1/3 h-full bg-red-500"></div>
                    </div>
                    <p className="text-red-200 text-sm">
                        © 2026 City of Cabuyao. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center mb-8">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-yellow-400 p-0.5">
                            <img
                                src="/images/cab-logo1.png"
                                alt="Cabuyao City Logo"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="ml-2">
                            <div className="font-bold text-xl text-gray-900">
                                City of Cabuyao
                            </div>
                            <div className="text-xs text-gray-500">
                                Staff Portal
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Login
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Enter your credentials to access the staff
                            dashboard.
                        </p>
                    </div>

                    {/* Registration Success Modal */}
                    {success && (
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center transition-colors"
                            style={{
                                backgroundColor: "rgba(15,23,42,0.6)",
                                backdropFilter: "blur(6px)",
                            }}
                        >
                            <div
                                className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800"
                                style={{
                                    border: "1px solid rgba(13,148,136,0.12)",
                                    boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
                                }}
                            >
                                <div
                                    className="h-1 w-full"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #0d9488, #0f766e, #1d4ed8)",
                                    }}
                                />
                                <div className="px-6 pt-8 pb-6">
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                                                border: "1.5px solid #bbf7d0",
                                                boxShadow:
                                                    "0 4px 12px rgba(34,197,94,0.1)",
                                            }}
                                        >
                                            <CheckCircle2
                                                size={32}
                                                className="text-green-500"
                                                strokeWidth={2}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center mb-6">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            Registration Successful!
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {success}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSuccess("")}
                                        className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98]"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #0d9488, #0f766e)",
                                            boxShadow:
                                                "0 4px 12px rgba(13,148,136,0.25)",
                                        }}
                                    >
                                        Continue to Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Success Modal */}
                    {loginSuccess && (
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center transition-colors"
                            style={{
                                backgroundColor: "rgba(15,23,42,0.6)",
                                backdropFilter: "blur(6px)",
                            }}
                        >
                            <div
                                className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 animate-in fade-in zoom-in-95 duration-200"
                                style={{
                                    border: "1px solid rgba(13,148,136,0.12)",
                                    boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
                                }}
                            >
                                <div
                                    className="h-1 w-full"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #0d9488, #0f766e, #1d4ed8)",
                                    }}
                                />
                                <div className="px-6 pt-8 pb-6">
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="w-20 h-20 rounded-2xl flex items-center justify-center animate-pulse"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                                                border: "2px solid #bbf7d0",
                                                boxShadow:
                                                    "0 8px 24px rgba(34,197,94,0.2)",
                                            }}
                                        >
                                            <CheckCircle2
                                                size={40}
                                                className="text-green-500"
                                                strokeWidth={2.5}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            Login Successful!
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Welcome back! Redirecting you to the
                                            dashboard...
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <div
                                            className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                                            style={{ animationDelay: "0ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                                            style={{ animationDelay: "150ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                                            style={{ animationDelay: "300ms" }}
                                        ></div>
                                    </div>
                                    <button
                                        onClick={handleRedirectAfterSuccess}
                                        className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98] hover:opacity-90"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #0d9488, #0f766e)",
                                            boxShadow:
                                                "0 4px 12px rgba(13,148,136,0.25)",
                                        }}
                                    >
                                        Go to Dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Modal */}
                    {error && (
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center transition-colors"
                            style={{
                                backgroundColor: "rgba(15,23,42,0.6)",
                                backdropFilter: "blur(6px)",
                            }}
                        >
                            <div
                                className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800"
                                style={{
                                    border: "1px solid rgba(13,148,136,0.12)",
                                    boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
                                }}
                            >
                                <div
                                    className="h-1 w-full"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #dc2626, #b91c1c)",
                                    }}
                                />
                                <button
                                    onClick={() => setError("")}
                                    className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                                >
                                    <X size={13} strokeWidth={2.5} />
                                </button>
                                <div className="px-6 pt-8 pb-6">
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #fff1f2, #ffe4e6)",
                                                border: "1.5px solid #fecdd3",
                                                boxShadow:
                                                    "0 4px 12px rgba(239,68,68,0.1)",
                                            }}
                                        >
                                            <AlertCircle
                                                size={32}
                                                className="text-red-500"
                                                strokeWidth={2}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center mb-6">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            Login Failed
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            {error}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            Please verify your email and
                                            password, then try again.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setError("")}
                                        className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98]"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #dc2626, #b91c1c)",
                                            boxShadow:
                                                "0 4px 12px rgba(220,38,38,0.25)",
                                        }}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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
                                    className="text-red-600 text-xs hover:underline font-medium"
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
                                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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

                        {/* Remember me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <label
                                htmlFor="remember"
                                className="ml-2 text-sm text-gray-600"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                            style={{
                                background:
                                    "linear-gradient(90deg, #dc2626, #b91c1c)",
                            }}
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-gray-500 text-sm">
                            Don't have an account?{" "}
                            <a
                                href="/staff/register"
                                className="text-red-600 font-medium hover:underline"
                            >
                                Register
                            </a>
                        </p>
                        <p className="text-center text-gray-400 text-xs mt-3">
                            For technical support, contact the City IT Office.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
