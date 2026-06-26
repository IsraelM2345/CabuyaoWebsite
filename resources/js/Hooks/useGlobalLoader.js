import { useCallback } from "react";

/**
 * useGlobalLoader Hook
 *
 * Provides a simple interface to trigger the GlobalLoader component
 * for async operations like API calls, form submissions, etc.
 *
 * Usage:
 * const { showLoader, hideLoader, withLoader } = useGlobalLoader();
 *
 * // Manual show/hide
 * showLoader();
 * await someOperation();
 * hideLoader();
 *
 * // Automatic with async function
 * await withLoader(async () => {
 *   await fetchData();
 * });
 */
export function useGlobalLoader() {
    const showLoader = useCallback(() => {
        window.dispatchEvent(new CustomEvent("global:loader"));
    }, []);

    const hideLoader = useCallback(() => {
        window.dispatchEvent(new CustomEvent("global:loader-hide"));
    }, []);

    const withLoader = useCallback(
        async (asyncFn, options = {}) => {
            const { hideOnSuccess = true, hideOnError = true } = options;

            showLoader();

            try {
                const result = await asyncFn();
                if (hideOnSuccess) {
                    hideLoader();
                }
                return result;
            } catch (error) {
                if (hideOnError) {
                    hideLoader();
                }
                throw error;
            }
        },
        [showLoader, hideLoader]
    );

    return { showLoader, hideLoader, withLoader };
}
