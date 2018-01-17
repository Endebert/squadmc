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
    this.clearLines();
  },

  onBaseLayerChange() {
    this.clearLines();
    this.redraw();
  },

  clearLines() {
    this.eachLayer(this.removeLayer, this);
    this.kpLines = [];
    this.s1Lines = [];
    this.s2Lines = [];
  },

  onAdd(map) {
    this.map = map;
    // add listener for view change
    this.map.on(`viewreset ${this.options.redraw}`, this.updateLineOpacity, this);
    this.map.on("baselayerchange", this.onBaseLayerChange, this);

    this.redraw();
    this.updateLineOpacity();
  },

  onRemove(map) {
    // remove listener for view change
    map.off(`viewreset ${this.options.redraw}`, this.updateLineOpacity, this);
    this.clearLines();
  },

  /**
   * Sets opacity of subgrid lines based on zoom level.
   */
  updateLineOpacity() {
    // first check if there are lines to process
    if (this.s2Lines.length === 0) {
      return;
    }

    const currentZoom = Math.round(this.map.getZoom());

    if (currentZoom >= 0) {
      // we check only the first object as we are updating all at the same time
      // and this one check might save us iterating through the whole array
      if (this.s2Lines[0].options.opacity !== this.lineStyleSUB2.opacity) {
        this.s2Lines.forEach((l) => {
          l.setStyle({
            opacity: this.lineStyleSUB2.opacity,
          });
        });
      }
      if (this.s1Lines[0].options.opacity !== this.lineStyleSUB.opacity) {
        this.s1Lines.forEach((l) => {
          l.setStyle({
            opacity: this.lineStyleSUB.opacity,
          });
        });
      }
    } else if (currentZoom >= -1) {
      if (this.s2Lines[0].options.opacity !== 0.0) {
        this.s2Lines.forEach((l) => {
          l.setStyle({
            opacity: 0.0,
          });
        });
      }
      if (this.s1Lines[0].options.opacity !== this.lineStyleSUB.opacity) {
        this.s1Lines.forEach((l) => {
          l.setStyle({
            opacity: this.lineStyleSUB.opacity,
          });
        });
      }
    } else {
      if (this.s2Lines[0].options.opacity !== 0.0) {
        this.s2Lines.forEach((l) => {
          l.setStyle({
            opacity: 0.0,
          });
        });
      }
      if (this.s1Lines[0].options.opacity !== 0.0) {
        this.s1Lines.forEach((l) => {
          l.setStyle({
            opacity: 0.0,
          });
        });
      }
    }
  },

  /**
   * Redraws the grid inside the current view bounds.
   */
  redraw() {
    const viewBounds = this.map.options ? this.map.options.maxBounds : undefined;

    if (!viewBounds) {
      return;
    }
    // clear old grid lines
    this.clearLines();

    const kp = 300 / (3 ** 0);
    const s1 = 300 / (3 ** 1);
    const s2 = 300 / (3 ** 2);

    // for complete grid drawing we take lowest interval, as we want to draw all lines
    // whether or not they will be seen is dependant on another function setting opacity based on zoom level
    const interval = s2;

    // clearing arrays
    this.kpLines = [];
    this.s1Lines = [];
    this.s2Lines = [];

    // vertical keypad lines
    // doing some magic against floating point imprecision
    const startX = Math.ceil(viewBounds.getWest() / interval) * interval;
    const endX = Math.floor(viewBounds.getEast() / interval) * interval;

    for (let x = startX; x <= endX; x += interval) {
      const bot = new L.LatLng(viewBounds.getSouth(), x);
      const top = new L.LatLng(viewBounds.getNorth(), x);

      // checking which style to use for the current line
      // style is decided by whether or not current line is multiple of which (sub-) keypad interval
      // basically, main style if multiple of 300, sub1 style if multiple of 100, sub2 if multiple of 33
      // we use if-else so that we don't draw lines over each other
      if (Utils.isMultiple(kp, x)) {
        this.kpLines.push(new L.Polyline([bot, top], this.lineStyleKP));
      } else if (Utils.isMultiple(s1, x)) {
        this.s1Lines.push(new L.Polyline([bot, top], this.lineStyleSUB));
      } else if (Utils.isMultiple(s2, x)) {
        this.s2Lines.push(new L.Polyline([bot, top], this.lineStyleSUB2));
      } else {
        console.warn(`no match! x = ${x}; x%:`, [x % kp, x % s1, x % s2]); // this should never happen
      }
    }

    // horizontal keypad lines, almost the same as for vertical lines
    const startY = Math.ceil(viewBounds.getSouth() / interval) * interval;
    const endY = Math.floor(viewBounds.getNorth() / interval) * interval;
    for (let y = startY; y <= endY; y += interval) {
      const left = new L.LatLng(y, viewBounds.getWest());
      const right = new L.LatLng(y, viewBounds.getEast());

      if (Utils.isMultiple(kp, y)) {
        this.kpLines.push(new L.Polyline([left, right], this.lineStyleKP));
      } else if (Utils.isMultiple(s1, y)) {
        this.s1Lines.push(new L.Polyline([left, right], this.lineStyleSUB));
      } else if (Utils.isMultiple(s2, y)) {
        this.s2Lines.push(new L.Polyline([left, right], this.lineStyleSUB2));
      } else {
        console.warn(`no match! y = ${y}; y%:`, [y % kp, y % s1, y % s2]);
      }
    }

    this.kpLines.forEach(this.addLayer, this);
    this.s1Lines.forEach(this.addLayer, this);
    this.s2Lines.forEach(this.addLayer, this);
  },
});

L.squadGrid = options => new L.SquadGrid(options);
