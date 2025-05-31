
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
// import { Toaster } from "@/components/ui/toaster"; // Removed redundant Toaster
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext"; // Added import

interface NavItemConfig {
  href: string;
  labelKey: import('@/locales/translations').TranslationKey; // Use TranslationKey
  icon: LucideIcon;
}

const navItemConfigs: NavItemConfig[] = [
  { href: '/', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/visits', labelKey: 'appointments', icon: CalendarDays },
  { href: '/reminders', labelKey: 'medicationReminder', icon: Pill },
  { href: '/documents', labelKey: 'medicalDocuments', icon: FileText },
  { href: '/analytics', labelKey: 'analytics', icon: BarChart3 }, // Assuming 'analytics' key exists
  { href: '/nearby-facility', labelKey: 'nearbyFacility', icon: MapPin }, // Assuming 'nearbyFacility' key exists
  { href: '/profile', labelKey: 'profile', icon: User },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { t } = useLanguage(); // Get translation function

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-card p-4 flex flex-col fixed h-full shadow-sm border-r"> {/* Sidebar (white) */}
        <div className="flex items-center gap-3 mb-8 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/40x40.png" alt={t('kishan')} data-ai-hint="man face" />
            <AvatarFallback>{t('kishan').charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg text-foreground">{t('kishan')}</span>
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
                    ? "bg-accent text-accent-foreground" // Accent is light blue, text is darker blue
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground" // Muted text, hover to lighter accent
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-muted-foreground")} />
                {t(item.labelKey)}
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
                {t('settings')}
              </Link>
          <Link
            href="/logout" 
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-1 w-full",
                "text-destructive hover:bg-destructive/10 hover:text-destructive-foreground" // Destructive color for logout
            )}
          >
            <LogOut className="h-5 w-5" />
            {t('logOut')}
          </Link>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col"> {/* This column takes remaining space */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-2 border-b bg-background px-6"> {/* Header bar (white) */}
            <LanguageToggle />
            <ThemeToggle />
        </header>
        <main className="flex-1 p-8 overflow-y-auto bg-secondary"> {/* Main content area (light gray) */}
            {children}
        </main>
      </div>
      {/* <Toaster /> Removed redundant Toaster */}
    </div>
  );
}
