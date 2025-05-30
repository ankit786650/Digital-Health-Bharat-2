
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/calendar", label: "Calendar" },
  { href: "/messages", label: "Messages" },
  { href: "/documents", label: "Documents" },
  { href: "/reports", label: "Reports" },
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

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-background">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border px-10 py-3 bg-card shadow-sm">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 text-foreground">
              <AppLogo />
              <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">HealthHub</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium leading-normal transition-colors
                    ${pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/")
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <form className="relative hidden sm:flex flex-shrink-0 min-w-40 !h-10 max-w-64 items-stretch rounded-lg">
              <div className="text-muted-foreground absolute left-0 top-0 flex h-full items-center justify-center pl-3">
                <Search className="h-5 w-5" />
              </div>
              <Input
                className="h-full placeholder:text-muted-foreground pl-10 pr-3 text-sm font-normal leading-normal focus:border-primary"
                placeholder="Search"
              />
            </form>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-accent relative flex size-10 items-center justify-center rounded-full transition-colors">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar className="h-10 w-10 border-2 border-card shadow-sm cursor-pointer hover:border-primary transition-colors">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex flex-1">
          {/* This children will now contain the two-column layout for pages like Documents */}
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
