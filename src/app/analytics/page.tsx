
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  PlusCircle,
  Smile,
  Meh,
  Frown,
  ThumbsUp,
  Lightbulb,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MoodEntry {
  id: string;
  emoji: string;
  title: string;
  description: string;
  time: string;
}

const moodEntries: MoodEntry[] = [
  { id: '1', emoji: '😄', title: 'July 5th - Feeling Great', description: 'Energy levels were high, no significant symptoms.', time: '08:00 AM' },
  { id: '2', emoji: '😐', title: 'July 9th - Feeling Okay', description: 'Slight headache in the afternoon.', time: '09:30 AM' },
  { id: '3', emoji: '😞', title: 'July 12th - Feeling Bad', description: 'Fatigue and joint pain. Took medication as prescribed.', time: '11:15 AM' },
  { id: '4', emoji: '😄', title: 'July 15th - Feeling Great Again!', description: 'Back to feeling good. Medication seems to be helping.', time: '10:00 AM' },
];

interface MoodCorrelationData {
  positive: { percentage: number; label: string };
  neutral: { percentage: number; label: string };
  negative: { percentage: number; label: string };
}

const moodCorrelationData: MoodCorrelationData = {
  positive: { percentage: 75, label: "Positive Mood Days" },
  neutral: { percentage: 15, label: "Neutral Mood Days" },
  negative: { percentage: 10, label: "Negative Mood Days" },
};

interface Observation {
  id: string;
  Icon: LucideIcon;
  iconColorClass: string;
  bgColorClass: string;
  title: string;
  description: string;
}

const helpfulObservations: Observation[] = [
  {
    id: '1',
    Icon: ThumbsUp,
    iconColorClass: 'text-green-600 dark:text-green-400',
    bgColorClass: 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50',
    title: 'Great Job on Consistency!',
    description: 'Taking your medication regularly seems to be helping your mood. Keep up the fantastic work!'
  },
  {
    id: '2',
    Icon: Lightbulb,
    iconColorClass: 'text-yellow-600 dark:text-yellow-400',
    bgColorClass: 'bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50',
    title: 'Energy Boost Days',
    description: "We've noticed your energy is often higher on days you take Medication B. That's a positive sign!"
  },
  {
    id: '3',
    Icon: MessageSquare,
    iconColorClass: 'text-blue-600 dark:text-blue-400',
    bgColorClass: 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50',
    title: 'Talk to Your Doctor',
    description: "If you notice any new or worsening symptoms, or if your current plan isn't feeling right, please chat with your doctor. They can help adjust your care."
  },
];

export default function AnalyticsPage() {
  const { t } = useLanguage(); // Assuming you have translations for titles if needed
  const { toast } = useToast();
  const [currentMonthYear, setCurrentMonthYear] = useState("July 2024"); // Mock state

  // Placeholder for useEffect if data fetching is needed later
  useEffect(() => {
    // Fetch data or set up subscriptions
  }, []);

  const handleLogNewEntry = () => {
    toast({ title: "Log New Entry", description: "This feature is coming soon!" });
  };

  const handleCorrelationReport = () => {
    toast({ title: "Correlation Report", description: "Viewing the full report is coming soon!" });
  };

  return (
    <div className="space-y-8">
      {/* Mood & Symptom Timeline Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Mood &amp; Symptom Timeline</CardTitle>
            <Button variant="link" size="sm" className="text-xs text-muted-foreground hover:text-primary">
              <Info className="h-3 w-3 mr-1" />
              How you've been feeling
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Button variant="ghost" size="icon" aria-label="Previous month">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="font-medium text-foreground">{currentMonthYear}</span>
            <Button variant="ghost" size="icon" aria-label="Next month">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-1 px-3 sm:px-6">
          {moodEntries.map((entry, index) => (
            <React.Fragment key={entry.id}>
              <div className="flex items-start gap-3 py-3">
                <span className="text-2xl mt-0.5">{entry.emoji}</span>
                <div className="flex-grow">
                  <p className="font-medium text-sm text-foreground">{entry.title}</p>
                  <p className="text-xs text-muted-foreground">{entry.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.time}</span>
              </div>
              {index < moodEntries.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
        <CardFooter className="border-t pt-4 mt-2">
          <Button variant="outline" className="w-full bg-muted/50 hover:bg-muted" onClick={handleLogNewEntry}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Log New Entry
          </Button>
        </CardFooter>
      </Card>

      {/* Medication & Well-being Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-semibold text-foreground">Medication &amp; Well-being</h2>
            <Button variant="link" size="sm" className="text-xs text-muted-foreground hover:text-primary">
              <Info className="h-3 w-3 mr-1" />
              How your medication helps
            </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Medication & Mood Correlation Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Medication &amp; Mood Correlation</CardTitle>
                <Select defaultValue="last7days">
                  <SelectTrigger className="w-auto h-8 text-xs">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                    <SelectItem value="last90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                When you took <span className="font-semibold text-foreground">Medication A</span>, your mood was <span className="font-semibold text-green-600">positive {moodCorrelationData.positive.percentage}%</span> of the time.
              </p>
              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-muted-foreground">{moodCorrelationData.positive.label}</span>
                    <span className="font-medium text-green-600">{moodCorrelationData.positive.percentage}%</span>
                  </div>
                  <Progress value={moodCorrelationData.positive.percentage} className="h-2 bg-green-500/20" indicatorClassName="bg-green-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-muted-foreground">{moodCorrelationData.neutral.label}</span>
                    <span className="font-medium text-yellow-500">{moodCorrelationData.neutral.percentage}%</span>
                  </div>
                  <Progress value={moodCorrelationData.neutral.percentage} className="h-2 bg-yellow-500/20" indicatorClassName="bg-yellow-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-muted-foreground">{moodCorrelationData.negative.label}</span>
                    <span className="font-medium text-red-500">{moodCorrelationData.negative.percentage}%</span>
                  </div>
                  <Progress value={moodCorrelationData.negative.percentage} className="h-2 bg-red-500/20" indicatorClassName="bg-red-500" />
                </div>
              </div>
               <Button variant="link" size="sm" className="text-primary p-0 h-auto text-xs" onClick={handleCorrelationReport}>
                See Full Correlation Report <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Helpful Observations Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-medium">Helpful Observations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {helpfulObservations.map((obs) => (
                <div key={obs.id} className={cn("p-3 rounded-lg flex items-start gap-3 border", obs.bgColorClass)}>
                  <div className={cn("flex-shrink-0 rounded-full p-1.5 mt-0.5", obs.iconColorClass, obs.bgColorClass.replace(/bg-(\w+)-(\d+)/, (match, color, intensity) => intensity === '50' ? `bg-${color}-100 dark:bg-${color}-700/30` : `bg-${color}-200 dark:bg-${color}-600/40`))}>
                     <obs.Icon className={cn("h-4 w-4", obs.iconColorClass)} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{obs.title}</h4>
                    <p className="text-xs text-muted-foreground">{obs.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    