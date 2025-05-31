
"use client";

import type { Facility } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";

interface FacilityCardProps {
  facility: Facility;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-card rounded-lg border border-border">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-md font-semibold leading-tight text-card-foreground">{facility.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 px-4 pb-4 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground text-xs">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground/80" />
          <span>{facility.address}</span>
        </div>
        {facility.phone && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
            <span>{facility.phone}</span>
          </div>
        )}
        {facility.hours && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
            <span>{facility.hours}</span>
          </div>
        )}
      </CardContent>
      {/* Action buttons like "Get Directions" or "View Details" can be added here if needed in a future iteration or on a dedicated details page */}
    </Card>
  );
}
