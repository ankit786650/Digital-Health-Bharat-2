
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/reminders", label: "Reminders" },
  { href: "/visits", label: "Visits" },
  { href: "/documents", label: "Documents" },
  { href: "/profile", label: "Profile" }, 
  { href: "/settings", label: "Settings" },
];

const AppLogo = () => (
  <div className="size-6 text-primary">
    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
    </svg>
  </div>
);


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-border bg-card px-10 py-3 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-slate-900">
            <AppLogo />
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">HealthHub</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium leading-normal transition-colors",
                    isActive ? "text-primary font-bold" : "text-slate-700 hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <form className="hidden sm:flex flex-shrink-0 min-w-40 !h-10 max-w-64">
            <div className="relative flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-slate-500 absolute left-0 top-0 flex h-full items-center justify-center pl-3">
                <Search className="h-5 w-5" />
              </div>
              <Input
                suppressHydrationWarning
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary border-border bg-background focus:border-primary h-full placeholder:text-slate-500 pl-10 pr-3 text-sm font-normal leading-normal"
                placeholder="Search"
              />
            </div>
          </form>
          <Button 
            suppressHydrationWarning
            variant="ghost" 
            size="icon" 
            className="text-slate-500 hover:text-primary relative flex size-10 items-center justify-center rounded-full transition-colors hover:bg-accent">
            <Bell className="h-6 w-6" />
          </Button>
          <Avatar className="h-10 w-10 border-2 border-card shadow-sm">
            <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-card border-b border-border p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive ? "bg-accent text-primary" : "text-slate-700 hover:bg-accent/50 hover:text-primary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
           <form className="flex sm:hidden flex-shrink-0 w-full !h-10 mt-2">
            <div className="relative flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-slate-500 absolute left-0 top-0 flex h-full items-center justify-center pl-3">
                <Search className="h-5 w-5" />
              </div>
              <Input
                suppressHydrationWarning
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary border-border bg-background focus:border-primary h-full placeholder:text-slate-500 pl-10 pr-3 text-sm font-normal leading-normal"
                placeholder="Search"
              />
            </div>
          </form>
        </nav>
      )}

      <main className="flex flex-1">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
