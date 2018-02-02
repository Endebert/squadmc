/**
 *  File: L.SimpleGraticule.js
 *  Desc: A graticule for Leaflet maps in the L.CRS.Simple coordinate system.
 *  Auth: Andrew Blakey (ablakey@gmail.com)
 */

/**
 * This Layergroup displays the grid in the same way it is displayed in-game.
 * SquadGrid was originally based on SimpleGraticule, but underwent massive changes.
 * See https://github.com/ablakey/Leaflet.SimpleGraticule for more information.
 *
 * @type {L.SquadGrid} - squadGrid layer object
 */
L.SquadGrid = L.LayerGroup.extend({

  l: log.getLogger("SquadGrid"),

  curMap: "",

  // grid line arrays for each (sub-)keypad
  kpLines: [],
  s1Lines: [],
  s2Lines: [],

  // keypad line styles
  lineStyleKP: {
    stroke: true,
    color: "#000",
    opacity: 0.5,
    weight: 2,
    interactive: false,
    clickable: false, // legacy support
  },

  lineStyleSUB1: {
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
    this.l.debug("initialize");

    L.LayerGroup.prototype.initialize.call(this);
    L.Util.setOptions(this, options);
  },

  onBaseLayerChange(e) {
    this.l.debug("onBaseLayerChange");
    this.curMap = e.name;
    // new map means new bounds, so we have to adjust/redraw the grid
    this.redraw();
    this.updateLineOpacity();
  },

  clearLines() {
    this.l.debug("clearLines");
    this.eachLayer(this.removeLayer, this);
  },

  onAdd(map) {
    this.l.debug("onAdd");

    this.map = map;
    // add listener for view change, so that we can show (sub-)keypads based on zoom level
    this.map.on("zoomend", this.updateLineOpacity, this);
    this.map.on("baselayerchange", this.onBaseLayerChange, this);

    this.redraw();
    this.updateLineOpacity();
  },

  onRemove(map) {
    this.l.debug("onRemove");

    // remove listener for view change
    map.off("zoomend", this.updateLineOpacity, this);
    this.clearLines();
  },

  /**
   * Sets opacity of subgrid lines based on zoom level.
   */
  updateLineOpacity() {
    const currentZoom = Math.round(this.map.getZoom());
    this.l.debug("updateLineOpacity with zoom:", currentZoom);

    if (currentZoom >= 4) {
      this.setLinesOpacity(this.s2Lines, this.lineStyleSUB2.opacity);
      this.setLinesOpacity(this.s1Lines, this.lineStyleSUB1.opacity);
    } else if (currentZoom >= 2) {
      this.setLinesOpacity(this.s2Lines, 0.0);
      this.setLinesOpacity(this.s1Lines, this.lineStyleSUB1.opacity);
    } else {
      this.setLinesOpacity(this.s2Lines, 0.0);
      this.setLinesOpacity(this.s1Lines, 0.0);
    }
  },

  /**
   * Updates the opacity for all lines in the lines array to the desired opacity value.
   * @param {Array} lines - array of lines to update
   * @param {Number} opacity - desired opacity value
   */
  setLinesOpacity(lines, opacity = 0.5) {
    // we check only the first object as we are updating all at the same time
    // and this one check might save us iterating through the whole array
    if (lines.length === 0 || lines[0].options.opacity === opacity) {
      // this.l.debug("nothing to do");
    } else {
      this.l.debug("setLinesOpacity:", [lines, opacity]);
      lines.forEach((l) => {
        l.setStyle({
          opacity,
        });
      });
    }
  },

  /**
   * Redraws the grid inside the current view bounds.
   */
  redraw() {
    const bounds = Utils.getMapBounds(this.curMap);
    this.l.debug("redraw:", bounds);
    // const bounds = this.map.options ? this.map.options.maxBounds : undefined;

    if (!bounds) {
      this.l.debug("no viewbounds, skipping draw");
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
    const startX = Math.ceil(bounds.getWest() / interval) * interval;
    const endX = Math.floor(bounds.getEast() / interval) * interval;

    for (let x = startX; x <= endX; x += interval) {
      const bot = new L.LatLng(bounds.getSouth(), x);
      const top = new L.LatLng(bounds.getNorth(), x);

      // checking which style to use for the current line
      // style is decided by whether or not current line is multiple of which (sub-) keypad interval
      // basically, main style if multiple of 300, sub1 style if multiple of 100, sub2 if multiple of 33
      // we use if-else so that we don't draw lines over each other
      if (Utils.isMultiple(kp, x)) {
        this.kpLines.push(new L.Polyline([bot, top], this.lineStyleKP));
      } else if (Utils.isMultiple(s1, x)) {
        this.s1Lines.push(new L.Polyline([bot, top], this.lineStyleSUB1));
      } else if (Utils.isMultiple(s2, x)) {
        this.s2Lines.push(new L.Polyline([bot, top], this.lineStyleSUB2));
      } else {
        this.l.warn(`no match! x = ${x}; x%:`, [x % kp, x % s1, x % s2]); // this should never happen
      }
    }

    // horizontal keypad lines, almost the same as for vertical lines
    const startY = Math.ceil(bounds.getSouth() / interval) * interval;
    const endY = Math.floor(bounds.getNorth() / interval) * interval;
    for (let y = startY; y <= endY; y += interval) {
      const left = new L.LatLng(y, bounds.getWest());
      const right = new L.LatLng(y, bounds.getEast());

      if (Utils.isMultiple(kp, y)) {
        this.kpLines.push(new L.Polyline([left, right], this.lineStyleKP));
      } else if (Utils.isMultiple(s1, y)) {
        this.s1Lines.push(new L.Polyline([left, right], this.lineStyleSUB1));
      } else if (Utils.isMultiple(s2, y)) {
        this.s2Lines.push(new L.Polyline([left, right], this.lineStyleSUB2));
      } else {
        this.l.warn(`no match! y = ${y}; y%:`, [y % kp, y % s1, y % s2]);
      }
    }

    this.kpLines.forEach(this.addLayer, this);
    this.s1Lines.forEach(this.addLayer, this);
    this.s2Lines.forEach(this.addLayer, this);
  },
});

L.squadGrid = options => new L.SquadGrid(options);
