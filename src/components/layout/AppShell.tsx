
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import {
  Home,
  Pill,
  CalendarDays,
  FileText,
  MessageSquare,
  LogOut,
} from "lucide-react";
import Image from "next/image"; // Import next/image

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/medications", label: "Medications", icon: Pill }, // Assuming /medications, adjust if needed
  { href: "/visits", label: "Visits", icon: CalendarDays },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/messages", label: "Messages", icon: MessageSquare }, // Assuming /messages, adjust if needed
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative flex size-full min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-border bg-card p-4 shadow-sm">
          {/* User Info */}
          <div className="mb-8 flex items-center gap-3 p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://placehold.co/48x48.png" alt="Sophia Carter" data-ai-hint="woman face" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Sophia Carter
              </h1>
              {/* <p className="text-sm text-muted-foreground">User</p> */}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-grow flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Log Out */}
          <div className="mt-auto pt-4">
            <Link
              href="/logout" // Adjust logout path as needed
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
