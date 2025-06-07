"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon issue with Webpack/CRA
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface MapComponentProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
}

export default function MapComponent({
  latitude = 20.5937, // Default to India's center
  longitude = 78.9629,
  zoom = 4
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapInstance.current) {
      // Initialize map if it doesn't exist
      mapInstance.current = L.map(mapContainer.current).setView([latitude, longitude], zoom);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    }

    // Update map view if center or zoom props change
    if (mapInstance.current) {
      mapInstance.current.setView([latitude, longitude], zoom);
    }

    // Add or update marker
    if (latitude && longitude) {
      if (markerInstance.current) {
        markerInstance.current.setLatLng([latitude, longitude]);
      } else if (mapInstance.current) {
        markerInstance.current = L.marker([latitude, longitude]).addTo(mapInstance.current);
      }
    } else if (markerInstance.current) {
      // Remove marker if coordinates are no longer provided
      mapInstance.current?.removeLayer(markerInstance.current);
      markerInstance.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div id="map-container" ref={mapContainer} className="w-full h-full" />
    </div>
  );
} 