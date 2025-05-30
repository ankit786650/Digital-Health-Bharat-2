
"use client";

import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Basic header placeholder if needed in future */}
      {/* <header className="border-b p-4">
        <h1 className="text-xl font-semibold">App Name</h1>
      </header> */}
      <main className="flex-1 p-4">
        {children}
      </main>
      {/* Basic footer placeholder if needed in future */}
      {/* <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Your Company
      </footer> */}
    </div>
  );
}
