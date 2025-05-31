
"use client";

import type { Facility, FacilityType } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Globe, ExternalLink, Stethoscope, Pill, FlaskConical, Building } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FacilityCardProps {
  facility: Facility;
}

const facilityTypeIcons: Record<FacilityType, React.ElementType> = {
  "Government Hospital": Building,
  "PHC": Stethoscope,
  "Private Hospital": Building,
  "Jan Aushadhi Kendra": Pill,
  "Diagnostic Lab": FlaskConical,
  "Pharmacy": Pill,
  "Clinic": Stethoscope,
};

const facilityTypeBadgeVariant: Record<FacilityType, "default" | "secondary" | "destructive" | "outline" | "info" | "accent"> = {
  "Government Hospital": "default", // Primary
  "PHC": "info", 
  "Private Hospital": "secondary",
  "Jan Aushadhi Kendra": "accent",
  "Diagnostic Lab": "outline", 
  "Pharmacy": "destructive", // Using destructive for now, can be a new color
  "Clinic": "info",
};


export function FacilityCard({ facility }: FacilityCardProps) {
  const { toast } = useToast();
  const IconComponent = facilityTypeIcons[facility.type] || Building;

  const handleViewDetails = () => {
    toast({
      title: "Details Coming Soon",
      description: `More details for ${facility.name} will be available soon.`,
    });
  };

  const handleGetDirections = () => {
    if (facility.address) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address)}`;
      window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    } else {
      toast({
        title: "Address Unavailable",
        description: "Cannot get directions as the address is not available.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card rounded-lg border border-border">
      {facility.imageUrl ? (
        <div className="relative w-full h-40">
          <Image
            src={facility.imageUrl}
            alt={facility.name}
            fill
            style={{ objectFit: "cover" }}
            className="bg-muted"
            data-ai-hint="hospital building"
          />
        </div>
      ) : (
         <div className="w-full h-40 bg-muted flex items-center justify-center">
            <IconComponent className="w-16 h-16 text-muted-foreground/50" />
         </div>
      )}
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-semibold leading-tight text-card-foreground">{facility.name}</CardTitle>
            <Badge variant={facilityTypeBadgeVariant[facility.type]} className="text-xs whitespace-nowrap shrink-0">
                {facility.type}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2.5 px-4 pb-4 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <span>{facility.address}</span>
        </div>
        {facility.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            <span>{facility.phone}</span>
          </div>
        )}
        {facility.hours && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            <span>{facility.hours}</span>
          </div>
        )}
        {facility.distance && (
          <p className="text-sm font-medium text-primary pt-1">Distance: {facility.distance}</p>
        )}
        {facility.website && (
          <a
            href={facility.website.startsWith('http') ? facility.website : `https://${facility.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline text-sm"
          >
            <Globe className="h-4 w-4 shrink-0" />
            Visit Website
          </a>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3 border-t border-border bg-muted/30">
        <div className="flex w-full justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleViewDetails}>
            View Details
          </Button>
          <Button size="sm" onClick={handleGetDirections} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <ExternalLink className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
