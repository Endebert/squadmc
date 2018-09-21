import { Circle } from "leaflet";

/**
 * This Class holds a pin of a certain type. It behaves similar to a leaflet Marker with setLatLng() and getLatLng(),
 * however, it provides additional functionality, such as binding and moving tooltips and min/max range circles
 */
export default class MarkerHolder {
  /**
   * Creates a marker
   *
   * @param {Map} map - leaflet map object the marker is to be displayed on
   * @param {LatLng} pos - initial position
   * @param {boolean} [draggable] - whether or not this pin is draggable
   */
  constructor(map, pos, draggable = true) {
    console.debug("new MarkerHolder:", [map, pos, draggable]);
    this._map = map;
    this._pos = pos;
    this._draggable = draggable;
    // this.draggable = draggable;

    // setup instance variabels
    this._attachments = [];
    this._dragging = false;
    this._onDragStartListeners = [];
    this._onDragEndListeners = [];

    // this._createMarker(pos);
    // this._createAttachments();

    // if (type === PIN_TYPE.MORTAR) {
    //   this._createMortarAttachments();
    // } else if (type === PIN_TYPE.FOB) {
    //   this._createFobAttachments();
    // }
  }

  /**
   * Creates the marker.
   * Should be overridden by extending classes to further customize how the marker should look like.
   *
   */
  _createMarker() {
    this.marker = new Circle(this._pos, { radius: 50 });
  }

  _onDragStart() {
    console.log("_onDragStart:", this);
    this._dragging = true;

    // fire all listeners for this event
    this._onDragStartListeners.forEach((f) => {
      try {
        f();
      } catch (e) {
        console.warn(`Error while calling onDragStartListener ${f}`, e);
      }
    });
  }

  _onDrag(e) {
    // if (this.type === PIN_TYPE.MORTAR || this.type === PIN_TYPE.FOB) {
    //   this._moveAttachments(e.latlng);
    // }
    this.pos = e.latlng;
  }

  _onDragEnd() {
    setTimeout(() => { // black magic to not trigger click after drag
      this._dragging = false;

      // fire all listeners for this event
      this._onDragEndListeners.forEach((f) => {
        try {
          f();
        } catch (e) {
          console.warn(`Error while calling onDragEndListener ${f}`, e);
        }
      });
    }, 10);
  }

  _createAttachments() {
    this._attachments = [];
  }

  /**
   * Move attachments to specified position
   * @param {LatLng} latlng
   */
  _moveAttachments(latlng) {
    this._attachments.forEach((a) => {
      a.setLatLng(latlng);
    });
  }

  /**
   * Show attachments on map
   */
  _showAttachments() {
    this._attachments.forEach((a) => {
      if (!this._map.hasLayer(a)) {
        this._map.addLayer(a);
      }
    });
  }

  /**
   * Hide attachments on map
   */
  _hideAttachments() {
    this._attachments.forEach((a) => {
      // if (this.map.hasLayer(a)) {
      this._map.removeLayer(a);
      // }
    });
  }

  /**
   * Get position of pin
   */
  get pos() {
    return this.marker ? this.marker.getLatLng() : this._pos;
  }

