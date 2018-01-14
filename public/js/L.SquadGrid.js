/**
 *  File: L.SimpleGraticule.js
 *  Desc: A graticule for Leaflet maps in the L.CRS.Simple coordinate system.
 *  Auth: Andrew Blakey (ablakey@gmail.com)
 */

/**
 * This Layergroup displays the grid in the same way it is displayed in-game.
 * SquadGrid was originally based on SimpleGraticule, but underwent massive changes.
 * See https://github.com/ablakey/Leaflet.SimpleGraticule for more information.
 * @type {*|void}
 */
L.SquadGrid = L.LayerGroup.extend({
  options: {
    redraw: "move",
    attribution: "SquadGrid originally based on " +
    "<a href='https://github.com/ablakey/Leaflet.SimpleGraticule'>SimpleGraticule</a>",
  },

  // keypad line styles
  lineStyleKP: {
    stroke: true,
    color: "#000",
    opacity: 1.0,
    weight: 1,
    interactive: false,
    clickable: false, // legacy support
  },

  lineStyleSUB: {
    stroke: true,
    color: "#000",
    opacity: 0.5,
    weight: 1,
    interactive: false,
    clickable: false, // legacy support
  },

  lineStyleSUB2: {
    stroke: true,
    color: "#fff",
    opacity: 0.5,
    weight: 1,
    interactive: false,
    clickable: false, // legacy support
  },

  initialize(options) {
    L.LayerGroup.prototype.initialize.call(this);
    L.Util.setOptions(this, options);

    this.draw = -1; // this variable is used later for optimizing draw calls
  },

  onAdd(map) {
    this.map = map;
    // add listener for view change
    this.map.on(`viewreset ${this.options.redraw}`, this.redrawAsync, this);
    this.redrawAsync();
  },

  onRemove(map) {
    // remove listener for view change
    map.off(`viewreset ${this.options.redraw}`, this.redrawAsync, this);
    this.eachLayer(map.removeLayer, map);
    this.redrawAsync();
  },

  /**
   * Redraws the grid after a 50ms timeout. Resets timer for already pending redraw request.
   */
  redrawAsync() {
    // if a redraw is already waiting for the timeout to pass, we cancel it
    if (this.draw >= 0) {
      clearTimeout(this.draw);
    }

    this.draw = setTimeout(() => {
      this.redraw();
    }, 50);
  },

  /**
   * Redraws the grid inside the current view bounds.
   */
  redraw() {
    this.bounds = this.map.getBounds();
    const viewBounds = this.viewBounds();

    // clear old grid lines
    this.clearLayers();

    const currentZoom = Math.round(this.map.getZoom());

    const kp = 300 / (3 ** 0);
    const s1 = 300 / (3 ** 1);
    const s2 = 300 / (3 ** 2);
    let interval;
    if (currentZoom >= 0) {
      interval = s2;
    } else if (currentZoom >= -1) {
      interval = s1;
    } else {
      interval = kp;
    }

    // vertical keypad lines
    // doing some magic against floating point imprecision
    const startX = Math.ceil(viewBounds.getWest() / interval) * interval;
    const endX = Math.floor(viewBounds.getEast() / interval) * interval;

    for (let x = startX; x <= endX; x += interval) {
      const bot = new L.LatLng(viewBounds.getSouth(), x);
      const top = new L.LatLng(viewBounds.getNorth(), x);

      let curStyle;
      // checking which style to use for the current line
      // style is decided by whether or not current line is multiple of which (sub-) keypad interval
      // basically, main style if multiple of 300, sub1 style if multiple of 100, sub2 if multiple of 33
      // we use if-else so that we don't draw lines over each other
      if (Utils.isMultiple(kp, x)) {
        curStyle = this.lineStyleKP;
      } else if (Utils.isMultiple(s1, x)) {
        curStyle = this.lineStyleSUB;
      } else if (Utils.isMultiple(s2, x)) {
        curStyle = this.lineStyleSUB2;
      } else {
        console.warn(`no match! x = ${x}; x%:`, [x % kp, x % s1, x % s2]); // this should never happen
      }
      this.addLayer(new L.Polyline([bot, top], curStyle));
    }

    // horizontal keypad lines, almost the same as for vertical lines
    const startY = Math.ceil(viewBounds.getSouth() / interval) * interval;
    const endY = Math.floor(viewBounds.getNorth() / interval) * interval;
    for (let y = startY; y <= endY; y += interval) {
      const left = new L.LatLng(y, viewBounds.getWest());
      const right = new L.LatLng(y, viewBounds.getEast());

      let curStyle;
      if (Utils.isMultiple(kp, y)) {
        curStyle = this.lineStyleKP;
      } else if (Utils.isMultiple(s1, y)) {
        curStyle = this.lineStyleSUB;
      } else if (Utils.isMultiple(s2, y)) {
        curStyle = this.lineStyleSUB2;
      } else {
        console.log(`no match! y = ${y}; y%:`, [y % kp, y % s1, y % s2]);
      }
      this.addLayer(new L.Polyline([left, right], curStyle));
    }
  },

  /**
   * Returns view bounds based on map bounds, so that grid is not drawn across map borders
   * @returns {L.LatLng} - view bounds
   */
  viewBounds() {
    const maxBounds = this.map.options.maxBounds;

    // some clamping going on here
    const c1 = L.latLng(
      Math.max(this.bounds.getSouth(), maxBounds ? maxBounds.getSouth() : 0),
      Math.max(this.bounds.getWest(), maxBounds ? maxBounds.getWest() : 0),
    );
    const c2 = L.latLng(
      Math.min(this.bounds.getNorth(), maxBounds ? maxBounds.getNorth() : 10000),
      Math.min(this.bounds.getEast(), maxBounds ? maxBounds.getEast() : 10000),
    );
    return L.latLngBounds(c1, c2);
  },
});

L.squadGrid = options => new L.SquadGrid(options);
