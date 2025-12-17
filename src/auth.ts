import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

const config: NextAuthConfig = {
    providers: [
        {
            id: "openiddict",
            name: "OpenIddict",
            type: "oidc",
            issuer: process.env.OPENIDDICT_ISSUER,
            clientId: process.env.OPENIDDICT_CLIENT_ID,
            clientSecret: process.env.OPENIDDICT_CLIENT_SECRET,

            // Ask for what you need. Add your API scope.
            authorization: {
                params: {
                    scope: "openid profile email offline_access pixel_api",
                },
            },
        },
    ],

    // Keep the session server-friendly
    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, account }) {
            // First login: persist tokens in the server-side JWT
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpiresAt = account.expires_at
                    ? account.expires_at * 1000
                    : undefined;
            }
            return token;
        },
        async session({ session, token }) {
            // IMPORTANT: do NOT expose access tokens to the browser session unless you truly need it.
            // Keep session minimal.
            session.user = session.user ?? {};
            // (session as any).error = token.error;
            console.log("Error Session Token: ", session, token);
            return session;
        },
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);