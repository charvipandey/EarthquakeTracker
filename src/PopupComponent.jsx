import React, { useEffect, useState } from "react";
import Overlay from "ol/Overlay";

const PopupComponent = ({ map }) => {
  const [overlay, setOverlay] = useState(null);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
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
  }, []);

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
          const formattedTime = formatDate(new Date(properties.time));
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
          overlay.setPosition(undefined);
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
