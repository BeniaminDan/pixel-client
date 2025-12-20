/**
 * @fileoverview Zustand store for UI preferences and layout toggles.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemePreference = 'light' | 'dark' | 'system';

interface UiState {
    theme: ThemePreference;
    isSidebarOpen: boolean;
}

interface UiActions {
    setTheme: (theme: ThemePreference) => void;
    toggleTheme: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebar: () => void;
    reset: () => void;
}

type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>()(
    persist(
        (set) => ({
            theme: 'system',
            isSidebarOpen: false,
            setTheme: (theme) => set({ theme }),
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'dark' ? 'light' : 'dark',
                })),
            openSidebar: () => set({ isSidebarOpen: true }),
            closeSidebar: () => set({ isSidebarOpen: false }),
            toggleSidebar: () =>
                set((state) => ({
                    isSidebarOpen: !state.isSidebarOpen,
                })),
            reset: () =>
                set({
                    theme: 'system',
                    isSidebarOpen: false,
                }),
        }),
        {
            name: 'ui-store',
            ...(typeof window !== 'undefined'
                ? { storage: createJSONStorage(() => localStorage) }
                : {}),
            partialize: (state) => ({
                theme: state.theme,
                isSidebarOpen: state.isSidebarOpen,
            }),
        }
    )
);
