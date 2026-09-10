// Edge middleware for Vercel: forwards every /v1/* call to the iCode control
// server (Render) so the CLI and browser can use ONE origin (the Vercel
// domain) for the marketing site, the /access page, and all control APIs.
// Runs before vercel.json rewrites, so /v1/* is proxied instead of being
// handed to the SPA fallback.

const RENDER_ORIGIN = "https://icode-s05p.onrender.com";

export const config = {
  matcher: ["/v1/:path*"],
};

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const upstream = new URL(url.pathname + url.search, RENDER_ORIGIN);

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("origin");
  headers.delete("content-length");

  const init: RequestInit = {
    method: request.method,
    headers,
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  return fetch(upstream.toString(), init);
}