import { Layout } from "../../../Components/Sidebar";
import { Link } from "@inertiajs/react";
import { Users, ShieldCheck, History, UserPlus, Key } from "lucide-react";

export default function UserManagementIndex() {
    return (
        <Layout
            currentPage="User Management"
            title="User Management Overview"
            subtitle="Monitor staff accounts, role distributions, and system activity."
        >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-colors">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 transition-colors">
                        <Users
                            size={24}
                            className="text-blue-600 dark:text-blue-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Total System Users
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            12
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-colors">
                    <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/30 transition-colors">
                        <ShieldCheck
                            size={24}
                            className="text-teal-600 dark:text-teal-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Active Admins
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            3
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 transition-colors">
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 transition-colors">
                        <Key
                            size={24}
                            className="text-purple-600 dark:text-purple-400"
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
                            Active Sessions
                        </p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                            5
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/user-management/roles"
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:border-teal-300 dark:hover:border-teal-700 transition-all text-center flex flex-col items-center"
                >
                    <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UserPlus
                            size={32}
                            className="text-teal-600 dark:text-teal-400"
                        />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Manage Staff Roles
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        Add new personnel, update account permissions, and
                        manage access levels across the EvacTech system.
                    </p>
                </Link>

                <Link
                    href="/user-management/logs"
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-center flex flex-col items-center"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <History
                            size={32}
                            className="text-blue-600 dark:text-blue-400"
                        />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        System Activity Logs
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        View a detailed audit trail of user logins, data
                        modifications, and critical system actions for security
                        compliance.
                    </p>
                </Link>
            </div>
        </Layout>
    );
}
