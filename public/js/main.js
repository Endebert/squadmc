/**
 * This is the page logic. It sets up the map and its layers.
 */

const main = () => {
  this.l = Logger.get("main");

  // setting up map
  const map = L.map("map", {
    crs: L.CRS.SimpleTopLeft,
    minZoom: -2,
    maxZoom: 2,
    attributionControl: true,
    layers: [],
    zoomSnap: 0,
  });

  const grid = L.squadGrid();
  grid.addTo(map); // display it by defaults

  const locations = L.locations();
  locations.addTo(map); // display it by default

  // adding grid and locations to list of selectable layers
  const overlayMaps = {
    "Keypad grid": grid,
    "Location markers": locations,
  };

  // lets you select the map and whether or not to display grid/locations
  const layerControl = L.control.layers(MAPDATA.maps, overlayMaps);
  layerControl.addTo(map);

  // shows map scale on bottom right
  const scaleControl = L.control.scale({
    maxWidth: 300, metric: true, imperial: false, position: "bottomright",
  });
  scaleControl.addTo(map);

  // show keypad of cursor position on map
  const mouseControl = L.control.mousePosition();
  mouseControl.addTo(map);

  // the most important part, the mortar layer
  const mortarLayer = L.mortar();
  mortarLayer.addTo(map);

  // a few buttons
  const githubBtn = L.easyButton({
    states: [{
      icon: "fab fa-github",
      title: "View the code on GitHub",
      onClick() {
        window.open("https://github.com/Endebert/squadmc");
      },
    }],
  });

  githubBtn.addTo(map);

  const debugBtn = L.easyButton({
    states: [{
      stateName: "on",
      icon: "fa-bug",
      title: "Disable DEBUG mode",
      onClick(btn) {
        window.setOrToggleDebugMode(false);
        btn.state("off");
        const popup = L.popup()
          .setLatLng(map.getBounds().getCenter())
          .setContent("<p>Debug mode OFF</p>")
          .openOn(map);

        setTimeout(() => {
          map.closePopup(popup);
        }, 2500);
      },
    }, {
      icon: "fa-bug disabled",
      stateName: "off",
      onClick(btn) {
        window.setOrToggleDebugMode(true);
        btn.state("on");

        const popup = L.popup()
          .setLatLng(map.getBounds().getCenter())
          .setContent("<p>Debug mode ON</p>")
          .openOn(map);

        setTimeout(() => {
          map.closePopup(popup);
        }, 2500);
      },
      title: "Enable DEBUG mode",
    }],
  });

  if (window.DEBUG) { debugBtn.state("on"); } else { debugBtn.state("off"); }
  debugBtn.addTo(map);

  /**
   * resets the view based on displayed map
   * @param bounds - bounds of map
   */
  const setBounds = (bounds) => {
    map.setMaxBounds(bounds);
    map.fitBounds(bounds);
  };

  /**
   * Handles baselayerchange event
   * @param e - baselayerchange event object
   */
  const onBaseLayerChange = (e) => {
    // closes layerControl (otherwise annoying on mobile)
    layerControl.collapse();

    // update map name in top ribbon
    document.getElementById("mapName").innerText = e.name;

    setBounds(e.layer.getBounds(), e.name);
    localStorage.setItem("lastLayer", e.name); // save layer name that is displayed
  };

  map.on("baselayerchange", onBaseLayerChange);

  // display last selected layer if page was used before
  const m = localStorage.getItem("lastLayer") || Object.keys(MAPDATA.maps)[0];

  // try to show the complete map, but reInit will be run anyway
  map.setView(MAPDATA.maps[m].getBounds().getCenter(), -3);
  map.addLayer(MAPDATA.maps[m]); // finally add the map overlay
};

main();
