
"use client";

import { useState, useEffect } from "react";
import { AddVisitForm } from "@/components/visits/AddVisitForm";
import type { Visit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Stethoscope, Loader2 } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

const initialVisits: Visit[] = [
    { id: "1", date: "2024-07-15", doctorName: "Dr. Priya Sharma", specialization: "Psychiatry", notes: "Patient reported improved sleep patterns and reduced anxiety levels. Continue current medication regimen." },
    { id: "2", date: "2024-06-20", doctorName: "Dr. Vikram Singh", specialization: "General Practice", notes: "Blood pressure within normal range. Continue with current medication." },
    { id: "3", date: "2024-05-10", doctorName: "Dr. Priya Sharma", specialization: "Psychiatry", notes: "Patient reported mild headaches. Adjusted medication dosage. Follow up in 2 weeks." },
    { id: "4", date: "2024-04-05", doctorName: "Dr. Vikram Singh", specialization: "General Practice", notes: "Initial consultation. Prescribed medication for anxiety and sleep issues." },
];


export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedVisits = localStorage.getItem("meditrack_visits");
    if (storedVisits) {
      setVisits(JSON.parse(storedVisits).sort((a:Visit,b:Visit) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
      // Initialize with default data if no local storage data
      setVisits(initialVisits.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    setIsLoading(false);                                                                                                                                                                                                       
  }, []);

  useEffect(() => {                                                                                                                                                                           
    if (!isLoading) {
      localStorage.setItem("meditrack_visits", JSON.stringify(visits));
    }
  }, [visits, isLoading]);

  const handleAddVisit = (newVisit: Omit<Visit, 'id' | 'attachedDocuments'> & { attachedDocuments?: File[] }) => {
    const visitWithId: Visit = {
      ...newVisit,
      id: `visit-${Date.now()}`,
      attachedDocuments: newVisit.attachedDocuments || [],
    };
    setVisits((prev) => [visitWithId, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({ title: "Appointment Logged", description: `Appointment with ${visitWithId.doctorName} on ${format(new Date(visitWithId.date), "MMM d, yyyy")} has been recorded.` });
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-[300px]">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">Doctors Appointment</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            When you tap 'Add Appointment,' a simple form pops up. You can fill in the date of your appointment, your doctor's name, and any notes about what happened during the appointment. There's also a handy option to set a reminder for your next appointment, including the time and a short note to jog your memory. Plus, if you have any documents from a past appointment with the same doctor, you can easily upload them here.
          </p>
        </div>
        <div className="relative">
          <Button 
            onClick={() => setShowAddForm(prev => !prev)} 
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-primary-foreground text-sm font-semibold leading-normal shadow-sm hover:bg-primary/90 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus className="h-4 w-4" />
            <span className="truncate">{showAddForm ? "Cancel" : "Add Appointment"}</span>
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <AddVisitForm onAddVisit={handleAddVisit} onCancel={() => setShowAddForm(false)} />
        </div>
      )}
      
      <Card className="shadow-lg rounded-xl overflow-hidden bg-card">
        <CardHeader className="px-6 py-4 border-b border-border">
          <CardTitle className="text-xl font-semibold leading-tight tracking-tight text-card-foreground">Recent Appointments</CardTitle>
        </CardHeader>
        {isLoading ? (
           <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 mx-auto text-muted-foreground mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading appointments...</p>
          </CardContent>
        ) : (
          <CardContent className="p-0 divide-y divide-border">
            {visits.length === 0 && !showAddForm ? (
              <div className="text-center py-10 px-6 text-muted-foreground">
                <Stethoscope className="h-12 w-12 mx-auto mb-4" />
                <p>No appointments recorded yet.</p>
                <p className="text-sm">Click "+ Add Appointment" to log your first appointment.</p>
              </div>
            ) : (
              visits.map((visit) => (
                <div key={visit.id} className="flex items-start gap-4 p-6 hover:bg-secondary transition-colors duration-150">
                  <div className="text-primary flex items-center justify-center rounded-full bg-primary/10 shrink-0 size-12 mt-1">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-base font-semibold leading-normal mb-1 text-foreground">
                      {format(parseISO(visit.date), "MMMM d, yyyy")}
                    </p>
                    {visit.notes && (
                      <p className="text-sm font-normal leading-relaxed mb-1 text-muted-foreground">
                        Clinical notes: {visit.notes}
                      </p>
                    )}
                    <p className="text-sm font-medium leading-normal text-muted-foreground/80">
                      {visit.doctorName} - {visit.specialization || "N/A"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
 