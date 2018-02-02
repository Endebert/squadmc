/**
 * This Layergroup holds all location markers for the current map.
 * Automatically loads correct location markers on map layer change.
 *
 * @type {L.Locations} - locations layer
 */
L.Locations = L.LayerGroup.extend({

  l: log.getLogger("Locations"),

  initialize(options = {}) {
    L.LayerGroup.prototype.initialize.call(this); // don't know why, but this is important
    L.Util.setOptions(this, options);
  },

  onAdd(map) {
    this.map = map;
    this.map.on("baselayerchange", this.onBaseLayerChange, this);

    // try to restore locations of (hopefully current) layer
    if (this.latestLayer) {
      this.setLocations(this.latestLayer);
    }
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
  setLocations(mapName) {
    // save latest layer so that when location layer gets hidden and readded, it knows which locations to load
    this.latestLayer = mapName;
    // clear old markers first
    this.reset();

    try {
      const mapFlags = Utils.getMapLocations(mapName);
      Object.values(mapFlags).forEach((flag) => {
        this.addLayer(flag);
      });
    } catch (e) {
      this.l.warn(`loading locations of ${mapName} failed:`, e);
    }
  },

  onBaseLayerChange(e) {
    this.setLocations(e.name);
  },

});

L.locations = options => new L.Locations(options);
