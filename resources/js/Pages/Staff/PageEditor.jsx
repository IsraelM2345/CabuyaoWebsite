import React, { useState } from "react";
import { StaffLayout } from "../../Components/StaffSidebar";
import {
    Save,
    Eye,
    Edit3,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FileText,
    Home,
    Info,
    Briefcase,
    Globe,
    Image,
    Link,
} from "lucide-react";

// Sample pages data
const initialPages = [
    {
        id: 1,
        title: "Home",
        slug: "/",
        lastUpdated: "2026-05-20",
        status: "published",
        author: "Admin",
        sections: ["Hero", "News", "Announcements", "Quick Links", "Footer"],
    },
    {
        id: 2,
        title: "About Cabuyao",
        slug: "/about",
        lastUpdated: "2026-05-18",
        status: "published",
        author: "PIO",
        sections: ["History", "Geography", "Demographics", "City Seal"],
    },
    {
        id: 3,
        title: "Accomplishments",
        slug: "/accomplishments",
        lastUpdated: "2026-05-15",
        status: "published",
        author: "Admin",
        sections: ["Infrastructure", "Social Services", "Economic Development"],
    },
    {
        id: 4,
        title: "Tourism",
        slug: "/tourism",
        lastUpdated: "2026-05-10",
        status: "published",
        author: "Tourism Office",
        sections: ["Destinations", "Events", "Food & Dining", "Accommodations"],
    },
    {
        id: 5,
        title: "Gallery",
        slug: "/gallery",
        lastUpdated: "2026-05-05",
        status: "published",
        author: "PIO",
        sections: ["Photos", "Videos"],
    },
    {
        id: 6,
        title: "Mayor's Office",
        slug: "/mayor",
        lastUpdated: "2026-04-28",
        status: "published",
        author: "Admin",
        sections: ["Mayor Profile", "Vice Mayor Profile", "Message"],
    },
    {
        id: 7,
        title: "City Council",
        slug: "/council",
        lastUpdated: "2026-04-20",
        status: "draft",
        author: "Admin",
        sections: ["Councilors List", "Committees", "Ordinances"],
    },
    {
        id: 8,
        title: "Departments",
        slug: "/departments",
        lastUpdated: "2026-04-15",
        status: "published",
        author: "Admin",
        sections: ["Department List", "Contact Info", "Services"],
    },
    {
        id: 9,
        title: "E-Services",
        slug: "/e-services",
        lastUpdated: "2026-04-10",
        status: "published",
        author: "IT Office",
        sections: ["BPLO Online", "Barangay Clearance", "Scholarships"],
    },
    {
        id: 10,
        title: "Transparency",
        slug: "/transparency",
        lastUpdated: "2026-04-05",
        status: "published",
        author: "Admin",
        sections: ["Budget", "Projects", "Reports"],
    },
    {
        id: 11,
        title: "BPLO Services",
        slug: "/bplo",
        lastUpdated: "2026-03-28",
        status: "published",
        author: "BPLO",
        sections: ["Requirements", "Fees", "Process Flow"],
    },
    {
        id: 12,
        title: "PESO Services",
        slug: "/peso",
        lastUpdated: "2026-03-20",
        status: "published",
        author: "PESO",
        sections: ["Job Listings", "Programs", "Contact"],
    },
];

