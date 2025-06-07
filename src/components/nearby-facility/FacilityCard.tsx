"use client";

import type { Facility } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ExternalLink, Info, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FacilityCardProps {
  facility: Facility;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function FacilityCard({ facility, onSelect, isSelected }: FacilityCardProps) {
  const { toast } = useToast();

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when clicking directions
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

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when clicking details
    toast({
      title: "Details Coming Soon",
      description: `More details for "${facility.name}" will be available in a future update.`,
    });
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-card rounded-lg border border-border cursor-pointer",
        isSelected && "ring-2 ring-primary shadow-md"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-md font-semibold leading-tight text-card-foreground">
            {facility.name}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {facility.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-3 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground text-xs">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground/80" />
          <span className="line-clamp-2">{facility.address}</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
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
          {facility.distance && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Navigation className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
              <span>{facility.distance}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-3 pt-2 border-t border-border/50 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleViewDetails} 
          className="text-xs px-2 py-1 h-auto text-muted-foreground hover:text-primary"
        >
          <Info className="mr-1 h-3.5 w-3.5" />
          Details
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGetDirections} 
          className="text-xs px-2 py-1 h-auto"
        >
          <ExternalLink className="mr-1 h-3.5 w-3.5" />
          Directions
        </Button>
      </CardFooter>
    </Card>
  );
}
