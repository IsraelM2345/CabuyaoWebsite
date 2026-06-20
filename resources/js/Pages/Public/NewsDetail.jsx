import React, { useEffect, useState } from "react";
import { Calendar, ArrowLeft, Tag, Image as ImageIcon } from "lucide-react";

function formatDisplayDate(value) {
    if (!value) return "";
    return String(value);
}

export default function NewsDetail({ id }) {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`/api/public/news/${id}`);

                if (!res.ok) {
                    throw new Error(`Failed to load news (${res.status})`);
                }
                const json = await res.json();
                const data = json?.data || json?.item || null;

                if (!cancelled) setItem(data);
            } catch (e) {
                if (!cancelled) setError(e?.message || "Unable to load news.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        if (id) load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div
                className="w-full h-8 flex items-center px-6 text-white text-xs font-medium"
                style={{
                    background:
                        "linear-gradient(90deg, #4c1d95 0%, #dc2626 50%, #f59e0b 100%)",
                }}
            >
                Republic of the Philippines
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-6">
                    <a
                        href="/news"
                        className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline"
                    >
                        <ArrowLeft size={18} /> Back to News
                    </a>
                </div>

                {loading && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                        <p className="text-gray-600 font-bold">Loading...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                        <p className="text-red-600 font-bold">{error}</p>
                    </div>
                )}

                {!loading && !error && !item && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                        <p className="text-gray-600 font-bold">
                            News not found
                        </p>
                    </div>
                )}

                {!loading && !error && item && (
                    <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* --- IMAGE CONTAINER --- */}
                        <div className="relative w-full bg-[#111827] border-b border-gray-100 flex justify-center">
                            {item.image_path ? (
                                <img
                                    src={
                                        item.image_path.startsWith("http")
                                            ? item.image_path
                                            : `/storage/${item.image_path}`
                                    }
                                    alt={item.title}
                                    // object-contain prevents cropping
                                    // max-h-[80vh] caps the height so it doesn't take over the whole screen
                                    className="w-full h-auto max-h-[80vh] object-contain block"
                                />
                            ) : (
                                <div className="w-full flex items-center justify-center text-gray-400 py-24 bg-gray-100">
                                    <ImageIcon size={60} />
                                </div>
                            )}
                        </div>

                        {/* --- TEXT CONTAINER --- */}
                        <div className="p-6 md:p-10">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                {item.category && (
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                                        <Tag size={12} /> {item.category}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={16} />{" "}
                                    {formatDisplayDate(
                                        item.date || item.published_at,
                                    )}
                                </span>
                            </div>

                            {/* Replaced break-words with break-all to force unbroken text to wrap */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-all">
                                {item.title}
                            </h1>

                            {item.excerpt && (
                                <p className="text-gray-600 text-lg leading-relaxed mb-6 break-all">
                                    {item.excerpt}
                                </p>
                            )}

                            {item.body ? (
                                <div className="prose max-w-none break-all">
                                    {item.body}
                                </div>
                            ) : (
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap break-all">
                                    {item.excerpt || ""}
                                </div>
                            )}
                        </div>
                    </article>
                )}
            </div>
        </div>
    );
}
