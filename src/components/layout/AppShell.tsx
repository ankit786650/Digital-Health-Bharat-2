
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import {
  LayoutGrid,
  Pill,
  CalendarDays,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/reminders", label: "Medications", icon: Pill }, // Changed from /reminders to /medications for clarity, icon Pill
  { href: "/visits", label: "Appointments", icon: CalendarDays }, // Changed from /visits, icon CalendarDays
  { href: "/documents", label: "Medical Records", icon: FileText }, // Changed from /documents, icon FileText
  { href: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-4 flex flex-col items-start gap-3">
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://placehold.co/100x100.png" alt="Sophia Carter" data-ai-hint="female avatar" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold text-sidebar-foreground">Sophia Carter</p>
                <p className="text-xs text-muted-foreground">Patient ID: P123456</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="flex-1 overflow-y-auto p-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label, className: "bg-card text-card-foreground border-border" }}
                      className="justify-start text-sidebar-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-auto group-data-[collapsible=icon]:hidden bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarSeparator className="group-data-[collapsible=icon]:hidden bg-sidebar-border" />
          
          <SidebarFooter className="p-2">
             <Link href="/logout" passHref legacyBehavior>
                <SidebarMenuButton 
                    variant="ghost" 
                    className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
                    tooltip={{ children: "Log Out", className: "bg-card text-card-foreground border-border"}}
                >
                    <LogOut className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
                </SidebarMenuButton>
            </Link>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col">
          {/* Header removed as per new design - page titles are part of page content now */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
