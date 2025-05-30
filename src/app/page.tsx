
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, CalendarDays, FilePlus2, Pill } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 p-6 rounded-lg shadow-md bg-gradient-to-r from-primary to-teal-600 text-primary-foreground">
        <h1 className="text-4xl font-bold mb-2">Welcome to MediMinder AI!</h1>
        <p className="text-lg text-primary-foreground/90">
          Your intelligent health companion for managing medications and tracking medical history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Reminders</CardTitle>
            <BellRing className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3 Reminders Today</div>
            <p className="text-xs text-muted-foreground">
              Next: Paracetamol 500mg at 2:00 PM
            </p>
            <Button asChild variant="link" className="px-0 text-primary hover:text-accent">
              <Link href="/reminders">View All Reminders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Recent Visit</CardTitle>
            <CalendarDays className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Dr. Smith - July 25, 2024</div>
            <p className="text-xs text-muted-foreground">
              Follow-up check for seasonal flu.
            </p>
            <Button asChild variant="link" className="px-0 text-primary hover:text-accent">
              <Link href="/visits">View Visit History</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
             <Pill className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/reminders#add-manual"><Pill className="mr-2 h-4 w-4" /> Add Manual Reminder</Link>
            </Button>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/reminders#upload-prescription"><FilePlus2 className="mr-2 h-4 w-4" /> Upload Prescription</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Stay on Top of Your Health</CardTitle>
          <CardDescription>
            MediMinder AI helps you organize your medical life seamlessly. Explore features like automatic reminder setup from prescriptions, manual reminders, visit tracking, and secure document storage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-60 w-full rounded-md overflow-hidden">
            <Image
              src="https://placehold.co/800x400.png"
              alt="Healthcare illustration"
              layout="fill"
              objectFit="cover"
              data-ai-hint="health tech illustration"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
