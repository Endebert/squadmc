import { CircleMarker, ImageOverlay, LatLngBounds } from "leaflet";
import HeightmapHolder from "./HeightmapHolder";
import NoGapTileLayer from "./Leaflet_extensions/NoGapTileLayer";

/**
 * This class holds a map and gives simplified access to its heightmap, locations, etc.
 */
export default class SquadMap {
  /**
   * Initialize the SquadMap with the given object from MAPDATA
   * @param mapDataObj - object holding map data
   */
  constructor(mapDataObj) {
    console.log("initializing SquadMap with:", mapDataObj);
    this._mapData = mapDataObj;
    this.hasHeightmap = !!mapDataObj.heightmap;
    this.hasLocations = !!mapDataObj.locations;
    this.bounds = new LatLngBounds([0, 0], this._mapData.bounds);
    this._heightmapHolder = undefined;
    this._heightmapOverlay = undefined;
    this._heightmapTileLayer = undefined;
    this._locations = undefined;
    this._mapTileLayer = undefined;

    if (this.hasHeightmap) { this.getHeightmapHolder(); }
  }

  /**
   * Return the map as a TileLayer.
   * @returns {TileLayer} - map as leaflet TileLayer
   */
  getMapTileLayer() {
    if (!this._mapTileLayer) {
      this._mapTileLayer = new NoGapTileLayer(this._mapData.url, {
        minNativeZoom: 0,
        maxNativeZoom: 4,
        // zoomOffset: -3,
        attribution: "Map &copy; <a href='http://joinsquad.com/'>Offworld Inc.</a>",
        bounds: this.bounds,
      });
    }

    return this._mapTileLayer;
  }

  /**
   * Returns heightmap of the map matching given name as ImageOverlay.
   * @returns {ImageOverlay} the generated heightmap as ImageOverlay
   */
  getHeightmapOverlay() {
    if (!this.hasHeightmap) { throw new Error(`${this._mapData.name} has no heightmap!`); }

    if (!this._heightmapOverlay) {
      this._heightmapOverlay = new ImageOverlay(this._mapData.heightmap.url, this.bounds, { opacity: 0.5 });
    }

    return this._heightmapOverlay;
  }

  /**
   * Returns heightmap of the map matching given name as TileLayer.
   * @returns {TileLayer} the generated heightmap as TileLayer
   */
  getHeightmapTileLayer() {
    if (!this.hasHeightmap) { throw new Error(`${this._mapData.name} has no heightmap!`); }

    if (!this._heightmapTileLayer) {
      this._heightmapTileLayer = new NoGapTileLayer(this._mapData.heightmap.tile, {
        minNativeZoom: 0,
        maxNativeZoom: 4,
        // zoomOffset: -3,
        attribution: "Map &copy; <a href='http://joinsquad.com/'>Offworld Inc.</a>",
        bounds: this.bounds,
      });
    }

    return this._heightmapTileLayer;
  }

  /**
   * Returns locations of the map matching given name.
   * @returns {CircleMarker[]} array of location markers
   */
  getLocations() {
    if (!this.hasLocations) { throw new Error(`${this._mapData.name} has no locations!`); }

    if (!this._locations) {
      this._locations = [];
      this._mapData.locations.forEach(([name, latlng]) => {
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

        this._locations.push(marker);
      });
    }

    return this._locations;
  }

  /**
   * Returns the HeightmapHolder if it exists, throws Error otherwise
   * @returns {HeightmapHolder}
   */
  getHeightmapHolder() {
    console.log("getHeightmapHolder");
    if (!this.hasHeightmap) { throw new Error(`${this._mapData.name} has no heightmap!`); }

    if (!this._heightmapHolder) {
      this._heightmapHolder = new HeightmapHolder();
      this._heightmapHolder.setMap(this._mapData.heightmap.url, this._mapData.heightmap.scale);
    }

    return this._heightmapHolder;
  }
}
