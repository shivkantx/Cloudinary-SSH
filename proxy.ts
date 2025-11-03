import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Public routes that don’t need authentication
const isPublicRoute = createRouteMatcher(["/", "/sign-in", "/sign-up"]);
const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);

  // 🔹 If logged in and visiting a public route — redirect to /home
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 🔹 If NOT logged in and trying to access a protected route — redirect to sign-in
  if (!userId && !isPublicRoute(req) && !isPublicApiRoute(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // ✅ Otherwise allow request to continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|webp|gif|svg|ico|woff2?|ttf|csv|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
