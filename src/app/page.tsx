"use client";
import React, { useEffect, useState, useMemo } from "react";
import { MapPin, House, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import HouseList from "@/components/HouseList";
import houses from "@/data/masies.json";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Filter badge component
const FilterBadge = ({
  label,
  isActive,
  onClick,
  count,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count: number;
}) => (
  <Badge
    variant={isActive ? "default" : "outline"}
    className={`cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1
      ${isActive ? "bg-blue-600" : "bg-transparent text-gray-600"}`}
    onClick={onClick}
  >
    {label}
    <span className="text-xs">({count})</span>
    {isActive && <X size={14} className="ml-1" />}
  </Badge>
);

// Filter section component
const FilterSection = ({
  title,
  options,
  selectedFilters,
  onFilterChange,
}: {
  title: string;
  options: { value: string; count: number }[];
  selectedFilters: string[];
  onFilterChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <h3 className="text-sm font-medium text-gray-700">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, count }) => (
        <FilterBadge
          key={value}
          label={value}
          isActive={selectedFilters.includes(value)}
          onClick={() => onFilterChange(value)}
          count={count}
        />
      ))}
    </div>
  </div>
);

// Custom marker icon using Lucide MapPin
const createCustomIcon = (conservationStatus: string) => {
  let color = "#93C5FD";
  let strokeColor = "#2563EB";

  if (conservationStatus === "Mal estat") {
    color = "#FBBF24";
    strokeColor = "#F59E0B";
  } else if (conservationStatus === "Ruïnes") {
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
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [useFilters, setUseFilters] = useState<string[]>([]);

  // Calculate available filter options and counts
  const filterOptions = useMemo(() => {
    const getOptionsWithCount = (key: string) => {
      const counts = houses.reduce((acc, house) => {
        const value = house[key];
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(counts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);
    };

    return {
      status: getOptionsWithCount("conservation_status"),
      use: getOptionsWithCount("current_use"),
    };
  }, []);

  // Filter houses based on selected filters
  const filteredHouses = useMemo(() => {
    return houses.filter((house) => {
      const statusMatch =
        statusFilters.length === 0 ||
        statusFilters.includes(house.conservation_status);
      const useMatch =
        useFilters.length === 0 || useFilters.includes(house.current_use);
      return statusMatch && useMatch;
    });
  }, [houses, statusFilters, useFilters]);

  const toggleFilter = (
    value: string,
    currentFilters: string[],
    setFilters: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setUseFilters([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filters Section */}
      <div className="p-4 bg-white shadow-sm mb-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <FilterSection
            title="Estat de Conservació"
            options={filterOptions.status}
            selectedFilters={statusFilters}
            onFilterChange={(value) =>
              toggleFilter(value, statusFilters, setStatusFilters)
            }
          />
          <FilterSection
            title="Ús Actual"
            options={filterOptions.use}
            selectedFilters={useFilters}
            onFilterChange={(value) =>
              toggleFilter(value, useFilters, setUseFilters)
            }
          />

          {(statusFilters.length > 0 || useFilters.length > 0) && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-600">
                Mostrant {filteredHouses.length} de {houses.length} cases
              </span>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                onClick={clearFilters}
              >
                Netejar filtres
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="h-[calc(100vh-200px)] sticky top-4">
          <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
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
                    click: () => setSelectedHouse(house),
                  }}
                />
              ))}
            </MapContainer>
          </div>
        </div>

        {/* List Section */}
        <div className="h-[calc(100vh-200px)] overflow-auto">
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
