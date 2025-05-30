
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { MedicationReminder } from "@/lib/types";
import { processPrescriptionImage, ProcessPrescriptionResult } from "@/lib/actions";
import { UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";

interface PrescriptionUploadFormProps {
  onRemindersGenerated: (reminders: MedicationReminder[]) => void;
}

export function PrescriptionUploadForm({ onRemindersGenerated }: PrescriptionUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile || !filePreview) {
      toast({
        title: "No file selected",
        description: "Please select a prescription image to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result: ProcessPrescriptionResult = await processPrescriptionImage(filePreview);
      if (result.success && result.medications) {
        onRemindersGenerated(result.medications);
        toast({
          title: "Success!",
          description: `${result.medications.length} medication reminder(s) extracted.`,
        });
        setSelectedFile(null);
        setFilePreview(null);
      } else {
        toast({
          title: "Extraction Failed",
          description: result.error || "Could not extract medication details. Please try again or add manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><UploadCloud className="text-accent"/>Upload Prescription (AI Powered)</CardTitle>
        <CardDescription>
          Upload an image of your prescription. Our AI will extract medication details to create reminders automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prescription-file">Prescription Image</Label>
            <Input
              id="prescription-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file:text-sm file:font-medium file:text-primary file:bg-primary-foreground hover:file:bg-primary/10"
            />
          </div>

          {filePreview && (
            <div className="mt-4 border rounded-md p-2">
              <p className="text-sm font-medium mb-2 text-foreground">Preview:</p>
              <Image
                src={filePreview}
                alt="Prescription preview"
                width={300}
                height={200}
                className="rounded-md object-contain max-h-48 w-auto mx-auto"
                data-ai-hint="prescription image"
              />
            </div>
          )}

          <Button type="submit" disabled={isLoading || !selectedFile} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Processing..." : "Upload and Extract Reminders"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
