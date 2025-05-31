
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Construction } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a simple loading state or null during SSR and initial client render
    // to avoid hydration issues with translated text.
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="text-lg font-semibold text-muted-foreground">
          Loading Analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">{t('analytics')}</h1>
      </div>
      
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-6 w-6 text-muted-foreground" />
            Under Development
          </CardTitle>
          <CardDescription>
            We're working hard to bring you a comprehensive analytics dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-lg text-foreground mb-2">
              This section is currently under construction.
            </p>
            <p className="text-muted-foreground">
              Analytics features will be added here one by one as you provide them. Please share the first feature you'd like to implement!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
