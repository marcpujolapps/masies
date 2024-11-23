"use client";
import React, { useState, useMemo } from "react";
import {
  Car,
  ClipboardList,
  Hammer,
  Home,
  House,
  KeyRound,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import HouseList from "@/components/HouseList";
import houses from "@/data/masies.json";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "./ui/dialog";

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

const PropertyIcon = ({
  status,
}: {
  status: "Molt bo" | "Bo" | "Regular" | "Dolent";
}) => {
  const colors = {
    "Molt bo": "text-green-600",
    Bo: "text-blue-600",
    Regular: "text-yellow-600",
    Dolent: "text-red-600",
  };

  return <House className={`${colors[status] || "text-gray-600"}`} />;
};

const Main = () => {
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [useFilters, setUseFilters] = useState<string[]>([]);

  // Calculate available filter options and counts
  const filterOptions = useMemo(() => {
    const getOptionsWithCount = (key: string) => {
      const counts = houses.reduce((acc, house: any) => {
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
    return houses.filter((house: any) => {
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
      {selectedHouse && (
        <Dialog
          open={!!selectedHouse}
          onOpenChange={() => setSelectedHouse(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-2xl">
                <PropertyIcon status={selectedHouse.conservation_status} />
                <span>{selectedHouse.name}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={`pdf_images/pdf_${selectedHouse.pdf_page}.jpg`}
                    alt={selectedHouse.name}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-5 w-5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Propietari
                      </p>
                      <p className="text-sm">{selectedHouse.owner_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <KeyRound className="h-5 w-5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Ref. Cadastral
                      </p>
                      <p className="text-sm">
                        {selectedHouse.cadastral_reference}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Home className="h-5 w-5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Ús Actual
                      </p>
                      <p className="text-sm">{selectedHouse.current_use}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Car className="h-5 w-5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Accessibilitat
                      </p>
                      <p className="text-sm">{selectedHouse.accessibility}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                    <ClipboardList className="h-5 w-5" />
                    Descripció
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Estructura
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedHouse.description.structure}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">
                        Materials
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedHouse.description.materials}
                      </p>
                    </div>
                    {selectedHouse.description?.historical_notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Notes Històriques
                        </h4>
                        <p className="text-sm text-gray-600">
                          {selectedHouse.description.historical_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                    <Hammer className="h-5 w-5" />
                    Opcions de Renovació
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedHouse.renovation_options?.map(
                      (option: any, index: number) => (
                        <li key={index} className="text-sm text-gray-600">
                          {option}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex flex-row">
        {/* Map Section */}
        <div className="h-[calc(100vh)] flex-1">
          <div
            className="w-full h-full rounded-xl overflow-hidden shadow-lg"
            style={{
              zIndex: 1,
            }}
          >
            <MapContainer
              center={[41.99698374446344, 1.5264785003724906]}
              zoom={13}
              className="w-full h-full"
              style={{ background: "#f8fafc", zIndex: 1 }}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
              />
              {filteredHouses.map((house: any) => (
                <Marker
                  key={house.reference_number}
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
        <div className="h-[calc(100vh)] flex-1 overflow-auto">
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

export default Main;
