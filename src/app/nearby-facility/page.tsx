
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Facility, FacilityType } from "@/lib/types";
import { FacilityCard } from "@/components/nearby-facility/FacilityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPinned, Search, LocateFixed, Info, Package, ExternalLink } from "lucide-react";
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
    address: "12 MG Road, Shivaji Nagar, Bangalore, Karnataka 560001",
    phone: "(080) 1234-5678",
    hours: "Mon-Fri 9 AM - 5 PM",
    distance: "1.2 km",
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: "2",
    name: "Community Health Clinic (PHC)",
    type: "PHC",
    address: "45 Kaggadasapura Main Road, CV Raman Nagar, Bangalore, Karnataka 560093",
    phone: "(080) 9876-5432",
    hours: "Mon-Sat 8 AM - 6 PM",
    distance: "3.5 km",
    lat: 12.9822,
    lng: 77.6588,
  },
  {
    id: "3",
    name: "Wellness Private Hospital",
    type: "Private Hospital",
    address: "78 Indiranagar 100 Feet Road, Indiranagar, Bangalore, Karnataka 560038",
    phone: "(080) 2345-6789",
    hours: "Open 24 hours",
    distance: "2.1 km",
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    id: "4",
    name: "Jan Aushadhi Kendra - Jayanagar",
    type: "Jan Aushadhi Kendra",
    address: "101 Jayanagar 4th Block, Jayanagar, Bangalore, Karnataka 560011",
    phone: "(080) 3456-7890",
    hours: "Mon-Sat 10 AM - 6 PM",
    distance: "0.8 km",
    lat: 12.9293,
    lng: 77.5824,
  },
  {
    id: "5",
    name: "QuickScan Diagnostic Lab",
    type: "Diagnostic Lab",
    address: "202 Koramangala 5th Block, Koramangala, Bangalore, Karnataka 560095",
    phone: "(080) 4567-8901",
    hours: "Mon-Sun 7 AM - 7 PM",
    distance: "4.0 km",
    lat: 12.9351,
    lng: 77.6245,
  },
  {
    id: "6",
    name: "HealthFirst Pharmacy",
    type: "Pharmacy",
    address: "303 Malleswaram 8th Cross, Malleswaram, Bangalore, Karnataka 560003",
    phone: "(080) 5678-9012",
    hours: "Open 24 hours",
    distance: "1.5 km",
    lat: 13.0014,
    lng: 77.5723,
  },
  {
    id: "7",
    name: "Dr. Sharma's Family Clinic",
    type: "Clinic",
    address: "55 Richmond Road, Richmond Town, Bangalore, Karnataka 560025",
    phone: "(080) 6789-1234",
    hours: "Mon, Wed, Fri 8AM - 4PM",
    distance: "2.8 km",
    lat: 12.9657,
    lng: 77.5970,
  },
];


export default function NearbyFacilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const [mapText, setMapText] = useState("Map View of Nearby Facilities");
  const { toast } = useToast();

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location Found!",
            description: `Latitude: ${position.coords.latitude.toFixed(4)}, Longitude: ${position.coords.longitude.toFixed(4)}. Facility search based on this location is a future feature.`,
          });
          // In a real app, you'd use these coordinates to fetch facilities
          // For now, we can clear the search term or set a placeholder
          setSearchTerm(`Near ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: error.message || "Could not retrieve your location.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
    }
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

  useEffect(() => {
    let newMapText = "Map View of Nearby Facilities";
    if (filteredFacilities.length === 0 && (searchTerm || selectedTypes.length > 0)) {
      newMapText = "No Matching Facilities to Display on Map";
    } else if (searchTerm && selectedTypes.length > 0) {
      newMapText = `Map for '${searchTerm}' (${selectedTypes.join(', ')})`;
    } else if (searchTerm) {
      newMapText = `Map for '${searchTerm}'`;
    } else if (selectedTypes.length > 0) {
      if (selectedTypes.length === 1) {
        newMapText = `Map of ${selectedTypes[0]}s`;
      } else {
        newMapText = `Map of ${selectedTypes.join(' & ')}`;
      }
    }
    setMapText(newMapText);
  }, [filteredFacilities, searchTerm, selectedTypes]);


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        {/* Content Column */}
        <div className="space-y-6">
          {/* Location Detection */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Nearby Facility</h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <Button onClick={handleUseCurrentLocation} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                <LocateFixed className="mr-2 h-4 w-4" /> Use My Current Location
              </Button>
              <span className="text-muted-foreground">or</span>
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by Name, Address or PIN Code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            </div>
            <Alert variant="default" className="bg-info-muted border-info text-info-muted-foreground">
              <Info className="h-5 w-5 text-info" />
              <AlertTitle className="font-medium text-info-muted-foreground">Location Permissions</AlertTitle>
              <AlertDescription className="text-info-muted-foreground/90">
                We need your permission to access your location. If denied, you can manually enter your location or use a PIN code. <a href="#" className="font-semibold hover:underline text-info-muted-foreground">Learn more.</a>
              </AlertDescription>
            </Alert>
          </section>

          {/* Filter by Facility Type */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Filter by Facility Type <span className="text-sm text-muted-foreground">(within 5km - mock range)</span></h2>
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
                    onCheckedChange={() => handleTypeChange(type)} // This will be triggered by the div click too
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
                src={`https://placehold.co/800x400.png?text=${encodeURIComponent(mapText)}`}
                alt={mapText}
                width={800}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint="map locations"
                priority
                key={mapText} // Force re-render if text changes for placeholder
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

