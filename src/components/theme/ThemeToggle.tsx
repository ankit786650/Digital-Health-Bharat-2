
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null on the server and initial client render
    // to avoid hydration mismatch if the theme is resolved differently.
    return (
        <Button
            variant="ghost"
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full justify-start",
                "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-label="Toggle theme"
            disabled
        >
            <Sun className="h-5 w-5" />
            <span className="ml-8">Toggle Theme</span>
        </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full justify-start",
        "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      {/* Position Moon absolutely to overlap Sun, adjust margin-left if needed based on your Sun icon's actual rendered width */}
      <Moon className="absolute ml-[0.05rem] h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="ml-8"> {/* Adjust this margin if icons and text overlap */}
        {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
      </span>
    </Button>
  );
}
