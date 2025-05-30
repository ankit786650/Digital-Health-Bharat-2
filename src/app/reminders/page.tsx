
"use client";

import { useState, useEffect } from "react";
import { AddReminderForm } from "@/components/reminders/AddReminderForm";
import { PrescriptionUploadForm } from "@/components/reminders/PrescriptionUploadForm";
import type { MedicationReminder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ListChecks,
  PlusCircle,
  BotMessageSquare,
  FilePenLine,
  Trash2,
  ScanLine,
  PillIcon
} from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card"; // Keep for empty state

export default function RemindersPage() {
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [showAddManualForm, setShowAddManualForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Effect to load reminders from local storage
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
    setReminders((prev) => [newReminder, ...prev].sort((a,b) => (b.id > a.id ? 1 : -1))); // Sort by most recent
    toast({ title: "Reminder Added", description: `${newReminder.name} has been added to your reminders.` });
    setShowAddManualForm(false);
    setShowUploadForm(false);
  };

  const handleGeneratedReminders = (generatedReminders: MedicationReminder[]) => {
    setReminders((prev) => [...generatedReminders, ...prev].sort((a,b) => (b.id > a.id ? 1 : -1)));
    toast({ title: "Reminders Generated", description: `${generatedReminders.length} reminder(s) added from prescription.`})
    setShowUploadForm(false);
    setShowAddManualForm(false);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Reminder Deleted", description: "The reminder has been removed.", variant: "destructive" });
    setReminderToDelete(null);
  };

  const handleEditReminder = (id: string) => {
    // For now, just a placeholder. In a real app, this would open an edit form.
    // You could set state here to show an edit form populated with the reminder's data.
    const reminderToEdit = reminders.find(r => r.id === id);
    toast({ title: "Edit Action", description: `Editing reminder for ${reminderToEdit?.name}. (Functionality not fully implemented)` });
  };

  const getStatusBadge = (index: number) : JSX.Element => {
    const statuses = [
      <Badge key="active" variant="outline" className="bg-green-100 text-green-700 border-green-300">Active</Badge>,
      <Badge key="snoozed" variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">Snoozed</Badge>,
      <Badge key="inactive" variant="outline" className="bg-red-100 text-red-700 border-red-300">Inactive</Badge>
    ];
    return statuses[index % statuses.length];
  }

  const getNextReminderTime = (index: number): string => {
    const times = ["Today, 4:00 PM", "Today, 8:00 AM", "Tomorrow, 9:00 AM", "Today, 6:00 PM"];
    return times[index % times.length];
  }


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ListChecks className="text-primary h-8 w-8" />
            Medication Reminders
          </h1>
          <p className="text-muted-foreground">
            Manage all your medication reminders in one place.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button onClick={() => { setShowUploadForm(true); setShowAddManualForm(false); }} variant="outline">
            <ScanLine className="mr-2 h-4 w-4" /> Scan Prescription
          </Button>
          <Button onClick={() => { setShowAddManualForm(true); setShowUploadForm(false); }} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Reminder
          </Button>
        </div>
      </div>

      {(showAddManualForm || showUploadForm) && <Separator />}

      {showAddManualForm && (
        <div
          id="add-manual"
          className="animate-in fade-in-50 slide-in-from-top-5 duration-300"
        >
          <AddReminderForm onAddReminder={handleAddReminder} />
        </div>
      )}

      {showUploadForm && (
        <div
          id="upload-prescription"
          className="animate-in fade-in-50 slide-in-from-top-5 duration-300"
        >
          <PrescriptionUploadForm
            onRemindersGenerated={handleGeneratedReminders}
          />
        </div>
      )}

      <Separator />

      <div>
        <h2 className="text-2xl font-semibold mb-6">All Reminders</h2>
        {reminders.length === 0 ? (
           <Card className="text-center py-10 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center">
              <PillIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No reminders set up yet.</p>
              <p className="text-sm text-muted-foreground">
                Add reminders manually or scan a prescription to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Reminder</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reminders.map((reminder, index) => (
                  <TableRow key={reminder.id}>
                    <TableCell className="font-medium">{reminder.name}</TableCell>
                    <TableCell>{reminder.dosage}</TableCell>
                    <TableCell>{reminder.timings}</TableCell>
                    <TableCell>{getNextReminderTime(index)}</TableCell>
                    <TableCell>
                      {reminder.isGenerated ? (
                        <span className="flex items-center gap-1">
                          <BotMessageSquare className="h-4 w-4 text-primary" /> OCR Scan
                        </span>
                      ) : (
                        "Manual"
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(index)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-primary" onClick={() => handleEditReminder(reminder.id)}>
                        <FilePenLine className="h-4 w-4" />
                         <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => setReminderToDelete(reminder.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {reminderToDelete && (
        <AlertDialog
          open={!!reminderToDelete}
          onOpenChange={() => setReminderToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                reminder for "{reminders.find((r) => r.id === reminderToDelete)?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setReminderToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteReminder(reminderToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
