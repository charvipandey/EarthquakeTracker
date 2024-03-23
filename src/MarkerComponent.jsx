import React, { useEffect } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import PopupComponent from "./PopupComponent"; // Import PopupComponent

const MarkerComponent = ({ earthquakeData, map }) => {
  useEffect(() => {
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
            stroke: new Stroke({
              color: "rgba(255,255,255,0.8)",
              width: 2,
            }),
          }),
        });
      },
    });

    map.addLayer(vectorLayer);

    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [earthquakeData]);

  const getColorForMagnitude = (magnitude) => {
    let fillColor;

    // For floating-point magnitudes, consider the ceiling value
    magnitude = Math.ceil(magnitude);

    switch (magnitude) {
      case 3:
        fillColor = "yellow";
        break;
      case 4:
        // Mix of yellow and orange
        fillColor = "rgb(255, 191, 0)"; // Light orange (mix of yellow and orange)
        break;
      case 5:
        fillColor = "orange";
        break;
      case 6:
        // Mix of orange and red
        fillColor = "rgb(255, 128, 0)"; // Orange-red (mix of orange and red)
        break;
      case 7:
        fillColor = "red";
        break;
      case 8:
        // Dark red
        fillColor = "darkred";
        break;
      case 9:
        // Dark red
        fillColor = "darkred";
        break;
      default:
        // For magnitudes beyond 9, use dark red
        fillColor = "darkred";
    }

    return fillColor;
  };

  return null;
};

export default MarkerComponent;
