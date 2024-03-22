import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM, Vector as VectorSource } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Overlay from "ol/Overlay";

const MapComponent = () => {
  const mapRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
        );
        const earthquakeData = res.data;
        initializeMap(earthquakeData);
      } catch (error) {
        console.error("Error fetching earthquake data:", error);
      }
    };

    fetchData();
  }, []);

  const initializeMap = (earthquakeData) => {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(earthquakeData, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: function (feature) {
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

    map.getView().fit(vectorSource.getExtent(), map.getSize());

    const overlay = new Overlay({
      element: document.createElement("div"),
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    map.addOverlay(overlay);

    map.on("pointermove", function (event) {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const coordinates = feature.getGeometry().getCoordinates();
        const properties = feature.getProperties();
        const popupContent = `
          <div class="popup-content">
            <h4>Earthquake Information</h4>
            <p><strong>Location:</strong> ${properties.place}</p>
            <p><strong>Time:</strong> ${new Date(properties.time).toLocaleString()}</p>
            <p><strong>Magnitude:</strong> ${properties.mag}</p>
          </div>
        `;
        overlay.getElement().innerHTML = popupContent;
        overlay.setPosition(coordinates);
      } else {
        overlay.setPosition(undefined);
      }
    });
  };

  const getColorForMagnitude = (magnitude) => {
    const minMag = 0.5;
    const maxMag = 7.0;
    const normalizedMag = (magnitude - minMag) / (maxMag - minMag);
    const hue = (1 - normalizedMag) * 240;
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <div id="map" ref={mapRef} style={{ height: "400px", width: "100%" }} />
  );
};

export default MapComponent;
