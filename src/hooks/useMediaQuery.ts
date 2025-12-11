/**
 * @fileoverview Hook to track a CSS media query's match state.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 */

import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const mediaQuery = window.matchMedia(query);
        const updateMatch = (event: MediaQueryListEvent) => setMatches(event.matches);

        setMatches(mediaQuery.matches);
        mediaQuery.addEventListener('change', updateMatch);

        return () => {
            mediaQuery.removeEventListener('change', updateMatch);
        };
    }, [query]);

    return matches;
};
