import { useState, useCallback } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface UseMapPinProps {
  lat: number;
  lng: number;
}

export function useMapPin({ lat, lng }: UseMapPinProps) {
  const [mapCenter, setMapCenter] = useState<Location>({ lat, lng });
  const [pinnedLocation, setPinnedLocation] = useState<Location | null>(null);

  const pinLocation = useCallback((lat: number, lng: number) => {
    setPinnedLocation({ lat, lng });
  }, []);

  const clearPin = useCallback(() => {
    setPinnedLocation(null);
  }, []);

  return {
    mapCenter,
    setMapCenter,
    pinnedLocation,
    pinLocation,
    clearPin
  };
} 