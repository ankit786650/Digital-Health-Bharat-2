
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Added CardContent
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  FileText,
  MoreVertical,
  Upload,
  StickyNote // Added StickyNote
} from "lucide-react";
import { format, parseISO } from "date-fns";

// Mock data, replace with actual data fetching
const visitsData = [
  { id: "1", date: "2024-05-15", doctorName: "Dr. Emily Carter", documents: [
      { id: "doc1", name: "Blood Test Results", type: "Lab Report", icon: FileText },
      { id: "doc2", name: "Medication List", type: "Prescription", icon: FileText },
      { id: "doc3", name: "X-Ray Scan", type: "Imaging", icon: FileText },
    ], notes: [
      { id: "note1", name: "Consultation Notes", type: "Visit Summary", icon: StickyNote }, // Changed icon
    ] 
  },
  { id: "2", date: "2024-04-20", doctorName: "Dr. Emily Carter", documents: [], notes: [] },
  { id: "3", date: "2024-03-05", doctorName: "Dr. Emily Carter", documents: [{id: "doc4", name: "Follow-up Report", type: "Lab Report", icon: FileText}], notes: [] },
  { id: "4", date: "2024-02-01", doctorName: "Dr. Emily Carter", documents: [], notes: [] },
  { id: "5", date: "2024-01-10", doctorName: "Dr. Emily Carter", documents: [], notes: [{id: "note2", name: "Initial Assessment", type: "Visit Summary", icon: StickyNote}] }, // Changed icon
];

type DocumentItem = { id: string; name: string; type: string; icon: React.ElementType };
type Visit = { id: string; date: string; doctorName: string; documents: DocumentItem[]; notes: DocumentItem[] };

export default function DocumentsPage() {
  const [selectedVisitId, setSelectedVisitId] = useState<string>(visitsData[0].id);

  const selectedVisit = visitsData.find(v => v.id === selectedVisitId) || visitsData[0];

  return (
    // The main AppShell now provides the overall flex structure (sidebar + main content)
    // This component now represents the content within the <main> tag of AppShell
    <div className="flex flex-1 w-full"> {/* This outer div acts as the two-column container for this specific page */}
      {/* Left Column: Document Navigation */}
      <div className="flex w-80 flex-col border-r border-border bg-card">
        <header className="border-b border-border p-4">
          <h2 className="text-foreground text-xl font-semibold leading-tight">Documents</h2>
        </header>
        <Tabs defaultValue="visits" className="flex flex-col flex-1">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border bg-card px-2 h-auto py-0">
            <TabsTrigger 
              value="visits" 
              className="flex-1 flex-col items-center justify-center border-b-[3px] data-[state=active]:border-primary data-[state=inactive]:border-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:border-border hover:data-[state=inactive]:text-foreground py-3 transition-colors rounded-none text-sm font-semibold leading-normal data-[state=active]:shadow-none focus-visible:ring-0"
            >
              Visits
            </TabsTrigger>
            <TabsTrigger 
              value="categories"
              className="flex-1 flex-col items-center justify-center border-b-[3px] data-[state=active]:border-primary data-[state=inactive]:border-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:border-border hover:data-[state=inactive]:text-foreground py-3 transition-colors rounded-none text-sm font-semibold leading-normal data-[state=active]:shadow-none focus-visible:ring-0"
            >
              Categories
            </TabsTrigger>
          </TabsList>
          <TabsContent value="visits" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-full">
              {visitsData.map((visit) => (
                <button
                  key={visit.id}
                  onClick={() => setSelectedVisitId(visit.id)}
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
          <TabsContent value="categories" className="flex-1 mt-0 p-4">
            <p className="text-muted-foreground text-sm">Category view not yet implemented.</p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Column: Selected Visit Details */}
      <div className="flex flex-1 flex-col bg-background"> {/* Ensured bg-background from theme */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-border">
          <div className="flex flex-col gap-1">
            <h1 className="text-foreground text-2xl font-semibold leading-tight">
              {format(parseISO(selectedVisit.date), "MMMM d, yyyy")}
            </h1>
            <p className="text-muted-foreground text-sm font-normal leading-normal">
              {selectedVisit.doctorName}
            </p>
          </div>
          <Button className="text-sm font-bold leading-normal tracking-[0.015em]"> {/* Primary button styling will apply from theme */}
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-foreground text-lg font-semibold leading-tight tracking-[-0.015em] mb-3">Documents</h3>
              {selectedVisit.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedVisit.documents.map((doc) => (
                    <Card key={doc.id} className="flex items-center gap-4 p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card">
                       <CardContent className="flex items-center gap-4 p-0 w-full"> {/* Use CardContent and remove its padding */}
                        <div className="text-primary-foreground flex items-center justify-center rounded-lg bg-primary shrink-0 size-10">
                          <doc.icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                          <p className="text-card-foreground text-sm font-medium leading-normal line-clamp-1">{doc.name}</p>
                          <p className="text-muted-foreground text-xs font-normal leading-normal line-clamp-2">{doc.type}</p>
                        </div>
                        <Button variant="ghost" size="icon-sm" className="ml-auto text-muted-foreground hover:text-foreground">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedVisit.notes.map((note) => (
                     <Card key={note.id} className="flex items-center gap-4 p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card">
                       <CardContent className="flex items-center gap-4 p-0 w-full"> {/* Use CardContent and remove its padding */}
                        <div className="text-primary-foreground flex items-center justify-center rounded-lg bg-primary shrink-0 size-10">
                          <note.icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                          <p className="text-card-foreground text-sm font-medium leading-normal line-clamp-1">{note.name}</p>
                          <p className="text-muted-foreground text-xs font-normal leading-normal line-clamp-2">{note.type}</p>
                        </div>
                         <Button variant="ghost" size="icon-sm" className="ml-auto text-muted-foreground hover:text-foreground">
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
      </div>
    </div>
  );
}
