# System Patterns

- Next.js 16 App Router with `src/app` directory; layout + page follow default template.
- Tailwind CSS v4 via `@import "tailwindcss";` in `globals.css` with CSS custom properties for theme tokens.
- Path alias `@/*` maps to `src/*` (tsconfig paths).
- State management via Zustand stores exported through barrel file (`src/stores/index.ts`); examples include `useCounterStore` and persisted `useUiStore`.
- Shared hooks exported through barrel file (`src/hooks/index.ts`); now includes debouncing, async task runner, localStorage sync, and media query listener.
- HTTP handled through an Axios client (`src/lib/apiClient.ts`) plus helper wrappers in `src/lib/http.ts` (`httpRequest`, `safeHttpRequest`, `buildQueryString`); barrel exported in `src/lib/index.ts`.
- Types centralized under `src/types`, including API envelopes/errors and query param helpers.
- User preference: reusable components should encapsulate styling internally rather than being styled at call sites.
