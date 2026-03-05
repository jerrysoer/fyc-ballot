import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGIN = "https://jerrysoer.github.io";

const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function withCors(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  return response;
}

export function middleware(req: NextRequest) {
  // CORS handling for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      return withCors(new NextResponse(null, { status: 204 }));
    }
    return withCors(NextResponse.next());
  }

  // Admin auth for /admin/* routes
  if (!req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const user = process.env.AUTH_USER;
  const password = process.env.AUTH_PASSWORD;

  if (!user || !password) {
    return new NextResponse("Admin not configured", { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // Check lockout
  const attempt = failedAttempts.get(ip);
  if (attempt && attempt.lockedUntil > Date.now()) {
    return new NextResponse("Too many failed attempts. Try again later.", {
      status: 429,
    });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const base64 = authHeader.slice(6);
  let decoded: string;
  try {
    decoded = atob(base64);
  } catch {
    return new NextResponse("Invalid credentials", { status: 401 });
  }

  const [inputUser, inputPass] = decoded.split(":");
  if (inputUser !== user || inputPass !== password) {
    const current = failedAttempts.get(ip) ?? { count: 0, lockedUntil: 0 };
    current.count++;
    if (current.count >= 5) {
      current.lockedUntil = Date.now() + 15 * 60 * 1000;
      current.count = 0;
    }
    failedAttempts.set(ip, current);

    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  failedAttempts.delete(ip);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
