
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PlusCircle, Pill, Check, X, MoreHorizontal, HeartPulse, ShieldCheck, FlaskConical, FileText, Activity, Sun } from "lucide-react"; // Changed FileShield to FileText
import Link from "next/link";

// Placeholder data
const upcomingMedications = [
  { name: "Amoxicillin", nextDose: "10:00 AM", dosage: "(250mg)", icon: Pill, iconColor: "bg-teal-100 text-teal-600", taken: false, missed: false },
  { name: "Ibuprofen", nextDose: "12:00 PM", dosage: "(200mg)", icon: Activity, iconColor: "bg-purple-100 text-purple-600", taken: true, missed: false },
  { name: "Vitamin D", nextDose: "06:00 PM", dosage: "(1000 IU)", icon: Sun, iconColor: "bg-yellow-100 text-yellow-600", taken: false, missed: true },
];

const recentAppointments = [
  { type: "Cardiology Checkup", doctor: "Dr. Emily Clark", date: "10 Jul 2024", icon: HeartPulse, iconColor: "bg-red-100 text-red-600" },
  { type: "Annual Physical", doctor: "Dr. Robert Harris", date: "02 Jul 2024", icon: ShieldCheck, iconColor: "bg-blue-100 text-blue-600" },
];

const latestDocuments = [
  { name: "Lab Results - Blood Test", uploadedDate: "15 Jul 2024", icon: FlaskConical, iconColor: "bg-green-100 text-green-600" },
  { name: "Insurance Policy Update", uploadedDate: "20 Jun 2024", icon: FileText, iconColor: "bg-indigo-100 text-indigo-600" }, // Changed FileShield to FileText
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome, Sophia!</h1>
        <p className="text-md text-muted-foreground">
          Here&apos;s your health overview for today.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content area (Upcoming Medications) */}
        <div className="lg:w-2/3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Upcoming Medications</CardTitle>
              <Button variant="link" size="sm" asChild className="text-primary hover:underline">
                <Link href="/reminders">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMedications.map((med, index) => (
                <Card key={index} className="bg-muted p-4 rounded-lg flex items-center justify-between shadow-none border-none">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${med.iconColor}`}>
                      <med.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{med.name}</p>
                      <p className="text-sm text-muted-foreground">Next dose: {med.nextDose} <span className="text-xs">{med.dosage}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon-sm" className={`h-7 w-7 ${med.taken ? 'text-green-500' : 'text-muted-foreground/50 hover:text-green-500'}`}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className={`h-7 w-7 ${med.missed ? 'text-destructive' : 'text-muted-foreground/50 hover:text-destructive'}`}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground/70 hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-primary">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Medication
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar area (Appointments, Documents) */}
        <div className="lg:w-1/3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Recent Appointments</CardTitle>
              <Button variant="link" size="sm" asChild className="text-primary hover:underline">
                <Link href="/visits">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAppointments.map((appt, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-full ${appt.iconColor}`}>
                    <appt.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{appt.type}</p>
                    <p className="text-xs text-muted-foreground">{appt.doctor} &bull; {appt.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Latest Documents</CardTitle>
              <Button variant="link" size="sm" asChild className="text-primary hover:underline">
                <Link href="/documents">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-full ${doc.iconColor}`}>
                    <doc.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">Uploaded on {doc.uploadedDate}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Page Footer */}
      <footer className="text-center text-sm text-muted-foreground pt-8">
        © 2024 Digital Health Bharat. All rights reserved.
      </footer>
    </div>
  );
}
