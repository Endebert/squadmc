L.Flags = L.LayerGroup.extend({
  options: {
    attribution: 'Created by Robert Ende. Uses modified ' +
    "<a href='https://github.com/ablakey/Leaflet.SimpleGraticule'>SimpleGraticule</a> " +
    "and calculation code from <a href='https://squadcalc.com'>squadcalc.com</a>",
    hidden: false,
  },

  initialize(options) {
    L.LayerGroup.prototype.initialize.call(this);
    L.Util.setOptions(this, options);

    this.fo = {}; // flag objects
    this.fo['Al Basrah'] = [
      createLocation('Village', [2000, 760]),
      createLocation('US Airfield', [770, 1070]),
      createLocation('US Checkpoint', [1550, 1530]),
      createLocation('Outskirts', [2050, 1600]),
      createLocation('Refinery', [1939, 2070]),
      createLocation('Mosque', [2107, 1882]),
      createLocation('Oasis', [2448, 1575]),
      createLocation('Suburbs', [2307, 1941]),
      createLocation('Alleys', [2238, 2243]),
      createLocation('Fringe', [2713, 1541]),
      createLocation('Estates', [2705, 2087]),
    ];

    this.fo['Chora Valley'] = [
      createLocation('Russia Main', [2730, 600]),
      createLocation('Monolith', [2345, 850]),
      createLocation('SW Nursery', [2529, 1213]),
      createLocation('Orchard', [1835, 1428]),
      createLocation('Radio Station', [2224, 1898]),
      createLocation('Hemp Farm', [1755, 2148]),
      createLocation('Gas Station', [1817, 2511]),
      createLocation('US Main', [1795, 2905]),
    ];
  },

  onAdd(map) {
    this.map = map;
    // this.map.on('click', this.onMapClick, this);
    this.map.on('baselayerchange', this.onBaseLayerChange, this);

    // this.eachLayer(map.addLayer, map);
  },

  onRemove() {
    this.reset();
  },

  reset() {
    this.eachLayer((layer) => {
      this.removeLayer(layer);
    });
  },

  setMapFlags(mapName) {
    this.reset();
    try {
      let mapFlags = this.fo[mapName];
      for (const f in mapFlags) {
        if (mapFlags.hasOwnProperty(f)) {
          // console.log('f:', mapFlags[f]);
          mapFlags[f].addTo(this);
        } else {
          console.warn("setMapFlags iteration failed hasOwnProperty check:", [mapFlags, f]);
        }
      }
    } catch (e) {
      console.log('reIniting flagMarkers failed:', e);
    }
  },

  onBaseLayerChange(e) {
    this.setMapFlags(e.name);
  }

});

L.flags = function (options) {
  return new L.Flags(options);
};