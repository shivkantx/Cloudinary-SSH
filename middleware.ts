import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextFetchEvent } from "next/server";

// ✅ Correct function signature
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  return clerkMiddleware()(req, event);
}

// ✅ Ensure you match all routes properly
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|woff2?|ttf|map|txt)).*)",
    // Always run for API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};
