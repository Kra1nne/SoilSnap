import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
import { useAuth } from "../../context/AuthContext";

export default function Map() {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [soilClassifications, setSoilClassifications] = useState([]);
  const [selectedSoil, setSelectedSoil] = useState(""); // State for the selected soil classification
  const [pos] = useState([10.3333, 125.1667]); // Southern Leyte center

  useEffect(() => {
    api.get("/api/location")
      .then((response) => {
        const data = response.data || [];
        setLocations(data);
        setFilteredLocations(data);

        // Collect unique soil classifications for the filter
        const uniqueClassifications = [
          ...new Set(data.map((loc) => loc.soil_classification)),
        ];
        setSoilClassifications(uniqueClassifications);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  // Filter locations when the selected soil classification changes
  useEffect(() => {
    if (selectedSoil === "") {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        (loc) => loc.soil_classification === selectedSoil
      );
      setFilteredLocations(filtered);
    }
  }, [selectedSoil, locations]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-5">
      {/* Filter dropdown */}
      <div className="mb-4">
       <select
        className="h-11 w-50 appearance-none rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 pr-10"
        onChange={(e) => setSelectedSoil(e.target.value)}
        value={selectedSoil}
      >
        <option value="">All Soil Classifications</option>
        {soilClassifications.map((soil) => (
          <option key={soil} value={soil}>
            {soil}
          </option>
        ))}
      </select>
      </div>

      <div className="w-full max-w-7xl h-[80vh] rounded-2xl border border-gray-200 overflow-hidden">
        <MapContainer
          center={pos}
          zoom={11}
          className="w-full h-full z-10"
          style={{ margin: "2px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Loop through filtered locations */}
          {filteredLocations.map((loc) => {
            // Custom square marker with DB image
            const customIcon = L.divIcon({
              className: "custom-marker",
              html: ` 
                <div class="marker-wrapper">
                  <div class="marker-square">
                    <img src="${loc.image}" alt="${loc.soil_classification}" />
                  </div>
                  <div class="marker-pin"></div>
                </div>
              `,
              iconSize: [50, 60],
              iconAnchor: [25, 60],
              popupAnchor: [0, -55],
            });

            return (
              <Marker
                key={loc._id}
                position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
                icon={customIcon}
              >
                <Popup>
                  <div className="text-sm text-center">
                    <strong>{loc.soil_classification}</strong>
                    {user?.role === "Soil Expert" && (
                      <>
                        <strong>_{loc.number}</strong>
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <style>{`
        .marker-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Square marker */
        .marker-square {
          width: 40px;
          height: 40px;
          border-radius: 8px; /* slightly rounded corners, remove if you want sharp */
          overflow: hidden;
          border: 2px solid #ffffff;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .marker-square img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .marker-pin {
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid white; /* Change this to your desired color */
          margin-top: -1px;
        }
      `}</style>
    </div>
  );
}
