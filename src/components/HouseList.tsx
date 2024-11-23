"use client";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { House } from "lucide-react";

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
      <div className="grid md:grid-cols-3 gap-4">
        {filteredHouses.map((house: any) => (
          <Card
            key={house.reference_number}
            className="hover:shadow-lg transition-shadow cursor-pointer flex overflow-hidden"
            onClick={() => setSelectedHouse(house)}
          >
            <div className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <House className="mr-2 text-blue-600" />
                  {house.name}
                </CardTitle>
              </CardHeader>
              <div className="relative w-96 h-64 overflow-hidden border border-gray-300">
                <img
                  src={`pdf_images/pdf_${house.pdf_page}.jpg`}
                  alt="House Image"
                  className="absolute object-cover"
                  style={{
                    transform: "translate(11.5%, -80%) scale(1.9)",
                    width: "auto",
                    height: "auto",
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HouseList;
