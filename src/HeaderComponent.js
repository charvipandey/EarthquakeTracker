// HeaderComponent.jsx
import React from "react";

const HeaderComponent = () => {
  return (
    <header id="header">
      <h1 className="title">Real-Time Earthquake Data</h1>
      <p className="subtitle">
        Real-time seismic activity monitoring and Earthquake tracking, an
        interactive map that fetches data from the USGS API and visualizes the
        map using OpenLayers.
      </p>
    </header>
  );
};

export default HeaderComponent;
