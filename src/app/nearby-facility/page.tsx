"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Facility, FacilityType } from "@/lib/types";
import { FacilityCard } from "@/components/nearby-facility/FacilityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, LocateFixed, Info, Package, MapPin, X, Loader2, SlidersHorizontal, Map, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNearbyFacilities } from "@/hooks/useNearbyFacilities";
import { useMapPin } from "@/hooks/useMapPin";
import { useAutoNearbyLocation } from "@/hooks/useAutoNearbyLocation";
import { mockFacilities } from "@/lib/mockFacilities"; // For initial state

const DynamicMapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const allFacilityTypes: FacilityType[] = [
  "Government Hospital",
  "PHC",
  "Private Hospital",
  "Jan Aushadhi Kendra",
  "Diagnostic Lab",
  "Pharmacy",
  "Clinic",
];

export default function NearbyFacilityPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<FacilityType[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const { toast } = useToast();
  const [openSelect, setOpenSelect] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string>("");

  // Use the custom hooks
  const {
    facilities,
    isLoading: facilitiesLoading,
    searchAllHealthCenters,
    setFacilities,
  } = useNearbyFacilities();

  const {
    mapCenter,
    setMapCenter,
    pinnedLocation,
    pinLocation,
    clearPin,
  } = useMapPin({ lat: 12.9716, lng: 77.5946 }); // Default to Bangalore

  const [mapZoom, setMapZoom] = useState<number>(12);

  const {
    userLocation,
    isLocating,
    error: locationError,
    askAndShowNearbyFacilities,
    nearbyFacilities,
  } = useAutoNearbyLocation(facilities);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
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
  }, [setResolvedAddress]);

  const handleMarkerDragEnd = useCallback(async (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
    setMapZoom(15); // Zoom in slightly on the new pin location
    const address = await reverseGeocode(lat, lng);
    toast({
      title: "Location Updated",
      description: `Map center updated to: ${lat.toFixed(4)}, ${lng.toFixed(4)} - ${address}`,
    });
    pinLocation(lat, lng);
  }, [setMapCenter, setMapZoom, reverseGeocode, toast, pinLocation]);

  // Handler for current location
  const handleUseCurrentLocation = useCallback(() => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setMapCenter({ lat, lng });
          setMapZoom(14);

          const address = await reverseGeocode(lat, lng);
          toast({
            title: "Location Found!",
            description: `Map updated to your location: ${address}`,
          });
          setSearchTerm(address); // Update search term with the full address
          setIsLoadingLocation(false);
          pinLocation(lat, lng); // Pin location on GPS detection
        },
        (error: GeolocationPositionError) => {
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
  }, [setMapCenter, setMapZoom, reverseGeocode, toast, pinLocation, setIsLoadingLocation]);

  useEffect(() => {
    // Initial load, ask for current location
    handleUseCurrentLocation();
  }, [handleUseCurrentLocation]); // Depend on handleUseCurrentLocation

  // Handler for geocoding
  const handleGeocodeSearch = useCallback(async (query: string) => {
    if (!query) return;
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        if (!isNaN(newLat) && !isNaN(newLng)) {
          setMapCenter({ lat: newLat, lng: newLng });
          setMapZoom(12);
          toast({
            title: "Location Found!",
            description: `Map updated to: ${display_name}`,
          });
          setSearchTerm(display_name);
          setResolvedAddress(display_name); // Update resolved address
          pinLocation(newLat, newLng); // Pin location on geocoding
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
      toast({
        title: "Search Error",
        description: "Failed to fetch location. Please check your network or try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  }, [setMapCenter, setMapZoom, toast, setSearchTerm, setResolvedAddress, pinLocation, setIsGeocoding]);

  const handleTypeChange = useCallback((type: FacilityType) => {
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
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTypes([]);
    setSearchTerm("");
    setSelectedFacility(null);
    setFacilities(mockFacilities);
    clearPin(); // Clear the pinned location
    setResolvedAddress(""); // Clear resolved address
    setMapCenter({ lat: 12.9716, lng: 77.5946 }); // Reset map to default Bangalore
    setMapZoom(12); // Reset map zoom
  }, [setFacilities, clearPin, setResolvedAddress, setMapCenter, setMapZoom]);

  const handleFacilitySelect = useCallback((facility: Facility) => {
    setSelectedFacility(facility);
    setMapCenter({ lat: facility.lat, lng: facility.lng });
    setMapZoom(15);
    pinLocation(facility.lat, facility.lng);
    reverseGeocode(facility.lat, facility.lng);
  }, [setMapCenter, setMapZoom, pinLocation, reverseGeocode]);

  // Effect to parse search term for coordinates or trigger geocoding
  useEffect(() => {
    const coordMatch = searchTerm.match(/(?:Near\s*)?(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/i);

    if (coordMatch && coordMatch[1] && coordMatch[2]) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
        setMapZoom(12);
        pinLocation(lat, lng);
        reverseGeocode(lat, lng);
      }
    } else if (!searchTerm && mapCenter) {
      // Only reset if the map center is different from default
      if (mapCenter.lat !== 12.9716 || mapCenter.lng !== 77.5946) {
        clearPin();
        setMapCenter({ lat: 12.9716, lng: 77.5946 }); // Reset to default Bangalore
        setMapZoom(12);
        setResolvedAddress("");
      }
    }
  }, [searchTerm, pinLocation, reverseGeocode, clearPin, setMapCenter, setMapZoom, setResolvedAddress]);

  // Initialize facilities with mock data
  useEffect(() => {
    setFacilities(mockFacilities);
  }, [setFacilities]);

  // Use userLocation for map if available
  const mapLat = userLocation?.lat ?? mapCenter.lat;
  const mapLng = userLocation?.lng ?? mapCenter.lng;
  const mapMarker = pinnedLocation ?? userLocation;

  // Filtered facilities based on type and search term
  const filteredFacilities = useMemo(() => {
    return facilities
      .filter((facility: Facility) => {
        const matchesSearchTerm =
          facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (facility.services && facility.services.some((service: string) => service.toLowerCase().includes(searchTerm.toLowerCase())));
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(facility.type);
        return matchesSearchTerm && matchesType;
      })
      .sort((a: Facility, b: Facility) => {
        if (mapCenter) {
          // Calculate distance from mapCenter for sorting
          const getDistanceSquared = (lat1: number, lng1: number, lat2: number, lng2: number) => {
            return Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2);
          };
          const distA = getDistanceSquared(a.lat, a.lng, mapCenter.lat, mapCenter.lng);
          const distB = getDistanceSquared(b.lat, b.lng, mapCenter.lat, mapCenter.lng);
          return distA - distB;
        }
        return 0;
      });
  }, [facilities, searchTerm, selectedTypes, mapCenter]);

  // Show nearby facilities if user has triggered location
  const listToShow = nearbyFacilities.length > 0 ? nearbyFacilities : filteredFacilities;

  // Handler to pin location on map (on map click)
  const handlePinLocationOnMap = useCallback(async (lat: number, lng: number) => {
    pinLocation(lat, lng);
    setMapCenter({ lat, lng });
    setMapZoom(15);
    const address = await reverseGeocode(lat, lng);
    toast({
      title: "Pinned Location",
      description: `Pinned at: ${lat.toFixed(4)}, ${lng.toFixed(4)} - ${address}`,
    });
  }, [pinLocation, setMapCenter, setMapZoom, reverseGeocode, toast]);

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
                  if (e.key === "Enter") {
                    const coordMatch = searchTerm.match(/(?:Near\s*)?(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/i);
                    if (!(coordMatch && coordMatch[1] && coordMatch[2])) { // Only geocode if not coordinates
                      handleGeocodeSearch(searchTerm);
                    } else { // If it's coordinates, set resolved address
                      setResolvedAddress(`Coordinates: ${coordMatch[1]}, ${coordMatch[2]}`);
                    }
                  }
                }}
                className="pl-8 w-full"
              />
            </div>
            <Button
              onClick={searchAllHealthCenters}
              className="bg-info text-info-foreground hover:bg-info/90"
            >
              {facilitiesLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Show All Health Centers
            </Button>
          </div>
          {resolvedAddress && ( // Display resolved address here
            <Alert variant="default" className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Resolved Location: <span className="font-semibold text-foreground">{resolvedAddress}</span></span>
            </Alert>
          )}
          {/* Button for "Show Facilities Near Me" */}
          <section className="space-y-2">
            <Button
              onClick={() => askAndShowNearbyFacilities()}
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-6"
              disabled={facilitiesLoading || isLocating}
            >
              <MapPin className="mr-2 h-4 w-4" />
              {isLocating ? "Locating..." : "Show Facilities Near Me"}
            </Button>
            {locationError && <Alert variant="destructive"><AlertTitle>Location Error</AlertTitle><AlertDescription>{locationError}</AlertDescription></Alert>}
          </section>
          <Alert variant="default" className="bg-info-muted border-info text-info-muted-foreground">
            <Info className="h-5 w-5 text-info" />
            <AlertTitle className="font-medium text-info-muted-foreground">Location Tips</AlertTitle>
            <AlertDescription className="text-info-muted-foreground/90">
              Allow location access for better results, or enter coordinates, address or pincode manually.
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
                                setOpenSelect(true);
                              }}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`type-${type.replace(/\s+/g, "-")}`}
                                  checked={selectedTypes.includes(type)}
                                  className={cn(
                                    selectedTypes.includes(type)
                                      ? "border-primary text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                      : "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                  )}
                                />
                                <Label
                                  htmlFor={`type-${type.replace(/\s+/g, "-")}`}
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
                <DynamicMapComponent
                  latitude={mapCenter.lat}
                  longitude={mapCenter.lng}
                  zoom={mapZoom}
                  markers={pinnedLocation ? [{ lat: pinnedLocation.lat, lng: pinnedLocation.lng, name: resolvedAddress || "Pinned Location" }] : []}
                />
              </div>
            )}
          </div>
        </div>

        {/* Facilities List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {listToShow.length} Facilities Found
            </h2>
          </div>

          <div className="space-y-4">
            {listToShow.length > 0 ? (
              listToShow.map((facility: Facility) => (
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

