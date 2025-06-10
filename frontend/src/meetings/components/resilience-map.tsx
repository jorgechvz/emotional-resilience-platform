import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap, Marker, type LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { ResilienceCircle } from "../types/resilience-circles.types";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN!;

interface Props {
  circles: ResilienceCircle[];
  selectedId?: string | null;
  height?: string | number;
  defaultCenter?: LngLatLike;
  defaultZoom?: number;
}

export default function ResilienceMap({
  circles,
  selectedId,
  height = "100%",
  defaultCenter = [-71.505158, -16.425159],
  defaultZoom = 15,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: defaultCenter,
      zoom: defaultZoom,
    });

    map.once("load", () => setIsMapReady(true));
    mapRef.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    if (circles.length === 0) return;

    circles.forEach((circle) => {
      const lng = circle.longitude || 0;
      const lat = circle.latitude || 0;

      if (lng === 0 && lat === 0) {
        console.warn(`Círculo ${circle.name} no tiene coordenadas válidas`);
        return;
      }

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(
        `<div style="padding: 12px;">
          <h3 style="margin: 0 0 4px 0; font-size: 14px;">${circle.name}</h3>
          <p style="margin: 0 0 2px 0; font-size: 12px; color: #666;">📍 ${
            circle.location || "Ubicación no especificada"
          }</p>
          <p style="margin: 0; font-size: 12px; color: #666;">🎯 ${
            circle.focus
          }</p>
          ${
            circle.dateDescription
              ? `<p style="margin: 2px 0 0 0; font-size: 11px; color: #888;">📅 ${circle.dateDescription}</p>`
              : ""
          }
        </div>`
      );

      const marker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current[circle.id] = marker;
    });
  }, [circles, selectedId, isMapReady]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={containerRef} className="w-full h-full p-2" />
      {!isMapReady && (
        <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
}
