import { LayerGroup, Util } from "leaflet";

/**
 * This Layergroup holds all location markers for the current map.
 * Automatically loads correct location markers on map layer change.
 *
 * @type {LayerGroup} - locations layer
 */
export default LayerGroup.extend({

  initialize(options = {}) {
    console.log("initialize:", options);
    LayerGroup.prototype.initialize.call(this); // don't know why, but this is important
    Util.setOptions(this, options);
  },

  onAdd() {
    console.log("onAdd");
    console.log("locations:", this.locations);
    // try to restore locations of (hopefully current) layer
    if (this.locations) {
      this.showLocations();
    }
  },

  onRemove() {
    console.log("onRemove");

    this.hideLocations();
  },

  /**
   * Add locations to its layer
   */
  showLocations() {
    console.log("showLocations");

    if (this.locations) {
      this.locations.forEach((l) => {
        this.addLayer(l);
      });
    }
  },

  /**
   * Removes every loaded location marker
   */
  hideLocations() {
    console.log("hideLocations");

    this.eachLayer((layer) => {
      this.removeLayer(layer);
    });
  },

  /**
   * Set location markers based on map name. Clears old markers before adding new ones.
   *
   * @param locations - location objects
   */
  setLocations(locations) {
    console.log("setLocations:", locations);

    this.locations = locations;

    this.hideLocations();
    // this.showLocations(); // do not show, as it might be toggled off
  },

});
