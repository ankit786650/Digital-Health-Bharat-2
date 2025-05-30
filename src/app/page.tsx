
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreVertical, Heart, User, FileText as DocumentIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

const upcomingMedications = [
  { name: "Amoxicillin", time: "10:00 AM", iconColor: "bg-blue-100 text-primary" },
  { name: "Ibuprofen", time: "12:00 PM", iconColor: "bg-blue-100 text-primary" },
  { name: "Vitamin D", time: "06:00 PM", iconColor: "bg-blue-100 text-primary" },
];

const recentVisits = [
  { type: "Cardiology Checkup", doctor: "Dr. Emily Clark", icon: Heart, iconBg: "bg-green-100", iconColor: "text-green-600" },
  { type: "Annual Physical", doctor: "Dr. Robert Harris", icon: User, iconBg: "bg-purple-100", iconColor: "text-purple-600" },
];

const latestDocuments = [
  { name: "Lab Results", uploadedDate: "07/15/2024", icon: DocumentIcon, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
  { name: "Insurance Card", uploadedDate: "06/20/2024", icon: DocumentIcon, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Welcome back, Sophia
        </h1>
        <p className="text-md text-muted-foreground mt-1">
          Here&apos;s your health dashboard for today.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content area (Upcoming Medications) */}
        <div className="lg:w-2/3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Upcoming Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMedications.map((med, index) => (
                <Card key={index} className="p-4 rounded-lg flex items-center justify-between shadow-none border bg-card">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-full flex items-center justify-center size-10 ${med.iconColor}`}>
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{med.name}</p>
                      <p className="text-sm text-muted-foreground">{med.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </Card>
              ))}
              <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
                View All Medications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar area (Appointments, Documents) */}
        <div className="lg:w-1/3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Visits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentVisits.map((appt, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
                  <div className={`p-2.5 rounded-full flex items-center justify-center size-10 ${appt.iconBg}`}>
                    <appt.icon className={`h-5 w-5 ${appt.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{appt.type}</p>
                    <p className="text-xs text-muted-foreground">{appt.doctor}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 border-primary text-primary hover:bg-primary/10">
                View All Visits
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors">
                  <div className={`p-2.5 rounded-full flex items-center justify-center size-10 ${doc.iconBg}`}>
                    <doc.icon className={`h-5 w-5 ${doc.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">Uploaded on {doc.uploadedDate}</p>
                  </div>
                </div>
              ))}
               <Button variant="outline" className="w-full mt-2 border-primary text-primary hover:bg-primary/10">
                View All Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

