import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import "./App.css";

function App() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (scrolled > 0) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <header id="header">
        <h1>Real-Time Earthquake Data</h1>
        <p>
          Real-time seismic activity monitoring and Earthquake tracking,
          aninteractive map that fetches data from the USGS API.
        </p>
      </header>
      <main>
        <MapComponent />
      </main>
      {showFooter && (
        <div id="footer-container">
          <footer id="footer">
            <div className="footer-container">
              <div className="footer-section">
                <h3>Connect</h3>
                <ul>
                  <li>
                    <a href="https://github.com/charvipandey">GitHub</a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/charvipandey/">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href="https://codesandbox.io/p/github/charvipandey/testol/main">
                      Sandbox
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <div className="footer-disclaimer">
                <p>Developed by Charvi Pandey</p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
