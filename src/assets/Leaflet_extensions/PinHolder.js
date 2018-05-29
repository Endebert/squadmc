import { Circle, Icon, LatLng, Marker } from "../Leaflet/dist/leaflet-src.esm";
import { FOB_DISTANCE, FOB_RANGE, ICON_SIZE, MAX_DISTANCE, MIN_DISTANCE, PIN_TYPE } from "./Vars";
import { getKP } from "./Utils";

/**
 * This Class holds a pin of a certain type. It behaves similar to a leaflet Marker with setLatLng() and getLatLng(),
 * however, it provides additional functionality, such as binding and moving tooltips and min/max range circles
 */
export default class PinHolder {
  /**
   * Creates a pin of given type using the image given by the url, without placing it on the map
   * @param {String} mUrl - url of pin icon graphic
   * @param {Number} type - type of pin
   */
  constructor(mUrl, type) {
    const icon = new Icon({
      iconUrl: mUrl,
      iconSize: [ICON_SIZE, ICON_SIZE],
      iconAnchor: [ICON_SIZE / 2, ICON_SIZE - 4],
      // point from which the popup should open relative to the iconAnchor
      popupAnchor: [0, -ICON_SIZE / 2],
    });

    this.defLatlng = new LatLng(-5000, -5000);

    this.marker = new Marker(this.defLatlng, { draggable: "true", icon });

    if (type === PIN_TYPE.MORTAR) {
      this.createMortarAttachments();
    } else if (type === PIN_TYPE.FOB) {
      this.createFobAttachments();
    }

    this.mUrl = mUrl;
    this.icon = icon;
    this.type = type;
    this.dragging = false;

    // add listeners for dragging
    this.marker.on("dragstart", () => {
      this.dragging = true;
      this.marker.bindTooltip(
        "",
        { permanent: true, direction: "top", offset: [0, -ICON_SIZE] },
      );
    });
    this.marker.on("drag", (e) => {
      if (this.type === PIN_TYPE.MORTAR || this.type === PIN_TYPE.FOB) {
        this.moveAttachments(e.latlng);
      }
      this.pos = e.latlng;
      this.marker.setTooltipContent(getKP(e.latlng.lat, e.latlng.lng));
    });
    this.marker.on("dragend", () => {
      setTimeout(() => { // black magic to not trigger click after drag
        this.dragging = false;
        this.marker.unbindTooltip();
      }, 10);
    });
  }

  /**
   * Creates min and max range circles for mortar marker
   */
  createMortarAttachments() {
    this.minRangeCircle = new Circle(this.defLatlng, {
      draggable: "false",
      radius: MIN_DISTANCE,
      color: "#8BC34A",
      // fillOpacity: 0,
      fillOpacity: 0.05,
      interactive: false,
      clickable: false, // legacy support
    });

    this.maxRangeCircle = new Circle(this.defLatlng, {
      draggable: "false",
      radius: MAX_DISTANCE,
      color: "#4CAF50",
      // fillOpacity: 0,
      fillOpacity: 0.05,
      interactive: false,
      clickable: false, // legacy support
    });
  }

  /**
   * Creates max build range and min fob distance circles for fob marker
   */
  createFobAttachments() {
    this.minRangeCircle = new Circle(this.defLatlng, {
      draggable: "false",
      radius: FOB_RANGE, // build range
      color: "#03A9F4",
      // fillOpacity: 0,
      fillOpacity: 0.05,
      interactive: false,
      clickable: false, // legacy support
    });


    this.maxRangeCircle = new Circle(this.defLatlng, {
      draggable: "false",
      radius: FOB_DISTANCE, // min distance to next fob
      color: "#2196F3",
      // fillOpacity: 0,
      fillOpacity: 0.05,
      interactive: false,
      clickable: false, // legacy support
    });
  }

  /**
   * Move attachments to specified position
   * @param {LatLng} latlng
   */
  moveAttachments(latlng) {
    this.minRangeCircle.setLatLng(latlng);
    this.maxRangeCircle.setLatLng(latlng);
  }

  /**
   * Add pin (and attachments) to map
   * @param map - leaflet map object
   */
  addTo(map) {
    if (!map.hasLayer(this.marker)) {
      map.addLayer(this.marker);
    }

    if (this.type === PIN_TYPE.MORTAR || this.type === PIN_TYPE.FOB) {
      this.addAttachments(map);
    }
  }

  /**
   * Remove pin (and attachments) from map
   * @param map - leaflet map object
   */
  removeFrom(map) {
    if (map.hasLayer(this.marker)) {
      map.removeLayer(this.marker);
    }

    if (this.type === PIN_TYPE.MORTAR || this.type === PIN_TYPE.FOB) {
      this.removeAttachments(map);
    }
  }

  /**
   * Add pin attachments to map
   * @param map - leaflet map object
   */
  addAttachments(map) {
    if (!map.hasLayer(this.minRangeCircle)) {
      map.addLayer(this.minRangeCircle);
    }
    if (!map.hasLayer(this.maxRangeCircle)) {
      map.addLayer(this.maxRangeCircle);
    }
  }

  /**
   * Remove pin attachments from map
   * @param map - leaflet map object
   */
  removeAttachments(map) {
    if (map.hasLayer(this.minRangeCircle)) {
      map.removeLayer(this.minRangeCircle);
    }
    if (map.hasLayer(this.maxRangeCircle)) {
      map.removeLayer(this.maxRangeCircle);
    }
  }

  /**
   * Set active state of this pinholder. Only an active Mortar marker may have min and max range circles shown.
   * @param {Boolean} state - whether or not this pinHolder is "active"
   * @param map - leaflet map object
   */
  setActive(state, map) {
    if (this.type === PIN_TYPE.MORTAR) {
      if (state) {
        this.addAttachments(map);
      } else {
        this.removeAttachments(map);
      }
    }
  }

  /**
   * Set position of pin (and attachments)
   * @param {LatLng} latlng
   */
  setLatLng(latlng) {
    this.marker.setLatLng(latlng);

    if (this.type === PIN_TYPE.MORTAR || this.type === PIN_TYPE.FOB) {
      this.moveAttachments(latlng);
    }

    this.pos = latlng;
  }

  /**
   * Set position of pin
   */
  getLatLng() {
    return this.marker.getLatLng();
  }
}
