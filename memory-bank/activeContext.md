# Active Context

- Default scaffolding added: hooks (`useLocalStorage`, `useMediaQuery`, `useAsync`), UI store (`useUiStore` with persisted theme/sidebar), HTTP helpers (`httpRequest`, `safeHttpRequest`, `buildQueryString`), and normalized API types/results.
- Axios moved to runtime dependencies; barrel exports updated for hooks/lib/stores.
- Current app UI still the Create Next App page; components folder remains empty scaffold.
- Layout rebuilt with sticky `AppHeader`/`AppFooter` split into dedicated components (logo, nav, search, social); homepage uses the shared layout shell and hero content scaffold.
- Theme tokens refreshed to the provided OKLCH palette with inline Tailwind theme mapping fonts, radius, and shadow variables.
- Contact/Support page added under `/contact` using shared shadcn UI primitives (Cards, Inputs, Select, Textarea) to capture support, bug reports, and quick help details.
- Added global theme toggle component and wired it into the header (replacing Slack icon) and styleguide for light/dark switching.
- Cookie consent banner with inline management (no dialog), using shared UI components; stores preferences (necessary/analytics/marketing) in a cookie and renders globally via layout.
- Next focus: apply these utilities to real product features as requirements arrive and keep types aligned with backend contracts.
- Constraints: follow barrel-export pattern; avoid styling reusable components at call sites per user preference.
- Home hero refreshed to match reference: dark canvas, centered headline/CTA stack, badge/avatar cluster using shadcn `Badge`, `Button`, and `Avatar` primitives; floating avatars and marquees removed per follow-up.
- Hero now spans full viewport height (dvh) with fluid background reinstated and top padding based on `--header-height`.
- Header supports optional non-sticky mode via `disableSticky` prop; default is sticky/transparent at top and shifts to solid on scroll; header height driven by CSS var.
