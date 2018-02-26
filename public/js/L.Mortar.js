/* eslint-disable new-cap */
/**
 * The Mortar layer group holds the mortar and target markers and does the bearing and elevation calculations.
 * Also updates the top ribbon of the page.
 *
 * @type {L.Mortar} - mortar layer object
 */
L.Mortar = L.LayerGroup.extend({
  options: {
    attribution: "Created by <a href='https://github.com/Endebert/squadmc'>Robert Ende</a>",
    mortarPosElement: undefined,
    targetPosElement: undefined,
    mortarDeleteBtn: undefined,
    targetDeleteBtn: undefined,
    mousePosition: undefined,
    canvas: document.createElement("canvas"),
  },

  l: log.getLogger("Mortar"),
  heightData: [],

  initialize(options) {
    this.l.debug("initialize:", options);
    L.LayerGroup.prototype.initialize.call(this);
    L.Util.setOptions(this, options);
    this.resetVars();
    Utils.resizeHandler(options.mortarPosElement);
    Utils.resizeHandler(options.targetPosElement);
    this.setOnChangeHandler(options.mortarPosElement);
    this.setOnChangeHandler(options.targetPosElement);
    this.ogColor = {
      mortar: options.mortarPosElement.style.color,
      target: options.targetPosElement.style.color,
    };

    if (options.mortarDeleteBtn) {
      options.mortarDeleteBtn.button.addEventListener("click", () => {
        this.removeMortar();
        options.mortarDeleteBtn.disable();
      });
    }
    if (options.targetDeleteBtn) {
      options.targetDeleteBtn.button.addEventListener("click", () => {
        this.removeTarget();
        options.targetDeleteBtn.disable();
      });
    }
  },

  onAdd(map) {
    this.l.debug("onAdd:", map);
    this.map = map;
    this.map.on("click", this.onMapClick, this);
    this.map.on("baselayerchange", this.onBaseLayerChange, this);

    this.reset();

    // this.eachLayer(map.addLayer, map);
  },

  onRemove() {
    this.l.debug("onRemove");
    this.reset();
  },

  onBaseLayerChange(e) {
    this.l.debug("onBaseLayerChange");
    this.reset();
    this.setupHeightmap(e.name);
  },

  /**
   * Reset the layer, removing all markers
   */
  reset() {
    this.l.debug("reset");
    this.eachLayer(this.removeLayer, this);
    this.resetVars();
    this.options.mortarDeleteBtn.disable();
    this.options.targetDeleteBtn.disable();
    // eslint-disable-next-line no-underscore-dangle
    L.DomUtil.removeClass(this.map._container, "target-cursor-enabled");
    // eslint-disable-next-line no-underscore-dangle
    L.DomUtil.addClass(this.map._container, "mortar-cursor-enabled");
  },

  /**
   * Resets all variables to their original value;
   */
  resetVars() {
    this.l.debug("resetVars");
    this.bearing = 0;
    this.elevation = 0;
    this.mo = {};
    this.dragged = false;
    this.setMortarPosText();
    this.setTargetPosText();
    Utils.setBearingText();
    Utils.setDistanceText();
    Utils.setHeightDiffText();
    Utils.setElevationText();
  },

  /**
   * Loads heightmap data into memory for the given map
   * @param {string} name - map name
   */
  setupHeightmap(name) {
    this.l.debug("setupHeightmap:", name);
    this.heightmap = Utils.getHeightmap(name); // first we check if there is a heightmap available
    if (this.heightmap) {
      // it is, so we clear, load the image, and draw the image on the canvas
      const canvas = this.options.canvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // now we can get the image data
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        // now we create a smaller array, only holding one value of the rgba set
        const colorValues = new Array(data.length / 4);
        for (let i = 0; i < colorValues.length; i++) {
          colorValues[i] = data[i * 4];
        }
        // now we make this array available for later
        this.heightmap.data = colorValues;
      };
      img.src = this.heightmap.url; // this initiates downloading the image
    }
  },

  /**
   * Returns the scaled height for the given coordinate
   * @param {number} x - x-coordinate of target pixel/point
   * @param {number} y - y-coordinate of target pixel/point
   * @returns {number} scaled height in m, or 0 if heightmap is not available
   */
  getHeight(x, y) {
    if (this.heightmap) {
      const width = this.options.canvas.width;
      const height = this.options.canvas.height;
      if (x < 0 || x >= width || y < 0 || y >= height) { // return NaN if x or y outside of canvas
        return Number.NaN;
      }
      return this.heightmap.data[(y * width + x)] * this.heightmap.scale;
    }
    return 0;
  },

  /**
   * Removed the mortar marker from the layer.
   */
  removeMortar() {
    this.l.debug("removeMortar");

    // saves targetMarker position if it exists and then completely resets the layer
    // a bit hacky, but works well
    let targetPos;
    if (this.mo.targetMarker) {
      targetPos = this.mo.targetMarker.getLatLng();
    }
    this.reset();
    if (targetPos) {
      this.setTarget(targetPos);
    }
  },

  /**
   * Removed the target marker from the layer.
   */
  removeTarget() {
    this.l.debug("removeTarget");

    // saves mortarMarker position if it exists and then completely resets the layer
    // a bit hacky, but works well
    let mortarPos;
    if (this.mo.mortarMarker) {
      mortarPos = this.mo.mortarMarker.getLatLng();
    }
    this.reset();
    if (mortarPos) {
      this.setMortar(mortarPos);
    }
  },

  /**
   * Draws a line between the mortar marker and target marker.
   * Line is green if target is in mortar range, red otherwise.
   */
  drawLine() {
    if (!this.mo.mortarMarker || !this.mo.targetMarker) {
      return;
    }

    const s = this.mo.mortarMarker.getLatLng();
    const e = this.mo.targetMarker.getLatLng();

    // create or move the line
    if (!this.mo.distLine) {
      this.mo.distLine = L.polyline([s, e], {
        color: "green",
        interactive: false,
        clickable: false, // legacy support
      });
      // mapObjects.distLine.addTo(map);
      this.mo.distLine.addTo(this);
    } else {
      this.mo.distLine.setLatLngs([s, e]);
    }

    // isNaN is used as elevation might NaN
    this.mo.distLine.setStyle({ color: Number.isNaN(this.elevation) || this.elevation > 1579 ? "red" : "green" });
  },

  calculate() {
    if (!this.mo.mortarMarker || !this.mo.targetMarker) {
      return;
    }

    const s = this.mo.mortarMarker.getLatLng();
    const e = this.mo.targetMarker.getLatLng();

    // oh no, vector maths!
    this.bearing = Math.atan2(e.lng - s.lng, e.lat - s.lat) * 180 / Math.PI;

    const a = s.lat - e.lat;
    const b = s.lng - e.lng;

    const dist = Math.sqrt(a * a + b * b);

    // rotate so 0° is towards North, round to 1 decimal, mod 360 so that 360° = 0°
    this.bearing = (Math.round((180 - this.bearing) * 10) / 10) % 360;

    // rounding for pixel coordinates
    const sx = Math.round(s.lng);
    const sy = Math.round(s.lat);
    const ex = Math.round(e.lng);
    const ey = Math.round(e.lat);

    // now we get the height and calculate the difference
    const mortarHeight = this.getHeight(sx, sy);
    const targetHeight = this.getHeight(ex, ey);

    const heightDiff = targetHeight - mortarHeight;

    if (this.l.getLevel() <= log.levels.DEBUG) {
      this.l.debug(`mortar height @ ${sx}:${sy} = ${mortarHeight}`);
      this.l.debug(`target height @ ${ex}:${ey} = ${targetHeight}`);
      this.l.debug("height diff:", heightDiff);
    }

    this.elevation = Math.round(Utils.calcMortarAngle(dist, heightDiff));

    // 0-padding for bearing and elevation
    const strAngle = Utils.pad(this.bearing.toFixed(1), 5);
    const strElevation = Number.isNaN(this.elevation) || this.elevation > 1579 ?
      "XXXX" : Utils.pad(this.elevation, 4);
    const strDist = Utils.pad(Math.round(dist), 4);

    let hDiff;
    if (Number.isNaN(heightDiff)) {
      hDiff = "+XXX.X";
    } else {
      // now making heightDiff more readable
      // 1. get absolute value (we add sign when setting hDiff)
      // 2. round to 1 decimal, and force showing that decimal
      const roundedHDiffAbs = Math.abs(Math.round(heightDiff * 10) / 10).toFixed(1);
      hDiff = heightDiff >= 0 ? `+${Utils.pad(roundedHDiffAbs, 5)}` : `-${Utils.pad(roundedHDiffAbs, 5)}`;
    }

    Utils.setBearingText(`${strAngle}°`);
    Utils.setElevationText(`${strElevation}mil`);
    Utils.setDistanceText(`${strDist}m`);
    Utils.setHeightDiffText(`${hDiff}m`);
  },

  /**
   * Returns a circle indicating mortar's max range at the desired position
   * @param latlng - circle center. usually that's the position of the mortar marker
   */
  createMaxRangeCircle(latlng) {
    this.l.debug("createMaxRangeCircle:", latlng);

    this.mo.maxRangeCircle = new L.circle(latlng, {
      draggable: "false",
      radius: Utils.MAX_DISTANCE,
      color: "green",
      fillOpacity: 0.05,
      interactive: false,
      clickable: false, // legacy support
    });
  },

  /**
   * Returns a circle indicating mortar's min range at the desired position
   * @param latlng - circle center. usually that's the position of the mortar marker
   */
  createMinRangeCircle(latlng) {
    this.l.debug("createMinRangeCircle:", latlng);

    this.mo.minRangeCircle = new L.circle(latlng, {
      draggable: "false",
      radius: Utils.MIN_DISTANCE,
      color: "red",
      fillOpacity: 0.05,
      interactive: false,
      clickable: false, // legacy support
    });
  },

  /**
   * Create the mortar marker at the desired position.
   *
   * @param {L.LatLng} latlng - position of mortar marker
   */
  createMortar(latlng) {
    this.l.debug("createMortar:", latlng);

    // create marker
    this.mo.mortarMarker = new L.marker(latlng, { draggable: "true", icon: Utils.mortarIcon });

    // create green max range circle
    this.createMaxRangeCircle(latlng);

    // create red min range circle
    this.createMinRangeCircle(latlng);

    // add listeners for dragging
    this.mo.mortarMarker.on("dragstart", () => {
      this.dragged = true;
      if (this.options.mousePosition) {
        this.options.mousePosition.setEnabled(false);
      }
    });
    this.mo.mortarMarker.on("drag", (e) => {
      this.calcAndDraw();
      this.mo.maxRangeCircle.setLatLng(e.latlng);
      this.mo.minRangeCircle.setLatLng(e.latlng);
      this.setMortarPosText(Utils.getKP(e.latlng.lat, e.latlng.lng));

      if (this.options.mousePosition) {
        this.options.mousePosition.setPosition(e.latlng.lat, e.latlng.lng);
      }
    });
    this.mo.mortarMarker.on("dragend", () => {
      setTimeout(() => { // black magic to not trigger click after drag
        this.dragged = false;
        if (this.options.mousePosition) {
          this.options.mousePosition.setEnabled(true);
        }
      }, 10);
    });

    // add marker and components to layer
    this.mo.mortarMarker.addTo(this);
    this.mo.maxRangeCircle.addTo(this);
    this.mo.minRangeCircle.addTo(this);

    // finally, if mortar delete button is given, enable it
    if (this.options.mortarDeleteBtn) {
      this.options.mortarDeleteBtn.enable();
    }

    // eslint-disable-next-line no-underscore-dangle
    L.DomUtil.removeClass(this.map._container, "mortar-cursor-enabled");
    // eslint-disable-next-line no-underscore-dangle
    L.DomUtil.addClass(this.map._container, "target-cursor-enabled");
  },

  /**
   * Create the target marker at the desired position.
   *
   * @param {L.LatLng} latlng - position of target marker
   */
  createTarget(latlng) {
    this.l.debug("createTarget:", latlng);

    this.mo.targetMarker = new L.marker(latlng, { draggable: "true", icon: Utils.targetIcon });

    // add listeners for dragging
    this.mo.targetMarker.on("dragstart", () => {
      this.dragged = true;
      if (this.options.mousePosition) {
        this.options.mousePosition.setEnabled(false);
      }
    });
    this.mo.targetMarker.on("drag", (e) => {
      this.calcAndDraw();
      this.setTargetPosText(Utils.getKP(e.latlng.lat, e.latlng.lng));

      if (this.options.mousePosition) {
        this.options.mousePosition.setPosition(e.latlng.lat, e.latlng.lng);
      }
    });
    this.mo.targetMarker.on("dragend", () => {
      setTimeout(() => { // black magic to not trigger click after drag
        this.dragged = false;
        if (this.options.mousePosition) {
          this.options.mousePosition.setEnabled(true);
        }
      }, 10);
    });

    // now add marker to layer
    this.mo.targetMarker.addTo(this);

    // finally, if target delete button is given, enable it
    if (this.options.targetDeleteBtn) {
      this.options.targetDeleteBtn.enable();
    }
  },

  /**
   * Sets the position of the mortar marker
   * @param {L.LatLng} latlng - target position of mortar marker
   * @param {boolean} updateText - whether or not to also update the position label on the page
   */
  setMortar(latlng, updateText = true) {
    this.l.debug("setMortar:", [latlng, updateText]);
    // if marker doesn't exist, we have to create it and its components first
    if (!this.mo.mortarMarker) {
      this.createMortar(latlng);
    } else {
      // if everything exists already, we just move the marker and components to the target position
      this.mo.mortarMarker.setLatLng(latlng);
      this.mo.maxRangeCircle.setLatLng(latlng);
      this.mo.minRangeCircle.setLatLng(latlng);
    }

    // now that the position is set, we calculate bearing & elevation and draw the line between mortar and target marker
    this.calcAndDraw();

    // also update top ribbon to show the correct keypad
    if (updateText) {
      this.setMortarPosText(Utils.getKP(latlng.lat, latlng.lng));
    }
  },

  /**
   * Sets the position of the target marker
   * @param {L.LatLng} latlng - target position of target marker
   * @param {boolean} updateText - whether or not to also update the position label on the page
   */
  setTarget(latlng, updateText = true) {
    this.l.debug("setTarget:", [latlng, updateText]);
    // if target marker doesn't exist, we have to create it first
    if (!this.mo.targetMarker) {
      this.createTarget(latlng);
    } else {
      // if marker exists already, we just move it to the target position
      this.mo.targetMarker.setLatLng(latlng);
    }
    this.calcAndDraw();

    // also update top ribbon to show the correct keypad
    if (updateText) {
      this.setTargetPosText(Utils.getKP(latlng.lat, latlng.lng));
    }
  },

  /**
   * Convenience function to invoke calculation and line drawing, as they are always updated at the same time.
   */
  calcAndDraw() {
    this.l.debug("calcAndDraw");
    this.calculate();
    this.drawLine();
  },

  /**
   * Handles click events on the map.
   * 1. if no marker exists, add mortar marker at click position
   * 2. if mortar marker exists, add target marker at click position
   * 3. if both markers exist, show popup to allow choosing which marker to put at click position
   * @param e - "click" event object
   * @returns {boolean} always returns true
   */
  onMapClick(e) {
    this.l.debug("onMapClick:", e);
    // black magic to not trigger click after drag
    if (this.dragged) {
      return true;
    }

    // first time, set mortar marker. Once that exists, always set target marker
    if (!this.mo.mortarMarker) {
      this.setMortar(e.latlng);
    } else {
      this.setTarget(e.latlng);
    }

    // in debug mode we copy the click coordinates to the clipboard
    if (Utils.isDebug()) {
      Utils.copyTextToClipboard(`[${Math.round(e.latlng.lat)}, ${Math.round(e.latlng.lng)}]`);
    }

    return true;
  },

  /**
   * Update mortar position in top ribbon.
   * @param {string} text - updated mortar position, leave undefined to reset to initial value
   */
  setMortarPosText(text = "") {
    this.l.debug("setMortarPosText:", text);
    this.options.mortarPosElement.value = text;
    this.options.mortarPosElement.dispatchEvent(new CustomEvent("custom"));
  },

  /**
   * Update target position in top ribbon.
   * @param {string} text - updated target position, leave undefined to reset to initial value
   */
  setTargetPosText(text = "") {
    this.l.debug("setTargetPosText:", text);
    this.options.targetPosElement.value = text;
    this.options.targetPosElement.dispatchEvent(new CustomEvent("custom"));
  },

  /**
   * Sets a handler on document elements to handle change events. It updates the mortar position based on input.
   * @param el - element for the handler to handle
   */
  setOnChangeHandler(el) {
    const self = this;
    const onChange = (e) => {
      self.l.debug("onChange:", e, el.value);
      const formattedVal = Utils.formatKeyPad(el.value);

      // check which element to update
      // also change text color to indicate if input is valid mortar position
      if (e.target === self.options.mortarPosElement) {
        try {
          self.setMortar(Utils.getPos(formattedVal), false);
          self.options.mortarPosElement.style.color = self.ogColor.mortar;
        } catch (error) {
          self.l.warn(error);
          self.options.mortarPosElement.style.color = "red";
        }
        self.setMortarPosText(formattedVal);
      } else {
        try {
          self.setTarget(Utils.getPos(formattedVal), false);
          self.options.targetPosElement.style.color = self.ogColor.mortar;
        } catch (error) {
          self.l.warn(error);
          self.options.targetPosElement.style.color = "red";
        }
        self.setTargetPosText(formattedVal);
      }
    };
    const events = "keyup, keydown, keypress".split(",");
    events.forEach((e) => {
      el.addEventListener(e, onChange, false);
    });
  },
});

L.mortar = options => new L.Mortar(options);
