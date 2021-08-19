import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const Map = () => {
  const MapEl = useRef(null);

  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/SceneLayer",
      "esri/widgets/Daylight",
    ]).then(([Map, SceneView, SceneLayer, Daylight]) => {
      const map = new Map({
        basemap: "satellite",
        ground: "world-elevation",
        layers: [
          new SceneLayer({
            portalItem: {
              id: "b343e14455fe45b98a2c20ebbceec0b0",
            },
          }),
        ],
      });

      const view = new SceneView({
        map: map,
        container: "viewDiv",

        // position in Brest, France
        camera: {
          position: [-4.49292254, 48.38118005, 29.41383],
          heading: 250.18,
          tilt: 87.91,
        },
        qualityProfile: "high",
        environment: {
          atmosphere: {
            // creates a realistic view of the atmosphere
            quality: "high",
          },
          lighting: {
            // gets the current date at the user's location
            // and converts it to the local date in Brest, France
            date: new Date(),
            directShadowsEnabled: true,
          },
        },
        ui: {
          components: ["attribution"],
        },
      });

      /**************************************
       * Initialize the daylight widget
       **************************************/

      const daylightWidget = new Daylight({
        view: view,
        // plays the animation twice as fast than the default one
        playSpeedMultiplier: 2,
        // disable the timezone selection button
        visibleElements: {
          timezone: false,
        },
      });

      const btnDaylight = document.getElementById("buttonDaylight");

      view.ui.add(btnDaylight, "top-right");
      view.ui.add(daylightWidget, "top-right");

      // hide and show widget for display on small devices
      let widgetIsVisible = true;
      btnDaylight.addEventListener("click", () => {
        if (widgetIsVisible) {
          view.ui.remove(daylightWidget);
          widgetIsVisible = false;
        } else {
          view.ui.add(daylightWidget, "top-right");
          widgetIsVisible = true;
        }
      });
    });
  }, []);

  return (
    <>
      <div id="viewDiv" style={{ height: "100vh", width: "100vw" }} ref={MapEl}>
        <button id="buttonDaylight" class="esri-widget esri-widget--button">
          <span class="esri-icon-lightbulb"></span>
        </button>
      </div>
    </>
  );
};

export default Map;
