
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function Map() {
  const { toast } = useToast();
  const position = [40.7128, -74.0060]; // New York coordinates

  useEffect(() => {
    toast({
      title: "AI Prediction",
      description: "High demand expected in highlighted areas",
    });
  }, []);

  const hotspots = [
    { pos: [40.7580, -73.9855], radius: 1000 }, // Times Square
    { pos: [40.7527, -73.9772], radius: 800 },  // Grand Central
    { pos: [40.7484, -73.9857], radius: 1200 }, // Penn Station
  ];

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      <div className="absolute top-4 left-4 right-4 z-10 bg-black/80 p-4 rounded-lg backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-2">AI-Powered Hotspots</h2>
        <p className="text-sm text-gray-300 mb-4">
          Red zones indicate high demand areas with surge pricing
        </p>
        <Button 
          className="w-full bg-[#5271FF] hover:bg-[#5271FF]/90"
          onClick={() => {
            toast({
              title: "Navigation Started",
              description: "Directing you to the nearest hotspot",
            });
          }}
        >
          Navigate to Nearest Hotspot
        </Button>
      </div>

      <MapContainer
        center={position}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {hotspots.map((hotspot, index) => (
          <Circle
            key={index}
            center={hotspot.pos}
            radius={hotspot.radius}
            pathOptions={{
              color: '#5271FF',
              fillColor: '#ff0000',
              fillOpacity: 0.3,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
