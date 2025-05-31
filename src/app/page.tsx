
"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Heart, User, FileText as DocumentIcon, Megaphone, BadgePercent } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext"; 
import { useToast } from "@/hooks/use-toast";

const upcomingMedications = [
  { name: "Amoxicillin", time: "10:00 AM", icon: PlusCircle },
  { name: "Ibuprofen", time: "12:00 PM", icon: PlusCircle },
  { name: "Vitamin D", time: "06:00 PM", icon: PlusCircle },
];

const recentAppointments = [
  { title: "Cardiology Checkup", doctor: "Dr. Aisha Khan", icon: Heart },
  { title: "Annual Physical", doctor: "Dr. Vikram Singh", icon: User },
];

const recentDocuments = [
  { name: "Lab Results", date: "07/15/2024", icon: DocumentIcon },
  { name: "Insurance Card", date: "06/20/2024", icon: DocumentIcon },
];

const healthProgramAlerts = [
  { title: "Free Eye Check-up Camp", details: "Community Hall, Next Sunday", icon: Megaphone },
  { title: "Diabetes Screening Drive", details: "City Hospital, All this week", icon: Megaphone },
  { title: "Vaccination Subsidy Available", details: "Check Govt. Health Portal", icon: BadgePercent },
];

export default function HomePage() {
  const { t } = useLanguage(); 
  const { toast } = useToast();

  const handleMoreOptionsClick = (medicationName: string) => {
    toast({
      title: "Coming Soon!",
      description: `More options for ${medicationName} are under development.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('welcomeBack')}</h1>
        <p className="text-muted-foreground mt-1">{t('welcomeMessage')}</p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Upcoming Medications & Health Program Alerts) */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('upcomingMedications')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingMedications.map((med) => (
                  <div key={med.name} className="flex items-center justify-between p-3 bg-card rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary p-2.5 rounded-full">
                        <med.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.time}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      className="text-muted-foreground"
                      onClick={() => handleMoreOptionsClick(med.name)}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/reminders">{t('viewAllMedications')}</Link>
                </Button>
              </CardFooter>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('healthProgramAlerts')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthProgramAlerts.map((alert) => (
                  <div key={alert.title} className="flex items-center gap-3">
                     <div className="p-2.5 rounded-full bg-info-muted text-info-muted-foreground">
                      <alert.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.details}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/programs">{t('viewAllPrograms')}</Link>
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>

        {/* Right Sidebar (Recent Appointments, Documents) */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('recentAppointments')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.title} className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-info-muted text-info-muted-foreground">
                    <appointment.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{appointment.title}</p>
                    <p className="text-xs text-muted-foreground">{appointment.doctor}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/visits">{t('viewAllAppointments')}</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('documents')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3">
                   <div className="p-2.5 rounded-full bg-info-muted text-info-muted-foreground">
                    <doc.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">Uploaded on {doc.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/documents">{t('viewAllDocuments')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}
