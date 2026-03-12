import { NextRequest, NextResponse } from "next/server";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "builderbio.dev";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const hostname = host.split(":")[0]; // strip port

  // Skip if it's the bare domain, www, or localhost
  if (
    hostname === BASE_DOMAIN ||
    hostname === `www.${BASE_DOMAIN}` ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return NextResponse.next();
  }

  // Check if hostname is a subdomain of BASE_DOMAIN
  if (hostname.endsWith(`.${BASE_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${BASE_DOMAIN}`, "");

    // Skip multi-level subdomains
    if (subdomain.includes(".")) {
      return NextResponse.next();
    }

    // Rewrite public BuilderBio subdomains to the shared React recap page
    if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "") {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-builderbio-subdomain", subdomain);
      requestHeaders.set("x-builderbio-host", hostname);
      return NextResponse.rewrite(new URL("/builderbio-preview", req.url), {
        request: {
          headers: requestHeaders,
        },
      });
    }
    // For non-root paths under subdomains, pass through
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|skills/|install\\.sh|api/).*)",
  ],
};
