
"use client";

import { useState, useEffect } from "react";
import { AddVisitForm } from "@/components/visits/AddVisitForm";
import type { Visit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Plus, BriefcaseMedical, ListOrdered } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  // Removed visitToDelete state as delete functionality is removed from this list view
  const { toast } = useToast();

  useEffect(() => {
    const storedVisits = localStorage.getItem("mediminder_visits");
    if (storedVisits) {
      setVisits(JSON.parse(storedVisits).sort((a:Visit,b:Visit) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mediminder_visits", JSON.stringify(visits));
  }, [visits]);

  const handleAddVisit = (newVisit: Visit) => {
    setVisits((prev) => [newVisit, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({ title: "Visit Logged", description: `Visit with ${newVisit.doctorName} on ${format(new Date(newVisit.date), "MMM d, yyyy")} has been recorded.` });
    setShowAddForm(false);
  };

  // Edit and Delete functions are removed from this page as the UI to trigger them is no longer present
  // To re-add, a detail view or action menu per item would be needed.

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Stethoscope className="h-8 w-8 text-primary"/>Doctor Visits</h1>
        <Button onClick={() => setShowAddForm(prev => !prev)} variant={showAddForm ? "outline" : "default"}>
          <Plus className="mr-2 h-4 w-4" /> {showAddForm ? "Cancel" : "Add Visit"}
        </Button>
      </div>

      {showAddForm && <Separator />}

      {showAddForm && (
        <div className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <AddVisitForm onAddVisit={handleAddVisit} />
        </div>
      )}
      
      <Separator className={showAddForm ? "" : "hidden"}/>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Visits</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {visits.length === 0 && !showAddForm ? (
            <div className="text-center py-10 text-muted-foreground">
              <ListOrdered className="h-12 w-12 mx-auto mb-4" />
              <p>No visits recorded yet.</p>
              <p className="text-sm">Click "+ Add Visit" to log your first appointment.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {visits.map((visit) => (
                <div key={visit.id} className="flex items-start gap-4 py-4 border-b last:border-b-0">
                  <div className="bg-blue-100 text-primary p-3 rounded-full mt-1">
                    <BriefcaseMedical className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {format(new Date(visit.date), "MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground/90">Clinical notes:</span> {visit.notes || "No notes provided."}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Dr. {visit.doctorName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
