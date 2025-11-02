// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Cloudinary SaaS",
  description: "AI-powered Cloudinary SaaS app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
