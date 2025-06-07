import React, { useRef, useCallback } from 'react';
import L from 'leaflet';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const latitude = 0; // Replace with actual latitude
  const longitude = 0; // Replace with actual longitude
  const zoom = 13; // Replace with actual zoom level
  const markers = []; // Replace with actual markers

  const initMap = useCallback(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current!);
    } else if (mapInstanceRef.current) {
      // If map already exists, update view
      mapInstanceRef.current.setView([latitude, longitude], zoom);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    if (markers.length > 0 && mapInstanceRef.current) {
      markers.forEach(marker => {
        const newMarker = L.marker([marker.lat, marker.lng])
          .addTo(mapInstanceRef.current!)
          .bindPopup(marker.name || 'Location');
        markersRef.current.push(newMarker);
      });
    } else if (latitude && longitude && mapInstanceRef.current) {
      // Add single marker for current location if no specific markers provided
      const marker = L.marker([latitude, longitude])
        .addTo(mapInstanceRef.current!)
        .bindPopup('Selected Location');
      markersRef.current.push(marker);
    }
  }, [latitude, longitude, zoom, markers]);

  React.useEffect(() => {
    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, markers, initMap]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: '300px' }} />
  );
};

export default MapComponent; 