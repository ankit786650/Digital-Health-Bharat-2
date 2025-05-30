
"use client";

import { useState, useEffect } from "react";
import { AddVisitForm } from "@/components/visits/AddVisitForm";
import { VisitCard } from "@/components/visits/VisitCard";
import type { Visit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ListOrdered, PlusCircle, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card";


export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedVisits = localStorage.getItem("mediminder_visits");
    if (storedVisits) {
      setVisits(JSON.parse(storedVisits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mediminder_visits", JSON.stringify(visits));
  }, [visits]);

  const handleAddVisit = (newVisit: Visit) => {
    setVisits((prev) => [newVisit, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({ title: "Visit Logged", description: `Visit with ${newVisit.doctorName} on ${newVisit.date} has been recorded.` });
    setShowAddForm(false);
  };

  const handleDeleteVisit = (id: string) => {
    setVisits((prev) => prev.filter((v) => v.id !== id));
    toast({ title: "Visit Deleted", description: "The visit record has been removed.", variant: "destructive" });
    setVisitToDelete(null);
  };
  
  const handleEditVisit = (id: string) => {
    toast({ title: "Edit Action", description: `Editing visit with ID: ${id}. (Edit functionality not fully implemented)`});
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Stethoscope className="text-primary"/>Visit History</h1>
            <p className="text-muted-foreground">Keep a chronological record of your doctor appointments.</p>
        </div>
        <Button onClick={() => setShowAddForm(prev => !prev)} variant={showAddForm ? "outline" : "default"}>
          <PlusCircle className="mr-2 h-4 w-4" /> {showAddForm ? "Cancel" : "Log New Visit"}
        </Button>
      </div>

      {showAddForm && <Separator />}

      {showAddForm && (
        <div className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <AddVisitForm onAddVisit={handleAddVisit} />
        </div>
      )}
      
      <Separator />

      <div>
        <h2 className="text-2xl font-semibold mb-6">Your Recorded Visits</h2>
        {visits.length === 0 ? (
          <Card className="text-center py-10">
            <CardContent>
                <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No visits recorded yet.</p>
                <p className="text-sm text-muted-foreground">Click "Log New Visit" to add your first record.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visits.map((visit) => (
              <VisitCard key={visit.id} visit={visit} onEdit={handleEditVisit} onDelete={() => setVisitToDelete(visit.id)} />
            ))}
          </div>
        )}
      </div>

       {visitToDelete && (
        <AlertDialog open={!!visitToDelete} onOpenChange={() => setVisitToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the visit record with 
                "{visits.find(v => v.id === visitToDelete)?.doctorName}" on {visits.find(v => v.id === visitToDelete)?.date}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setVisitToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteVisit(visitToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
