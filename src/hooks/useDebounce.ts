/**
 * @fileoverview Custom hook for debouncing a value.
 *
 * This hook is used to delay updating a value state until a specified time
 * has passed since the last change. This is essential for performance-intensive
 * tasks like filtering, search inputs, or window resizing.
 *
 * @example
 * // In a component:
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * // This useEffect only runs 500ms after the user stops typing:
 * useEffect(() => {
 * if (debouncedSearchTerm) {
 * fetchData(debouncedSearchTerm);
 * }
 * }, [debouncedSearchTerm]);
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timeout to update the debounced value
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clear the timeout if the value changes or the component unmounts
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
