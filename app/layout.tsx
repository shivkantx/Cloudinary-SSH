import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for SEO and browser info
export const metadata: Metadata = {
  title: "☁️ Cloudinary SaaS",
  description:
    "Modern SaaS platform built with Next.js 16, Tailwind CSS, DaisyUI Dark Mode, and Clerk authentication.",
};

// Root Layout
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100 text-base-content transition-colors`}
        >
          {/* Header */}
          <header className="flex justify-between items-center px-6 py-4 border-b border-base-300 bg-base-200/40 backdrop-blur-md">
            <h1 className="text-lg font-semibold text-primary">
              ☁️ Cloudinary SaaS
            </h1>

            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton>
                  <button className="px-4 py-2 rounded-lg bg-primary text-primary-content hover:bg-primary/80 transition font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-content hover:bg-secondary/80 transition font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>

          {/* Main Content */}
          <main className="min-h-[calc(100vh-4rem)] px-6 py-10">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
