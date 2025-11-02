"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 p-4 m-4 rounded-3xl bg-base-100/60 backdrop-blur-lg border border-primary/20 shadow-xl transition-all">
        <div className="flex flex-col items-center gap-2 mb-8">
          <ImageIcon className="w-10 h-10 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cloudinary AI
          </h1>
        </div>

        <ul className="menu p-2 flex-grow space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-200 
                  ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                      : "bg-base-100/50 hover:bg-base-200/70 border border-primary/10"
                  }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    pathname === item.href ? "text-white" : "text-primary"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-50 bg-base-100/60 backdrop-blur-md border-b border-primary/10 shadow-sm">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-3">
            <button
              onClick={() => router.push("/")}
              className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              Cloudinary Showcase
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-8 h-8 rounded-full">
                    <img src={user.imageUrl} alt="user" />
                  </div>
                </div>
                <span className="text-sm text-base-content/80 hidden sm:block">
                  {user.username || user.emailAddresses[0].emailAddress}
                </span>

                {/* Stylish Sign Out Button */}
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
                >
                  <LogOutIcon size={16} className="inline-block mr-1" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 pb-10">
          <div className="max-w-6xl mx-auto mt-2">{children}</div>
        </main>
      </div>
    </div>
  );
}
