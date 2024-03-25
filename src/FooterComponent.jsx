import React from "react";

const FooterComponent = () => {
  return (
    <footer id="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="connect">
            <h3>Connect</h3>
            <ul className="social-links">
              <li>
                <a href="https://github.com/charvipandey">GitHub</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/charvipandey/">LinkedIn</a>
              </li>
              <li>
                <a href="https://codesandbox.io/p/github/charvipandey/testol/main">
                  Sandbox
                </a>
              </li>
            </ul>
          </div>
          <div className="developed-by">
            <p>Developed by Charvi Pandey</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
