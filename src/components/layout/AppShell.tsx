
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Users, Pill, Package, Settings2, HelpCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/medications", label: "Medications", icon: Pill },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden bg-background">
      <div className="flex h-full grow">
        <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-border bg-card p-4">
          <div className="mb-6 flex items-center gap-3 p-3">
            <Avatar className="h-12 w-12 border-2 border-muted">
              <AvatarImage src="https://placehold.co/48x48.png" alt="Dr. Emily Carter" data-ai-hint="doctor avatar" />
              <AvatarFallback>EC</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Dr. Emily Carter</h1>
              <p className="text-sm text-muted-foreground">Cardiologist</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "nav-item",
                    isActive && "active"
                  )}
                >
                  <item.icon className={cn("h-6 w-6", isActive ? "text-accent-foreground" : "text-muted-foreground")} />
                  <p className="text-sm font-medium">{item.label}</p>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto p-3 border-t border-border">
            <Link href="/support" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm">Help & Support</span>
            </Link>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-background p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
