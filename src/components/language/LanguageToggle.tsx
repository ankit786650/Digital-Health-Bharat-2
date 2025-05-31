
"use client";

import * as React from "react";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Language = "en" | "hi";

export function LanguageToggle() {
  const [mounted, setMounted] = React.useState(false);
  // For demonstration, using local state. In a real app, you'd use a context or i18n library.
  const [currentLanguage, setCurrentLanguage] = React.useState<Language>("en");

  React.useEffect(() => {
    setMounted(true);
    // Here you might want to load the saved language preference
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    // In a real app, you would trigger language change here
    console.log(`Language changed to: ${lang}`);
    // Potentially save to localStorage or update i18n state
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle language"
        disabled
        className="h-9 w-9"
      >
        <Languages className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Toggle language">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("en")} className="flex items-center justify-between">
          <span>English</span>
          {currentLanguage === "en" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("hi")} className="flex items-center justify-between">
          <span>हिंदी (Hindi)</span>
          {currentLanguage === "hi" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
