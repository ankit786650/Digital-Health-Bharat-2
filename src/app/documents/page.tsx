
"use client";

import { useState, useEffect } from "react";
import { UploadDocumentForm } from "@/components/documents/UploadDocumentForm";
import { DocumentCard } from "@/components/documents/DocumentCard";
import type { MedicalDocument } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FolderArchive, Plus, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedDocs = localStorage.getItem("mediminder_documents");
    if (storedDocs) {
      const parsedDocs = JSON.parse(storedDocs).map((doc: MedicalDocument) => ({...doc, file: null, filePreview: doc.filePreview || (doc.file && doc.file.type.startsWith("image/") ? "preview-lost-on-reload" : null)}));
      setDocuments(parsedDocs);
    }
  }, []);

  useEffect(() => {
    const docsToStore = documents.map(({ file, ...rest }) => rest);
    localStorage.setItem("mediminder_documents", JSON.stringify(docsToStore));
  }, [documents]);

  const handleAddDocument = (newDocument: MedicalDocument) => {
    setDocuments((prev) => [newDocument, ...prev].sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
    toast({ title: "Document Uploaded", description: `"${newDocument.name}" has been added.` });
    setShowUploadForm(false);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast({ title: "Document Deleted", description: "The document has been removed.", variant: "destructive" });
    setDocumentToDelete(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><FolderArchive className="text-primary h-8 w-8"/>Medical Documents</h1>
          <p className="text-muted-foreground mt-1">Organize and access your lab reports, prescriptions, and more.</p>
        </div>
        <Button onClick={() => setShowUploadForm(prev => !prev)} variant={showUploadForm ? "outline" : "default"}>
          <Plus className="mr-2 h-4 w-4" /> {showUploadForm ? "Cancel" : "+ Upload Document"}
        </Button>
      </div>

      {showUploadForm && <Separator />}

      {showUploadForm && (
         <div className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <UploadDocumentForm onAddDocument={handleAddDocument} />
        </div>
      )}
      
      <Separator className={showUploadForm ? "mt-8" : ""}/>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Your Uploaded Documents</h2>
        {documents.length === 0 && !showUploadForm ? (
          <Card className="text-center py-10 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center">
                <FileUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No documents uploaded yet.</p>
                <p className="text-sm text-muted-foreground">Click "+ Upload Document" to add your medical files.</p>
            </CardContent>
          </Card>
        ) : (
          documents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} onDelete={() => setDocumentToDelete(doc.id)} />
              ))}
            </div>
          )
        )}
      </div>

      {documentToDelete && (
        <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the document 
                "{documents.find(d => d.id === documentToDelete)?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteDocument(documentToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
