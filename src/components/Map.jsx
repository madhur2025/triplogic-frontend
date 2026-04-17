"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

export default function Map({
  places = [],
  userLocation = null,
  center = [25.2138, 75.9630],
  zoom = 12,
  height = "300px",
  route = []
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef(null);
  const userMarkerRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    window.goToPlace = (id) => {
      router.push(`/places/${id}`);
    };
  }, [router]);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, { zoomControl: false })
      .setView(center, zoom);

    mapRef.current.attributionControl.setPrefix(false);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "",
      maxZoom: 19,
    }).addTo(mapRef.current);

    markersRef.current = L.markerClusterGroup();
    mapRef.current.addLayer(markersRef.current);
  }, [center, zoom]);

  // Add place markers
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    places.forEach((place) => {
      if (!place.location?.coordinates) return;
      const [lng, lat] = place.location.coordinates;

      const marker = L.marker([lat, lng]).bindPopup(`
        <div>
          <h3>${place.name}</h3>
          <button onclick="window.goToPlace('${place._id}')" style="color:blue; border:none; background:none; cursor:pointer; font-weight:600;">View Place</button>
        </div>
      `);
      markersRef.current.addLayer(marker);
    });
  }, [places]);

  // User location marker
  useEffect(() => {
    if (!mapRef.current) return;
    if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current);

    if (userLocation?.lat && userLocation?.lng) {
      const userIcon = L.icon({
        iconUrl: "/user-location-pin.png", // agar image nahi hai to default use hoga
        iconSize: [32, 32],
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup("You are here")
        .addTo(mapRef.current);

      mapRef.current.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [userLocation]);

 
    // ✅ Draw Route Polyline (FINAL CLEAN)
useEffect(() => {
  if (!mapRef.current || route.length === 0) return;

  // remove old route
  if (window.routePolyline) {
    mapRef.current.removeLayer(window.routePolyline);
  }

  // draw new route
  window.routePolyline = L.polyline(route, {
    color: "#10b981",
    weight: 6,
    opacity: 0.85,
    lineJoin: "round",
    lineCap: "round"
  }).addTo(mapRef.current);

  // auto zoom
  mapRef.current.fitBounds(window.routePolyline.getBounds(), {
    padding: [40, 40]
  });

}, [route]);
  return (
    <div
      ref={containerRef}
      style={{ minHeight: height, width: "100%" }}
      className="rounded-2xl overflow-hidden shadow-xl z-1"
    />
  );
}