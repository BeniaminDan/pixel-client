# Progress

- Baseline Next.js app with default landing page, layout, and Tailwind setup is in place.
- Shared utilities now include: `useDebounce`, `useLocalStorage`, `useMediaQuery`, `useAsync`, `apiClient`, `httpRequest` helpers, `useCounterStore`, and `useUiStore` (persisted theme/sidebar).
- Types expanded with API envelopes/errors/query params; barrel exports refreshed across hooks/lib/stores. Axios moved to runtime dependencies.
- Added sticky layout chrome with `AppHeader`/`AppFooter` split into focused components (logo, nav, search, social); homepage replaced with a hero-style scaffold that uses the new layout shell.
- Global theme updated to the new OKLCH palette with Tailwind inline theme mapping (colors, fonts, radius, shadows, sidebar tokens).
- New `/contact` page added with support + bug-report form, contact channels, and live-help guidance using shared UI components.
- Theme toggle component added and surfaced in the header and styleguide for light/dark switching.
- Cookie consent banner with inline management (no dialog); preferences saved to a cookie using shared UI primitives.
- Homepage hero refreshed to match the provided design: dark background, badge + headline copy, primary/secondary CTAs, avatar cluster with social proof. Removed marquees and floating avatars; hero fills viewport height with fluid background restored and header-offset top padding.
- App header gains configurable positioning: default sticky/transparent at top, animates to solid on scroll; `disableSticky` prop switches to fixed solid surface. Header height controlled by `--header-height`.

## Next Steps
- Replace placeholder landing page with real product UI once requirements land.
- Align API types/helpers with backend contracts and extend stores/hooks as features solidify.
