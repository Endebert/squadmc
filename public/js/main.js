/**
 * This is the page logic. It sets up the map and its layers.
 */

(() => {
  this.l = log.getLogger("main");

  // setting up map
  const map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 5,
    attributionControl: true,
    layers: [],
    // zoomSnap: 0, // not needed for new scaling with tile layers
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

  // prepare map list for layer control
  const maps = {};
  Object.entries(MAPDATA).forEach(([mapName, props]) => {
    maps[mapName] = props.map;

    // check for heightmaps and add them as an overlay option
    if (props.heightmap) {
      overlayMaps[`${mapName} Heightmap`] = L.imageOverlay(props.heightmap.url, props.map.options.bounds);
    }
  });

  // lets you select the map and whether or not to display grid/locations
  const layerControl = L.control.layers(maps, overlayMaps);
  layerControl.addTo(map);

  // shows map scale on bottom right
  const scaleControl = L.control.scale({
    maxWidth: 300, metric: true, imperial: false, position: "bottomright",
  });
  scaleControl.addTo(map);

  // show keypad of cursor position on map
  const mouseControl = L.control.mousePosition();
  mouseControl.addTo(map);

  const mortarDeleteBtn = L.easyButton({
    position: "topright",
    states: [{
      stateName: "on",
      icon: "<img class='bigbtnicon' src='images/mortar_remove.png'>",
      title: "Remove mortar marker",
    }],
  });

  mortarDeleteBtn.button.style.width = "44px";
  mortarDeleteBtn.button.style.height = "44px";
  // default state is disabled
  mortarDeleteBtn.disable();

  mortarDeleteBtn.addTo(map);

  const targetDeleteBtn = L.easyButton({
    position: "topright",
    states: [{
      stateName: "on",
      icon: "<img class='bigbtnicon' src='images/target_remove.png'>",
      title: "Remove target marker",
    }],
  });

  targetDeleteBtn.button.style.width = "44px";
  targetDeleteBtn.button.style.height = "44px";
  // default state is disabled
  targetDeleteBtn.disable();

  targetDeleteBtn.addTo(map);

  // the most important part, the mortar layer
  const mortarLayer = L.mortar({
    mortarPosElement: document.getElementById("mortarPos"),
    targetPosElement: document.getElementById("targetPos"),
    mortarDeleteBtn,
    targetDeleteBtn,
    mousePosition: mouseControl,
  });
  mortarLayer.addTo(map);

  // a few buttons
  const githubBtn = L.easyButton({
    states: [{
      icon: "<img class='icon' src='svg/github.svg'>",
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
      icon: "<img class='icon bug' src='svg/bug.svg'>",
      title: "Debug mode is on",
      onClick(btn) {
        Utils.setDebugMode(false);
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
      icon: "<img class='icon disabled' src='svg/bug.svg'>",
      stateName: "off",
      onClick(btn) {
        Utils.setDebugMode(true);
        btn.state("on");

        const popup = L.popup()
          .setLatLng(map.getBounds().getCenter())
          .setContent("<p>Debug mode ON</p>")
          .openOn(map);

        setTimeout(() => {
          map.closePopup(popup);
        }, 2500);
      },
      title: "Debug mode is off",
    }],
  });

  if (Utils.isDebug()) {
    debugBtn.state("on");
  } else {
    debugBtn.state("off");
  }
  debugBtn.addTo(map);

  /**
   * resets the view based on displayed map
   * @param bounds - bounds of map
   */
  const setBounds = (bounds) => {
    this.l.debug("setBounds:", bounds);
    this.l.debug("test:", bounds.getNorthEast());
    map.setMaxBounds(bounds.getNorthEast());
    map.fitBounds(bounds);
  };

  /**
   * Updates the CRS scaling factor based on the map that is laoded. Uses some black magic so it works properly.
   * @param {string} mapName - name of loaded map
   */
  function updateCRS(mapName) {
    const bounds = Utils.getMapBounds(mapName);
    const x = 256 / bounds.getNorth();
    const y = 256 / bounds.getEast();
    map.options.crs.transformation = L.transformation(x, 0, y, 0);

    // manually invoke resetting view so we don't get tile loading errors
    // eslint-disable-next-line no-underscore-dangle
    map._resetView(map.getCenter(), map.getZoom());
  }

  /**
   * Handles baselayerchange event
   * @param e - baselayerchange event object
   */
  const onBaseLayerChange = (e) => {
    this.l.debug("onBaseLayerChange");
    // closes layerControl (otherwise annoying on mobile)
    layerControl.collapse();

    // update map name in top ribbon
    document.getElementById("mapName").innerText = e.name;

    this.l.debug("related MAPDATA:", MAPDATA[e.name]);
    updateCRS(e.name);
    setBounds(Utils.getMapBounds(e.name));
    localStorage.setItem("lastLayer", e.name); // save layer name that is displayed
  };

  map.on("baselayerchange", onBaseLayerChange);

  // display last selected layer if page was used before
  const m = localStorage.getItem("lastLayer") || Object.keys(MAPDATA)[0];
  // try to show the complete map, but reInit will be run anyway
  map.setView(Utils.getMapBounds(m).getCenter(), 0);
  map.addLayer(MAPDATA[m].map); // finally add the map overlay

  this.l.info("SquadMC Main code executed successfully!");
})();
