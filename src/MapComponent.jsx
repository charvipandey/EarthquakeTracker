import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";
import Overlay from "ol/Overlay";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import axios from "axios"; // Import Axios for data fetching

const MapComponent = () => {
  const [earthquakeData, setEarthquakeData] = useState(null);
  const [popupContent, setPopupContent] = useState("");
  const mapRef = useRef(null);
  const popupRef = useRef(null);

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
      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(earthquakeData, {
          featureProjection: "EPSG:3857",
        }),
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          const mag = feature.get("mag");
          const baseRadius = 5;
          const fillColor = getColorForMagnitude(mag);

          return new Style({
            image: new CircleStyle({
              radius: baseRadius,
              fill: new Fill({ color: fillColor }),
              stroke: new Stroke({ color: "rgba(255,255,255,0.8)", width: 2 }),
            }),
          });
        },
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
      });

      const overlay = new Overlay({
        element: popupRef.current,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });

      map.addOverlay(overlay);

      map.on("pointermove", function (event) {
        if (!map.getView().getAnimating()) {
          const pixel = map.getEventPixel(event.originalEvent);
          const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
            return feature;
          });
          if (feature) {
            const coordinates = feature.getGeometry().getCoordinates();
            const properties = feature.getProperties();
            const popupContent = `
              <div class="popup-content">
                <h4>Earthquake Information</h4>
                <p><strong>Location:</strong> ${properties.place}</p>
                <p><strong>Time:</strong> ${formatDate(new Date(properties.time))}</p>
                <p><strong>Magnitude:</strong> ${properties.mag}</p>
              </div>
            `;
            setPopupContent(popupContent);
            overlay.setPosition(coordinates);
          } else {
            overlay.setPosition(undefined);
          }
        }
      });

      return () => {
        map.setTarget(null);
        map.dispose();
      };
    }
  }, [earthquakeData]);

  const getColorForMagnitude = (magnitude) => {
    const minMag = 0.5;
    const maxMag = 7.0;
    const normalizedMag = (magnitude - minMag) / (maxMag - minMag);
    const hue = (1 - normalizedMag) * 240;
    return `hsl(${hue}, 100%, 50%)`;
  };

  const formatDate = (date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}, ${date.toLocaleTimeString()}`;
    return formattedDate;
  };

  return (
    <div
      id="map"
      ref={mapRef}
      style={{ height: "100vh", width: "100%", position: "relative" }}
    >
      <div
        ref={popupRef}
        className="popup-container"
        style={{ display: popupContent ? "block" : "none" }}
        dangerouslySetInnerHTML={{ __html: popupContent }}
      />
    </div>
  );
};

export default MapComponent;
