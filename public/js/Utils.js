/**
 * Utility class containing helper functions and objects.
 */

const iconSize = 48;

const Utils = {
  l: log.getLogger("Utils"),

  iSize: iconSize, // icon size
  DEBUG: localStorage.getItem("debug") === "true",

  MIN_DISTANCE: 50,
  MAX_DISTANCE: 1234,
  VELOCITY: 110,
  GRAVITY: 9.81,
  MIL_TO_DEG_FACTOR: 360 / 6400,

  // icon for mortar marker
  mortarIcon: L.icon({
    iconUrl: "images/mortar_marker.png",

    iconSize: [iconSize, iconSize], // size of the icon
    iconAnchor: [8, 8], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -iconSize / 2], // point from which the popup should open relative to the iconAnchor
  }),

  // icon for target marker
  targetIcon:
    L.icon({
      iconUrl: "images/target_marker.png",

      iconSize: [iconSize, iconSize], // size of the icon
      iconAnchor: [8, 8], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -iconSize / 2], // point from which the popup should open relative to the iconAnchor
    }),

  /**
   * Converts NATO mils to degrees
   * @param {number} mil - NATO mils
   * @returns {number} degrees
   */
  milToDeg(mil) {
    return mil * this.MIL_TO_DEG_FACTOR;
  },

  /**
   * Converts degrees into radians
   * @param {number} deg - degrees
   * @returns {number} radians
   */
  degToRad(deg) {
    return deg * Math.PI / 180;
  },

  /**
   * Converts radians into degrees
   * @param {number} rad - radians
   * @returns {number} degrees
   */
  radToDeg(rad) {
    return rad * 180 / Math.PI;
  },

  /**
   * Converts degrees into NATO mils
   * @param {number} deg - degrees
   * @returns {number} NATO mils
   */
  degToMil(deg) {
    return deg / this.MIL_TO_DEG_FACTOR;
  },

  /**
   * Converts radians into NATO mils
   * @param {number} rad - radians
   * @returns {number} NATO mils
   */
  radToMil(rad) {
    return this.degToMil(this.radToDeg(rad));
  },

  /**
   * Converts NATO mils into radians
   * @param mil - NATO mils
   * @returns {number} radians
   */
  milToRad(mil) {
    return this.degToRad(this.milToDeg(mil));
  },

  /**
   * Calculates the keypad coordinates for a given latlng coordinate, e.g. "A5-3-7"
   * @param lat - latitude coordinate
   * @param lng - longitude coordinate
   * @returns {string} keypad coordinates as string
   */
  getKP(lat, lng) {
    this.l.debug("getKP:", [lat, lng]);

    // to minimize confusion
    const x = lng;
    const y = lat;

    if (x < 0 || y < 0) {
      return "XXX-X-X"; // when outside of min bounds
    }
    const kp = 300 / (3 ** 0); // interval of main keypad, e.g "A5"
    const s1 = 300 / (3 ** 1); // interval of first sub keypad
    const s2 = 300 / (3 ** 2); // interval of second sub keypad

    // basic grid, e.g. B5
    const kpCharCode = 65 + Math.floor(x / kp);
    const kpLetter = String.fromCharCode(kpCharCode);
    const kpNumber = Math.floor(y / kp) + 1;

    // sub keypad 1, e.g. B5 - 5
    // ok when we go down, we have 3x3 pads and start with the left most column, i.e. 7,4,1
    // so we check which index y is in, either 1st (7), 2nd (4), or 3rd (1)
    const subY = Math.floor(y / s1) % 3;

    // now we substract the index times 3 from 10
    // 1st = 10 - 1*3 = 7
    // 1st = 10 - 2*3 = 4
    // 1st = 10 - 3*3 = 1
    let subNumber = 10 - ((subY + 1) * 3);

    // now all we need to do is add the index for of x, but starting from 0
    subNumber += Math.floor(x / s1) % 3;

    // sub keypad 2, e.g. B5 - 5 - 3;
    // same as above for sub keypad 1
    const sub2Y = Math.floor(y / s2) % 3;
    let sub2Number = 10 - ((sub2Y + 1) * 3);
    sub2Number += Math.floor(x / s2) % 3;

    return `${kpLetter}${Utils.pad(kpNumber, 2)}-${subNumber}-${sub2Number}`;
  },

  /**
   * Helper function that takes a text and copies it to the clipboard using black magic.
   * Taken from https://stackoverflow.com/a/30810322.
   * @param text - text will be copied to the clipboard
   */
  copyTextToClipboard(text) {
    const textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = "2em";
    textArea.style.height = "2em";

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = "transparent";

    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
      const successful = document.execCommand("copy");
      const msg = successful ? "successful" : "unsuccessful";
      this.l.debug(`Copying text ${text} was ${msg}`);
    } catch (err) {
      this.l.debug("Oops, unable to copy");
    }

    document.body.removeChild(textArea);
  },

  /**
   * 0-padding for numbers.
   * @param num - number to be padded
   * @param size - size of target string length, e.g. size == 4 == 4 digits
   * @returns {string} padded number as string
   */
  pad(num, size) {
    return (`0000${num}`).substr(-size);
  },

  /**
   * Create location marker with the given name at the given location
   * @param name - name of the location
   * @param latlng - target position of marker
   * @returns {L.CircleMarker} generated marker
   */
  createLocation(name, latlng) {
    const marker = L.circleMarker(latlng, {
      draggable: false,
      radius: 8,
      color: "#000000",
      stroke: true,
      weight: 2,
      fillColor: "#ffc400",
      fillOpacity: 0.5,
      interactive: false,
      clickable: false, // legacy support
    });
    // bind name label to marker
    marker.bindTooltip(name, { permanent: true, direction: "top", offset: [0, -8] });
    return marker;
  },

  /**
   * Returns true if 'a' is a multiple of 'b' with a precision up to 4 decimals
   *
   * @param a
   * @param b
   * @returns {boolean} true if 'a' is a multiple of 'b' with a precision up to 4 decimals, false otherwise
   */
  isMultiple(a, b) {
    const t = b / a;
    const r = Math.round(t);
    const d = t >= r ? t - r : r - t;
    return d < 0.0001;
  },

  /**
   * Update bearing in top ribbon.
   * @param text - updated bearing
   */
  setBearingText(text = "") {
    document.getElementById("mapBearing").innerText = `✵ ${text}`;
  },

  /**
   * Update elevation in top ribbon.
   * @param text - updated elevation
   */
  setElevationText(text = "") {
    document.getElementById("mapElevation").innerText = `∠ ${text}`;
  },

  /**
   * Update distance in top ribbon.
   * @param text - updated distance
   */
  setDistanceText(text = "") {
    document.getElementById("mapDistance").innerText = `↔ ${text}`;
  },

  /**
   * Update height difference in top ribbon.
   * @param text - updated distance
   */
  setHeightDiffText(text = "") {
    document.getElementById("mapHeightDiff").innerText = `↕ ${text}`;
  },

  /**
   * Return a map from MAPDATA matching the given name.
   * @param name - map name
   */
  getMap(name) {
    return MAPDATA[name].map;
  },

  /**
   * Returns bounds of the map matching given name.
   * @param name - map name
   * @returns {L.LatLngBounds} map bounds if available, undefined otherwise
   */
  getMapBounds(name) {
    try {
      const map = MAPDATA[name].map;
      return map.options.bounds || map.getBounds();
    } catch (e) {
      this.l.debug("failed to get map bounds for:", name);
      return undefined;
    }
  },

  /**
   * Returns locations of the map matching given name.
   * @param name - map name
   * @returns {L.CircleMarker[]} array of location markers
   */
  getMapLocations(name) {
    return MAPDATA[name].locations;
  },

  /**
   * Returns heightmap of the map matching given name.
   * @param name - map name
   * @returns {Object} object containing url and scale
   */
  getHeightmap(name) {
    return MAPDATA[name].heightmap;
  },

  /**
   * Create a button with the given contents, to be bound to the given container.
   * @param label - button contents
   * @param container - container for button to be bound to
   * @returns {button} bound button
   */
  createButton(label, container) {
    const btn = L.DomUtil.create("button", "", container);
    btn.setAttribute("type", "button");
    btn.innerHTML = label;
    return btn;
  },

  /**
   * Calculates the angle the mortar needs to be set,
   * in order to hit the target at the desired distance and vertical delta.
   *
   * Function taken from https://en.wikipedia.org/wiki/Projectile_motion
   *
   * @param {number} x - distance between mortar and target
   * @param {number} [y] - vertical delta between mortar and target
   * @param {number} [v] - initial mortar projectile velocity
   * @param {number} [g] - gravity force
   * @returns {number || NaN} mil if target in range, NaN otherwise
   */
  calcMortarAngle(x, y = 0, v = this.VELOCITY, g = this.GRAVITY) {
    const p1 = Math.sqrt(v ** 4 - g * (g * x ** 2 + 2 * y * v ** 2));
    const a1 = Math.atan((v ** 2 + p1) / (g * x));
    // const a2 = Math.atan((v ** 2 - p1) / (g * x)); // no need to calculate, angle is always below 45°/800mil

    return this.radToMil(a1);
  },

  /**
   * Small helper function to set global DEBUG variable
   * @param state - debug state flag. true for debug mode, false otherwise
   */
  setDebugMode(state = false) {
    log.debug("setDebugMode:", state);
    this.DEBUG = state;
    log.setDefaultLevel(this.DEBUG ? log.levels.DEBUG : log.levels.INFO);
    localStorage.setItem("debug", this.DEBUG.toString());
  },

  /**
   * Toggles debug mode
   */
  toggleDebugMode() {
    this.setDebugMode(!this.DEBUG);
  },

  /**
   * Returns the debug mode state
   * @returns {boolean} true if debug mode is enabled, false otherwise
   */
  isDebug() {
    return this.DEBUG;
  },

  /**
   * Format keypad input, setting text to uppercase and adding dashes
   * @param {string} text - keypad string to be formatted
   * @returns {string} formatted string
   */
  formatKeyPad(text = "") {
    this.l.debug("formatKeyPad:", text);

    // special case if people prefer to input "A2-3-4" over "A0234"
    // check if length is 3 and third letter is a dash, then just convert to padded
    if (text.length === 3 && text[2] === "-") {
      // eslint-disable-next-line no-param-reassign
      text = text[0] + Utils.pad(text[1], 2);
    }
    const textND = text.toUpperCase().split("-").join("");
    const textParts = [];

    textParts.push(textND.slice(0, 3));

    // iteration through sub-keypads
    let i = 3;
    while (i < textND.length) {
      textParts.push(textND.slice(i, i + 1));
      i++;
    }

    const formattedText = textParts.join("-");
    this.l.debug("formattedText:", formattedText);
    return formattedText;
  },

  /**
   * Returns the latlng coordinates based on the given keypad string. Supports unlimited amount of sub-keypads.
   * Throws error if keypad string is too short or parsing results in invalid latlng coordinates.
   * @param {string} kp - keypad coordinates, e.g. "A02-3-5-2"
   * @returns {L.LatLng} converted coordinates
   */
  getPos(kp) {
    this.l.debug("getPos:", kp);

    // eslint-disable-next-line no-param-reassign
    kp = Utils.formatKeyPad(kp);

    if (!kp || kp.length < 2) {
      throw new Error(`invalid keypad string: ${kp}`);
    }

    const parts = kp.split("-");
    let x = 0;
    let y = 0;

    // "i" is is our (sub-)keypad indicator
    let i = 0;
    while (i < parts.length) {
      if (i === 0) {
        // special case, i.e. letter + number combo
        const letterCode = parts[i].charCodeAt(0);
        const letterIndex = letterCode - 65;
        const kpNr = Number(parts[i].slice(1)) - 1;

        x += 300 * letterIndex;
        y += 300 * kpNr;
      } else {
        // opposite of calculations in getKP()
        const sub = Number(parts[i]);
        if (Number.isNaN(sub)) {
          throw new Error(`Invalid keypad string: ${kp}`);
        }
        const subX = (sub - 1) % 3;
        const subY = 2 - (Math.ceil(sub / 3) - 1);

        const interval = 300 / (3 ** i);
        x += (interval * subX);
        y += (interval * subY);
      }
      i++;
    }
    i--;

    // at the end, add half of last interval, so it points to the center of the deepest sub-keypad
    const interval = 300 / (3 ** i);
    x += interval / 2;
    y += interval / 2;

    this.l.debug("calculated pos:", [y, x]);

    // might throw error
    return L.latLng(y, x);
  },

  /**
   * Resizes input elements when their content changes.
   * Also listens on a custom event that can be invoked by the L.Mortar layer to signal a programmatic change.
   * @param el - element to be watched for value changes
   */
  resizeHandler(el) {
    const resize = () => {
      // eslint-disable-next-line no-param-reassign
      el.style.width = `${((el.value.length + 1) / 10 * 5.5)}em`;
    };
    const events = "keyup,keydown,keypress,focus,blur,change,custom".split(",");
    events.forEach((e) => {
      el.addEventListener(e, resize, false);
    });
    resize();
  },
};

// initialize Logger
Utils.setDebugMode(Utils.DEBUG);

window.Utils = Utils;
