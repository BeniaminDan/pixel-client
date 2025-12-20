/**
 * @fileoverview Hook for syncing state with localStorage in a safe, SSR-friendly way.
 *
 * @example
 * const [theme, setTheme, clearTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
 */

import { useEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

const readValue = <T,>(key: string, initialValue: T): T => {
    if (!isBrowser) return initialValue;

    try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
        return initialValue;
    }
};

/**
 * Returns a tuple of the stored value, setter, and a remover helper.
 */
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(() => readValue(key, initialValue));

    useEffect(() => {
        if (!isBrowser) return;

        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch {
            // Swallow storage errors to avoid breaking the UI
        }
    }, [key, storedValue]);

    const remove = () => {
        setStoredValue(initialValue);

        if (!isBrowser) return;
        window.localStorage.removeItem(key);
    };

    return [storedValue, setStoredValue, remove] as const;
};
