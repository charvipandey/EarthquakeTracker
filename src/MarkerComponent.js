import React, { useEffect } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

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
        const baseRadius = getRadiusForMagnitude(mag);
        const fillColor = getColorForMagnitude(mag);

        return new Style({
          image: new CircleStyle({
            radius: baseRadius,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({
              color: "rgba(255,255,255,0.8)",
              width: 2,
            }),
            className: "earthquake-animation",
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

    switch (Math.ceil(magnitude)) {
      case 3:
        fillColor = "yellow";
        break;
      case 4:
        fillColor = "rgb(255, 191, 0)";
        break;
      case 5:
        fillColor = "orange";
        break;
      case 6:
        fillColor = "rgb(255, 128, 0)";
        break;
      case 7:
        fillColor = "red";
        break;
      default:
        fillColor = "darkred";
    }

    return fillColor;
  };

  const getRadiusForMagnitude = (magnitude) => {
    const baseRadius = 5;
    const radiusMultiplier = magnitude / 3;
    const radius = baseRadius * radiusMultiplier;
    return radius;
  };

  return null;
};

export default MarkerComponent;
