
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
import type { MedicationReminder } from "@/lib/types";
import { Pill } from "lucide-react";

const reminderFormSchema = z.object({
  name: z.string().min(2, "Medication name must be at least 2 characters."),
  dosage: z.string().min(1, "Dosage is required."),
  timings: z.string().min(3, "Timings are required (e.g., 'Twice a day')."),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

interface AddReminderFormProps {
  onAddReminder: (reminder: MedicationReminder) => void;
}

export function AddReminderForm({ onAddReminder }: AddReminderFormProps) {
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      name: "",
      dosage: "",
      timings: "",
    },
  });

  function onSubmit(data: ReminderFormValues) {
    const newReminder: MedicationReminder = {
      id: `manual-${Date.now()}`,
      ...data,
      isGenerated: false,
    };
    onAddReminder(newReminder);
    form.reset();
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Pill className="text-primary" />Manually Add Reminder</CardTitle>
        <CardDescription>Enter medication details to set up a reminder.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Amoxicillin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 250mg, 1 tablet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timings</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Twice a day after meals, Every 8 hours"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Add Reminder
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
