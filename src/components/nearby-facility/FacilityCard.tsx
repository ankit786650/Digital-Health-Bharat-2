"use client";

import type { Facility } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ExternalLink, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FacilityCardProps {
  facility: Facility;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const { toast } = useToast();

  const handleGetDirections = () => {
    if (facility.address) {
      const query = encodeURIComponent(facility.address);
      window.open(`https://maps.google.com/?q=${query}`, "_blank");
    } else {
      toast({
        title: "Address Unavailable",
        description: "Cannot get directions as the address is not provided.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = () => {
    toast({
      title: "Details Coming Soon",
      description: `More details for "${facility.name}" will be available in a future update.`,
    });
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-card rounded-lg border border-border">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-md font-semibold leading-tight text-card-foreground">{facility.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 px-4 pb-3 text-sm">
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
      <CardFooter className="px-4 pb-3 pt-2 border-t border-border/50 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleViewDetails} className="text-xs px-2 py-1 h-auto text-muted-foreground hover:text-primary">
          <Info className="mr-1 h-3.5 w-3.5" />
          Details
        </Button>
        <Button variant="outline" size="sm" onClick={handleGetDirections} className="text-xs px-2 py-1 h-auto">
          <ExternalLink className="mr-1 h-3.5 w-3.5" />
          Directions
        </Button>
      </CardFooter>
    </Card>
  );
}
