import { Circle, Icon, LatLng, Marker } from "./Leaflet/dist/leaflet-src.esm";
import { FOB_DISTANCE, FOB_RANGE, ICON_SIZE, MIN_DISTANCE, PIN_TYPE, SQUAD_MAX_DISTANCE } from "./Vars";
import { getKP, pinToColor, pinToSymbol } from "./Utils";

/**
 * This Class holds a pin of a certain type. It behaves similar to a leaflet Marker with setLatLng() and getLatLng(),
 * however, it provides additional functionality, such as binding and moving tooltips and min/max range circles
 */
export default class PinHolder {
  /**
   * Creates a pin of given type using the image given by the url, without placing it on the map
   * @param {String} pinUrl - url of pin icon graphic
   * @param {Number} type - type of pin
   * @param {Number} [size] - pin icon size
   * @param {Number} [maxDistance] - custom max distance (by default max distance of squad mortar is used)
   */
  constructor(type, pinUrl, size = ICON_SIZE, maxDistance = SQUAD_MAX_DISTANCE) {
    this.type = type;
    this.pUrl = pinUrl;
    this.sUrl = pinToSymbol(pinUrl);
    this.color = pinToColor(pinUrl);
    this.maxDistance = maxDistance;
    this.dragging = false;
    this.onDragStartListeners = [];
    this.onDragEndListeners = [];
    this.defLatlng = new LatLng(-5000, -5000);

    const icon = PinHolder.createIcon(pinUrl, size);
    this.icon = icon;

    this.marker = new Marker(this.defLatlng, { draggable: "true", icon });
    console.log("marker:", this.marker);

    if (type === PIN_TYPE.MORTAR) {
      this._createMortarAttachments();
    } else if (type === PIN_TYPE.FOB) {
      this._createFobAttachments();
    }

    // add listeners for dragging
    this.marker.on("dragstart", () => {
      this.dragging = true;
      this.marker.bindTooltip(
        "",
        { permanent: true, direction: "top", offset: [0, -(4 * this.size / ICON_SIZE)] },
      );

      // fire all listeners for this event
      this.onDragStartListeners.forEach((f) => {
        try {
          f();
        } catch (e) {
          console.warn(`Error while calling onDragStartListener ${f}`, e);
        }
      });
    });
    this.marker.on("drag", (e) => {
      if (this.type === PIN_TYPE.MORTAR || this.type === PIN_TYPE.FOB) {
        this._moveAttachments(e.latlng);
      }
      this.pos = e.latlng;
      this.marker.setTooltipContent(getKP(e.latlng.lat, e.latlng.lng));
    });
    this.marker.on("dragend", () => {
      setTimeout(() => { // black magic to not trigger click after drag
        this.dragging = false;
        this.marker.unbindTooltip();

        // fire all listeners for this event
        this.onDragEndListeners.forEach((f) => {
          try {
            f();
          } catch (e) {
            console.warn(`Error while calling onDragEndListener ${f}`, e);
          }
        });
      }, 10);
    });
  }

  /**
   * Get position of pin
   */
  get pos() {
    return this.marker.getLatLng();
  }

  /**
   * Set position of pin (and attachments)
   * @param {LatLng} latlng
   */
  set pos(latlng) {
    this.marker.setLatLng(latlng);

    if (this.type === PIN_TYPE.MORTAR || this.type === PIN_TYPE.FOB) {
      this._moveAttachments(latlng);
    }
  }

  get size() {
    return this.marker.options.icon.options.iconSize[0];
  }

  set size(size) {
    console.log("size:", size);
    this.marker.setIcon(PinHolder.createIcon(this.pUrl, size));
  }

