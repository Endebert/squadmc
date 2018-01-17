/* eslint-disable new-cap */
/**
 * The Mortar layer group holds the mortar and target icons, their popups, and does the bearing and angle calculations.
 * Also updates the top ribbon of page.
 *
 * @type {*|void}
 */
L.Mortar = L.LayerGroup.extend({
  options: {
    attribution: "Created by Robert Ende",
  },

  l: Logger.get("Mortar"),

  initialize(options) {
    L.LayerGroup.prototype.initialize.call(this);
    L.Util.setOptions(this, options);
    this.resetVars();
  },

  onAdd(map) {
    this.map = map;
    this.map.on("click", this.onMapClick, this);
    this.map.on("baselayerchange", this.reset, this);

    // this.eachLayer(map.addLayer, map);
  },

  onRemove() {
    this.reset();
  },

  /**
   * Removes all markers of this layer that are currently displayed.
   */
  reset() {
    this.eachLayer(this.removeLayer);
    this.resetVars();
  },

  /**
   * Resets all variables to their original value;
   */
  resetVars() {
    this.angle = 0;
    this.elevation = 0;
    this.mo = {};
    this.dragged = false;
    Utils.setMortarPosText();
    Utils.setTargetPosText();
    Utils.setAngleText();
    Utils.setElevationText();
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
   * Calculates angle and bearing for the mortar in-game.
   */
  calculate() {
    if (!this.mo.mortarMarker || !this.mo.targetMarker) {
      return;
    }

    const s = this.mo.mortarMarker.getLatLng();
    const e = this.mo.targetMarker.getLatLng();

    // oh no, vector maths!
    this.angle = Math.atan2(e.lng - s.lng, e.lat - s.lat) * 180 / Math.PI;

    const a = s.lat - e.lat;
    const b = s.lng - e.lng;

    const dist = Math.sqrt(a * a + b * b);
    this.angle = Math.round(180 - this.angle); // rotate so 0° is towards North
    this.elevation = Math.round(Utils.interpolateElevation(dist));

    // 0-padding for angle and elevation
    const strAngle = (`000${this.angle}`).substr(-3);
    const strElevation = Number.isNaN(this.elevation) ? "XXXX" : (`0000${this.elevation}`).substr(-4);

    Utils.setAngleText(`${strAngle}°`);
    Utils.setElevationText(strElevation);
  },

  /**
   * Sets the position of the mortar marker
   * @param latlng - target position of mortar marker
   */
  setMortar(latlng) {
    // if marker doesn't exist, we have to create it and its components first
    if (!this.mo.mortarMarker) {
      // create marker
      this.mo.mortarMarker = new L.marker(latlng, { draggable: "true", icon: Utils.mortarIcon });

      // create green max range circle
      this.mo.maxRangeCircle = new L.circle(latlng, {
        draggable: "false",
        radius: 1250, // 1250 meters == 800 mill == max range of mortar
        color: "green",
        fillOpacity: 0.05,
        interactive: false,
        clickable: false, // legacy support
      });

      // create red min range circle
      this.mo.minRangeCircle = new L.circle(latlng, {
        draggable: "false",
        radius: 50, // 50 meters == 1579 mill == min range of mortar
        color: "red",
        fillOpacity: 0.05,
        interactive: false,
        clickable: false, // legacy support
      });

      // add listeners for dragging
      this.mo.mortarMarker.on("dragstart", () => {
        this.dragged = true;
      });
      this.mo.mortarMarker.on("drag", (e) => {
        this.calcAndDraw();
        this.mo.maxRangeCircle.setLatLng(e.latlng);
        this.mo.minRangeCircle.setLatLng(e.latlng);
        document.getElementById("mortarPos").innerText = Utils.getKP(e.latlng.lat, e.latlng.lng);
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
    } else {
      // if everything exists already, we just move the marker and components to the target position
      this.mo.mortarMarker.setLatLng(latlng);
      this.mo.maxRangeCircle.setLatLng(latlng);
      this.mo.minRangeCircle.setLatLng(latlng);
    }

    // now that the position is set, we calculate angle & bearing and draw the line between mortar and target marker
    this.calcAndDraw();

    // also update top ribbon to show the correct keypad
    Utils.setMortarPosText(Utils.getKP(latlng.lat, latlng.lng));
  },

  /**
   * Convenience function to invoke calculation and line drawing, as they are always updated at the same time.
   */
  calcAndDraw() {
    this.calculate();
    this.drawLine();
  },

  /**
   * Sets the position of the target marker
   * @param latlng - target position of target marker
   */
  setTarget(latlng) {
    // if target marker doesn't exist, we have to create it first
    if (!this.mo.targetMarker) {
      this.mo.targetMarker = new L.marker(latlng, { draggable: "true", icon: Utils.targetIcon });

      // add listeners for dragging
      this.mo.targetMarker.on("dragstart", () => {
        this.dragged = true;
      });
      this.mo.targetMarker.on("drag", (e) => {
        this.calcAndDraw();
        document.getElementById("targetPos").innerText = Utils.getKP(e.latlng.lat, e.latlng.lng);
      });
      this.mo.targetMarker.on("dragend", () => {
        setTimeout(() => { // black magic to not trigger click after drag
          this.dragged = false;
        }, 10);
      });

      // now add marker to layer
      this.mo.targetMarker.addTo(this);
    } else {
      // if marker exists already, we just move it to the target position
      this.mo.targetMarker.setLatLng(latlng);
    }
    this.calcAndDraw();

    // also update top ribbon to show the correct keypad
    Utils.setTargetPosText(Utils.getKP(latlng.lat, latlng.lng));
  },

  /**
   * Handles click events on the map.
   * 1. if no marker exists, add mortar marker at click position
   * 2. if mortar marker exists, add target marker at click position
   * 3. if both markers exist, show popup to allow choosing which marker to put at click position
   * @param e - "click" event object
   * @returns {boolean} - always returns true
   */
  onMapClick(e) {
    // black magic to not trigger click after drag
    if (this.dragged) {
      return true;
    }

    // check what exists and what doesn't
    if (!this.mo.mortarMarker) {
      this.setMortar(e.latlng);
    } else if (!this.mo.targetMarker) {
      this.setTarget(e.latlng);
    } else {
      // both markers exist, so we create the choice popup
      const choicePopUp = L.popup();
      const container = L.DomUtil.create("div");

      const mortar = Utils.createButton(
        `<img src="./images/mortar.png" height=${Utils.iSize} width=${Utils.iSize}>`,
        container,
      );
      const target = Utils.createButton(
        `<img src="./images/target.png" height=${Utils.iSize} width=${Utils.iSize}>`,
        container,
      );

      choicePopUp
        .setLatLng(e.latlng)
        .setContent(container)
        .openOn(this.map);

      L.DomEvent.on(mortar, "click", () => {
        this.map.closePopup();
        this.setMortar(e.latlng);
      });

      L.DomEvent.on(target, "click", () => {
        this.map.closePopup();
        this.setTarget(e.latlng);
      });
    }

    // in debug mode we copy the click coordinates to the clipboard
    if (window.DEBUG) {
      Utils.copyTextToClipboard(`[${Math.round(e.latlng.lat)}, ${Math.round(e.latlng.lng)}]`);
    }

    return true;
  }
  ,

});

L.mortar = options => new L.Mortar(options);
