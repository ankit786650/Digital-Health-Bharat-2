
"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { MedicalDocument } from "@/lib/types";
import { UploadCloud, FileSpreadsheet } from "lucide-react";
import Image from "next/image";

const documentFormSchema = z.object({
  name: z.string().min(2, "Document name must be at least 2 characters."),
  type: z.enum(["prescription", "lab_report", "other"], {
    required_error: "You need to select a document type.",
  }),
  file: z.instanceof(File, { message: "Please upload a file." })
    .refine(file => file.size < 5 * 1024 * 1024, "File size should be less than 5MB."), // Example: 5MB limit
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

interface UploadDocumentFormProps {
  onAddDocument: (document: MedicalDocument) => void;
}

export function UploadDocumentForm({ onAddDocument }: UploadDocumentFormProps) {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null); // Clear preview for non-image files
      }
    } else {
        // @ts-ignore
        form.setValue("file", undefined); // Or null, depending on how you handle it
        setFilePreview(null);
    }
  };

  function onSubmit(data: DocumentFormValues) {
    const newDocument: MedicalDocument = {
      id: `doc-${Date.now()}`,
      name: data.name,
      type: data.type,
      file: data.file, // The actual file object
      filePreview: filePreview, // The data URL for preview
      uploadedAt: new Date().toISOString(),
    };
    onAddDocument(newDocument);
    form.reset();
    setFilePreview(null);
    // @ts-ignore
    document.getElementById('document-file-input')?.value = null; // Reset file input
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="text-primary" />Upload New Document</CardTitle>
        <CardDescription>Add lab reports, prescriptions, or other medical documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blood Test Report - July 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="lab_report">Lab Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => ( // field is not directly used for input type file to allow custom handler
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                     <Input id="document-file-input" type="file" onChange={handleFileChange} className="file:text-sm file:font-medium file:text-primary file:bg-primary-foreground hover:file:bg-primary/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {filePreview && (
              <div className="mt-4 border rounded-md p-2">
                <p className="text-sm font-medium mb-2 text-foreground">Preview:</p>
                <Image
                    src={filePreview}
                    alt="Document preview"
                    width={200}
                    height={150}
                    className="rounded-md object-contain max-h-36 w-auto"
                    data-ai-hint="document medical"
                />
              </div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
