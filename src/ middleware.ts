export { auth as middleware } from "@/auth";

// Optionally scope it:
export const config = {
    matcher: ["/app/:path*", "/api/backend/:path*"],
};