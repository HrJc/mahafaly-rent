"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet default icon issue with webpack
const icon = L.divIcon({
  html: `
    <div style="
      width: 40px;
      height: 40px;
      background: white;
      border: 2px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>
  `,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

// Antananarivo coordinates
const position: [number, number] = [-18.9137, 47.5361]

export default function LocationMap() {
  useEffect(() => {
    return () => {
      document.querySelectorAll(".leaflet-container").forEach((el) => {
        ;(el as HTMLElement & { _leaflet_id?: number })._leaflet_id = undefined
      })
    }
  }, [])

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%", background: "#0A0A0A" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup
          className="dark-popup"
        >
          <div style={{
            background: "#000",
            color: "white",
            padding: "8px 12px",
            fontSize: "12px",
            minWidth: "160px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>Mahafaly Rent</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
              Antananarivo, Madagascar
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
