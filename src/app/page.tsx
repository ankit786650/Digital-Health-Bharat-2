
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, MoreHorizontal, Heart, User, FileText as DocumentIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const upcomingMedications = [
  { name: "Amoxicillin", time: "10:00 AM", icon: PlusCircle },
  { name: "Ibuprofen", time: "12:00 PM", icon: PlusCircle },
  { name: "Vitamin D", time: "06:00 PM", icon: PlusCircle },
];

const recentAppointments = [ // Renamed from recentVisits
  { title: "Cardiology Checkup", doctor: "Dr. Emily Clark", icon: Heart, iconBg: "bg-green-100", iconColor: "text-green-600" },
  { title: "Annual Physical", doctor: "Dr. Robert Harris", icon: User, iconBg: "bg-purple-100", iconColor: "text-purple-600" },
];

const recentDocuments = [
  { name: "Lab Results", date: "07/15/2024", icon: DocumentIcon, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
  { name: "Insurance Card", date: "06/20/2024", icon: DocumentIcon, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Sophia</h1>
        <p className="text-muted-foreground mt-1">Your personal assistant for managing health records, medication reminders, and tracking your health journey effectively.</p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Medications (col-span-2) */}
        <section className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upcoming Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMedications.map((med) => (
                <div key={med.name} className="flex items-center justify-between p-3 bg-card rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 text-primary p-2.5 rounded-full">
                      <med.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full asChild">
                <Link href="/reminders">View All Medications</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Right Sidebar (Recent Appointments, Documents) */}
        <aside className="space-y-6">
          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAppointments.map((appointment) => ( // Renamed from visit to appointment
                <div key={appointment.title} className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-full", appointment.iconBg)}>
                    <appointment.icon className={cn("h-5 w-5", appointment.iconColor)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{appointment.title}</p>
                    <p className="text-xs text-muted-foreground">{appointment.doctor}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full asChild">
                <Link href="/visits">View All Appointments</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3">
                   <div className={cn("p-2.5 rounded-full", doc.iconBg)}>
                    <doc.icon className={cn("h-5 w-5", doc.iconColor)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">Uploaded on {doc.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full asChild">
                <Link href="/documents">View All Documents</Link>
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}
