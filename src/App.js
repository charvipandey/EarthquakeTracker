import React, { useState, useEffect } from "react";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import MapComponent from "./MapComponent";

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
      <HeaderComponent />
      <div id="content">
        <main>
          <MapComponent />
        </main>
      </div>
      {showFooter && <FooterComponent />}
    </div>
  );
}

export default App;
