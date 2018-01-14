/**
 * Utility class containing helper functions and objects.
 */

const iconSize = 48;

window.Utils = {
  // variables representing values in top ribbon, will be set to initial value on first time access (see below)
  iMortarPos: undefined,
  iTargetPos: undefined,
  iAngle: undefined,
  iElevation: undefined,

  iSize: iconSize, // icon size

  // icon for mortar marker
  mortarIcon: L.icon({
    iconUrl: "images/mortar.png",

    iconSize: [iconSize, iconSize], // size of the icon
    iconAnchor: [iconSize / 2, iconSize / 2], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -iconSize / 2], // point from which the popup should open relative to the iconAnchor
  }),

  // icon for target marker
  targetIcon: L.icon({
    iconUrl: "images/target.png",

    iconSize: [iconSize, iconSize], // size of the icon
    iconAnchor: [iconSize / 2, iconSize / 2], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -iconSize / 2], // point from which the popup should open relative to the iconAnchor
  }),

  /**
   * Calculates the keypad coordinates for a given latlng coordinate, e.g. "A5-3-7"
   * @param lat - latitude coordinate
   * @param lng - longitude coordinate
   * @returns {string} - keypad coordinates as string
   */
  getKP(lat, lng) {
    // to minimize confusion
    const x = lng;
    const y = lat;

    if (x < 0 || y < 0) {
      return "XX-X-X"; // when outside of min bounds
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

    return `${kpLetter}${kpNumber}-${subNumber}-${sub2Number}`;
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
      console.log(`Copying text ${text} was ${msg}`);
    } catch (err) {
      console.log("Oops, unable to copy");
    }

    document.body.removeChild(textArea);
  },

  /**
   * 0-padding for numbers.
   * @param num - number to be padded
   * @param size - size of target string length, e.g. size == 4 == 4 digits
   * @returns {string} - padded number as string
   */
  pad(num, size) {
    return (`0000${num}`).substr(-size);
  },

  /**
   * Create location marker with the given name at the given location
   * @param name - name of the location
   * @param latlng - target position of marker
   * @returns {L.CircleMarker} - generated marker
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
   * @returns {boolean}
   */
  isMultiple(a, b) {
    const t = b / a;
    const r = Math.round(t);
    const d = t >= r ? t - r : r - t;
    return d < 0.0001;
  },

  /**
   * Update mortar position in top ribbon.
   * @param text - updated mortar position, leave undefined to reset to initial value
   */
  setMortarPosText(text) {
    if (!this.iMortarPos) {
      this.iMortarPos = document.getElementById("mortarPos").innerText;
    }

    if (text) {
      document.getElementById("mortarPos").innerText = text;
    } else {
      document.getElementById("mortarPos").innerText = this.iMortarPos;
    }
  },

  /**
   * Update target position in top ribbon.
   * @param text - updated target position, leave undefined to reset to initial value
   */
  setTargetPosText(text) {
    if (!this.iTargetPos) {
      this.iTargetPos = document.getElementById("targetPos").innerText;
    }

    if (text) {
      document.getElementById("targetPos").innerText = text;
    } else {
      document.getElementById("targetPos").innerText = this.iTargetPos;
    }
  },

  /**
   * Update angle in top ribbon.
   * @param text - updated angle, leave undefined to reset to initial value
   */
  setAngleText(text) {
    if (!this.iAngle) {
      this.iAngle = document.getElementById("mapAngle").innerText;
    }

    if (text) {
      document.getElementById("mapAngle").innerText = text;
    } else {
      document.getElementById("mapAngle").innerText = this.iAngle;
    }
  },

  /**
   * Update elevation in top ribbon.
   * @param text - updated elevation, leave undefined to reset to initial value
   */
  setElevationText(text) {
    if (!this.iElevation) {
      this.iElevation = document.getElementById("mapBearing").innerText;
    }

    if (text) {
      document.getElementById("mapBearing").innerText = text;
    } else {
      document.getElementById("mapBearing").innerText = this.iElevation;
    }
  },

  /**
   * Create a button with the given contents, to be bound to the given container.
   * @param label - button contents
   * @param container - container for button to be bound to
   * @returns {button} - bound button
   */
  createButton(label, container) {
    const btn = L.DomUtil.create("button", "", container);
    btn.setAttribute("type", "button");
    btn.innerHTML = label;
    return btn;
  },

  /**
   * bearing calculation returning the correct mill for the mortar in-game based on distance.
   * Taken from https://github.com/lorenmh/sc-react.
   * @param distance - distance between mortar and target
   * @returns {*} - mill for in-game mortar, "TOO_FAR" if target is too far away, "TOO_CLOSE" if target is too close.
   */
  interpolateElevation(distance) {
    const MORTAR_TABLE = [
      [50, 1579],
      [100, 1558],
      [150, 1538],
      [200, 1517],
      [250, 1496],
      [300, 1475],
      [350, 1453],
      [400, 1431],
      [450, 1409],
      [500, 1387],
      [550, 1364],
      [600, 1341],
      [650, 1317],
      [700, 1292],
      [750, 1267],
      [800, 1240],
      [850, 1212],
      [900, 1183],
      [950, 1152],
      [1000, 1118],
      [1050, 1081],
      [1100, 1039],
      [1150, 988],
      [1200, 918],
      [1250, 800],
    ];

    const MIN_DISTANCE = MORTAR_TABLE[0][0];
    const MAX_DISTANCE = MORTAR_TABLE[MORTAR_TABLE.length - 1][0];

    const TOO_FAR = "TOO_FAR";
    const TOO_CLOSE = "TOO_CLOSE";
    const ERROR = "ERROR";

    if (distance < MIN_DISTANCE) return TOO_CLOSE;
    if (distance > MAX_DISTANCE) return TOO_FAR;

    for (let i = 0; i < MORTAR_TABLE.length; i++) {
      const currentTableEntry = MORTAR_TABLE[i];
      const nextTableEntry = MORTAR_TABLE[i + 1];
      const currentX = currentTableEntry[0];
      const currentY = currentTableEntry[1];
      if (distance === currentX) return currentY;

      const nextX = nextTableEntry[0];

      // eslint-disable-next-line no-continue
      if (distance >= nextX) continue;

      const nextY = nextTableEntry[1];
      const slope = (nextY - currentY) / (nextX - currentX);
      const deltaX = distance - currentX;

      // rounded to nearest .1
      return Math.round(((slope * deltaX) + currentY) * 10) / 10;
    }

    return ERROR;
  },
};