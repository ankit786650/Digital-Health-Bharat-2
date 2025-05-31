
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, CalendarDays, ThumbsUp, AlertTriangle, Phone, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock data for the calendar grid
const mockCalendarDays = Array.from({ length: 35 }, (_, i) => {
  const day = i + 1;
  let status: "taken" | "missed" | "upcoming" | "nodata" = "nodata";
  if (day <= 20) { // Simulate past days
    if (Math.random() > 0.8) status = "missed";
    else if (Math.random() > 0.1) status = "taken";
    else status = "nodata"; // some past days might have no data
  } else if (day <= 22) { // Simulate current/recent past with higher chance of data
     if (Math.random() > 0.7) status = "missed";
     else status = "taken";
  }
  else {
    status = "upcoming";
  }
  // For a 5x7 grid, some cells might be empty if month doesn't start on first day of week or fill all 35 cells
  // For simplicity, we'll fill all cells, assuming it's a generic 5-week view
  return { day: i, status }; // Use index for key, day number can be calculated if needed for display
});

const mockAdherenceScore = 82; // Example score

export default function AnalyticsPage() {
  const { t } = useLanguage(); // Assuming you might add translations later
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [adherenceScore, setAdherenceScore] = useState(mockAdherenceScore);
  const [calendarDays, setCalendarDays] = useState(mockCalendarDays);

  useEffect(() => {
    setMounted(true);
    // In a real app, you would fetch this data
  }, []);

  const getAdherenceFeedback = () => {
    if (adherenceScore >= 80) {
      return {
        emoji: <ThumbsUp className="h-6 w-6 text-green-500" />,
        message: "Great job on staying consistent!",
        textColor: "text-green-600",
      };
    } else if (adherenceScore >= 60) {
      return {
        emoji: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        message: "Good effort, but some doses were missed.",
        textColor: "text-yellow-600",
      };
    } else {
      return {
        emoji: <AlertTriangle className="h-6 w-6 text-red-500" />,
        message: "Let's work on improving adherence.",
        textColor: "text-red-600",
      };
    }
  };

  const adherenceFeedback = getAdherenceFeedback();

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="text-lg font-semibold text-muted-foreground">
          Loading Analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
      </div>

      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            Medication Adherence
          </CardTitle>
          <CardDescription>
            Track your medication intake and adherence over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Tracker: Simplified Calendar Grid */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Monthly Dose Tracker (Sample View)
            </h3>
            <div className="grid grid-cols-7 gap-1 p-2 border rounded-md bg-muted/30">
              {calendarDays.map((item) => (
                <div
                  key={item.day}
                  className={cn(
                    "w-full aspect-square rounded flex items-center justify-center text-xs font-medium",
                    item.status === "taken" && "bg-green-500 text-white",
                    item.status === "missed" && "bg-red-500 text-white",
                    item.status === "upcoming" && "bg-slate-200 text-slate-500",
                    item.status === "nodata" && "bg-slate-100 text-slate-400"
                  )}
                  title={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                >
                  {/* Minimalist: just color. Could add day number if needed */}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-2 text-xs">
              <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500"></span> Taken</div>
              <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500"></span> Missed</div>
              <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-slate-200"></span> Upcoming</div>
            </div>
          </section>

          {/* Adherence Score */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Adherence Score</h3>
            <div className="flex items-center gap-4 p-4 border rounded-md bg-card">
              <div className="flex-shrink-0">
                {adherenceFeedback.emoji}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-baseline mb-1">
                  <p className={`text-xl font-bold ${adherenceFeedback.textColor}`}>
                    {adherenceScore}% Adherence
                  </p>
                  <p className={`text-sm font-medium ${adherenceFeedback.textColor}`}>
                    {adherenceFeedback.message}
                  </p>
                </div>
                <Progress value={adherenceScore} className="h-3" />
              </div>
            </div>
          </section>

          {/* Trend Alerts */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary"/>
              Trend Alerts
            </h3>
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300">
              <AlertTriangle className="h-5 w-5 !text-red-500 dark:!text-red-400" />
              <AlertTitle className="font-semibold !text-red-700 dark:!text-red-300">Heads Up!</AlertTitle>
              <AlertDescription className="!text-red-600 dark:!text-red-300/90">
                You’ve missed 3 doses this week. Consistent intake is key to your treatment.
              </AlertDescription>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-800/50 dark:hover:text-red-200"
                  onClick={() => toast({ title: "Contact Support", description: "Helpline details would appear here." })}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </Alert>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
