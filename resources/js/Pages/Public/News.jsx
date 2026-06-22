import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Menu,
    X,
    Tag,
    MapPin,
    Phone,
    Mail,
    Globe,
} from "lucide-react";

import PublicHeader from "../../Components/PublicHeader";
import PublicFooter from "../../Components/PublicFooter";

const CATEGORIES = [
    "All",
    "DRRM",
    "Technology",
    "Health",
    "Education",
    "Business",
];

function formatDisplayDate(value) {
    if (!value) return "";
    return String(value);
}

export default function News() {
    // --- STATES ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [newsPagination, setNewsPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 6,
        total: 0,
    });

    const [annPagination, setAnnPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 6,
        total: 0,
    });

    const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [announcements, setAnnouncements] = useState([]);
    const [announcementsLoading, setAnnouncementsLoading] = useState(false);
    const [announcementsError, setAnnouncementsError] = useState(null);

    const effectiveCategory = useMemo(
        () => (activeCategory === "All" ? null : activeCategory),
        [activeCategory],
    );

    // --- HELPER FUNCTION FOR MOBILE ACCORDION ---
    const toggleMobileDropdown = (menuName) => {
        setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName));
    };

    useEffect(() => {
        let cancelled = false;

        async function loadNews() {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.set("page", String(currentPage));
                params.set("per_page", "6");
                if (effectiveCategory)
                    params.set("category", effectiveCategory);
                if (searchQuery) params.set("q", searchQuery);

                const res = await fetch(
                    `/api/public/news?${params.toString()}`,
                );
                if (!res.ok)
                    throw new Error(`Failed to load news (${res.status})`);
                const json = await res.json();

                if (cancelled) return;
                setNews(Array.isArray(json?.data) ? json.data : []);
                const meta = json?.meta || {};
                setNewsPagination({
                    current_page: meta.current_page ?? currentPage,
                    last_page: meta.last_page ?? 1,
                    per_page: meta.per_page ?? 6,
                    total: meta.total ?? 0,
                });
            } catch (e) {
                if (cancelled) return;
                setError(e?.message || "Unable to load news.");
            } finally {
                if (cancelled) return;
                setLoading(false);
            }
        }

        async function loadAnnouncements() {
            setAnnouncementsLoading(true);
            setAnnouncementsError(null);
            try {
                const params = new URLSearchParams();
                // announcements endpoint supports search/category/status in backend,
                // but this public page only has searchQuery + currentPage right now.
                params.set("page", String(currentPage));
                params.set("per_page", "6");
                if (searchQuery) params.set("search", searchQuery);

                const res = await fetch(
                    `/api/public/announcements?${params.toString()}`,
                );
                if (!res.ok)
                    throw new Error(
                        `Failed to load announcements (${res.status})`,
                    );
                const json = await res.json();

                if (cancelled) return;
                setAnnouncements(Array.isArray(json?.data) ? json.data : []);
            } catch (e) {
                if (cancelled) return;
                setAnnouncementsError(
                    e?.message || "Unable to load announcements.",
                );
            } finally {
                if (cancelled) return;
                setAnnouncementsLoading(false);
            }
        }

        loadNews();
        loadAnnouncements();

        return () => {
            cancelled = true;
        };
    }, [currentPage, effectiveCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* 1. TOP BAR */}
            <PublicHeader activePage="news" />

            {/* 3. HERO BANNER */}
            <div className="relative w-full h-[250px] md:h-[350px] flex items-center bg-gray-900 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: "url('/images/news.jpg')" }}
                />
                <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        News & Announcements
                    </h2>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl drop-shadow-md leading-relaxed">
                        Stay updated with the latest official news, advisories,
                        and events from the City Government.
                    </p>
                </div>
            </div>

            {/* 4. MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="flex flex-col xl:flex-row gap-4 items-center justify-between mb-10 w-full">
                    <div className="w-full xl:max-w-md relative flex-shrink-0">
                        <input
                            type="text"
                            placeholder="Search news..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-800 placeholder-gray-400"
                        />
                    </div>

                    <div className="w-full flex overflow-x-auto gap-2 pb-2 xl:pb-0 items-center no-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setCurrentPage(1);
                                }}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                                    activeCategory === cat
                                        ? "bg-[#0f4a96] text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-gray-600 font-bold">
                            Loading news...
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-red-600 font-bold">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="space-y-10">
                        <div>
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        News
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Latest official updates from the city.
                                    </p>
                                </div>
                            </div>

                            {news.length > 0 ? (
                                <div className="space-y-8">
                                    {news.map((article) => (
                                        <div
                                            key={article.id}
                                            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row group cursor-pointer"
                                        >
                                            <div className="w-full md:w-[320px] lg:w-[400px] h-60 md:h-[280px] flex-shrink-0 relative overflow-hidden bg-gray-100">
                                                <img
                                                    src={
                                                        article.image_path
                                                            ? article.image_path.startsWith(
                                                                  "http",
                                                              )
                                                                ? article.image_path
                                                                : `/storage/${article.image_path}`
                                                            : "/images/news.jpg"
                                                    }
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) =>
                                                        (e.target.src =
                                                            "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800")
                                                    }
                                                />
                                            </div>

                                            <div className="p-6 md:p-8 flex flex-col flex-grow">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                                                        <Tag
                                                            size={12}
                                                            strokeWidth={2.5}
                                                        />{" "}
                                                        {article.category}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                        <Calendar size={14} />{" "}
                                                        {formatDisplayDate(
                                                            article.date ||
                                                                article.published_at,
                                                        )}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight line-clamp-2 break-words">
                                                    {article.title}
                                                </h3>

                                                <p
                                                    className="text-gray-600 text-sm leading-relaxed mb-6 pr-3 line-clamp-3 break-words"
                                                    title={
                                                        article.excerpt ||
                                                        article.body
                                                    }
                                                >
                                                    {article.excerpt ||
                                                        article.body}
                                                </p>
                                                <div className="w-full h-px bg-gray-100 mt-2 mb-1" />

                                                <div className="mt-auto pt-2">
                                                    <a
                                                        href={`/news/${article.id}`}
                                                        className="text-[#0f4a96] font-bold text-sm flex items-center gap-1.5 group-hover:gap-2 transition-all w-max"
                                                    >
                                                        Read Full Article{" "}
                                                        <ArrowRight
                                                            size={16}
                                                            strokeWidth={2.5}
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-14 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <Search
                                        className="mx-auto text-gray-300 mb-4"
                                        size={48}
                                        strokeWidth={1.5}
                                    />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        No news found
                                    </h3>
                                    <p className="text-gray-500">
                                        We couldn't find any news articles
                                        matching your search.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setActiveCategory("All");
                                            setCurrentPage(1);
                                        }}
                                        className="mt-6 bg-blue-50 text-blue-600 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Announcements
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Latest advisories and announcements.
                                    </p>
                                </div>
                            </div>

                            {announcementsLoading ? (
                                <div className="text-center py-14 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-600 font-bold">
                                        Loading announcements...
                                    </p>
                                </div>
                            ) : announcements.length > 0 ? (
                                <div className="space-y-8">
                                    {announcements.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row group cursor-pointer"
                                        >
                                            <div className="w-full md:w-[320px] lg:w-[400px] h-60 md:h-[280px] flex-shrink-0 relative overflow-hidden bg-gray-100">
                                                <img
                                                    src={
                                                        item.image_path
                                                            ? item.image_path.startsWith(
                                                                  "http",
                                                              )
                                                                ? item.image_path
                                                                : `/storage/${item.image_path}`
                                                            : "/images/news.jpg"
                                                    }
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) =>
                                                        (e.target.src =
                                                            "/images/news.jpg")
                                                    }
                                                />
                                            </div>

                                            <div className="p-6 md:p-8 flex flex-col flex-grow">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                                                        <Tag
                                                            size={12}
                                                            strokeWidth={2.5}
                                                        />{" "}
                                                        {item.category}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                        <Calendar size={14} />{" "}
                                                        {formatDisplayDate(
                                                            item.date ||
                                                                item.published_at,
                                                        )}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight line-clamp-2 break-words">
                                                    {item.title}
                                                </h3>

                                                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 break-words">
                                                    {item.body || item.excerpt}
                                                </p>

                                                <div className="mt-auto pt-2">
                                                    <a
                                                        href={`/announcements/${item.id}`}
                                                        className="text-[#0f4a96] font-bold text-sm flex items-center gap-1.5 group-hover:gap-2 transition-all w-max"
                                                    >
                                                        Read Full Article{" "}
                                                        <ArrowRight
                                                            size={16}
                                                            strokeWidth={2.5}
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : announcementsError ? (
                                <div className="text-center py-14 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <p className="text-red-600 font-bold">
                                        {announcementsError}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-14 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        No announcements found
                                    </h3>
                                    <p className="text-gray-500">
                                        There are no announcements right now.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pagination UI (dynamic, uses backend meta). */}
                {!loading && !error && newsPagination.total > 0 && (
                    <div className="mt-16 flex justify-center items-center gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                                currentPage === 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {(() => {
                            const last = newsPagination.last_page || 1;
                            const current =
                                newsPagination.current_page || currentPage;

                            // Build pages list with ellipsis
                            const pages = [];
                            const push = (v) => {
                                if (pages.length === 0) {
                                    pages.push(v);
                                    return;
                                }
                                const prev = pages[pages.length - 1];
                                if (prev !== "…") pages.push(v);
                            };

                            const addRange = (from, to) => {
                                for (let i = from; i <= to; i++) {
                                    if (i >= 1 && i <= last) pages.push(i);
                                }
                            };

                            // Always show: 1, last, current, neighbors
                            const neighbors = 2;
                            const start = Math.max(2, current - neighbors);
                            const end = Math.min(last - 1, current + neighbors);

                            pages.push(1);
                            if (start > 2) pages.push("…");
                            addRange(start, end);
                            if (end < last - 1) pages.push("…");
                            if (last > 1) pages.push(last);

                            // Deduplicate while keeping order
                            const dedup = [];
                            for (const p of pages) {
                                if (dedup.length === 0) {
                                    dedup.push(p);
                                    continue;
                                }
                                if (dedup[dedup.length - 1] === p) continue;
                                dedup.push(p);
                            }

                            return dedup.map((p, idx) => {
                                if (p === "…") {
                                    return (
                                        <span
                                            key={`ellipsis-${idx}`}
                                            className="w-10 h-10 flex items-center justify-center text-gray-400 select-none"
                                        >
                                            …
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-10 h-10 rounded-lg font-medium flex items-center justify-center transition-colors ${
                                            current === p
                                                ? "bg-blue-50 text-blue-600 font-bold"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                );
                            });
                        })()}

                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(
                                        prev + 1,
                                        newsPagination.last_page || prev + 1,
                                    ),
                                )
                            }
                            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                                currentPage >= (newsPagination.last_page || 1)
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                            disabled={
                                currentPage >= (newsPagination.last_page || 1)
                            }
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* 5. FOOTER */}
            <PublicFooter />
        </div>
    );
}
