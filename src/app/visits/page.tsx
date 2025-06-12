"use client";

import { useState, useEffect, useRef } from "react";
import { AddVisitForm } from "@/components/visits/AddVisitForm";
import type { Visit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Stethoscope, Loader2, Pencil, User, ClipboardList } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const initialVisits: Visit[] = [
    {
      id: "sample-1",
      date: "2024-08-01",
      doctorName: "Dr. Sample Demo",
      appointmentType: "Follow-up",
      specialization: "Cardiology",
      notes: "Sample appointment for demonstration.",
      location: "Room 101",
      duration: "30 min"
    },
    {
      id: "1",
      date: "2024-07-15",
      doctorName: "Dr. Priya Sharma",
      appointmentType: "Routine Checkup",
      specialization: "Psychiatry",
      notes: "Patient reported improved sleep patterns and reduced anxiety levels. Continue current medication regimen.",
      location: "Room 201",
      duration: "45 min"
    },
    {
      id: "2",
      date: "2024-06-20",
      doctorName: "Dr. Vikram Singh",
      appointmentType: "Initial Consultation",
      specialization: "General Practice",
      notes: "Blood pressure within normal range. Continue with current medication.",
      location: "Room 305",
      duration: "30 min"
    },
    {
      id: "3",
      date: "2024-05-10",
      doctorName: "Dr. Priya Sharma",
      appointmentType: "Follow-up",
      specialization: "Psychiatry",
      notes: "Patient reported mild headaches. Adjusted medication dosage. Follow up in 2 weeks.",
      location: "Room 201",
      duration: "20 min"
    },
    {
      id: "4",
      date: "2024-04-05",
      doctorName: "Dr. Vikram Singh",
      appointmentType: "Initial Consultation",
      specialization: "General Practice",
      notes: "Initial consultation. Prescribed medication for anxiety and sleep issues.",
      location: "Room 305",
      duration: "40 min"
    }
];


