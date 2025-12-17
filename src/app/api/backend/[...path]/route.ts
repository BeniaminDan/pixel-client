import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL;

async function proxy(req: NextRequest, { params }: { params: { path: string[] } }) {
    const session = await auth();
    const accessToken = (session as any)?.token?.accessToken; // see note below

    // If you followed the earlier callbacks, access token is in the JWT token, not session.
    // For v5, you’ll typically read it via `auth()` + jwt strategy by extending types or storing minimal token in session.
    // Alternative: call `auth()` and retrieve the underlying JWT via callbacks/typed token storage.

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const upstreamUrl = `${API_BASE}/${params.path.join("/")}`;
    const headers = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    headers.delete("host");

    const upstream = await fetch(upstreamUrl, {
        method: req.method,
        headers,
        body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
    });

    return new NextResponse(upstream.body, { status: upstream.status, headers: upstream.headers });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };