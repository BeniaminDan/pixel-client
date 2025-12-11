# Tech Context

- Framework: Next.js 16 with App Router.
- Language: TypeScript (strict), React 19.
- State: Zustand (^5).
- HTTP: Axios (^1.13) configured in `src/lib/apiClient.ts` with helper wrappers in `src/lib/http.ts` for requests, error extraction, and query-string building. Axios is a runtime dependency.
- Styling: Tailwind CSS v4 (imported in `globals.css`), Geist font vars.
- Tooling: ESLint 9 with `eslint-config-next`, Prettier + `prettier-plugin-tailwindcss`.
- Paths: alias `@/*` => `./src/*`.
- Env: `NEXT_PUBLIC_API_URL` drives API base URL (defaults to `http://localhost:3001/api`).
