
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  FileText,
  MoreVertical,
  Upload,
  StickyNote,
  Archive,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { UploadDocumentDialog, type DocumentUploadFormValues } from "@/components/documents/UploadDocumentDialog";
import { useLanguage } from "@/contexts/LanguageContext";


// Initial mock data
const initialVisitsData = [
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

type DocumentOrNoteItem = { 
  id: string; 
  name: string; 
  type: string; 
  icon: React.ElementType;
  originalFile: File | null;
  documentDate: string;
  doctorName?: string;
  visitReason?: string;
};

type VisitItem = { 
  id: string; 
  date: string; 
  doctorName: string; 
  documents: DocumentOrNoteItem[]; 
  notes: DocumentOrNoteItem[]; 
};


export default function DocumentsPage() {
  const [visits, setVisits] = useState<VisitItem[]>(initialVisitsData);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(initialVisitsData.length > 0 ? initialVisitsData[0].id : null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (visits.length > 0 && !selectedVisitId) {
      setSelectedVisitId(visits[0].id);
    }
  }, [visits, selectedVisitId]);


  const selectedVisit = visits.find(v => v.id === selectedVisitId);

  const handleVisitSelect = (visitId: string) => {
    setSelectedVisitId(visitId);
  };

  const mapDocumentTypeToIcon = (docType: string): React.ElementType => {
    switch(docType) {
      case "lab_report": return FileText;
      case "prescription": return FileText;
      case "medical_imaging": return ImageIcon;
      case "consultation_notes": return StickyNote;
      case "discharge_summary": return FileText;
      case "vaccination_document": return ShieldCheck;
      case "insurance_document": return FileText;
      default: return FileText;
    }
  }

  const handleDocumentUploadSubmit = (data: DocumentUploadFormValues) => {
    if (!selectedVisitId) {
      toast({
        title: "No Visit Selected",
        description: "Please select a visit to add this document to.",
        variant: "destructive",
      });
      return;
    }

    const newDocument: DocumentOrNoteItem = {
      id: `doc-${Date.now()}`,
      name: data.documentTitle,
      type: data.documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: mapDocumentTypeToIcon(data.documentType),
      originalFile: data.documentFile,
      documentDate: format(data.documentDate, "yyyy-MM-dd"),
      doctorName: data.doctorName,
      visitReason: data.visitReason,
    };
    
    const isNoteType = data.documentType === 'consultation_notes';

    setVisits(prevVisits => 
      prevVisits.map(visit => {
        if (visit.id === selectedVisitId) {
          if (isNoteType) {
             return { ...visit, notes: [...visit.notes, newDocument] };
          }
          return { ...visit, documents: [...visit.documents, newDocument] };
        }
        return visit;
      })
    );

    toast({
      title: "Document Added",
      description: `"${data.documentTitle}" has been added to the visit on ${selectedVisit ? format(parseISO(selectedVisit.date), "MMM d, yyyy") : ''}.`,
    });
    setShowUploadDialog(false);
  };


  return (
    <div className="flex flex-1 w-full">
      <UploadDocumentDialog 
        isOpen={showUploadDialog} 
        onOpenChange={setShowUploadDialog}
        onSubmitDocument={handleDocumentUploadSubmit}
        selectedVisitDate={selectedVisit ? format(parseISO(selectedVisit.date), "MMMM d, yyyy") : undefined}
        userName={t('kishan')}
      />

      <div className="flex w-80 flex-col border-r border-border bg-card">
        <header className="border-b border-border p-4">
          <h2 className="text-foreground text-xl font-semibold leading-tight">Documents</h2>
        </header>
        <Tabs defaultValue="visits" className="flex flex-col flex-1">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-card px-2 h-auto py-0">
            <TabsTrigger
              value="visits"
              className="flex-1 flex-col items-center justify-center border-b-[3px] data-[state=active]:border-primary data-[state=inactive]:border-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:border-accent hover:data-[state=inactive]:text-accent-foreground py-3 transition-colors rounded-none text-sm font-semibold leading-normal data-[state=active]:shadow-none focus-visible:ring-0"
            >
              Visits
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex-1 flex-col items-center justify-center border-b-[3px] data-[state=active]:border-primary data-[state=inactive]:border-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:border-accent hover:data-[state=inactive]:text-accent-foreground py-3 transition-colors rounded-none text-sm font-semibold leading-normal data-[state=active]:shadow-none focus-visible:ring-0"
            >
              Categories
            </TabsTrigger>
          </TabsList>
          <TabsContent value="visits" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-full">
              {visits.map((visit) => (
                <button
                  key={visit.id}
                  onClick={() => handleVisitSelect(visit.id)}
                  className={`flex items-center gap-4 w-full px-4 py-3.5 justify-between text-left transition-colors focus:outline-none focus-visible:bg-accent
                    ${selectedVisitId === visit.id ? "bg-accent border-r-2 border-primary" : "hover:bg-accent/50"}`}
                >
                  <div className="flex flex-col justify-center overflow-hidden">
                    <p className={`text-sm font-semibold leading-normal line-clamp-1 ${selectedVisitId === visit.id ? "text-primary" : "text-foreground"}`}>
                      {format(parseISO(visit.date), "MMMM d, yyyy")}
                    </p>
                    <p className="text-muted-foreground text-xs font-normal leading-normal line-clamp-2">
                      {visit.doctorName}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <ChevronRight className={`h-5 w-5 ${selectedVisitId === visit.id ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                </button>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="categories" className="flex-1 mt-0 p-6 flex flex-col items-center justify-center text-center">
            <Archive className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-foreground text-lg font-medium">Category View Coming Soon</p>
            <p className="text-muted-foreground text-sm mt-1">
              This feature is under development. Soon you'll be able to organize your documents by category!
            </p>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-1 flex-col bg-background">
        {selectedVisit ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-border">
              <div className="flex flex-col gap-1">
                <h1 className="text-foreground text-2xl font-semibold leading-tight">
                  {format(parseISO(selectedVisit.date), "MMMM d, yyyy")}
                </h1>
                <p className="text-muted-foreground text-sm font-normal leading-normal">
                  {selectedVisit.doctorName}
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
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-foreground text-lg font-semibold leading-tight tracking-[-0.015em] mb-3">Documents</h3>
                  {selectedVisit.documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedVisit.documents.map((doc) => (
                        <Card key={doc.id} className="flex items-start gap-4 p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card">
                           <CardContent className="flex items-start gap-4 p-0 w-full">
                            <div className="text-primary-foreground flex items-center justify-center rounded-lg bg-primary shrink-0 size-10 mt-1">
                              <doc.icon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col justify-center flex-grow overflow-hidden">
                              <p className="text-card-foreground text-base font-medium leading-normal">{doc.name}</p>
                              <p className="text-muted-foreground text-xs font-normal leading-normal mt-1">{doc.type}</p>
                            </div>
                            <Button variant="ghost" size="icon-sm" className="ml-auto text-muted-foreground hover:text-accent-foreground shrink-0">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No documents for this visit.</p>
                  )}
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-semibold leading-tight tracking-[-0.015em] mb-3">Notes</h3>
                  {selectedVisit.notes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedVisit.notes.map((note) => (
                         <Card key={note.id} className="flex items-start gap-4 p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card">
                           <CardContent className="flex items-start gap-4 p-0 w-full">
                            <div className="text-primary-foreground flex items-center justify-center rounded-lg bg-primary shrink-0 size-10 mt-1">
                              <note.icon className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col justify-center flex-grow overflow-hidden">
                              <p className="text-card-foreground text-base font-medium leading-normal">{note.name}</p>
                              <p className="text-muted-foreground text-xs font-normal leading-normal mt-1">{note.type}</p>
                            </div>
                             <Button variant="ghost" size="icon-sm" className="ml-auto text-muted-foreground hover:text-accent-foreground shrink-0">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No notes for this visit.</p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <p className="text-muted-foreground text-lg">
              {visits.length > 0 ? "Select a visit to see details." : "No visits recorded yet. You can add visits in the 'Appointments' section."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
