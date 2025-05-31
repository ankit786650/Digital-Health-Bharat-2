
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Keep for potential future use, but not in current design
import { BarChart3, CalendarDays, ChevronLeft, ChevronRight, ThumbsUp, AlertTriangle, Smile, Frown, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CalendarDay {
  date: number | null;
  status?: 'taken' | 'missed' | 'none' | 'selected';
  isToday?: boolean;
  isCurrentMonth: boolean;
}

interface CalendarMonthData {
  name: string;
  year: number;
  days: CalendarDay[];
  dayLabels: string[];
}

// Helper to generate calendar days for a month
const generateCalendarDays = (year: number, month: number): CalendarDay[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysArray: CalendarDay[] = [];

  // Add empty cells for days before the first of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push({ date: null, isCurrentMonth: false });
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    let status: CalendarDay['status'] = 'none';
    if (i <= 20 && month === 9) { // Mock data for October
        if (i % 5 === 0 && i !== 15) status = 'missed';
        else if (i % 3 === 0 || i % 7 === 0) status = 'taken';
    }
    if (month === 9 && i === 11) status = 'selected'; // October 11th selected

    daysArray.push({
      date: i,
      status: status,
      isToday: new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === i,
      isCurrentMonth: true,
    });
  }

  // Add empty cells to fill the last week
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  while (daysArray.length < totalCells) {
    daysArray.push({ date: null, isCurrentMonth: false });
  }
  return daysArray;
};


const mockOctoberData: CalendarMonthData = {
  name: "October",
  year: 2024,
  days: generateCalendarDays(2024, 9), // Month is 0-indexed, so 9 is October
  dayLabels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
};

const mockNovemberData: CalendarMonthData = {
  name: "November",
  year: 2024,
  days: generateCalendarDays(2024, 10), // 10 is November
  dayLabels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
};


const adherenceScores = [
    { title: "Overall Adherence", score: 85, Icon: Smile, color: "text-blue-500" },
    { title: "Morning Medication", score: 92, Icon: ThumbsUp, color: "text-green-500" },
    { title: "Evening Medication", score: 78, Icon: Frown, color: "text-orange-500" },
];

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <div className="text-lg font-semibold text-muted-foreground">
          Loading Analytics...
        </div>
      </div>
    );
  }

  const CalendarView = ({ data }: { data: CalendarMonthData }) => (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-3">
        <Button variant="ghost" size="icon-sm" aria-label="Previous month">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <CardTitle className="text-lg font-semibold text-center">
          {data.name} {data.year}
        </CardTitle>
        <Button variant="ghost" size="icon-sm" aria-label="Next month">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {data.dayLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-x-1 gap-y-2">
          {data.days.map((day, index) => (
            <div key={index} className={cn(
                "flex flex-col items-center justify-center h-10 w-full rounded-md relative",
                 day.status === 'selected' && 'bg-primary text-primary-foreground',
                 day.isToday && day.status !== 'selected' && 'border-2 border-blue-300' // Example: border for today if not selected
            )}>
              {day.date !== null && (
                <>
                  <span className={cn(
                    "text-sm",
                    !day.isCurrentMonth && "text-muted-foreground/50",
                  )}>
                    {day.date}
                  </span>
                  {day.isCurrentMonth && day.status && day.status !== 'none' && day.status !== 'selected' && (
                     <span className={cn("absolute bottom-1.5 h-1.5 w-1.5 rounded-full",
                        day.status === 'taken' && 'bg-green-500',
                        day.status === 'missed' && 'bg-red-500',
                     )}></span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-foreground">Medication Adherence</h1>
      </div>

      {/* Calendar Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CalendarView data={mockOctoberData} />
        <CalendarView data={mockNovemberData} />
      </section>

      {/* Adherence Score Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Adherence Score</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adherenceScores.map(({ title, score, Icon, color }) => (
            <Card key={title} className="text-center shadow-lg">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-3">
                <p className={`text-5xl font-bold ${color}`}>{score}%</p>
                <Icon className={`h-8 w-8 ${color}`} strokeWidth={1.5} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trend Alerts Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Trend Alerts</h2>
        <Card className="shadow-lg overflow-hidden">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 text-red-500">
                    <AlertTriangle className="h-10 w-10" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Missed Doses Alert</h3>
                    <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                        You’ve missed 3 doses this week. Taking your medication consistently is important for managing your health. Need help remembering or have questions?
                    </p>
                    <Button 
                        onClick={() => toast({ title: "Support Contact", description: "Healthcare worker/helpline details would appear here."})}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Get Support <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <div className="flex-shrink-0 mt-4 md:mt-0">
                    <Image
                        src="https://placehold.co/150x140.png"
                        alt="Health illustration"
                        width={150}
                        height={140}
                        className="rounded-md object-cover"
                        data-ai-hint="woman health illustration"
                    />
                </div>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}

