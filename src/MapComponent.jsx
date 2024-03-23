import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import axios from "axios";
import MarkerComponent from "./MarkerComponent";
import PopupComponent from "./PopupComponent"; // Import PopupComponent

const MapComponent = () => {
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
      );
      const earthquakeData = res.data;
      setEarthquakeData(earthquakeData);
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (earthquakeData) {
      const mapInstance = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });

      setMap(mapInstance);
    }
  }, [earthquakeData]);

  return (
    <div
      id="map-container"
      ref={mapRef}
      style={{ height: "100vh", width: "100%", position: "relative" }}
    >
      {map && earthquakeData && (
        <>
          <MarkerComponent earthquakeData={earthquakeData} map={map} />
          <PopupComponent map={map} />
        </>
      )}
    </div>
  );
};

export default MapComponent;
