import { Layout } from "../../../Components/Sidebar";
import { Link } from "@inertiajs/react";
import {
    FileText,
    FilePlus,
    History,
    BarChart3,
    DownloadCloud,
} from "lucide-react";

export default function SystemReportsIndex() {
    return (
        <Layout
            currentPage="System Reports"
            title="System Reports Overview"
            subtitle="Access analytical data, generate new reports, and view export history."
        >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-colors">
                    <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/30 transition-colors">
                        <FileText
                            size={24}
                            className="text-teal-600 dark:text-teal-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Total Reports Generated
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            128
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-colors">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 transition-colors">
                        <DownloadCloud
                            size={24}
                            className="text-blue-600 dark:text-blue-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Downloads This Month
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            45
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-colors">
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 transition-colors">
                        <BarChart3
                            size={24}
                            className="text-purple-600 dark:text-purple-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Most Exported Format
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            PDF
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/system-reports/generate"
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:border-teal-300 dark:hover:border-teal-700 transition-all text-center flex flex-col items-center"
                >
                    <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FilePlus
                            size={32}
                            className="text-teal-600 dark:text-teal-400"
                        />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Generate New Report
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        Create custom reports for evacuee summaries, relief
                        distribution, and shelter occupancy in PDF or Excel
                        formats.
                    </p>
                </Link>

                <Link
                    href="/system-reports/history"
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-center flex flex-col items-center"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <History
                            size={32}
                            className="text-blue-600 dark:text-blue-400"
                        />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        View Export History
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        Access and re-download previously generated reports.
                        Track which staff members exported specific data sets.
                    </p>
                </Link>
            </div>
        </Layout>
    );
}
