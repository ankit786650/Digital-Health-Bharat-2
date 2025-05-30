
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
    // Prefer filePreview for images if available and it's an image type
    if (document.filePreview && document.file && document.file.type.startsWith("image/")) { 
        return <FileImage className="text-primary h-6 w-6" />;
    }
    if (document.filePreview && !document.file && document.type === 'prescription') { // Handle preview from reload for prescription
      return <FileImage className="text-primary h-6 w-6" />;
    }
    switch (document.type) {
      case "prescription":
        return <FileText className="text-primary h-6 w-6" />;
      case "lab_report":
        return <FileQuestion className="text-primary h-6 w-6" />; 
      default:
        return <FileText className="text-primary h-6 w-6" />;
    }
  };

  const handleDownload = () => {
    // This function might not work as expected if `document.file` is null (e.g. after page reload)
    // A more robust solution would involve storing files persistently or re-fetching them.
    if (document.file) {
      const url = URL.createObjectURL(document.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (document.filePreview) {
        // Fallback for previews if original file object isn't available
        const a = document.createElement('a');
        a.href = document.filePreview;
        a.download = document.name; // May not have original filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
  };
  
  const handlePreview = () => {
    // Similar to download, relies on `document.file` or `document.filePreview`
    if (document.file) {
      const url = URL.createObjectURL(document.file);
      window.open(url, '_blank');
      // URL.revokeObjectURL(url) should be called when the preview is no longer needed, e.g., when a modal closes or after a timeout.
      // For simplicity, not revoking immediately here to allow the new tab to load.
    } else if (document.filePreview) {
      window.open(document.filePreview, '_blank');
    }
  };


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 truncate">
            {getFileIcon()}
            <span className="truncate" title={document.name}>{document.name}</span>
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Type: <span className="font-medium capitalize">{document.type.replace('_', ' ')}</span> | Uploaded: {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        {document.filePreview && (document.file?.type.startsWith("image/") || (document.type === 'prescription' && document.filePreview.startsWith("data:image/"))) ? (
          <div className="my-2 rounded-md overflow-hidden border h-40 flex justify-center items-center bg-muted/30">
            <Image
              src={document.filePreview}
              alt={`${document.name} preview`}
              width={150}
              height={100} // This height is for aspect ratio, actual display constrained by parent
              className="object-contain h-full w-auto"
              data-ai-hint="document medical preview"
            />
          </div>
        ) : (
          <div className="my-2 p-4 text-center text-muted-foreground bg-muted/30 rounded-md h-40 flex flex-col justify-center items-center">
            <p className="text-sm">No preview available.</p>
            {document.file && <p className="text-xs mt-1">({(document.file.size / 1024).toFixed(2)} KB)</p>}
             {!document.file && document.filePreview && <p className="text-xs mt-1">(Preview loaded)</p>}
             {!document.file && !document.filePreview && <p className="text-xs mt-1">(File not loaded)</p>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
        {(document.file || document.filePreview) && ( // Enable if either file or preview exists
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
