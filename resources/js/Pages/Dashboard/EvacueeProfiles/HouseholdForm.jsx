import { useState } from "react";
import { Layout } from "../../../Components/Sidebar";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Save, ShieldAlert } from "lucide-react";

const BARANGAYS = [
    "Mamatid",
    "Sala",
    "Marinig",
    "Banay-Banay",
    "Gulod",
    "Casile",
    "Banlic",
];
const VULNERABILITIES = [
    { id: "Senior Citizen", label: "Elderly (60+ years old)" },
    { id: "Children", label: "Children (0-12 years old)" },
    { id: "Pregnant", label: "Pregnant Women" },
    { id: "PWD", label: "Persons with Disabilities (PWD)" },
];

export default function HouseholdForm() {
    const [formData, setFormData] = useState({
        head: "",
        contact: "",
        members: 1,
        barangay: "Banlic",
        center: "Banlic Covered Court",
        vulnerable: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (value) => {
        setFormData((prev) => {
            const current = prev.vulnerable;
            if (current.includes(value)) {
                return {
                    ...prev,
                    vulnerable: current.filter((item) => item !== value),
                };
            } else {
                return { ...prev, vulnerable: [...current, value] };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // router.post('/evacuee-profiles', formData);
        alert("Household Profile Saved successfully!");
        window.history.back();
    };

    return (
        <Layout
            currentPage="Add Household"
            title="Register Household"
            subtitle="Add a new evacuee family record to the masterlist."
        >
            <div className="max-w-4xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/evacuee-profiles"
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Masterlist
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Primary Info Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 transition-colors">
                        <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                Household Representative
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Primary contact and leader of the evacuating
                                family.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Head of Family{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    name="head"
                                    value={formData.head}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-gray-400"
                                    placeholder="Last Name, First Name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Contact Number{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-gray-400"
                                    placeholder="09XXXXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Total Family Members{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    name="members"
                                    value={formData.members}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location & Shelter Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 transition-colors">
                        <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                Location & Assignment
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Origin barangay and current evacuation center
                                assignment.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Origin Barangay{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="barangay"
                                    value={formData.barangay}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                                >
                                    {BARANGAYS.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Assigned Evacuation Center{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    name="center"
                                    value={formData.center}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:bg-white dark:focus:bg-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder-gray-400"
                                    placeholder="e.g. Banlic Covered Court"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vulnerable Groups Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 transition-colors">
                        <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                    Vulnerability Profiling
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Check all that apply to members of this
                                    household.
                                </p>
                            </div>
                            <ShieldAlert
                                className="text-teal-500 opacity-50"
                                size={28}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {VULNERABILITIES.map((vuln) => (
                                <label
                                    key={vuln.id}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                                        formData.vulnerable.includes(vuln.id)
                                            ? "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800"
                                            : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.vulnerable.includes(
                                            vuln.id,
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(vuln.id)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 cursor-pointer"
                                    />
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {vuln.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-3 rounded-xl text-sm font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-sm hover:opacity-90 active:scale-[0.98]"
                            style={{
                                background:
                                    "linear-gradient(90deg, #0d9488, #0f766e)",
                            }}
                        >
                            <Save size={18} />
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
