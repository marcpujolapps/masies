"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  House,
  Hammer,
  ClipboardList,
  Home,
  KeyRound,
  User,
  Car,
} from "lucide-react";

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

const HouseList = ({
  filteredHouses,
  selectedHouse,
  setSelectedHouse,
}: {
  filteredHouses: any[];
  selectedHouse: any;
  setSelectedHouse: any;
}) => {
  return (
    <div className="p-6 bg-gray-50 max-h-screen overflow-y-auto">
      <div className="grid md:grid-cols-2 gap-4">
        {filteredHouses.map((house: any) => (
          <Card
            key={house.reference_number}
            className="hover:shadow-lg transition-shadow cursor-pointer flex"
            onClick={() => setSelectedHouse(house)}
          >
            <div className="relative w-96 h-64 overflow-hidden border border-gray-300">
              <img
                src={`pdf_images/pdf_${house.pdf_page}.jpg`}
                alt="House Image"
                className="absolute object-cover"
                style={{
                  transform: "translate(70%, -100%) scale(4)",
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
            <div className="w-2/3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <House className="mr-2 text-blue-600" />
                  {house.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-gray-500" size={16} />
                    <span className="text-sm">{house.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-gray-500" size={16} />
                    <span className="text-sm">{house.construction_period}</span>
                  </div>
                  <Badge
                    variant={
                      house.conservation_status === "Molt bo"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {house.conservation_status}
                  </Badge>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

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
    </div>
  );
};

export default HouseList;
