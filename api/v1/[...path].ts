// Vercel serverless function: proxies every /v1/* request to the iCode
// control server (Render) including the request BODY (edge middleware can't
// read bodies, so POST/PATCH/PUT calls need a function). Lets the CLI and the
// browser use one origin — the Vercel domain — for the site and control API.

const RENDER_ORIGIN = "https://icode-s05p.onrender.com";

type HandlerContext = { params: { path?: string[] } };

export default async function handler(request: Request, ctx: HandlerContext): Promise<Response> {
  const path = ctx.params.path ?? [];
  const url = new URL(request.url);
  const upstream = new URL(`/v1/${path.join("/")}${url.search}`, RENDER_ORIGIN);

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";

  const res = await fetch(upstream.toString(), {
    method,
    headers,
    body: hasBody ? request.body : undefined,
  });

  return new Response(res.body, { status: res.status, headers: res.headers });
}