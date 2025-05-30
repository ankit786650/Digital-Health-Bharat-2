
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Visit } from "@/lib/types";
import { UploadCloud, FileText, CalendarDays, User, Briefcase, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];

const visitFormSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Visit date is required.",
  }),
  doctorName: z.string().min(2, "Doctor's name must be at least 2 characters."),
  specialization: z.string().optional(),
  reasonForVisit: z.string().optional(),
  notes: z.string().optional(), // Clinical notes
  nextAppointmentTime: z.string().optional(),
  nextAppointmentNote: z.string().optional(),
  attachedDocuments: z.array(z.instanceof(File))
    .optional()
    .refine(files => !files || files.every(file => file.size <= MAX_FILE_SIZE), `Max file size is 10MB.`)
    .refine(files => !files || files.every(file => ALLOWED_FILE_TYPES.includes(file.type)), ".pdf, .png, .jpg files are accepted."),
});

type VisitFormValues = z.infer<typeof visitFormSchema>;

interface AddVisitFormProps {
  onAddVisit: (visit:  Omit<Visit, 'id' | 'attachedDocuments'> & { attachedDocuments?: File[] }) => void;
  onCancel: () => void;
}

export function AddVisitForm({ onAddVisit, onCancel }: AddVisitFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      doctorName: "",
      specialization: "",
      reasonForVisit: "",
      notes: "",
      nextAppointmentTime: "",
      nextAppointmentNote: "",
      attachedDocuments: [],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      form.setValue("attachedDocuments", filesArray, { shouldValidate: true });
    }
  };

  function onSubmit(data: VisitFormValues) {
    onAddVisit({
        date: data.date,
        doctorName: data.doctorName,
        specialization: data.specialization,
        reasonForVisit: data.reasonForVisit,
        notes: data.notes,
        nextAppointmentTime: data.nextAppointmentTime,
        nextAppointmentNote: data.nextAppointmentNote,
        attachedDocuments: selectedFiles,
    });
    form.reset();
    setSelectedFiles([]);
  }

  return (
    <Card className="w-full shadow-xl rounded-xl bg-card ring-1 ring-slate-900/5">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-lg font-semibold text-card-foreground">Add New Visit</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="visit-date">Visit Date</FormLabel>
                  <FormControl>
                    <Input type="date" id="visit-date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="doctor-name">Doctor's Name</FormLabel>
                  <FormControl>
                    <Input id="doctor-name" placeholder="Enter doctor's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="specialization">Specialization</FormLabel>
                  <FormControl>
                    <Input id="specialization" placeholder="e.g., Cardiology, Pediatrics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reasonForVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="reason-for-visit">Reason for Visit</FormLabel>
                  <FormControl>
                    <Input id="reason-for-visit" placeholder="e.g., Annual check-up, Follow-up" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="clinical-notes">Clinical Notes / Observations</FormLabel>
                  <FormControl>
                    <Textarea id="clinical-notes" placeholder="Enter clinical notes or observations..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div>
              <FormLabel htmlFor="next-appointment-time">Next Appointment Reminder</FormLabel>
              <FormField
                control={form.control}
                name="nextAppointmentTime"
                render={({ field }) => (
                  <FormItem className="mt-1">
                    <FormControl>
                      <Input type="time" id="next-appointment-time" placeholder="Select time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nextAppointmentNote"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <Textarea id="next-appointment-note" placeholder="Short note for reminder..." rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="attachedDocuments"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="file-upload">Attach Documents</FormLabel>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex text-sm text-muted-foreground">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-card rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                        >
                          <span>Upload a file</span>
                          <Input id="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept={ALLOWED_FILE_TYPES.join(",")} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground/80">PDF, PNG, JPG up to 10MB</p>
                       {selectedFiles.length > 0 && (
                        <div className="pt-2 text-xs text-muted-foreground">
                          Selected: {selectedFiles.map(f => f.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-3 pt-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Save Visit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
