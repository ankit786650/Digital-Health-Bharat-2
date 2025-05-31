
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Facility, FacilityType } from "@/lib/types";
import { FacilityCard } from "@/components/nearby-facility/FacilityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MapPinned, Search, LocateFixed, SlidersHorizontal, AlertCircle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

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
    address: "123 Main St, Anytown, CA 90210",
    phone: "(555) 123-4567",
    hours: "Open 24 hours",
    distance: "1.2 km",
    lat: 34.0522,
    lng: -118.2437,
    services: ["Emergency", "OPD", "Surgery", "Pediatrics"],
    website: "citygeneral.example.com",
    imageUrl: "https://placehold.co/600x400.png?text=City+General+Hospital",
  },
  {
    id: "2",
    name: "Community Health Clinic (PHC)",
    type: "PHC",
    address: "456 Oak Ave, Anytown, CA 90211",
    phone: "(555) 987-6543",
    hours: "Mon-Fri 9 AM - 5 PM",
    distance: "3.5 km",
    lat: 34.0550,
    lng: -118.2500,
    services: ["General Checkups", "Vaccinations", "Minor Illnesses"],
    imageUrl: "https://placehold.co/600x400.png?text=Community+Clinic",
  },
  {
    id: "3",
    name: "Wellness Private Hospital",
    type: "Private Hospital",
    address: "789 Pine Ln, Anytown, CA 90212",
    phone: "(555) 234-5678",
    hours: "Open 24 hours",
    distance: "2.1 km",
    lat: 34.0600,
    lng: -118.2450,
    services: ["Specialist Consultations", "Advanced Diagnostics", "Luxury Wards"],
    website: "wellnessprivate.example.com",
    imageUrl: "https://placehold.co/600x400.png?text=Wellness+Private",
  },
  {
    id: "4",
    name: "Jan Aushadhi Kendra - Elm St",
    type: "Jan Aushadhi Kendra",
    address: "101 Elm St, Anytown, CA 90210",
    phone: "(555) 345-6789",
    hours: "Mon-Sat 10 AM - 6 PM",
    distance: "0.8 km",
    lat: 34.0510,
    lng: -118.2400,
    services: ["Affordable Generic Medicines"],
    imageUrl: "https://placehold.co/600x400.png?text=Jan+Aushadhi",
  },
  {
    id: "5",
    name: "QuickScan Diagnostic Lab",
    type: "Diagnostic Lab",
    address: "202 Maple Dr, Anytown, CA 90213",
    phone: "(555) 456-7890",
    hours: "Mon-Sun 7 AM - 7 PM",
    distance: "4.0 km",
    lat: 34.0650,
    lng: -118.2550,
    services: ["Blood Tests", "X-Rays", "MRI", "Ultrasound"],
    website: "quickscanlabs.example.com",
    imageUrl: "https://placehold.co/600x400.png?text=QuickScan+Lab",
  },
  {
    id: "6",
    name: "HealthFirst Pharmacy",
    type: "Pharmacy",
    address: "303 Birch Rd, Anytown, CA 90210",
    phone: "(555) 567-8901",
    hours: "Open 24 hours",
    distance: "1.5 km",
    lat: 34.0530,
    lng: -118.2420,
    services: ["Prescription Drugs", "OTC Medicines", "Health Products"],
    imageUrl: "https://placehold.co/600x400.png?text=HealthFirst+Pharmacy",
  },
  {
    id: "7",
    name: "Dr. Smith's Family Clinic",
    type: "Clinic",
    address: "55 Cedar Ave, Anytown, CA 90214",
    phone: "(555) 678-1234",
    hours: "Mon, Wed, Fri 8AM - 4PM",
    distance: "2.8 km",
    lat: 34.0580,
    lng: -118.2390,
    services: ["General Practice", "Pediatrics", "Annual Physicals"],
    website: "drsmithclinic.example.com",
    imageUrl: "https://placehold.co/600x400.png?text=Dr.+Smith's+Clinic",
  },
];


export default function NearbyFacilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<FacilityType | "all">("all");
  const [displayedFacilities, setDisplayedFacilities] = useState<Facility[]>(mockFacilities);
  const { toast } = useToast();

  const handleUseCurrentLocation = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Automatic location detection will be implemented in a future update.",
    });
    // In a real app, you would use navigator.geolocation here
  };

  const filteredFacilities = useMemo(() => {
    return mockFacilities.filter((facility) => {
      const matchesSearchTerm =
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (facility.services && facility.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesType = selectedType === "all" || facility.type === selectedType;
      return matchesSearchTerm && matchesType;
    });
  }, [searchTerm, selectedType]);

  useEffect(() => {
    setDisplayedFacilities(filteredFacilities);
  }, [filteredFacilities]);
  
  // Add unique keys to facility images by appending id
  const facilitiesWithImageKeys = displayedFacilities.map(facility => ({
    ...facility,
    imageUrl: facility.imageUrl ? `${facility.imageUrl}&facility_id=${facility.id}` : `https://placehold.co/600x400.png?text=${encodeURIComponent(facility.name)}&facility_id=${facility.id}`
  }));


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <MapPinned className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Nearby Medical Facilities</h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-right max-w-md">
          Find hospitals, clinics, pharmacies, and labs near you. Use filters to narrow your search.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border rounded-lg bg-card shadow">
        <div className="md:col-span-1 space-y-1.5">
          <Label htmlFor="search-facility" className="text-sm font-medium">Search by Name, Address, PIN</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-facility"
              type="text"
              placeholder="e.g., City Hospital or 90210"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="facility-type" className="text-sm font-medium">Filter by Type</Label>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as FacilityType | "all")}>
            <SelectTrigger id="facility-type">
              <SelectValue placeholder="All Facility Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facility Types</SelectItem>
              {allFacilityTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleUseCurrentLocation} variant="outline" className="w-full md:w-auto">
          <LocateFixed className="mr-2 h-4 w-4" /> Use Current Location
        </Button>
      </div>

      {/* Map Placeholder Section */}
      <div className="bg-card p-4 rounded-lg shadow border">
        <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPinned className="h-5 w-5 text-primary" />
          Facility Map View
        </h2>
        <div className="aspect-[16/7] bg-muted rounded overflow-hidden relative">
          <Image
            src="https://placehold.co/1200x525.png"
            alt="Map placeholder showing facility locations"
            fill
            style={{objectFit: "cover"}}
            data-ai-hint="map city locations"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <p className="text-white text-lg font-medium bg-black/50 px-4 py-2 rounded">Map View Coming Soon</p>
          </div>
        </div>
      </div>
      
      {/* Facility Listings */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <SlidersHorizontal className="h-6 w-6 text-primary"/>
          Found {facilitiesWithImageKeys.length} Facilities
        </h2>
        {facilitiesWithImageKeys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilitiesWithImageKeys.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-lg shadow border">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-foreground">No Facilities Found</p>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search term or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
