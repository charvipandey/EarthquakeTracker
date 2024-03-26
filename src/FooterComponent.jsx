import React from "react";

const FooterComponent = () => {
  return (
    <footer id="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="column">
            <h3>Connect</h3>
            <ul className="social-links">
              <li>
                <a href="https://github.com/charvipandey">GitHub</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/charvipandey/">LinkedIn</a>
              </li>
            </ul>
          </div>
          <div className="column">
            <h3>Project Links</h3>
            <ul className="social-links">
              <li>
                <a href="https://codesandbox.io/p/github/charvipandey/testol/main">
                  Sandbox
                </a>
              </li>
              <li>
                <a href="https://github.com/charvipandey/testol">
                  Github Repository
                </a>
              </li>
            </ul>
          </div>
          <div className="column">
            <h3>Educational Resources</h3>
            <ul className="educational-links">
              <li>
                <a href="https://www.livescience.com/planet-earth/earthquakes">
                  LiveScience - Earthquakes
                </a>
              </li>
              <li>
                <a href="https://ndma.gov.in/Natural-Hazards/Earthquakes/Dos-Donts">
                  NDMA - Earthquake Safety
                </a>
              </li>
              <li>
                <a href="https://scienceexchange.caltech.edu/topics/earthquakes/what-causes-earthquakes">
                  Caltech - What Causes Earthquakes
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
