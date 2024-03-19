// C:\Users\ASUS\OneDrive\Desktop\JAVASCRIPT\react\testol\src\MapComponent.jsx
import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM, Vector as VectorSource } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Overlay from "ol/Overlay";
import axios from "axios";
import { unByKey } from "ol/Observable";

const MapComponent = () => {
  const mapRef = useRef();
  const overlayRef = useRef();
  const popupContentRef = useRef();

  useEffect(() => {
    let map;
    let clickListener;

    const getColorForMagnitude = (magnitude) => {
      const minMag = 0.5;
      const maxMag = 7.0;
      const normalizedMag = (magnitude - minMag) / (maxMag - minMag);
      const hue = (1 - normalizedMag) * 240;
      return `hsl(${hue}, 100%, 50%)`;
    };

    axios
      .get(
        "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2024-02-20%2000:00:00&endtime=2024-02-27%2023:59:59&minmagnitude=0.5&eventtype=earthquake&orderby=time"
      )
      .then((res) => {
        const earthquakeData = res.data;

        const vectorSource = new VectorSource({
          features: new GeoJSON().readFeatures(earthquakeData),
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: function (feature) {
            const mag = feature.get("mag");
            const baseRadius = 5; // Adjust the base radius as needed
        
            const scaleValue = mag <= 5 ? 1 : mag / 5; // Adjust the scale value as needed
        
            const circleStyle = new CircleStyle({
              radius: baseRadius * scaleValue, // Adjust the initial radius as needed
              fill: new Fill({
                color: getColorForMagnitude(mag),
              }),
              stroke: new Stroke({
                color: "rgba(255,255,255,0.8)",
                width: 2,
              }),
            });
        
            // Add earthquake animation class
            const imageElement = circleStyle.getImage();
            if (imageElement) {
              imageElement.classList.add('earthquake-animation');
            }
        
            return new Style({
              image: circleStyle,
            });
          },
        });

        if (mapRef.current && mapRef.current instanceof HTMLElement) {
          map = new Map({
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

          mapRef.current = map;

          const overlay = new Overlay({
            element: overlayRef.current,
            autoPan: true,
            autoPanAnimation: {
              duration: 250,
            },
          });

          map.addOverlay(overlay);

          clickListener = map.on("click", (event) => {
            const features = map.getFeaturesAtPixel(event.pixel);

            if (features && features.length > 0) {
              const selectedFeature = features[0];
              const coordinates = selectedFeature
                .getGeometry()
                .getCoordinates();
              const properties = selectedFeature.getProperties();
              const popupContent = `
                <div class="popup-content">
                  <h4>Earthquake Information</h4>
                  <p><strong>Location:</strong> ${properties.place}</p>
                  <p><strong>Time:</strong> ${new Date(
                    properties.time
                  ).toLocaleString()}</p>
                  <p><strong>Magnitude:</strong> ${properties.mag}</p>
                  <button onclick="closePopup()">X</button>
                </div>
              `;

              popupContentRef.current.innerHTML = popupContent;
              overlay.setPosition(coordinates);

              const closePopup = () => {
                overlay.setPosition(undefined);
              };

              window.closePopup = closePopup;
            } else {
              overlay.setPosition(undefined);
            }
          });

          map.getView().fit(vectorSource.getExtent(), map.getSize());
        }
      })
      .catch((error) => {
        console.error("Error fetching earthquake data:", error);
      });

    return () => {
      if (map) {
        unByKey(clickListener);
        map.setTarget(null);
      }
    };
  }, []);

  return (
    <div>
      <div
        ref={mapRef}
        style={{ height: "100vh", width: "100%" }}
        className="map-component"></div>
      <div ref={overlayRef} className="popup-container">
        <div ref={popupContentRef}></div>
      </div>
    </div>
  );
};

export default MapComponent;
