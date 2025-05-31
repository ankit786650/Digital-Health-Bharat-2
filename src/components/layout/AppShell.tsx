
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, // Added Dashboard icon
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


interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard }, // Added Dashboard link
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
    <div className="flex min-h-screen bg-background"> {/* bg-background is light gray */}
      {/* Sidebar */}
      <aside className="w-64 bg-card p-4 flex flex-col fixed h-full shadow-sm border-r"> {/* bg-card is white */}
        {/* User Info */}
        <div className="flex items-center gap-3 mb-8 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Kishan" data-ai-hint="man face" />
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg text-foreground">Kishan</span>
        </div>

        {/* Navigation */}
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

        {/* Log Out */}
        <div className="mt-auto">
          <Link
            href="/logout" // Replace with actual logout path/handler
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto bg-card"> {/* bg-card is white for main content panel */}
        {children}
      </main>
      <Toaster />
    </div>
  );
}
