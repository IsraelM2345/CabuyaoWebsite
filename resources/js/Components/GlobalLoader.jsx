import { useState, useEffect, useRef, useCallback } from "react";
import { router } from "@inertiajs/react";

/**
 * GlobalLoader Component - Optimized Version
 *
 * Displays a loading overlay with the Cabuyao logo during:
 * - Inertia page navigation
 * - Form submissions
 * - API calls
 *
 * This version only shows for operations that take longer than 100ms
 * to avoid flickering on fast operations.
 */
export default function GlobalLoader() {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    // Refs to track state
    const visibleRef = useRef(false);
    const progressRef = useRef(0);
    const showTimeoutRef = useRef(null);
    const forceHideTimeoutRef = useRef(null);
    const progressIntervalRef = useRef(null);
    const navigateStartRef = useRef(0);

    // Delay before showing loader (avoid flicker on fast operations)
    const SHOW_DELAY = 100; // ms
    // Maximum time to show loader before forcing hide
    const MAX_LOAD_TIME = 3000; // 3 seconds

    const showLoader = useCallback(() => {
        // Clear any pending hide timeout
        if (forceHideTimeoutRef.current) {
            clearTimeout(forceHideTimeoutRef.current);
            forceHideTimeoutRef.current = null;
        }

        // Delay showing to avoid flicker on fast operations
        showTimeoutRef.current = setTimeout(() => {
            visibleRef.current = true;
            progressRef.current = 0;
            setVisible(true);
            setProgress(0);

            // Set maximum load time timeout
            forceHideTimeoutRef.current = setTimeout(() => {
                hideLoader();
            }, MAX_LOAD_TIME);
        }, SHOW_DELAY);
    }, []);

    const hideLoader = useCallback(() => {
        // Clear show delay if still pending
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
            showTimeoutRef.current = null;
        }

        // Clear force hide timeout
        if (forceHideTimeoutRef.current) {
            clearTimeout(forceHideTimeoutRef.current);
            forceHideTimeoutRef.current = null;
        }

        // Clear progress interval
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }

        // If not visible, nothing to hide
        if (!visibleRef.current) return;

        visibleRef.current = false;

        // Complete progress animation
        setProgress(100);

        // Hide after a brief delay for smooth transition
        setTimeout(() => {
            setVisible(false);
            setProgress(0);
        }, 100);
    }, []);

    const updateProgress = useCallback((value) => {
        progressRef.current = Math.min(100, Math.max(0, value));
        setProgress(progressRef.current);
    }, []);

    useEffect(() => {
        // Inertia navigation start
        const unsubscribeNavigate = router.on("navigate", () => {
            navigateStartRef.current = Date.now();

            // Clear any existing progress interval
            if (progressIntervalRef.current)
                clearInterval(progressIntervalRef.current);

            showLoader();

            // Simulate initial progress
            updateProgress(5);

            // Gradually increase progress while loading (up to 60%)
            progressIntervalRef.current = setInterval(() => {
                if (progressRef.current < 60) {
                    updateProgress(progressRef.current + Math.random() * 8);
                }
            }, 150);
        });

        // Inertia progress events
        const unsubscribeProgress = router.on("progress", (event) => {
            const { progress: p } = event.detail;
            if (p !== null && visibleRef.current) {
                // Map percentage to 60-90 range (leave room for completion)
                updateProgress(60 + (p / 100) * 30);
            }
        });

        // Inertia finish event
        const unsubscribeFinish = router.on("finish", () => {
            if (progressIntervalRef.current)
                clearInterval(progressIntervalRef.current);

            // If visible, complete and hide
            if (visibleRef.current) {
                updateProgress(100);
                hideLoader();
            } else {
                // Wasn't shown yet, just cancel showing
                hideLoader();
            }
        });

        // Inertia error event
        const unsubscribeError = router.on("error", () => {
            if (progressIntervalRef.current)
                clearInterval(progressIntervalRef.current);
            if (visibleRef.current) {
                updateProgress(100);
            }
            hideLoader();
        });

        // Inertia cancel event
        const unsubscribeCancel = router.on("cancel", () => {
            if (progressIntervalRef.current)
                clearInterval(progressIntervalRef.current);
            hideLoader();
        });

        // Cleanup
        return () => {
            unsubscribeNavigate();
            unsubscribeProgress();
            unsubscribeFinish();
            unsubscribeError();
            unsubscribeCancel();

            if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
            if (forceHideTimeoutRef.current)
                clearTimeout(forceHideTimeoutRef.current);
            if (progressIntervalRef.current)
                clearInterval(progressIntervalRef.current);
        };
    }, [showLoader, hideLoader, updateProgress]);

    // Don't render if not visible
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-200"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(6px)",
            }}
        >
            {/* Progress bar at top */}
            <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-800 z-[10000]">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-yellow-400 transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Logo Container */}
            <div className="relative">
                {/* Glow effect behind logo */}
                <div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(234, 179, 8, 0.15) 50%, transparent 70%)",
                        width: "100px",
                        height: "100px",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />

                {/* Logo */}
                <div className="relative z-10">
                    <img
                        src="/images/cab-logo1.png"
                        alt="Cabuyao City Logo"
                        className="w-16 h-16 object-contain drop-shadow-lg animate-pulse"
                    />
                </div>
            </div>

            {/* Loading text */}
            <p className="mt-4 text-white text-base font-medium tracking-wide animate-pulse">
                Loading...
            </p>

            {/* Animated dots */}
            <div className="mt-3 flex gap-1.5">
                <div
                    className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                />
                <div
                    className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                />
                <div
                    className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                />
            </div>
        </div>
    );
}
