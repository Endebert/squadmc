import { CircleMarker, ImageOverlay, LatLngBounds, TileLayer } from "../Leaflet/dist/leaflet-src.esm";
import HeightmapHolder from "./HeightmapHolder";

/**
 * This class holds a map and gives simplified access to its heightmap, locations, etc.
 */
export default class SquadMap {
  /**
   * Initialize the SquadMap with the given object from MAPDATA
   * @param mapDataObj - object holding map data
   */
  constructor(mapDataObj) {
    // console.log("initializing SquadMap with:", mapDataObj);
    this.mapData = mapDataObj;
    this.hasHeightmap = !!mapDataObj.heightmap;
    this.hasLocations = !!mapDataObj.locations;
    this.bounds = new LatLngBounds([0, 0], this.mapData.bounds);
    this.heightmapHolder = undefined;
    this.heightmap = undefined;
    this.locations = undefined;
    this.tileLayer = undefined;

    if (this.hasHeightmap) { this.getHeightmapHolder(); }
  }

  /**
   * Return the map as a TileLayer.
   * @returns {TileLayer} - map as leaflet TileLayer
   */
  getTileLayer() {
    if (!this.tileLayer) {
      this.tileLayer = new TileLayer(this.mapData.url, {
        minNativeZoom: 0,
        maxNativeZoom: 4,
        // zoomOffset: -3,
        attribution: "Map &copy; <a href='http://joinsquad.com/'>Offworld Inc.</a>",
        bounds: this.bounds,
      });
    }

    return this.tileLayer;
  }

  /**
   * Returns heightmap of the map matching given name.
   * @returns {ImageOverlay} the generated heightmap as ImageOverlay
   */
  getHeightmap() {
    if (!this.hasHeightmap) { throw new Error(`${this.mapData.name} has no heightmap!`); }

    if (!this.heightmap) {
      this.heightmap = new ImageOverlay(this.mapData.heightmap.url, this.bounds, { opacity: 0.5 });
    }

    return this.heightmap;
  }

  /**
   * Returns locations of the map matching given name.
   * @returns {CircleMarker[]} array of location markers
   */
  getLocations() {
    if (!this.hasLocations) { throw new Error(`${this.mapData.name} has no locations!`); }

    if (!this.locations) {
      this.locations = [];
      this.mapData.locations.forEach(([name, latlng]) => {
        const marker = new CircleMarker(latlng, {
          draggable: false,
          radius: 8,
          color: "#212121",
          stroke: true,
          weight: 2,
          fillColor: "#FFEB3B",
          fillOpacity: 0.5,
          interactive: false,
          clickable: false, // legacy support
        });
        // bind name label to marker
        marker.bindTooltip(name, { permanent: true, direction: "top", offset: [0, -8] });

        this.locations.push(marker);
      });
    }

    return this.locations;
  }

  /**
   * Returns the HeightmapHolder if it exists, throws Error otherwise
   * @returns {HeightmapHolder}
   */
  getHeightmapHolder() {
    // console.log("getHeightmapHolder");
    if (!this.hasHeightmap) { throw new Error(`${this.mapData.name} has no heightmap!`); }

    if (!this.heightmapHolder) {
      this.heightmapHolder = new HeightmapHolder();
      this.heightmapHolder.setMap(this.mapData.heightmap.url, this.mapData.heightmap.scale);
    }

    return this.heightmapHolder;
  }
}
