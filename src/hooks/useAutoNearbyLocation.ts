import { useState, useCallback } from 'react';
import type { Facility } from '@/lib/types';

interface Location {
  lat: number;
  lng: number;
}

export function useAutoNearbyLocation(initialFacilities: Facility[]) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyFacilities, setNearbyFacilities] = useState<Facility[]>([]);

  const askAndShowNearbyFacilities = useCallback(() => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Calculate distances and sort facilities
        const facilitiesWithDistance = initialFacilities.map(facility => ({
          ...facility,
          distance: calculateDistance(
            latitude,
            longitude,
            facility.lat,
            facility.lng
          )
        }));

        // Sort by distance and take top 10
        const sortedFacilities = facilitiesWithDistance
          .sort((a, b) => (a.distance || 0) - (b.distance || 0))
          .slice(0, 10);

        setNearbyFacilities(sortedFacilities);
        setIsLocating(false);
      },
      (error) => {
        setError(error.message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [initialFacilities]);

  return {
    userLocation,
    isLocating,
    error,
    nearbyFacilities,
    askAndShowNearbyFacilities
  };
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
} 