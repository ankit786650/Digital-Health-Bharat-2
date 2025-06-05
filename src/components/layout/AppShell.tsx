
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
  Settings,
  Activity,
  QrCode,
  type LucideIcon
} from 'lucide-react';
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar, 
} from '@/components/ui/sidebar';

interface NavItemConfig {
  href: string;
  labelKey: import('@/locales/translations').TranslationKey | 'monitor' | 'healthQrCode';
  icon: LucideIcon;
}

const navItemConfigs: NavItemConfig[] = [
  { href: '/', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/visits', labelKey: 'appointments', icon: CalendarDays },
  { href: '/reminders', labelKey: 'medicationReminder', icon: Pill },
  { href: '/documents', labelKey: 'medicalDocuments', icon: FileText },
  { href: '/monitoring', labelKey: 'monitor' as any, icon: Activity },
  { href: '/analytics', labelKey: 'analytics', icon: BarChart3 },
  { href: '/nearby-facility', labelKey: 'nearbyFacility', icon: MapPin },
  { href: '/health-summary-qr', labelKey: 'healthQrCode' as any, icon: QrCode },
  { href: '/profile', labelKey: 'profile', icon: User },
];

interface AppShellProps {
  children: ReactNode;
}

function AppShellContent({ children }: AppShellProps) {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const { state: sidebarState } = useSidebar(); 

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLabel = (labelKey: NavItemConfig['labelKey']) => {
    if (!mounted) {
      if (labelKey === 'monitor') return 'Monitor';
      if (labelKey === 'healthQrCode') return 'Health QR Code';
      return labelKey.toString().charAt(0).toUpperCase() + labelKey.toString().slice(1);
    }
    if (labelKey === 'monitor') return 'Monitor'; // Assuming 'Monitor' doesn't need translation or key exists.
    if (labelKey === 'healthQrCode') return t('healthQrCode');
    return t(labelKey as import('@/locales/translations').TranslationKey);
  };

  const userName = mounted ? t('kishan', 'User') : 'User';
  const userFallback = mounted ? t('kishan', 'K').charAt(0).toUpperCase() : 'U';

  return (
    <>
      <Sidebar collapsible="icon" className="border-r shadow-sm bg-card">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/40x40.png" alt={userName} data-ai-hint="man face" />
              <AvatarFallback>{userFallback}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-lg text-foreground">
              {userName}
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navItemConfigs.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              const itemLabel = getLabel(item.labelKey);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={itemLabel}
                    className="w-full justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{itemLabel}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2 border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/settings')}
                tooltip={mounted ? t('settings') : 'Settings'}
                className="w-full justify-start"
              >
                <Link href="/settings">
                  <Settings />
                  <span>{mounted ? t('settings') : 'Settings'}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={mounted ? t('logOut') : 'Log Out'}
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive-foreground focus-visible:ring-destructive"
              >
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Logout action (to be implemented)"); }}>
                  <LogOut />
                  <span>{mounted ? t('logOut') : 'Log Out'}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-background">
        <AppShellContent>{children}</AppShellContent>
      </div>
    </SidebarProvider>
  );
}
