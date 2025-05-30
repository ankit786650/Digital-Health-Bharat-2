
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, LayoutGrid, Pill, CalendarDays, FileText, MessageSquare } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/reminders", label: "Medications", icon: Pill },
  { href: "/visits", label: "Appointments", icon: CalendarDays },
  { href: "/messages", label: "Messages", icon: MessageSquare, badge: 3 }, // Example badge
  { href: "/documents", label: "Documents", icon: FileText },
];

const AppLogo = () => (
  <div className="size-6 text-primary">
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
    </svg>
  </div>
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border px-10 py-3 shadow-sm bg-card">
        <div className="flex items-center gap-3 text-foreground">
          <AppLogo />
          <h2 className="text-xl font-semibold leading-tight tracking-tight">MediTrack</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4">
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium leading-normal transition-colors duration-150 ${
                  pathname === item.href
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-secondary">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            {/* Add DropdownMenu for avatar later if needed */}
            <Avatar className="h-10 w-10 border-2 border-border hover:border-primary transition-colors duration-150 cursor-pointer">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col w-full max-w-5xl flex-1">
          {children}
        </div>
      </main>
      <Toaster />
      {/* Mobile navigation can be added here if needed, e.g. using a Sheet component */}
    </div>
  );
}
