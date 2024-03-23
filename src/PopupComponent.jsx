import React, { useEffect, useState } from "react";
import Overlay from "ol/Overlay";

const PopupComponent = ({ map }) => {
  const [overlay, setOverlay] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    const newOverlay = new Overlay({
      element: document.createElement("div"),
      autoPan: true,
      autoPanAnimation: {
        duration: 0,
      },
    });
    map.addOverlay(newOverlay);
    setOverlay(newOverlay);

    return () => {
      if (overlay) {
        map.removeOverlay(overlay);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    if (!overlay) return;

    const handlePointerMove = (event) => {
      if (!map.getView().getAnimating()) {
        const pixel = map.getEventPixel(event.originalEvent);
        const feature = map.forEachFeatureAtPixel(pixel, (feature) => {
          return feature;
        });
        if (feature) {
          const coordinates = feature.getGeometry().getCoordinates();
          const properties = feature.getProperties();
          const formattedTime = formatDate(properties.time);
          const popupContent = `
            <div class="popup-content">
              <h4>Earthquake Information</h4>
              <p><strong>Location:</strong> ${properties.place}</p>
              <p><strong>Time:</strong> ${formattedTime}</p>
              <p><strong>Magnitude:</strong> ${properties.mag}</p>
            </div>
          `;
          overlay.getElement().innerHTML = popupContent;
          overlay.setPosition(coordinates);
        } else {
          overlay.setPosition(undefined); // Clear overlay position if not over a marker
        }
      }
    };

    map.on("pointermove", handlePointerMove);

    return () => {
      map.un("pointermove", handlePointerMove);
    };
  }, [map, overlay]);

  return null;
};

export default PopupComponent;
