
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Visit } from "@/lib/types";
import { CalendarDays, Edit3, Trash2, UserCircle } from "lucide-react"; // Changed Stethoscope to UserCircle for doctor
import { format } from "date-fns";

interface VisitCardProps {
  visit: Visit;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function VisitCard({ visit, onEdit, onDelete }: VisitCardProps) {
  const formattedDate = visit.date ? format(new Date(visit.date), "MMMM d, yyyy") : "N/A";

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <UserCircle className="text-primary h-6 w-6" />
            {visit.doctorName}
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <CalendarDays className="h-4 w-4" /> {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        {visit.notes ? (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{visit.notes}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No clinical notes recorded for this visit.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
        <Button variant="outline" size="sm" onClick={() => onEdit(visit.id)}>
          <Edit3 className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(visit.id)}>
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
