
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Visit } from "@/lib/types";
import { CalendarPlus, UserMdIcon } from "lucide-react"; // Assuming UserMdIcon or similar for doctor

// Fallback for UserMdIcon if not available
const DoctorIcon = UserMdIcon || (() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-cog"><path d="M2 21a8 8 0 0 1 10.721-7.673"/><circle cx="10" cy="7" r="4"/><path d="M17.5 17.5L16 22l-1.5-1.5"/><path d="M22 16l-1.5-1.5L19 16"/><circle cx="19" cy="19" r="3"/></svg>);


const visitFormSchema = z.object({
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format. Please use YYYY-MM-DD.",
  }),
  doctorName: z.string().min(2, "Doctor's name must be at least 2 characters."),
  notes: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitFormSchema>;

interface AddVisitFormProps {
  onAddVisit: (visit: Visit) => void;
}

export function AddVisitForm({ onAddVisit }: AddVisitFormProps) {
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0], // Default to today
      doctorName: "",
      notes: "",
    },
  });

  function onSubmit(data: VisitFormValues) {
    const newVisit: Visit = {
      id: `visit-${Date.now()}`,
      ...data,
      notes: data.notes || "", // Ensure notes is always a string
    };
    onAddVisit(newVisit);
    form.reset({ date: new Date().toISOString().split("T")[0], doctorName: "", notes: ""});
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CalendarPlus className="text-primary" />Log New Visit</CardTitle>
        <CardDescription>Record details of your doctor's appointment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Visit</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Doctor's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dr. Jane Smith" {...field} />
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
                  <FormLabel>Clinical Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Discussed lab results, prescription updated..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Add Visit Record
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
