
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
  name: z.string().min(2, "Document name must be at least 2 characters.").max(100, "Document name is too long."),
  type: z.enum(["prescription", "lab_report", "other"], {
    required_error: "You need to select a document type.",
  }),
  file: z.instanceof(File, { message: "Please upload a file." })
    .refine(file => file.size > 0, "File cannot be empty.")
    .refine(file => file.size < 5 * 1024 * 1024, "File size should be less than 5MB."),
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
      // type: undefined, // Let placeholder show
      // file: undefined, // Let placeholder show
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file, { shouldValidate: true });
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null); 
      }
    } else {
      form.setValue("file", undefined as any, { shouldValidate: true }); 
      setFilePreview(null);
    }
  };

  function onSubmit(data: DocumentFormValues) {
    // file is already validated by schema to be a File object
    const newDocument: MedicalDocument = {
      id: `doc-${Date.now()}`,
      name: data.name,
      type: data.type,
      file: data.file, 
      filePreview: data.file.type.startsWith("image/") ? filePreview : null,
      uploadedAt: new Date().toISOString(),
    };
    onAddDocument(newDocument);
    form.reset();
    setFilePreview(null);
    const fileInput = document.getElementById('document-file-input') as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl"><FileSpreadsheet className="text-primary h-5 w-5" />Upload New Document</CardTitle>
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
              render={() => ( 
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                     <Input id="document-file-input" type="file" onChange={handleFileChange} className="file:text-sm file:font-medium file:text-primary file:bg-primary-foreground hover:file:bg-primary/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {filePreview && form.getValues("file")?.type.startsWith("image/") && (
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
