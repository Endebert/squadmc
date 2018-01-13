/**
 *  File: L.SimpleGraticule.js
 *  Desc: A graticule for Leaflet maps in the L.CRS.Simple coordinate system.
 *  Auth: Andrew Blakey (ablakey@gmail.com)
 */
L.SquadGrid = L.LayerGroup.extend({
  options: {
    redraw: 'move',
    hidden: false,
    attribution: "Created by Robert Ende. Uses modified <a href='https://github.com/ablakey/Leaflet.SimpleGraticule'>SimpleGraticule</a> and calculation code from <a href='https://squadcalc.com'>squadcalc.com</a>",
  },

  lineStyleKP: {
    stroke: true,
    color: '#000',
    opacity: 1.0,
    weight: 1,
    interactive: false,
    clickable: false, // legacy support
  },

  lineStyleSUB: {
    stroke: true,
    color: '#000',
    opacity: 0.5,
    weight: 1,
    interactive: false,
    clickable: false, // legacy support
  },

  lineStyleSUB2: {
    stroke: true,
    color: '#fff',
    opacity: 0.5,
    weight: 1,
    interactive: false,
    clickable: false, // legacy support
  },

  initialize(options) {
    L.LayerGroup.prototype.initialize.call(this);
    L.Util.setOptions(this, options);
  },

  onAdd(map) {
    this.map = map;
    this.grid = this.redraw();

    map.on(`viewreset ${this.options.redraw}`, this.grid.redraw, this.grid);

    this.eachLayer(map.addLayer, map);
  },

  onRemove(map) {
    map.off(`viewreset ${this.options.redraw}`, this.grid.redraw, this.grid);
    this.eachLayer(map.removeLayer, map);
  },

  hide() {
    this.options.hidden = true;
    this.redraw();
  },

  show() {
    this.options.hidden = false;
    this.redraw();
  },

  redraw() {
    console.log('redrawing');
    this.bounds = this.map.getBounds();
    const viewBounds = this.viewBounds();

    this.clearLayers();
    const currentZoom = Math.round(this.map.getZoom());

    console.log('zoom:', this.map.getZoom());

    const kp = 300 / (3 ** 0);
    const s1 = 300 / (3 ** 1);
    const s2 = 300 / (3 ** 2);
    let interval;
    if (currentZoom >= 0) { interval = s2; } else if (currentZoom >= -1) { interval = s1; } else { interval = kp; }

    // vertical keypad lines
    for (let x = Math.ceil(viewBounds.getWest() / interval) * interval; x <= Math.floor(viewBounds.getEast() / interval) * interval; x += interval) {
      const bot = new L.LatLng(viewBounds.getSouth(), x);
      const top = new L.LatLng(viewBounds.getNorth(), x);

      // console.log("x %:", [Math.floor(x % kp), Math.floor(x % s1), Math.floor(x % s2)]);
      let curStyle;
      if (isMultiple(kp, x)) { curStyle = this.lineStyleKP; } else if (isMultiple(s1, x)) { curStyle = this.lineStyleSUB; } else if (isMultiple(s2, x)) { curStyle = this.lineStyleSUB2; } else {
        console.log(`no match! x = ${x}; x%:`, [x % kp, x % s1, x % s2]);
      }
      this.addLayer(new L.Polyline([bot, top], curStyle));
    }

    // horizontal keypad lines
    for (let y = Math.ceil(viewBounds.getSouth() / interval) * interval; y <= Math.floor(viewBounds.getNorth() / interval) * interval; y += interval) {
      const left = new L.LatLng(y, viewBounds.getWest());
      const right = new L.LatLng(y, viewBounds.getEast());

      let curStyle;
      if (isMultiple(kp, y)) { curStyle = this.lineStyleKP; } else if (isMultiple(s1, y)) { curStyle = this.lineStyleSUB; } else if (isMultiple(s2, y)) { curStyle = this.lineStyleSUB2; } else {
        console.log(`no match! y = ${y}; y%:`, [y % kp, y % s1, y % s2]);
      }
      this.addLayer(new L.Polyline([left, right], curStyle));
    }

    return this;
  },

  viewBounds() {
    const c1 = L.latLng(Math.max(this.bounds.getSouth(), this.map.options.maxBounds ? this.map.options.maxBounds.getSouth() : 0), Math.max(this.bounds.getWest(), this.map.options.maxBounds ? this.map.options.maxBounds.getWest() : 0));
    const c2 = L.latLng(Math.min(this.bounds.getNorth(), this.map.options.maxBounds ? this.map.options.maxBounds.getNorth() : 10000), Math.min(this.bounds.getEast(), this.map.options.maxBounds ? this.map.options.maxBounds.getEast() : 10000));
    return L.latLngBounds(c1, c2);
  },
});

L.squadGrid = function (options) {
  return new L.SquadGrid(options);
};
