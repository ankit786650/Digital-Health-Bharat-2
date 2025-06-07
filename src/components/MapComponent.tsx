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
  onMarkerDragEnd?: (lat: number, lng: number) => void;
}

export default function MapComponent({
  latitude = 20.5937, // Default to India's center
  longitude = 78.9629,
  zoom = 4,
  onMarkerDragEnd
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
      console.log("Map initialized with center:", latitude, longitude);
    }

    // Update map view if center or zoom props change
    if (mapInstance.current && (mapInstance.current.getCenter().lat !== latitude || mapInstance.current.getCenter().lng !== longitude || mapInstance.current.getZoom() !== zoom)) {
      mapInstance.current.setView([latitude, longitude], zoom);
      console.log("Map view updated to:", latitude, longitude, "zoom:", zoom);
    }

    // Add or update marker
    if (latitude !== undefined && longitude !== undefined) {
      if (markerInstance.current) {
        markerInstance.current.setLatLng([latitude, longitude]);
        console.log("Marker position updated to:", latitude, longitude);
      } else if (mapInstance.current) {
        markerInstance.current = L.marker([latitude, longitude], { draggable: !!onMarkerDragEnd }).addTo(mapInstance.current);
        console.log("Marker added at:", latitude, longitude, "Draggable:", !!onMarkerDragEnd);

        // Add dragend event listener if onMarkerDragEnd is provided
        if (onMarkerDragEnd) {
          markerInstance.current.on('dragend', (event) => {
            const { lat, lng } = event.target.getLatLng();
            onMarkerDragEnd(lat, lng);
            console.log("Marker dragged to:", lat, lng);
          });
        }
      }
    } else if (markerInstance.current) {
      // Remove marker if coordinates are no longer provided
      mapInstance.current?.removeLayer(markerInstance.current);
      markerInstance.current = null;
      console.log("Marker removed.");
    }

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        console.log("Map instance removed on unmount.");
      }
    };
  }, [latitude, longitude, zoom, onMarkerDragEnd]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div id="map-container" ref={mapContainer} className="w-full h-full" />
    </div>
  );
} 