  static createIcon(pinUrl, size) {
    return new Icon({
      iconUrl: pinUrl,
      iconSize: [size, size],
      iconAnchor: [size / 2, (4 * size / ICON_SIZE)],
      // point from which the popup should open relative to the iconAnchor
      popupAnchor: [0, -ICON_SIZE / 2],
    });
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
      this._addAttachments(map);
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
      this._removeAttachments(map);
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
        this._addAttachments(map);
      } else {
        this._removeAttachments(map);
      }
    }
  }

  /**
   * Set the max distance for this pin. Used to draw max range circle on mortar markers
   * @param {Number} maxDistance - max distance value for this pin
   */
  setMaxDistance(maxDistance) {
    console.log("setMaxDistance", maxDistance);
    this.maxDistance = maxDistance;
    if (this.maxRangeCircle) {
      console.log("maxRangeCircle", this.maxRangeCircle);
      this.maxRangeCircle.setRadius(maxDistance);
    }
  }

  /**
   * Adds function to be called when dragstart event is fired by marker.
   * @param {function} l - listener function
   * @returns {number} index of listener function in listeners array
   */
  addOnDragStartListener(l) {
    return this.onDragStartListeners.push(l);
  }

  /**
   * Removes listener function (given by function object or index in array) from listeners array.
   * @param {function|number} l - listener function or index in listeners array
   */
  removeOnDragStartListener(l) {
    const type = typeof l;
    let index = -1;
    if (type === "number") {
      index = l;
    } else if (type === "function") {
      index = this.onDragStartListeners.indexOf(l);
    }

    if (index > -1) {
      this.onDragStartListeners.splice(index, 1);
    }
    console.warn(`Unable to remove onDragStartListener "${l}" (not in array)`);
  }

  /**
   * Adds function to be called when dragend event is fired by marker.
   * @param {function} l - listener function
   * @returns {number} index of listener function in listeners array
   */
  addOnDragEndListener(l) {
    return this.onDragEndListeners.push(l);
  }

  /**
   * Removes listener function (given by function object or index in array) from listeners array.
   * @param {function|number} l - listener function or index in listeners array
   */
  removeOnDragEndListener(l) {
    const type = typeof l;
    let index = -1;
    if (type === "number") {
      index = l;
    } else if (type === "function") {
      index = this.onDragEndListeners.indexOf(l);
    }

    if (index > -1) {
      this.onDragEndListeners.splice(index, 1);
    }
    console.warn(`Unable to remove onDragListener "${l}" (not in array)`);
  }

  /**
   * Creates min and max range circles for mortar marker
   */
  _createMortarAttachments() {
    this.minRangeCircle = new Circle(this.defLatlng, {
      draggable: "false",
      radius: MIN_DISTANCE,
      color: this.color,
      fillOpacity: 0,
      dashArray: "5, 5",
      interactive: false,
      clickable: false, // legacy support
    });

    this.maxRangeCircle = new Circle(this.defLatlng, {
      draggable: "false",
      radius: this.maxDistance,
      color: this.color,
      fillOpacity: 0.1,
      fillColor: this.color,
      dashArray: "5, 5",
      interactive: false,
      clickable: false, // legacy support
    });
  }

  /**
   * Creates max build range and min fob distance circles for fob marker
   */
  _createFobAttachments() {
    this.minRangeCircle = new Circle(this.defLatlng, {
      draggable: "false",
      radius: FOB_RANGE, // build range
      color: this.color,
      fillOpacity: 0,
      dashArray: "10, 10",
      interactive: false,
      clickable: false, // legacy support
    });

    this.maxRangeCircle = new Circle(this.defLatlng, {
      draggable: "false",
      radius: FOB_DISTANCE, // min distance to next fob
      color: this.color,
      fillOpacity: 0,
      dashArray: "10, 10",
      interactive: false,
      clickable: false, // legacy support
    });
  }

  /**
   * Move attachments to specified position
   * @param {LatLng} latlng
   */
  _moveAttachments(latlng) {
    this.minRangeCircle.setLatLng(latlng);
    this.maxRangeCircle.setLatLng(latlng);
  }

  /**
   * Add pin attachments to map
   * @param map - leaflet map object
   */
  _addAttachments(map) {
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
  _removeAttachments(map) {
    if (map.hasLayer(this.minRangeCircle)) {
      map.removeLayer(this.minRangeCircle);
    }
    if (map.hasLayer(this.maxRangeCircle)) {
      map.removeLayer(this.maxRangeCircle);
    }
  }
}
