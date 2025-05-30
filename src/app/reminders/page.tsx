
"use client";

import { useState, useEffect } from "react";
import { AddReminderForm } from "@/components/reminders/AddReminderForm";
import { PrescriptionUploadForm } from "@/components/reminders/PrescriptionUploadForm";
import { ReminderCard } from "@/components/reminders/ReminderCard";
import type { MedicationReminder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ListChecks, PlusCircle, BotMessageSquare, Pill } from "lucide-react";
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


export default function RemindersPage() {
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [showAddManualForm, setShowAddManualForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Effect to load reminders from local storage (example of persistence)
  useEffect(() => {
    const storedReminders = localStorage.getItem("mediminder_reminders");
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    }
  }, []);

  // Effect to save reminders to local storage
  useEffect(() => {
    localStorage.setItem("mediminder_reminders", JSON.stringify(reminders));
  }, [reminders]);


  const handleAddReminder = (newReminder: MedicationReminder) => {
    setReminders((prev) => [newReminder, ...prev]);
    toast({ title: "Reminder Added", description: `${newReminder.name} has been added to your reminders.` });
    setShowAddManualForm(false);
  };

  const handleGeneratedReminders = (generatedReminders: MedicationReminder[]) => {
    setReminders((prev) => [...generatedReminders, ...prev]);
    setShowUploadForm(false);
  };
  
  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Reminder Deleted", description: "The reminder has been removed.", variant: "destructive" });
    setReminderToDelete(null);
  };

  const handleEditReminder = (id: string) => {
    // For now, just a placeholder. In a real app, this would open an edit form.
    toast({ title: "Edit Action", description: `Editing reminder with ID: ${id}. (Edit functionality not fully implemented)`});
  };


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><ListChecks className="text-primary"/>Medication Reminders</h1>
            <p className="text-muted-foreground">Manage your medication schedule effectively.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setShowAddManualForm(true); setShowUploadForm(false); }} variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Manually
          </Button>
          <Button onClick={() => { setShowUploadForm(true); setShowAddManualForm(false); }} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <BotMessageSquare className="mr-2 h-4 w-4" /> Upload Prescription (AI)
          </Button>
        </div>
      </div>

      {(showAddManualForm || showUploadForm) && <Separator />}

      {showAddManualForm && (
        <div id="add-manual" className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <AddReminderForm onAddReminder={handleAddReminder} />
        </div>
      )}
      
      {showUploadForm && (
        <div id="upload-prescription" className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <PrescriptionUploadForm onRemindersGenerated={handleGeneratedReminders} />
        </div>
      )}
      
      <Separator />

      <div>
        <h2 className="text-2xl font-semibold mb-6">Your Active Reminders</h2>
        {reminders.length === 0 ? (
          <Card className="text-center py-10">
            <CardContent>
              <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reminders set up yet.</p>
              <p className="text-sm text-muted-foreground">Add reminders manually or upload a prescription to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reminders.map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} onEdit={handleEditReminder} onDelete={() => setReminderToDelete(reminder.id)} />
            ))}
          </div>
        )}
      </div>

      {reminderToDelete && (
        <AlertDialog open={!!reminderToDelete} onOpenChange={() => setReminderToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the reminder for 
                "{reminders.find(r => r.id === reminderToDelete)?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setReminderToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteReminder(reminderToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
