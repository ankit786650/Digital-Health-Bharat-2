import { useState, useCallback } from 'react';
import type { Facility } from '@/lib/types';
import { mockFacilities } from '@/lib/mockFacilities';

export function useNearbyFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities);
  const [isLoading, setIsLoading] = useState(false);

  const searchAllHealthCenters = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/health-centers');
      if (!response.ok) {
        throw new Error('Failed to fetch health centers');
      }
      const data = await response.json();
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching health centers:', error);
      // Fallback to mock data if API fails
      setFacilities(mockFacilities);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    facilities,
    isLoading,
    searchAllHealthCenters,
    setFacilities
  };
} 