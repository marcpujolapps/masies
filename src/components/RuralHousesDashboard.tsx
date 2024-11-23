"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Home, Clock } from "lucide-react";

// Preprocessing function to transform data for charts
const prepareConservationStatusData = (houses) => {
  const statusCounts = houses.reduce((acc, house) => {
    acc[house.conservation_status] = (acc[house.conservation_status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    fill:
      status === "Molt bo"
        ? "#10B981"
        : status === "Mal estat"
        ? "#EF4444"
        : "#F59E0B",
  }));
};

const RuralHousesDashboard = ({ houses }) => {
  const [selectedFilter, setSelectedFilter] = useState("conservation_status");

  const chartData = useMemo(
    () => prepareConservationStatusData(houses),
    [houses]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Conservation Status Chart */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="mr-2 text-green-600" />
            Estat de conservació
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Insights Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 text-blue-600" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-xl font-bold text-blue-600">
                {houses.length}
              </h3>
              <p className="text-gray-600">Total Houses</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-xl font-bold text-green-600">
                {
                  houses.filter((h) => h.conservation_status === "Molt bo")
                    .length
                }
              </h3>
              <p className="text-gray-600">Well-Preserved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RuralHousesDashboard;