const statusColors = {
    published:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    draft: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function PageEditor() {
    const [pages, setPages] = useState(initialPages);
    const [selectedPage, setSelectedPage] = useState(null);
    const [editingContent, setEditingContent] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter pages
    const filteredPages = pages.filter((page) =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleEdit = (page) => {
        setSelectedPage(page);
        setEditingContent(
            `<!-- Content for ${page.title} -->\n\n<h1>${page.title}</h1>\n<p>Welcome to the ${page.title} page. This is sample content that can be edited.</p>\n\n<h2>Section 1</h2>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`,
        );
    };

    const handleSave = () => {
        if (selectedPage) {
            setPages(
                pages.map((page) =>
                    page.id === selectedPage.id
                        ? {
                              ...page,
                              lastUpdated: new Date()
                                  .toISOString()
                                  .split("T")[0],
                          }
                        : page,
                ),
            );
            setShowSaveModal(true);
            setTimeout(() => {
                setShowSaveModal(false);
                setSelectedPage(null);
                setEditingContent("");
            }, 2000);
        }
    };

    const getPageIcon = (slug) => {
        if (slug === "/") return <Home size={16} />;
        if (slug.includes("about")) return <Info size={16} />;
        if (slug.includes("mayor") || slug.includes("council"))
            return <Briefcase size={16} />;
        if (
            slug.includes("e-") ||
            slug.includes("bplo") ||
            slug.includes("peso")
        )
            return <Globe size={16} />;
        return <FileText size={16} />;
    };

    return (
        <StaffLayout
            currentPage="Page Editor"
            title="Page Editor"
            subtitle="Edit and manage content for all public web portal pages."
        >
            {/* Save Success Toast */}
            {showSaveModal && (
                <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-2">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">
                            Page saved successfully!
                        </span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pages List */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                            <div className="relative">
                                <FileText
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search pages..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                                />
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
                            {filteredPages.map((page) => (
                                <div
                                    key={page.id}
                                    onClick={() => handleEdit(page)}
                                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/30 ${
                                        selectedPage?.id === page.id
                                            ? "bg-red-50 dark:bg-red-900/20"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div
                                                className={`p-2 rounded-lg ${selectedPage?.id === page.id ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-500 dark:bg-slate-600 dark:text-slate-400"}`}
                                            >
                                                {getPageIcon(page.slug)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                                    {page.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                                    {page.slug}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[page.status]}`}
                                        >
                                            {page.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-slate-500">
                                        <span>Updated: {page.lastUpdated}</span>
                                        <span>
                                            {page.sections.length} sections
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-2">
                    {selectedPage ? (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                            {/* Editor Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
                                <div>
                                    <h2 className="font-semibold text-gray-900 dark:text-white">
                                        {selectedPage.title}
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                        Last updated: {selectedPage.lastUpdated}{" "}
                                        by {selectedPage.author}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            setShowPreview(!showPreview)
                                        }
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                                    >
                                        <Eye size={16} />
                                        {showPreview ? "Edit" : "Preview"}
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
                                    >
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>

                            {/* Editor Content */}
                            <div className="p-4">
                                {showPreview ? (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <div
                                            className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 min-h-[400px]"
                                            dangerouslySetInnerHTML={{
                                                __html: editingContent,
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        {/* Section Tabs */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {selectedPage.sections.map(
                                                (section, idx) => (
                                                    <button
                                                        key={idx}
                                                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition"
                                                    >
                                                        {section}
                                                    </button>
                                                ),
                                            )}
                                        </div>

                                        {/* Content Editor */}
                                        <textarea
                                            value={editingContent}
                                            onChange={(e) =>
                                                setEditingContent(
                                                    e.target.value,
                                                )
                                            }
                                            rows={20}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
                                            placeholder="Enter page content here (HTML supported)..."
                                        />

                                        {/* Editor Toolbar */}
                                        <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                            <button
                                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                                title="Bold"
                                            >
                                                <span className="font-bold text-xs">
                                                    B
                                                </span>
                                            </button>
                                            <button
                                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                                title="Italic"
                                            >
                                                <span className="italic text-xs">
                                                    I
                                                </span>
                                            </button>
                                            <button
                                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                                title="Heading"
                                            >
                                                <span className="font-bold text-xs">
                                                    H1
                                                </span>
                                            </button>
                                            <button
                                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                                title="Heading 2"
                                            >
                                                <span className="font-bold text-xs">
                                                    H2
                                                </span>
                                            </button>
                                            <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-2" />
                                            <button
                                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                                title="Insert Image"
                                            >
                                                <Image size={16} />
                                            </button>
                                            <button
                                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-slate-400 transition"
                                                title="Insert Link"
                                            >
                                                <Link size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-center min-h-[500px]">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                                    <Edit3
                                        size={28}
                                        className="text-gray-400"
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Select a Page to Edit
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                    Choose a page from the list to start editing
                                    its content.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}
