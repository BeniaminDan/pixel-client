# Active Context

- Default scaffolding added: hooks (`useLocalStorage`, `useMediaQuery`, `useAsync`), UI store (`useUiStore` with persisted theme/sidebar), HTTP helpers (`httpRequest`, `safeHttpRequest`, `buildQueryString`), and normalized API types/results.
- Axios moved to runtime dependencies; barrel exports updated for hooks/lib/stores.
- Current app UI still the Create Next App page; components folder remains empty scaffold.
- Next focus: apply these utilities to real product features as requirements arrive and keep types aligned with backend contracts.
- Constraints: follow barrel-export pattern; avoid styling reusable components at call sites per user preference.