  /**
   * Set position of pin (and attachments)
   * @param {LatLng} latlng
   */
  set pos(latlng) {
    console.log("set pos:", latlng);
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this._pos = latlng;
    }
    this._moveAttachments(latlng);
  }

  /**
   * Show pin (and attachments) on map
   */
  show() {
    if (!this.marker) {
      this._createMarker(this._pos);
      // add listeners for dragging
      if (this._draggable) {
        // using arrow functions to keep correct "this" reference
        this.marker.on("dragstart", e => this._onDragStart(e));
        this.marker.on("drag", e => this._onDrag(e));
        this.marker.on("dragend", e => this._onDragEnd(e));
      }
      this._createAttachments();
    }

    if (!this._map.hasLayer(this.marker)) {
      this._map.addLayer(this.marker);
    }

    this._showAttachments();
  }

  /**
   * Hide pin (and attachments) on map
   */
  hide() {
    // if (map.hasLayer(this.marker)) {
    this._map.removeLayer(this.marker);
    // }

    this._hideAttachments();
  }

  /**
   * Adds function to be called when dragstart event is fired by marker.
   * @param {function} l - listener function
   * @returns {number} index of listener function in listeners array
   */
  addOnDragStartListener(l) {
    return this._onDragStartListeners.push(l);
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
      index = this._onDragStartListeners.indexOf(l);
    }

    if (index > -1) {
      this._onDragStartListeners.splice(index, 1);
    }
    console.warn(`Unable to remove onDragStartListener "${l}" (not in array)`);
  }

  /**
   * Adds function to be called when dragend event is fired by marker.
   * @param {function} l - listener function
   * @returns {number} index of listener function in listeners array
   */
  addOnDragEndListener(l) {
    return this._onDragEndListeners.push(l);
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
      index = this._onDragEndListeners.indexOf(l);
    }

    if (index > -1) {
      this._onDragEndListeners.splice(index, 1);
    }
    console.warn(`Unable to remove onDragListener "${l}" (not in array)`);
  }

  // /**
  //  * Creates min and max range circles for mortar marker
  //  */
  // _createMortarAttachments() {
  //   this.minRangeCircle = new Circle(this.defLatlng, {
  //     draggable: "false",
  //     radius: MIN_DISTANCE,
  //     color: this.color,
  //     fillOpacity: 0,
  //     dashArray: "5, 5",
  //     interactive: false,
  //     clickable: false, // legacy support
  //   });
  //
  //   this.maxRangeCircle = new Circle(this.defLatlng, {
  //     draggable: "false",
  //     radius: this.maxDistance,
  //     color: this.color,
  //     fillOpacity: 0.1,
  //     fillColor: this.color,
  //     dashArray: "5, 5",
  //     interactive: false,
  //     clickable: false, // legacy support
  //   });
  // }

  // /**
  //  * Creates max build range and min fob distance circles for fob marker
  //  */
  // _createFobAttachments() {
  //   this.minRangeCircle = new Circle(this.defLatlng, {
  //     draggable: "false",
  //     radius: FOB_RANGE, // build range
  //     color: this.color,
  //     fillOpacity: 0,
  //     dashArray: "10, 10",
  //     interactive: false,
  //     clickable: false, // legacy support
  //   });
  //
  //   this.maxRangeCircle = new Circle(this.defLatlng, {
  //     draggable: "false",
  //     radius: FOB_DISTANCE, // min distance to next fob
  //     color: this.color,
  //     fillOpacity: 0,
  //     dashArray: "10, 10",
  //     interactive: false,
  //     clickable: false, // legacy support
  //   });
  // }

  // /**
  //  * Move attachments to specified position
  //  * @param {LatLng} latlng
  //  */
  // _moveAttachments(latlng) {
  //   this.minRangeCircle.setLatLng(latlng);
  //   this.maxRangeCircle.setLatLng(latlng);
  // }
  //
  // /**
  //  * Add pin attachments to map
  //  * @param map - leaflet map object
  //  */
  // _addAttachments(map) {
  //   if (!map.hasLayer(this.minRangeCircle)) {
  //     map.addLayer(this.minRangeCircle);
  //   }
  //   if (!map.hasLayer(this.maxRangeCircle)) {
  //     map.addLayer(this.maxRangeCircle);
  //   }
  // }

  // /**
  //  * Remove pin attachments from map
  //  * @param map - leaflet map object
  //  */
  // _removeAttachments(map) {
  //   if (map.hasLayer(this.minRangeCircle)) {
  //     map.removeLayer(this.minRangeCircle);
  //   }
  //   if (map.hasLayer(this.maxRangeCircle)) {
  //     map.removeLayer(this.maxRangeCircle);
  //   }
  // }
}
