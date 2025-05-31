
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Facility, FacilityType } from "@/lib/types";
import { FacilityCard } from "@/components/nearby-facility/FacilityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPinned, Search, LocateFixed, SlidersHorizontal, AlertCircle, Package, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

const allFacilityTypes: FacilityType[] = [
  "Government Hospital",
  "PHC",
  "Private Hospital",
  "Jan Aushadhi Kendra",
  "Diagnostic Lab",
  "Pharmacy",
  "Clinic",
];

const mockFacilities: Facility[] = [
  {
    id: "1",
    name: "City General Hospital",
    type: "Government Hospital",
    address: "123 Main St, Anytown, USA 12345",
    phone: "(555) 123-4567",
    hours: "Mon-Fri 9 AM - 5 PM",
    distance: "1.2 km",
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    id: "2",
    name: "Community Health Clinic (PHC)",
    type: "PHC",
    address: "456 Oak Avenue, Anytown, USA 12345",
    phone: "(555) 987-6543",
    hours: "Mon-Sat 8 AM - 6 PM",
    distance: "3.5 km",
    lat: 34.0550,
    lng: -118.2500,
  },
  {
    id: "3",
    name: "Wellness Private Hospital",
    type: "Private Hospital",
    address: "789 Pine Ln, Anytown, USA 12345",
    phone: "(555) 234-5678",
    hours: "Open 24 hours",
    distance: "2.1 km",
    lat: 34.0600,
    lng: -118.2450,
  },
  {
    id: "4",
    name: "Jan Aushadhi Kendra - Elm St",
    type: "Jan Aushadhi Kendra",
    address: "101 Elm St, Anytown, USA 12345",
    phone: "(555) 345-6789",
    hours: "Mon-Sat 10 AM - 6 PM",
    distance: "0.8 km",
    lat: 34.0510,
    lng: -118.2400,
  },
  {
    id: "5",
    name: "QuickScan Diagnostic Lab",
    type: "Diagnostic Lab",
    address: "202 Maple Dr, Anytown, USA 12345",
    phone: "(555) 456-7890",
    hours: "Mon-Sun 7 AM - 7 PM",
    distance: "4.0 km",
    lat: 34.0650,
    lng: -118.2550,
  },
  {
    id: "6",
    name: "HealthFirst Pharmacy",
    type: "Pharmacy",
    address: "303 Birch Rd, Anytown, USA 12345",
    phone: "(555) 567-8901",
    hours: "Open 24 hours",
    distance: "1.5 km",
    lat: 34.0530,
    lng: -118.2420,
  },
  {
    id: "7",
    name: "Dr. Smith's Family Clinic",
    type: "Clinic",
    address: "55 Cedar Ave, Anytown, USA 12345",
    phone: "(555) 678-1234",
    hours: "Mon, Wed, Fri 8AM - 4PM",
    distance: "2.8 km",
    lat: 34.0580,
    lng: -118.2390,
  },
];


export default function NearbyFacilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const { toast } = useToast();

  const handleUseCurrentLocation = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Automatic location detection will be implemented in a future update.",
    });
  };

  const handleTypeChange = (type: FacilityType) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  const filteredFacilities = useMemo(() => {
    return mockFacilities.filter((facility) => {
      const matchesSearchTerm =
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (facility.services && facility.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(facility.type);
      return matchesSearchTerm && matchesType;
    });
  }, [searchTerm, selectedTypes]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        {/* Content Column */}
        <div className="space-y-6">
          {/* Location Detection */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Location Detection</h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <Button onClick={handleUseCurrentLocation} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                <LocateFixed className="mr-2 h-4 w-4" /> Use My Current Location
              </Button>
              <span className="text-muted-foreground">or</span>
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter Address or PIN Code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            </div>
            <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
              <Info className="h-5 w-5 text-blue-500" />
              <AlertTitle className="font-medium text-blue-800">Location Permissions</AlertTitle>
              <AlertDescription className="text-blue-700">
                We need your permission to access your location. If denied, you can manually enter your location or use a PIN code. <a href="#" className="font-semibold hover:underline">Learn more.</a>
              </AlertDescription>
            </Alert>
          </section>

          {/* Filter by Facility Type */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Filter by Facility Type <span className="text-sm text-muted-foreground">(within 5km)</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {allFacilityTypes.map((type) => (
                <div key={type} 
                     className={cn(
                        "flex items-center space-x-2 border border-border rounded-md p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                        selectedTypes.includes(type) && "bg-primary/10 border-primary text-primary ring-1 ring-primary"
                     )}
                     onClick={() => handleTypeChange(type)}
                >
                  <Checkbox
                    id={`type-${type.replace(/\s+/g, '-')}`}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => handleTypeChange(type)}
                    className={cn(selectedTypes.includes(type) ? "border-primary text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" : "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground")}
                  />
                  <Label htmlFor={`type-${type.replace(/\s+/g, '-')}`} className="font-medium text-sm cursor-pointer select-none">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </section>

          {/* Map Section */}
          <section className="my-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Facility Map</h2>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border bg-muted">
              <Image
                src="https://placehold.co/800x400.png?text=Map+View+of+Selected+Facilities"
                alt="Map placeholder showing facility locations"
                width={800}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint="map locations"
                priority
              />
            </div>
          </section>

          {/* Facility Listings */}
          <section>
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                    {filteredFacilities.length > 0 ? `Found ${filteredFacilities.length} Facilities` : "Facilities"}
                </h2>
            </div>
            {filteredFacilities.length > 0 ? (
              <div className="space-y-4">
                {filteredFacilities.map((facility) => (
                  <FacilityCard key={facility.id} facility={facility} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg bg-card shadow-sm">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-foreground">No Facilities Found</p>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search term or filters.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

