"use client";
import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import HouseList from "@/components/HouseList";
import houses from "@/data/masies.json";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon using Lucide MapPin
const createCustomIcon = (conservationStatus: string) => {
  let color = "#93C5FD";
  let strokeColor = "#2563EB";

  if (conservationStatus === "Mal estat") {
    // orange
    color = "#FBBF24";
    strokeColor = "#F59E0B";
  } else if (conservationStatus === "Ruïnes") {
    // red
    color = "#FCA5A5";
    strokeColor = "#DC2626";
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const RuralHousesPage = () => {
  const [filteredHouses, setFilteredHouses] = useState(houses);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const handleMarkerClick = (house) => {
    setSelectedHouse(house);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="h-full sticky">
          <div className="w-full h-full rounded-tr-xl rounded-br-xl overflow-hidden shadow-lg">
            <MapContainer
              center={[41.99698374446344, 1.5264785003724906]}
              zoom={13}
              className="w-full h-full"
              style={{ background: "#f8fafc" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredHouses.map((house) => (
                <Marker
                  key={house.id}
                  position={[house.coordinates.lat, house.coordinates.lng]}
                  icon={createCustomIcon(house.conservation_status)}
                  eventHandlers={{
                    click: () => handleMarkerClick(house),
                  }}
                ></Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* List Section */}
        <div className="h-full overflow-auto">
          <HouseList
            filteredHouses={filteredHouses}
            selectedHouse={selectedHouse}
            setSelectedHouse={setSelectedHouse}
          />
        </div>
      </div>
    </div>
  );
};

// Add required CSS for Leaflet marker icons
const style = document.createElement("style");
style.textContent = `
  .custom-marker {
    background: none;
    border: none;
    transform: translate(-16px, -32px);
  }
`;
document.head.appendChild(style);

export default RuralHousesPage;
