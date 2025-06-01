
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Keep for potential future use, but not in current design
import { BarChart3, CalendarDays, ChevronLeft, ChevronRight, ThumbsUp, AlertTriangle, Smile, Frown, ArrowRight, ArrowDown, ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

  // Add days of the month based on the provided image for October 2024
  for (let i = 1; i <= daysInMonth; i++) {
    let status: CalendarDay['status'] = 'none';
    if (month === 9 && year === 2024) { // October 2024
        if (i === 5) status = 'selected';
        else if ([4, 6, 10, 16, 27].includes(i)) status = 'taken';
        else if ([7, 20].includes(i)) status = 'missed';
    }
    
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

const adherenceScores = [
    { title: "Overall Adherence", score: 85, Icon: Smile, color: "text-blue-500" },
    { title: "Morning Medication", score: 92, Icon: ThumbsUp, color: "text-green-500" },
    { title: "Evening Medication", score: 78, Icon: Frown, color: "text-orange-500" },
];

interface VitalTrend {
  id: string;
  title: string;
  value: string;
  unit: string;
  trendStatus: 'improving' | 'stable_attention' | 'action_required';
  trendText: string;
  feedback: string;
  Icon: LucideIcon;
  colorClass: string;
  valueColorClass: string;
}

const healthVitalsData: VitalTrend[] = [
  {
    id: "bp",
    title: "Blood Pressure",
    value: "118/78",
    unit: "mmHg",
    trendStatus: 'improving',
    trendText: "Getting Better",
    feedback: "Your blood pressure is looking great. Trend is improving.",
    Icon: ArrowDown,
    colorClass: 'text-green-600 dark:text-green-400',
    valueColorClass: 'text-green-600 dark:text-green-400',
  },
  {
    id: "weight",
    title: "Weight",
    value: "152",
    unit: "lbs",
    trendStatus: 'stable_attention',
    trendText: "Needs Attention",
    feedback: "Your weight has slightly increased. Consider reviewing your diet.",
    Icon: ArrowRight,
    colorClass: 'text-amber-600 dark:text-amber-400',
    valueColorClass: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: "sugar",
    title: "Blood Sugar",
    value: "105",
    unit: "mg/dL",
    trendStatus: 'action_required',
    trendText: "High - Action Required",
    feedback: "Your blood sugar is higher than usual. Please monitor closely.",
    Icon: ArrowUp,
    colorClass: 'text-red-600 dark:text-red-400',
    valueColorClass: 'text-red-600 dark:text-red-400',
  },
];

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  // For now, we'll just display October. Month navigation can be added later.
  const [currentCalendarData, setCurrentCalendarData] = useState<CalendarMonthData>(mockOctoberData);


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
      <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-4">
        <Button variant="ghost" size="icon" aria-label="Previous month" onClick={() => toast({ title: "Navigation", description: "Previous month (coming soon)"})}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <CardTitle className="text-xl font-semibold text-center text-foreground">
          {data.name} {data.year}
        </CardTitle>
        <Button variant="ghost" size="icon" aria-label="Next month" onClick={() => toast({ title: "Navigation", description: "Next month (coming soon)"})}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted-foreground mb-3">
          {data.dayLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-x-1.5 gap-y-2.5">
          {data.days.map((day, index) => (
            <div key={index} className={cn(
                "flex flex-col items-center justify-center h-12 w-full rounded-md relative text-sm",
                 day.status === 'selected' && 'bg-primary text-primary-foreground',
                 day.status === 'taken' && 'bg-green-200/70 dark:bg-green-700/50 text-green-800 dark:text-green-200',
                 day.status === 'missed' && 'bg-red-200/70 dark:bg-red-700/50 text-red-800 dark:text-red-200',
                 day.isToday && day.status !== 'selected' && !['taken', 'missed'].includes(day.status || 'none') && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                 day.date === null ? 'opacity-0 pointer-events-none' : 'hover:bg-accent/50 dark:hover:bg-accent/30 transition-colors'
            )}>
              {day.date !== null && (
                <>
                  <span className={cn(
                    !day.isCurrentMonth && "text-muted-foreground/50",
                  )}>
                    {day.date}
                  </span>
                  {day.isCurrentMonth && (day.status === 'taken' || day.status === 'missed') && (
                     <span className={cn("mt-0.5 h-1.5 w-1.5 rounded-full",
                        day.status === 'taken' && 'bg-green-600 dark:bg-green-400',
                        day.status === 'missed' && 'bg-red-600 dark:bg-red-400',
                     )}></span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center gap-x-6 gap-y-2 mt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                <span>Taken</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                <span>Missed</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      
      {/* Health Vitals Trends Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Health Vitals Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {healthVitalsData.map((vital) => (
            <Card key={vital.id} className="shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">{vital.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className={cn("text-4xl font-bold", vital.valueColorClass)}>
                  {vital.value} <span className="text-lg font-normal text-muted-foreground">{vital.unit}</span>
                </p>
                <div className={cn("flex items-center gap-1.5 text-sm font-medium", vital.colorClass)}>
                  <vital.Icon className="h-4 w-4" />
                  <span>{vital.trendText}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-normal">{vital.feedback}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => toast({ title: "Navigation", description: "Earlier data (coming soon)"})}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Earlier
            </Button>
            <Button onClick={() => toast({ title: "Navigation", description: "Later data (coming soon)"})} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Later <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
      </section>

      {/* Medication Adherence and Calendar Section */}
      <section>
        <div className="mb-4">
            <h1 className="text-3xl font-bold text-foreground">Medication Adherence</h1>
            <p className="text-muted-foreground mt-1">Track your medication intake and stay on schedule.</p>
        </div>
        <CalendarView data={currentCalendarData} />
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
                <div className="flex-shrink-0 text-red-500 dark:text-red-400">
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
