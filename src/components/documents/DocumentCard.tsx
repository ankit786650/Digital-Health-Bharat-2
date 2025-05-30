
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MedicalDocument } from "@/lib/types";
import { FileText, Download, Trash2, Eye, FileImage, FileQuestion } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface DocumentCardProps {
  document: MedicalDocument;
  onDelete: (id: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const formattedDate = document.uploadedAt ? format(new Date(document.uploadedAt), "MMMM d, yyyy, p") : "N/A";

  const getFileIcon = () => {
    if (document.filePreview && document.type !== 'other') { // Assuming preview means image-like
        return <FileImage className="text-primary h-6 w-6" />;
    }
    switch (document.type) {
      case "prescription":
        return <FileText className="text-primary h-6 w-6" />;
      case "lab_report":
        return <FileQuestion className="text-primary h-6 w-6" />; // Using FileQuestion for lab reports
      default:
        return <FileText className="text-primary h-6 w-6" />;
    }
  };

  const handleDownload = () => {
    if (document.file) {
      const url = URL.createObjectURL(document.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  
  const handlePreview = () => {
    if (document.file) {
      const url = URL.createObjectURL(document.file);
      window.open(url, '_blank');
      // For images, could also open in a modal.
      // URL.revokeObjectURL(url); // Revoke after a delay or when modal closes if used
    }
  };


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2 truncate">
            {getFileIcon()}
            <span className="truncate" title={document.name}>{document.name}</span>
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Type: <span className="font-medium capitalize">{document.type.replace('_', ' ')}</span> | Uploaded: {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        {document.filePreview ? (
          <div className="my-2 rounded-md overflow-hidden border max-h-40 flex justify-center items-center bg-muted/30">
            <Image
              src={document.filePreview}
              alt={`${document.name} preview`}
              width={150}
              height={100}
              className="object-contain h-full w-auto"
              data-ai-hint="document medical preview"
            />
          </div>
        ) : (
          <div className="my-2 p-4 text-center text-muted-foreground bg-muted/30 rounded-md">
            <p className="text-sm">No preview available for this file type.</p>
            {document.file && <p className="text-xs mt-1">({(document.file.size / 1024).toFixed(2)} KB)</p>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
        {document.file && (
          <>
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </>
        )}
        <Button variant="destructive" size="sm" onClick={() => onDelete(document.id)}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
