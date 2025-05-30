
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
import { CalendarPlus, UserIcon } from "lucide-react"; // Changed UserMdIcon to UserIcon

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
                    <div className="relative flex items-center">
                      <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="e.g., Dr. Jane Smith" {...field} className="pl-10" />
                    </div>
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
