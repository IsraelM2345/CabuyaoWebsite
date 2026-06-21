import { useState } from "react";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Building2,
    Shield,
    CheckCircle2,
    X,
    AlertCircle,
} from "lucide-react";

/**
 * FILE: resources/js/Pages/Staff/StaffRegister.jsx
 *
 * Staff registration page for the Bagong Cabuyao Staff Portal.
 * Separate from EvacTech - this is for the City Web Portal staff only.
 */
export default function StaffRegister() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        position: "",
        department: "",
        password: "",
        password_confirmation: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.password_confirmation) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (!form.firstName.trim() || !form.lastName.trim()) {
            setError("First name and last name are required.");
            return;
        }

        setLoading(true);

        const payload = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            middleName: form.middleName.trim(),
            email: form.email.trim(),
            position: form.position.trim(),
            department: form.department.trim(),
            password: form.password,
            password_confirmation: form.password_confirmation,
            role: "staff", // Default role for web portal staff
        };

        try {
            const res = await fetch("/register", {
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

            const data = await res.json();

            if (!res.ok) {
                // Extract error messages
                const errorMsg =
                    data.message || data.errors
                        ? Object.values(data.errors).flat().join("\n")
                        : "Registration failed";
                setModalMessage(errorMsg);
                setShowErrorModal(true);
                throw new Error(errorMsg);
            }

            // Registration successful - show success modal
            setModalMessage(
                "Your account has been created successfully! You can now sign in with your credentials.",
            );
            setShowSuccessModal(true);
        } catch (err) {
            if (err.message !== "Registration failed") {
                setModalMessage(err.message);
                setShowErrorModal(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    return (
        <div className="min-h-screen flex font-sans">
            {/* Success Modal */}
            {showSuccessModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center transition-colors"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={() => setShowSuccessModal(false)}
                >
                    <div
                        className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top accent bar */}
                        <div
                            className="h-1 w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #16a34a, #059669, #0d9488)",
                            }}
                        />

                        <div className="px-6 pt-8 pb-6">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                                        border: "2px solid #86efac",
                                        boxShadow:
                                            "0 4px 12px rgba(34,197,94,0.2)",
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
                                <h2 className="text-lg font-bold text-gray-900 mb-2">
                                    Registration Successful!
                                </h2>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {modalMessage}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    (window.location.href = "/staff/login")
                                }
                                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #16a34a, #059669)",
                                    boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                                }}
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center transition-colors"
                    style={{
                        backgroundColor: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(6px)",
                    }}
                    onClick={() => setShowErrorModal(false)}
                >
                    <div
                        className="relative w-full max-w-sm mx-4 rounded-2xl overflow-hidden shadow-2xl bg-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top accent bar */}
                        <div
                            className="h-1 w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, #dc2626, #b91c1c, #991b1b)",
                            }}
                        />

                        <div className="px-6 pt-8 pb-6">
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #fef2f2, #fee2e2)",
                                        border: "2px solid #fca5a5",
                                        boxShadow:
                                            "0 4px 12px rgba(239,68,68,0.2)",
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
                                <h2 className="text-lg font-bold text-gray-900 mb-2">
                                    Registration Failed
                                </h2>
                                <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                                    {modalMessage}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #dc2626, #b91c1c)",
                                    boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Panel - Branding */}
            <div
                className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
                style={{
                    background:
                        "linear-gradient(160deg, #dc2626 0%, #b91c1c 30%, #1e40af 70%, #1e3a8a 100%)",
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-15"
                    style={{
                        backgroundImage: "url('/images/cabs.png')",
                    }}
                />

                <div className="relative z-10">
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
                                Staff Registration
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h1 className="text-3xl font-bold text-white mb-4">
                            Join the Team
                        </h1>
                        <p className="text-red-100 text-base leading-relaxed mb-6">
                            Create your staff account to access the City of
                            Cabuyao's internal management system.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-red-100 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Shield
                                        className="text-yellow-400"
                                        size={14}
                                    />
                                </div>
                                <span>Secure staff authentication</span>
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
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <span>Access to staff resources</span>
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
                                <span>Manage city operations</span>
                            </div>
                        </div>
                    </div>
                </div>

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

            {/* Right Panel - Registration Form */}
            <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
                <div className="w-full max-w-lg">
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
                                Staff Registration
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Fill in your details to register as a staff member.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                            <AlertCircle
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#dc2626"
                                strokeWidth="2"
                                className="mt-0.5 flex-shrink-0 text-red-500"
                            />
                            <div>
                                <p className="text-sm font-medium text-red-800">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Fields - Split into First and Last */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    First Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Juan"
                                        value={form.firstName}
                                        onChange={set("firstName")}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Last Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Dela Cruz"
                                        value={form.lastName}
                                        onChange={set("lastName")}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Middle Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Middle Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Santos (optional)"
                                    value={form.middleName}
                                    onChange={set("middleName")}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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
                                    onChange={set("email")}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Position */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Position / Title
                            </label>
                            <div className="relative">
                                <Building2
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    placeholder="e.g., Admin Officer, IT Specialist"
                                    value={form.position}
                                    onChange={set("position")}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Department / Office
                            </label>
                            <select
                                value={form.department}
                                onChange={set("department")}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            >
                                <option value="">Select Department</option>
                                <option value="mayor">
                                    Office of the Mayor
                                </option>
                                <option value="admin">
                                    Administrative Office
                                </option>
                                <option value="it">IT Department</option>
                                <option value="hr">Human Resources</option>
                                <option value="finance">Finance Office</option>
                                <option value="planning">
                                    Planning Office
                                </option>
                                <option value="public">
                                    Public Information Office
                                </option>
                                <option value="drrm">DRRM Office</option>
                                <option value="health">Health Office</option>
                                <option value="engineering">
                                    Engineering Office
                                </option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Password */}
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={set("password")}
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

                        {/* Confirm Password */}
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
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="••••••••"
                                    value={form.password_confirmation}
                                    onChange={set("password_confirmation")}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
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
                            disabled={loading}
                            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{
                                background:
                                    "linear-gradient(90deg, #dc2626, #b91c1c)",
                            }}
                        >
                            <Shield size={16} />
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-gray-500 text-sm">
                            Already have an account?{" "}
                            <a
                                href="/staff/login"
                                className="text-red-600 font-medium hover:underline"
                            >
                                Sign in
                            </a>
                        </p>
                        <p className="text-center text-gray-400 text-xs mt-3">
                            By registering, you agree to the City's IT policies
                            and data privacy guidelines.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