export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [followUpData, setFollowUpData] = useState<null | { visit: any }>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleInitial, setRescheduleInitial] = useState<any>(null);
  const rescheduleData = useRef<any>(null);
  const [editAppointment, setEditAppointment] = useState<Visit | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const handleAddVisit = (newVisit: any) => {
    const visitWithId = {
      ...newVisit,
      id: `visit-${Date.now()}`,
      attachedDocuments: newVisit.documents || [],
      date: newVisit.appointmentDate || "",
    };
    setVisits((prev) => [visitWithId, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({
      title: "Appointment Logged",
      description: `Appointment with ${visitWithId.doctor} on ${visitWithId.appointmentDate} at ${visitWithId.appointmentTime} has been recorded.`
    });
    setShowAddForm(false);

    // Validate date and time
    if (!visitWithId.appointmentDate || !visitWithId.appointmentTime) {
      toast({ title: "Error", description: "Appointment date and time are required for follow-up.", variant: "destructive" });
      return;
    }
    const appointmentDateTime = new Date(`${visitWithId.appointmentDate}T${visitWithId.appointmentTime}`);
    if (isNaN(appointmentDateTime.getTime())) {
      toast({ title: "Error", description: "Invalid appointment date or time.", variant: "destructive" });
      return;
    }

    // Calculate the follow-up time (1 hour after appointment)
    const followUpTime = appointmentDateTime.getTime() + 60 * 60 * 1000; // +1 hour

    // Store in localStorage for persistence
    localStorage.setItem("followUpVisit", JSON.stringify({ visit: visitWithId, followUpTime }));

    // Set timer
    const msUntilFollowUp = followUpTime - Date.now();
    if (msUntilFollowUp > 0) {
      setTimeout(() => {
        setFollowUpData({ visit: visitWithId });
        setShowFollowUp(true);
      }, msUntilFollowUp);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("followUpVisit");
    if (stored) {
      const { visit, followUpTime } = JSON.parse(stored);
      const msUntilFollowUp = followUpTime - Date.now();
      if (msUntilFollowUp > 0) {
        setTimeout(() => {
          setFollowUpData({ visit });
          setShowFollowUp(true);
        }, msUntilFollowUp);
      } else if (msUntilFollowUp <= 0 && !showFollowUp) {
        setFollowUpData({ visit });
        setShowFollowUp(true);
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleEditVisit = (updated: any) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === editAppointment?.id
          ? { ...v, ...updated, date: updated.appointmentDate }
          : v
      )
    );
    setShowEditModal(false);
    setEditAppointment(null);
    toast({ title: "Appointment updated successfully." });
    setTimeout(() => {
      localStorage.setItem(
        "meditrack_visits",
        JSON.stringify(
          visits.map((v) =>
            v.id === editAppointment?.id
              ? { ...v, ...updated, date: updated.appointmentDate }
              : v
          )
        )
      );
    }, 0);
  };

  const isOlderThan3Months = (date: string) => {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();
    return now.getTime() - d.getTime() > 90 * 24 * 60 * 60 * 1000;
  };

  // Helper for colored badge
  const getAppointmentTypeBadge = (type: string) => {
    if (!type) return { color: "bg-gray-200 text-gray-700", label: "—" };
    const t = type.toLowerCase();
    if (t.includes("follow")) return { color: "bg-blue-100 text-blue-800", label: type };
    if (t.includes("initial") || t.includes("new")) return { color: "bg-green-100 text-green-800", label: type };
    if (t.includes("routine")) return { color: "bg-yellow-100 text-yellow-800", label: type };
    return { color: "bg-gray-200 text-gray-700", label: type };
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
            onClick={() => setShowAddForm(true)} 
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-primary-foreground text-sm font-semibold leading-normal shadow-sm hover:bg-primary/90 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Plus className="h-4 w-4" />
            <span className="truncate">Add Appointment</span>
          </Button>
        </div>
      </div>

      {/* Dialog for Add Appointment */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 sm:rounded-lg rounded-none max-h-[90vh] h-full sm:h-auto overflow-y-auto">
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <AddVisitForm 
            onAddVisit={handleAddVisit} 
            onCancel={() => {
              setShowAddForm(false);
              setRescheduleInitial(null);
            }}
            initialValues={rescheduleInitial}
            fields={{
              patientName: true,
              appointmentType: true,
              appointmentDate: true,
              appointmentTime: true,
              doctorName: true,
              specialization: true,
              location: true,
              duration: true,
              notes: true,
              documents: true,
              reminder: true,
              enableNotifications: true
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Follow-Up Modal */}
      {showFollowUp && followUpData && (
        <Dialog open={showFollowUp} onOpenChange={setShowFollowUp}>
          <DialogContent className="max-w-md w-full text-center">
            <DialogTitle>Appointment Follow-Up</DialogTitle>
            {/* Doctor metadata section with robust fallbacks */}
            <div className="mb-4 mt-2 text-left flex flex-col gap-1 items-center w-full">
              <div className="font-semibold text-lg text-foreground flex items-center gap-2 flex-wrap">
                <User className="h-4 w-4 text-muted-foreground" />
                {followUpData.visit.doctorName?.trim() ? followUpData.visit.doctorName : "Doctor"}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <Stethoscope className="h-4 w-4" />
                {followUpData.visit.specialization?.trim() ? followUpData.visit.specialization : "Specialty"}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <ClipboardList className="h-4 w-4" />
                {followUpData.visit.appointmentType?.trim() ? followUpData.visit.appointmentType : "Appointment"}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                <span className="font-medium">
                  {followUpData.visit.appointmentDate ? format(parseISO(followUpData.visit.appointmentDate), "MMMM d, yyyy") : "Date"}
                </span>
              </div>
            </div>
            {/* End doctor metadata section */}
            <div className="mt-2 mb-4 text-lg font-medium">
              Did you visit the doctor for your appointment?
            </div>
            <div className="flex justify-center gap-3 mb-4 flex-wrap">
              <Button
                className="bg-blue-100 text-blue-900 font-semibold"
                onClick={() => {
                  setShowFollowUp(false);
                  localStorage.removeItem("followUpVisit");
                  toast({ title: "Thank you!", description: "Glad you made it to your appointment." });
                }}
              >
                ✓ Yes, I did
              </Button>
              <Button
                className="bg-gray-200 text-gray-900 font-semibold"
                onClick={() => {
                  setShowFollowUp(false);
                  setShowReschedule(true);
                  rescheduleData.current = followUpData.visit;
                }}
              >
                ✗ No, I missed it
              </Button>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground border-t pt-2 flex-wrap">
              <span>This is an automated follow-up.</span>
              <span>
                <span className="mr-2">⏰ Snooze</span>
                <span className="cursor-pointer" onClick={() => setShowFollowUp(false)}>🔕 Dismiss</span>
              </span>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reschedule Modal */}
      {showReschedule && (
        <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
          <DialogContent className="max-w-md w-full text-center">
            <DialogTitle>Missed Appointment</DialogTitle>
            <div className="mt-2 mb-4 text-lg font-medium">
              Would you like to reschedule your appointment?
            </div>
            <div className="flex justify-center gap-3 mb-2 flex-wrap">
              <Button
                className="bg-primary text-primary-foreground font-semibold"
                onClick={() => {
                  setShowReschedule(false);
                  setRescheduleInitial(rescheduleData.current);
                  setShowAddForm(true);
                }}
              >
                Yes, Reschedule
              </Button>
              <Button
                variant="outline"
                className="font-semibold"
                onClick={() => setShowReschedule(false)}
              >
                No, Dismiss
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && editAppointment && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl w-full">
            <DialogTitle>Edit Appointment</DialogTitle>
            <AddVisitForm
              onAddVisit={handleEditVisit}
              onCancel={() => setShowEditModal(false)}
              initialValues={editAppointment}
            />
          </DialogContent>
        </Dialog>
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
              visits.map((visit) => {
                const badge = getAppointmentTypeBadge(visit.appointmentType || '');
                return (
                  <div key={visit.id} className="flex items-start gap-4 p-6 hover:bg-secondary transition-colors duration-150">
                    <div className="text-primary flex items-center justify-center rounded-full bg-primary/10 shrink-0 size-12 mt-1">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-base font-semibold leading-normal mb-1 text-foreground">
                        {visit.date ? format(parseISO(visit.date), "MMMM d, yyyy") : "No date"}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground truncate">{visit.doctorName || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <ClipboardList className="h-4 w-4 text-muted-foreground" />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground truncate">{visit.specialization || "—"}</span>
                        </div>
                      </div>
                      {visit.notes && (
                        <p className="text-sm font-normal leading-relaxed mb-1 text-muted-foreground">
                          Clinical notes: {visit.notes}
                        </p>
                      )}
                      <p className="text-sm font-medium leading-normal text-muted-foreground/80">
                        {visit.doctorName} - {visit.specialization || "N/A"}
                      </p>
                      <div className="mt-1">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-xs px-2 py-0.5 text-blue-600 hover:underline"
                          onClick={() => setExpandedId(expandedId === visit.id ? null : visit.id)}
                        >
                          {expandedId === visit.id ? "Hide" : "Show more"}
                        </Button>
                        {expandedId === visit.id && (
                          <div className="mt-2 text-xs text-muted-foreground space-y-1">
                            <div>Location: {(visit as any).location || "N/A"}</div>
                            <div>Duration: {(visit as any).duration || "N/A"}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="ml-2 text-blue-500 hover:text-blue-700 shrink-0"
                      title="Edit appointment"
                      disabled={isOlderThan3Months(visit.date)}
                      onClick={() => {
                        setEditAppointment(visit as Visit);
                        setShowEditModal(true);
                      }}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                  </div>
                );
              })
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}