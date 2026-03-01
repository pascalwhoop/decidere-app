import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || ""
  if (host === "netcalc.curiloo.com") {
    const url = request.nextUrl.clone()
    url.host = "decidere.app"
    url.protocol = "https:"
    return NextResponse.redirect(url, 301)
  }
}

export const config = {
  matcher: "/:path*",
}
