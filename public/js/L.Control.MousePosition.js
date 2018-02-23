/**
 * The MousePosition control layer displays the keypad of the mouse position on the map right below the mouse cursor
 * and (by default) in the bottom left corner of the map.
 *
 * Originally taken from https://www.airpressuretendency.net/fcsquad/squadmaps/
 *
 * @type {L.Control.MousePosition} - mouse position control layer
 */
L.Control.MousePosition = L.Control.extend({
  options: {
    position: "bottomleft",
    enabled: true,
  },

  l: log.getLogger("MousePosition"),
  moveTimeout: undefined,

  initialize(options) {
    L.Util.setOptions(this, options);
  },

  onAdd(map) {
    // register the listener
    map.on("mousemove", this.onMouseMove, this);
    this.map = map;

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

  setPosition(lat, lng) {
    // if (this.l.getLevel() <= log.levels.DEBUG) {
    //   this.l.debug("setPosition:", [lat, lng]);
    // }

    let kp = Utils.getKP(lat, lng);

    // in debug mode we want to display the map coordinates instead of the keypad
    if (Utils.isDebug()) {
      kp = `${Utils.pad(Math.round(lat), 4)} | ${Utils.pad(Math.round(lng), 4)}`;
    }

    this.container.innerHTML = kp;
    this.onMouseContainer.innerHTML = kp;

    // move onMouseContainer to mouse cursor (with offset)
    this.onMouseContainer.style.opacity = "1.0";

    const point = this.map.latLngToContainerPoint([lat, lng]);
    this.onMouseContainer.style.left = `${point.x - (this.onMouseContainer.offsetWidth / 2)}px`;
    this.onMouseContainer.style.top = `${point.y - this.onMouseContainer.offsetHeight - 12}px`;

    // hide container after 1 second (fix for mobile)
    if (this.moveTimeout) {
      clearTimeout(this.moveTimeout);
    }

    this.moveTimeout = setTimeout(() => {
      this.onMouseContainer.style.opacity = "0.0";
    }, 1000);
  },
  onMouseMove(e) {
    if (this.options.enabled) {
      this.setPosition(e.latlng.lat, e.latlng.lng);
    }

    // this.l.debug("onMouseMove",e);
  },

  setEnabled(enabled = true) {
    this.l.debug("setEnabled:", enabled);
    this.options.enabled = enabled;
  },

});

L.control.mousePosition = options => new L.Control.MousePosition(options);
