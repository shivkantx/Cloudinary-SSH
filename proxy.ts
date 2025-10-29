import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher(["/", "/signin", "/signup"]);

// Define public API routes that can be accessed without login
const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // Get the logged-in user's ID (if any)
  const url = new URL(req.url);
  const path = url.pathname;

  const isApi = path.startsWith("/api/"); // Check if request is for API
  const isHome = path === "/home"; // Dashboard or protected page

  // ✅ Redirect logged-in users away from sign-in/up pages to the dashboard
  if (userId && isPublicRoute(req) && !isHome) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 🚫 Redirect non-logged-in users trying to access protected routes
  if (!userId) {
    // If not logged in and not accessing a public route or public API
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // If accessing a protected API while not logged in
    if (isApi && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // ✅ Allow the request to continue
  return NextResponse.next();
});

// Configure middleware to run for all routes except static assets
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
