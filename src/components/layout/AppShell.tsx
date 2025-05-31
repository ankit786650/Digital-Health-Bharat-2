
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Settings, // Ensure settings icon is imported if used directly
  type LucideIcon
} from 'lucide-react';
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState, useEffect } from "react"; // Added useState and useEffect

interface NavItemConfig {
  href: string;
  labelKey: import('@/locales/translations').TranslationKey;
  icon: LucideIcon;
}

const navItemConfigs: NavItemConfig[] = [
  { href: '/', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/visits', labelKey: 'appointments', icon: CalendarDays },
  { href: '/reminders', labelKey: 'medicationReminder', icon: Pill },
  { href: '/documents', labelKey: 'medicalDocuments', icon: FileText },
  { href: '/analytics', labelKey: 'analytics', icon: BarChart3 },
  { href: '/nearby-facility', labelKey: 'nearbyFacility', icon: MapPin },
  { href: '/profile', labelKey: 'profile', icon: User },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-card p-4 flex flex-col fixed h-full shadow-sm border-r">
        <div className="flex items-center gap-3 mb-8 p-2">
          <Avatar className="h-10 w-10">
            {mounted ? (
              <>
                <AvatarImage src="https://placehold.co/40x40.png" alt={t('kishan')} data-ai-hint="man face" />
                <AvatarFallback>{t('kishan').charAt(0).toUpperCase()}</AvatarFallback>
              </>
            ) : (
              <>
                <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="man face" />
                <AvatarFallback>U</AvatarFallback>
              </>
            )}
          </Avatar>
          {mounted ? (
            <span className="font-semibold text-lg text-foreground">{t('kishan')}</span>
          ) : (
            <span className="font-semibold text-lg text-foreground">User</span>
          )}
        </div>

        <nav className="flex-grow space-y-1">
          {navItemConfigs.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.labelKey}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-muted-foreground")} />
                {mounted ? t(item.labelKey) : item.labelKey.toString()} 
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-border space-y-1">
             <Link
                href="/settings"
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full",
                    pathname.startsWith('/settings')
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <Settings className={cn("h-5 w-5", pathname.startsWith('/settings') ? "text-accent-foreground" : "text-muted-foreground")} />
                {mounted ? t('settings') : 'Settings'}
              </Link>
          <Link
            href="/logout"
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-1 w-full",
                "text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
            )}
            onClick={(e) => { // Placeholder for logout logic, to prevent Next.js navigation error if /logout page doesn't exist
              e.preventDefault();
              alert("Logout action (to be implemented)");
             }}
          >
            <LogOut className="h-5 w-5" />
            {mounted ? t('logOut') : 'Log Out'}
          </Link>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-2 border-b bg-background px-6">
            <LanguageToggle />
            <ThemeToggle />
        </header>
        <main className="flex-1 p-8 overflow-y-auto bg-background"> {/* Changed bg-secondary to bg-background */}
            {children}
        </main>
      </div>
    </div>
  );
}
