/**
 * The MousePosition control layer displays the keypad of the mouse position on the map right below the mouse cursor
 * and (by default) in the bottom left corner of the map.
 *
 * Originally taken from https://www.airpressuretendency.net/fcsquad/squadmaps/
 *
 * @type {*|void}
 */
L.Control.MousePosition = L.Control.extend({
  options: {
    position: "bottomleft",
  },

  initialize(options) {
    L.Util.setOptions(this, options);
  },

  onAdd(map) {
    // register the listener
    map.on("mousemove", this.onMouseMove, this);

    // create the display for the map corner
    this.container = L.DomUtil.create("div", "leaflet-control-mouseposition");
    this.container.innerHTML = "";

    // get the display for below the mouse cursor (div needs to be defined in index.html)
    this.onMouseContainer = document.getElementById("mousecoord");
    this.onMouseContainer.innerHTML = "";

    return this.container;
  },

  onRemove(map) {
    // unregister the listener
    map.off("mousemove", this.onMouseMove);
  },

  onMouseMove(e) {
    let kp = Utils.getKP(e.latlng.lat, e.latlng.lng);

    // in debug mode we want to display the map coordinates instead of the keypad
    if (window.DEBUG) {
      kp = `${Utils.pad(Math.round(e.latlng.lat), 4)} | ${Utils.pad(Math.round(e.latlng.lng), 4)}`;
    }

    this.container.innerHTML = kp;
    this.onMouseContainer.innerHTML = kp;

    // move onMouseContainer to mouse cursor (with offset)
    this.onMouseContainer.style.left = `${e.originalEvent.pageX + 5}px`;
    this.onMouseContainer.style.top = `${e.originalEvent.pageY + 5}px`;
  },
});

L.control.mousePosition = options => new L.Control.MousePosition(options);