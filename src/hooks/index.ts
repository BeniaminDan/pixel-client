/**
 * @fileoverview Barrel file for custom React hooks.
 *
 * This file serves as a single export point for all hooks within the 'hooks'
 * directory. This simplifies imports in the rest of the application.
 *
 * @usage
 * // Import multiple hooks using one clean path alias:
 * import { useDebounce, useLocalStorage } from '@/hooks';
 */

export * from './useDebounce';
export * from './useLocalStorage';
export * from './useMediaQuery';
export * from './useAsync';
export * from './useCookieConsent';