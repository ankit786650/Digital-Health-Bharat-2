
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Button component is not directly used in this file after changes, but kept for context if needed by children or ThemeToggle indirectly.
// import { Button } from '@/components/ui/button'; 
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CalendarDays,
  Pill,
  FileText,
  BarChart3,
  MapPin,
  User,
  LogOut,
  type LucideIcon
} from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle"; // Added import

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/visits', label: 'Appointments', icon: CalendarDays },
  { href: '/reminders', label: 'Medication Reminder', icon: Pill },
  { href: '/documents', label: 'Medical Documents', icon: FileText },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/nearby-facility', label: 'Nearby Facility', icon: MapPin },
  { href: '/profile', label: 'Profile', icon: User },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-card p-4 flex flex-col fixed h-full shadow-sm border-r">
        <div className="flex items-center gap-3 mb-8 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Kishan" data-ai-hint="man face" />
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg text-foreground">Kishan</span>
        </div>

        <nav className="flex-grow space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-muted-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-border space-y-1">
             <Link
                href="/settings"
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
                    "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {/* Placeholder for future settings icon if needed */}
                {/* <Settings className="h-5 w-5" />  */}
                <span>Settings</span> 
              </Link>
          <Link
            href="/logout" // Assuming a logout page or functionality
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-1 w-full",
                "text-destructive hover:bg-destructive/10"
            )}
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Link>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-2 border-b bg-background px-6"> {/* Added gap-2 */}
            <LanguageToggle /> {/* Added LanguageToggle */}
            <ThemeToggle />
        </header>
        <main className="flex-1 p-8 overflow-y-auto bg-card">
            {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
