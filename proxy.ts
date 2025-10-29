import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * ✅ Public routes — accessible without login
 */
const isPublicRoute = createRouteMatcher(["/", "/sign-in", "/sign-up"]);

/**
 * ✅ Public API routes — accessible without login
 */
const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // Get the logged-in user (if any)
  const url = new URL(req.url);
  const path = url.pathname;

  const isApi = path.startsWith("/api/");
  const isHome = path === "/home";

  /**
   * 🔁 If a logged-in user visits a public route (like /sign-in),
   * redirect them to the dashboard.
   */
  if (userId && isPublicRoute(req) && !isHome) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  /**
   * 🚫 If the user is not logged in and tries to access
   * a protected page or API route, redirect to sign-in.
   */
  if (!userId) {
    // Protect all non-public and non-public-API pages
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Protect APIs as well (except public ones)
    if (isApi && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  /**
   * ✅ Allow the request to continue
   */
  return NextResponse.next();
});

/**
 * 🧩 Middleware Config:
 * Run for all routes except Next.js internals and static assets.
 */
export const config = {
  matcher: [
    // Run for all pages except static files (images, fonts, etc.)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|webp|gif|svg|ico|woff2?|ttf|csv|zip|webmanifest)).*)",

    // Always run for API and tRPC routes
    "/(api|trpc)(.*)",
  ],
};
