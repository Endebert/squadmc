/**
 * This Layergroup holds all location markers for the current map.
 * Automatically loads correct location markers on map layer change.
 *
 * @type {*|void}
 */
L.Locations = L.LayerGroup.extend({
  options: {
    locations: undefined,
  },

  initialize(options = {}) {
    L.LayerGroup.prototype.initialize.call(this); // don't know why, but this is important
    L.Util.setOptions(this, options);

    this.locations = options.locations || MAPDATA.locations;
  },

  onAdd(map) {
    this.map = map;
    this.map.on("baselayerchange", this.onBaseLayerChange, this);
  },

  onRemove() {
    this.reset();
  },

  /**
   * Removes every loaded location marker
   */
  reset() {
    this.eachLayer((layer) => {
      this.removeLayer(layer);
    });
  },

  /**
   * Set location markers based on map name. Clears old markers before adding new ones.
   *
   * @param mapName - map name that matches one of the keys in MAPDATA.maps
   */
  setMapFlags(mapName) {
    // clear old markers first
    this.reset();

    try {
      const mapFlags = this.locations[mapName];
      Object.values(mapFlags).forEach((flag) => {
        this.addLayer(flag);
      });
    } catch (e) {
      console.warn(`loading locations of ${mapName} failed:`, e);
    }
  },

  onBaseLayerChange(e) {
    this.setMapFlags(e.name);
  },

});

L.locations = options => new L.Locations(options);
