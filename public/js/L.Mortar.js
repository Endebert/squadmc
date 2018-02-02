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
  },

  l: log.getLogger("Mortar"),

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
    this.l.debug("onAdd");
    this.map = map;
    this.map.on("click", this.onMapClick, this);
    this.map.on("baselayerchange", this.reset, this);

    this.reset();

    // this.eachLayer(map.addLayer, map);
  },

  onRemove() {
    this.l.debug("onRemove");
    this.reset();
  },

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
    Utils.setElevationText();
  },

  removeMortar() {
    let targetPos;
    if (this.mo.targetMarker) {
      targetPos = this.mo.targetMarker.getLatLng();
    }
    this.reset();
    if (targetPos) {
      this.setTarget(targetPos);
    }
  },

  removeTarget() {
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

    // isNaN is used as elevation might be "TOO_FAR" or "TOO_CLOSE"
    this.mo.distLine.setStyle({ color: Number.isNaN(this.elevation) ? "red" : "green" });
  },

  /**
   * Calculates bearing and elevation for the mortar in-game.
   */
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
    this.bearing = (180 - this.bearing).toFixed(1); // rotate so 0° is towards North, round to 1 decimal
    this.elevation = Math.round(Utils.interpolateElevation(dist));

    // 0-padding for bearing and elevation
    const strAngle = Utils.pad(this.bearing, 5);
    const strElevation = Number.isNaN(this.elevation) ? "XXXX" : Utils.pad(this.elevation, 4);
    const strDist = Utils.pad(Math.round(dist), 4);

    Utils.setBearingText(`${strAngle}°`);
    Utils.setElevationText(`${strElevation}mil`);
    Utils.setDistanceText(`${strDist}m`);
  },

  createMaxRangeCircle(latlng) {
    this.mo.maxRangeCircle = new L.circle(latlng, {
      draggable: "false",
      radius: 1250, // 1250 meters == 800 mill == max range of mortar
      color: "green",
      fillOpacity: 0.05,
      interactive: false,
      clickable: false, // legacy support
    });
  },

  createMinRangeCircle(latlng) {
    this.mo.minRangeCircle = new L.circle(latlng, {
      draggable: "false",
      radius: 50, // 50 meters == 1579 mill == min range of mortar
      color: "red",
      fillOpacity: 0.05,
      interactive: false,
      clickable: false, // legacy support
    });
  },

  /**
   * Sets the position of the mortar marker
   * @param {L.LatLng} latlng - target position of mortar marker
   * @param {boolean} updateText - whether or not to also update the position label on the page
   */
  setMortar(latlng, updateText = true) {
    this.l.debug("setMortar:", latlng);
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

  createMortar(latlng) {
    // create marker
    this.mo.mortarMarker = new L.marker(latlng, { draggable: "true", icon: Utils.mortarIcon });

    // create green max range circle
    this.createMaxRangeCircle(latlng);

    // create red min range circle
    this.createMinRangeCircle(latlng);

    // add listeners for dragging
    this.mo.mortarMarker.on("dragstart", () => {
      this.dragged = true;
    });
    this.mo.mortarMarker.on("drag", (e) => {
      this.calcAndDraw();
      this.mo.maxRangeCircle.setLatLng(e.latlng);
      this.mo.minRangeCircle.setLatLng(e.latlng);
      this.setMortarPosText(Utils.getKP(e.latlng.lat, e.latlng.lng));
    });
    this.mo.mortarMarker.on("dragend", () => {
      setTimeout(() => { // black magic to not trigger click after drag
        this.dragged = false;
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
   * Convenience function to invoke calculation and line drawing, as they are always updated at the same time.
   */
  calcAndDraw() {
    this.l.debug("calcAndDraw");
    this.calculate();
    this.drawLine();
  },

  /**
   * Sets the position of the target marker
   * @param {L.LatLng} latlng - target position of target marker
   * @param {boolean} updateText - whether or not to also update the position label on the page
   */
  setTarget(latlng, updateText = true) {
    this.l.debug("setTarget:", latlng);
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

  createTarget(latlng) {
    this.mo.targetMarker = new L.marker(latlng, { draggable: "true", icon: Utils.targetIcon });

    // add listeners for dragging
    this.mo.targetMarker.on("dragstart", () => {
      this.dragged = true;
    });
    this.mo.targetMarker.on("drag", (e) => {
      this.calcAndDraw();
      this.setTargetPosText(Utils.getKP(e.latlng.lat, e.latlng.lng));
    });
    this.mo.targetMarker.on("dragend", () => {
      setTimeout(() => { // black magic to not trigger click after drag
        this.dragged = false;
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

    // check what exists and what doesn't
    if (!this.mo.mortarMarker) {
      this.setMortar(e.latlng);
    } else {
      this.setTarget(e.latlng);
      // } else {
      //   // both markers exist, so we create the choice popup
      //   const choicePopUp = L.popup();
      //   const container = L.DomUtil.create("div");
      //
      //   const mortar = Utils.createButton(
      //     `<img src="./images/mortar.png" height=${Utils.iSize} width=${Utils.iSize} style="display: block">`,
      //     container,
      //   );
      //   const target = Utils.createButton(
      //     `<img src="./images/target.png" height=${Utils.iSize} width=${Utils.iSize} style="display: block">`,
      //     container,
      //   );
      //
      //   choicePopUp
      //     .setLatLng(e.latlng)
      //     .setContent(container)
      //     .openOn(this.map);
      //
      //   L.DomEvent.on(mortar, "click", () => {
      //     this.map.closePopup();
      //     this.setMortar(e.latlng);
      //   });
      //
      //   L.DomEvent.on(target, "click", () => {
      //     this.map.closePopup();
      //     this.setTarget(e.latlng);
      //   });
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
