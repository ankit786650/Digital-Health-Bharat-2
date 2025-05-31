
"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Heart, User, FileText as DocumentIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext"; 
import { useToast } from "@/hooks/use-toast"; // Added import

const upcomingMedications = [
  { name: "Amoxicillin", time: "10:00 AM", icon: PlusCircle },
  { name: "Ibuprofen", time: "12:00 PM", icon: PlusCircle },
  { name: "Vitamin D", time: "06:00 PM", icon: PlusCircle },
];

const recentAppointments = [
  { title: "Cardiology Checkup", doctor: "Dr. Emily Clark", icon: Heart, iconBg: "bg-green-100", iconColor: "text-green-600" },
  { title: "Annual Physical", doctor: "Dr. Robert Harris", icon: User, iconBg: "bg-purple-100", iconColor: "text-purple-600" },
];

const recentDocuments = [
  { name: "Lab Results", date: "07/15/2024", icon: DocumentIcon, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
  { name: "Insurance Card", date: "06/20/2024", icon: DocumentIcon, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
];

export default function HomePage() {
  const { t } = useLanguage(); 
  const { toast } = useToast(); // Initialize useToast

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
        {/* Upcoming Medications (col-span-2) */}
        <section className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('upcomingMedications')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMedications.map((med) => (
                <div key={med.name} className="flex items-center justify-between p-3 bg-card rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-2.5 rounded-full"> {/* Changed bg-blue-100 to bg-primary/10 */}
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
                    onClick={() => handleMoreOptionsClick(med.name)} // Added onClick handler
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full asChild">
                <Link href="/reminders">{t('viewAllMedications')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Right Sidebar (Recent Appointments, Documents) */}
        <aside className="space-y-6">
          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('recentAppointments')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAppointments.map((appointment) => (
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
                <Link href="/visits">{t('viewAllAppointments')}</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t('documents')}</CardTitle>
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
                <Link href="/documents">{t('viewAllDocuments')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}
