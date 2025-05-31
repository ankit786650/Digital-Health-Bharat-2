
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  MoreVertical,
  Upload,
  StickyNote,
  Archive,
  Image as ImageIcon,
  ShieldCheck,
  Package,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { UploadDocumentDialog, type DocumentUploadFormValues } from "@/components/documents/UploadDocumentDialog";
import { useLanguage } from "@/contexts/LanguageContext";


// Initial mock data - will be transformed
const initialVisitsDataRaw = [
  { id: "1", date: "2024-05-15", doctorName: "Dr. Emily Carter", documents: [
      { id: "doc1", name: "Comprehensive Blood Test Results - Annual Checkup", type: "Lab Report", icon: FileText, originalFile: null, documentDate: "2024-05-15" },
      { id: "doc2", name: "Medication List Adjustment for Hypertension", type: "Prescription", icon: FileText, originalFile: null, documentDate: "2024-05-15" },
      { id: "doc3", name: "Chest X-Ray Scan - Follow-up on Respiratory Symptoms", type: "Imaging", icon: ImageIcon, originalFile: null, documentDate: "2024-05-15" },
    ], notes: [
      { id: "note1", name: "Consultation Notes Regarding Sleep Pattern Improvements", type: "Visit Summary", icon: StickyNote, originalFile: null, documentDate: "2024-05-15" },
    ]
  },
  { id: "2", date: "2024-04-20", doctorName: "Dr. John Doe", documents: [], notes: [] },
  { id: "3", date: "2024-03-05", doctorName: "Dr. Alice Smith", documents: [{id: "doc4", name: "Follow-up Report on Previous Condition", type: "Lab Report", icon: FileText, originalFile: null, documentDate: "2024-03-05"}], notes: [] },
];

type DocumentItem = {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  originalFile: File | null;
  documentDate: string;
  doctorName?: string;
  visitReason?: string;
  originalVisitDate?: string; // Keep track of original visit context if needed
};

const transformInitialData = (rawData: typeof initialVisitsDataRaw): DocumentItem[] => {
  const documents: DocumentItem[] = [];
  const currentYear = new Date().getFullYear();

  rawData.forEach(visit => {
    // Adjust visit date year
    const visitDateParts = visit.date.split('-'); // ["YYYY", "MM", "DD"]
    const adjustedVisitDate = `${currentYear}-${visitDateParts[1]}-${visitDateParts[2]}`;

    visit.documents.forEach(doc => {
      // Adjust document date year
      const docDateParts = doc.documentDate.split('-');
      const adjustedDocDate = `${currentYear}-${docDateParts[1]}-${docDateParts[2]}`;
      
      documents.push({
        ...doc,
        documentDate: adjustedDocDate, // Use adjusted date
        doctorName: doc.doctorName || visit.doctorName,
        originalVisitDate: adjustedVisitDate, // Store adjusted original visit date
      });
    });
    // Notes are being excluded as per the new design focusing on documents
  });
  return documents.sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime());
};


export default function DocumentsPage() {
  const [allDocuments, setAllDocuments] = useState<DocumentItem[]>(() => transformInitialData(initialVisitsDataRaw));
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const mapDocumentTypeToIcon = (docType: string): React.ElementType => {
    switch(docType.toLowerCase()) {
      case "lab report":
      case "lab_report": return FileText;
      case "prescription": return FileText;
      case "medical imaging":
      case "imaging":
      case "medical_imaging": return ImageIcon;
      case "consultation notes":
      case "visit summary":
      case "consultation_notes": return StickyNote;
      case "discharge summary":
      case "discharge_summary": return FileText;
      case "vaccination document":
      case "vaccination_document": return ShieldCheck;
      case "insurance document":
      case "insurance_document": return FileText;
      default: return FileText;
    }
  }

  const handleDocumentUploadSubmit = (data: DocumentUploadFormValues) => {
    const newDocument: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: data.documentTitle,
      type: data.documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: mapDocumentTypeToIcon(data.documentType),
      originalFile: data.documentFile,
      documentDate: format(data.documentDate, "yyyy-MM-dd"),
      doctorName: data.doctorName,
      visitReason: data.visitReason,
    };

    setAllDocuments(prevDocs => 
      [newDocument, ...prevDocs].sort((a, b) => new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime())
    );

    toast({
      title: "Document Added",
      description: `"${data.documentTitle}" has been added to your documents.`,
    });
    setShowUploadDialog(false);
  };

  const handleMoreOptionsClick = (event: React.MouseEvent, docName: string) => {
    event.stopPropagation(); // Prevent card click if any
    toast({
      title: "Coming Soon!",
      description: `More options for "${docName}" are under development.`,
    });
  };


  return (
    <div className="flex flex-1 flex-col bg-background w-full">
      <UploadDocumentDialog
        isOpen={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onSubmitDocument={handleDocumentUploadSubmit}
        userName={t('kishan')}
      />

      <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-border">
        <div className="flex flex-col gap-1">
          <h1 className="text-foreground text-2xl font-semibold leading-tight">
            All Your Documents
          </h1>
          <p className="text-muted-foreground text-sm font-normal leading-normal">
            Manage and view all your uploaded medical documents.
          </p>
        </div>
        <Button
          onClick={() => setShowUploadDialog(true)}
          className="text-sm font-bold leading-normal tracking-[0.015em] bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6">
          {allDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allDocuments.map((doc) => (
                <Card 
                  key={doc.id} 
                  className="flex items-start gap-4 p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card"
                  // onClick={() => console.log("Card clicked:", doc.name)} // Example: Card click handler
                >
                  <CardContent className="flex items-start gap-4 p-0 w-full">
                    <div className="text-primary-foreground flex items-center justify-center rounded-lg bg-primary shrink-0 size-10 mt-1">
                      <doc.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col justify-center flex-grow overflow-hidden">
                      <p className="text-card-foreground text-base font-medium leading-normal">{doc.name}</p>
                      <p className="text-muted-foreground text-xs font-normal leading-normal mt-1">
                        {doc.type} - {format(parseISO(doc.documentDate), "MMM d, yyyy")}
                      </p>
                      {doc.doctorName && (
                         <p className="text-muted-foreground text-xs font-normal leading-normal mt-0.5">Dr. {doc.doctorName}</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      className="ml-auto text-muted-foreground hover:text-accent-foreground shrink-0"
                      onClick={(e) => handleMoreOptionsClick(e, doc.name)}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-foreground text-lg font-medium">No Documents Yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Click "Upload Document" to add your first medical document.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

