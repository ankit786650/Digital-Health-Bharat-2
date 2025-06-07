"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Facility, FacilityType } from "@/lib/types";
import { FacilityCard } from "@/components/nearby-facility/FacilityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, LocateFixed, Info, Package, MapPin, X, Loader2, SlidersHorizontal, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

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
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const { toast } = useToast();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number; } | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(4);
  const [openSelect, setOpenSelect] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string>("");

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await response.json();
      if (data && data.display_name) {
        setResolvedAddress(data.display_name);
        return data.display_name;
      } else {
        setResolvedAddress("Address not found");
        return "Address not found";
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      setResolvedAddress("Error fetching address");
      return "Error fetching address";
    }
  };

  const handleMarkerDragEnd = useCallback(async (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
    setMapZoom(15); // Zoom in slightly on the new pin location
    const address = await reverseGeocode(lat, lng);
    toast({
      title: "Location Updated",
      description: `Map center updated to: ${lat.toFixed(4)}, ${lng.toFixed(4)} - ${address}`,
    });
  }, [setMapCenter, setMapZoom, toast]);

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (!mapCenter || mapCenter.lat !== lat || mapCenter.lng !== lng) {
            setMapCenter({ lat, lng });
            setMapZoom(14);
          }

          const address = await reverseGeocode(lat, lng);
          toast({
            title: "Location Found!",
            description: `Map updated to your location: ${address}`,
          });
          setSearchTerm(address); // Update search term with the full address
          setIsLoadingLocation(false);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: error.message || "Could not retrieve your location.",
            variant: "destructive",
          });
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
          maximumAge: 60000, // 1 minute
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      setIsLoadingLocation(false);
    }
  };

  const handleGeocodeSearch = async (query: string) => {
    if (!query) return;
    setIsGeocoding(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        if (!isNaN(newLat) && !isNaN(newLng)) {
          setMapCenter({ lat: newLat, lng: newLng });
          setMapZoom(12); // Zoom in on the geocoded location
          toast({
            title: "Location Found!",
            description: `Map updated to: ${display_name}`,
          });
          setSearchTerm(display_name); // Update search term with the full address
        } else {
          toast({
            title: "Search Error",
            description: "Could not parse coordinates from the address/pincode.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Search Error",
          description: "No results found for the given address/pincode.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast({
        title: "Search Error",
        description: "Failed to fetch location. Please check your network or try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleTypeChange = (type: FacilityType) => {
    setSelectedTypes((prevTypes) => {
      const isSelected = prevTypes.includes(type);
      let newTypes;
      if (isSelected) {
        newTypes = prevTypes.filter((t) => t !== type);
      } else {
        newTypes = [...prevTypes, type];
      }
      return newTypes;
    });
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSearchTerm("");
    setSelectedFacility(null);
  };

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
    setMapCenter({ lat: facility.lat, lng: facility.lng });
    setMapZoom(15);
  };

  // Effect to parse search term for coordinates or trigger geocoding
  useEffect(() => {
    const coordMatch = searchTerm.match(/(?:Near\s*)?(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/i);

    if (coordMatch && coordMatch[1] && coordMatch[2]) {
      // It's coordinates, so update map directly
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        if (!mapCenter || mapCenter.lat !== lat || mapCenter.lng !== lng) {
          setMapCenter({ lat, lng });
          setMapZoom(12);
        }
      }
    } else if (mapCenter && !searchTerm) {
        setMapCenter(null);
        setMapZoom(4);
    }
  }, [searchTerm, mapCenter, isGeocoding]); // mapCenter and isGeocoding are dependencies because we check their values

  const filteredFacilities = useMemo(() => {
    return mockFacilities
      .filter((facility) => {
        const matchesSearchTerm =
          facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (facility.services && facility.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(facility.type);
        return matchesSearchTerm && matchesType;
      })
      .sort((a, b) => {
        // Sort by distance if coordinates are available
        if (mapCenter) {
          const distA = Math.sqrt(Math.pow(a.lat - mapCenter.lat, 2) + Math.pow(a.lng - mapCenter.lng, 2));
          const distB = Math.sqrt(Math.pow(b.lat - mapCenter.lat, 2) + Math.pow(b.lng - mapCenter.lng, 2));
          return distA - distB;
        }
        return 0;
      });
  }, [searchTerm, selectedTypes, mapCenter]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Find Nearby Healthcare Facilities</h1>
          <p className="text-muted-foreground">
            Search for hospitals, clinics, pharmacies, and other healthcare facilities near you.
          </p>
        </div>

        {/* Search and Location Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button 
              onClick={handleUseCurrentLocation} 
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="mr-2 h-4 w-4" />
              )}
              {isLoadingLocation ? "Detecting Location..." : "Use My Location"}
            </Button>
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, address, pincode, or coordinates (e.g., Bangalore, 560001, 12.9716, 77.5946)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const coordMatch = searchTerm.match(/(?:Near\s*)?(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/i);
                    if (!(coordMatch && coordMatch[1] && coordMatch[2])) {
                      handleGeocodeSearch(searchTerm);
                    }
                  }
                }}
                className="pl-8 w-full"
              />
            </div>
          </div>

          {resolvedAddress && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Resolved Location: <span className="font-semibold text-foreground">{resolvedAddress}</span></span>
            </div>
          )}

          <Alert variant="default" className="bg-info-muted border-info text-info-muted-foreground">
            <Info className="h-5 w-5 text-info" />
            <AlertTitle className="font-medium text-info-muted-foreground">Location Tips</AlertTitle>
            <AlertDescription className="text-info-muted-foreground/90">
              Allow location access for better results, or enter coordinates, address or pincode manually. <a href="#" className="font-semibold hover:underline text-info-muted-foreground">Learn more</a>
            </AlertDescription>
          </Alert>
        </section>

        {/* Facility Types and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Facility Types Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Facility Types</h2>
              {(selectedTypes.length > 0 || searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <Popover open={openSelect} onOpenChange={setOpenSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSelect}
                    className="w-full justify-between"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {selectedTypes.length > 0
                      ? `${selectedTypes.length} types selected`
                      : "Select facility types"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[300px] p-0" 
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <Command>
                    <CommandInput placeholder="Search facility types..." />
                    <CommandList>
                      <CommandEmpty>No types found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-[200px]">
                          {allFacilityTypes.map((type) => (
                            <CommandItem
                              key={type}
                              onSelect={() => {
                                handleTypeChange(type);
                                setOpenSelect(true); // Keep the popover open for multi-selection
                              }}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`type-${type.replace(/\s+/g, '-')}`}
                                  checked={selectedTypes.includes(type)}
                                  className={cn(
                                    selectedTypes.includes(type)
                                      ? "border-primary text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                      : "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                  )}
                                />
                                <Label
                                  htmlFor={`type-${type.replace(/\s+/g, '-')}`}
                                  className="font-medium text-sm cursor-pointer select-none"
                                >
                                  {type}
                                </Label>
                              </div>
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="flex items-center gap-1 pr-1"
                    >
                      {type}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0.5 ml-1 leading-none"
                        onClick={() => handleTypeChange(type)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Facility Map</h2>
              <Button
                variant="outline"
                onClick={() => setShowMap(!showMap)}
                className="w-auto"
              >
                <Map className="mr-2 h-4 w-4" />
                {showMap ? "Hide Map" : "Show Map"}
              </Button>
            </div>
            
            {showMap && (
              <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border bg-muted">
                <MapComponent 
                  latitude={mapCenter?.lat} 
                  longitude={mapCenter?.lng} 
                  zoom={mapZoom}
                  onMarkerDragEnd={handleMarkerDragEnd}
                />
              </div>
            )}
          </div>
        </div>

        {/* Facilities List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {filteredFacilities.length} Facilities Found
            </h2>
            {mapCenter && (
              <span className="text-sm text-muted-foreground">
                <MapPin className="inline-block h-4 w-4 mr-1" />
                Sorted by distance from your location
              </span>
            )}
          </div>

          <div className="space-y-4">
            {filteredFacilities.length > 0 ? (
              filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className={cn(
                    "transition-all duration-200",
                    selectedFacility?.id === facility.id && "ring-2 ring-primary"
                  )}
                >
                  <FacilityCard
                    facility={facility}
                    onSelect={() => handleFacilitySelect(facility)}
                    isSelected={selectedFacility?.id === facility.id}
                  />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 bg-card rounded-lg shadow-inner text-muted-foreground">
                <Package className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No Facilities Found</p>
                <p className="text-sm text-center">
                  Try adjusting your search term or filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

