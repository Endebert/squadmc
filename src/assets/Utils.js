import { LatLng } from "leaflet";
import {
  MIL_TO_DEG_FACTOR,
  NATO_MIL_TO_DEG_FACTOR,
  GRAVITY,
  PIN_MAP,
  SQUAD_VELOCITY,
  SQUAD_NAME,
  SQUAD_MAX_DISTANCE,
  PS_8CM_NAME,
  PS_8CM_VELOCITY,
  PS_8CM_MAX_DISTANCE,
  PS_4INCH_MAX_DISTANCE,
  PS_4INCH_VELOCITY,
  PS_4INCH_NAME,
  PS_3INCH_MAX_DISTANCE,
  PS_3INCH_VELOCITY, PS_3INCH_NAME,
  PS_6CM_NAME, PS_6CM_VELOCITY, PS_6CM_MAX_DISTANCE,
} from "./Vars";
import MortarType from "./MortarType";

/**
 * Utility file exporting helper functions and objects.
 */

/**
 * Converts NATO mils to degrees
 * @param {number} mil - NATO mils
 * @returns {number} degrees
 */
export function natoMilToDeg(mil) {
  return mil * NATO_MIL_TO_DEG_FACTOR;
}

/**
 * Converts mils to degrees
 * @param {number} mil - NATO mils
 * @returns {number} degrees
 */
export function milToDeg(mil) {
  return mil * MIL_TO_DEG_FACTOR;
}

/**
 * Converts degrees into radians
 * @param {number} deg - degrees
 * @returns {number} radians
 */
export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Converts radians into degrees
 * @param {number} rad - radians
 * @returns {number} degrees
 */
export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

/**
 * Converts degrees into mils
 * @param {number} deg - degrees
 * @returns {number} NATO mils
 */
export function degToMil(deg) {
  return deg / MIL_TO_DEG_FACTOR;
}


/**
 * Converts degrees into NATO mils
 * @param {number} deg - degrees
 * @returns {number} NATO mils
 */
export function degToNatoMil(deg) {
  return deg / NATO_MIL_TO_DEG_FACTOR;
}

/**
 * Converts radians into mils
 * @param {number} rad - radians
 * @returns {number} mils
 */
export function radToMil(rad) {
  return degToMil(radToDeg(rad));
}

/**
 * Converts radians into NATO mils
 * @param {number} rad - radians
 * @returns {number} NATO mils
 */
export function radToNatoMil(rad) {
  return degToNatoMil(radToDeg(rad));
}

/**
 * Converts mils into radians
 * @param mil - mils
 * @returns {number} radians
 */
export function milToRad(mil) {
  return degToRad(milToDeg(mil));
}


/**
 * Converts NATO mils into radians
 * @param mil - NATO mils
 * @returns {number} radians
 */
export function natoMilToRad(mil) {
  return degToRad(natoMilToDeg(mil));
}

/**
 * 0-padding for numbers.
 * @param num - number to be padded
 * @param size - size of target string length, e.g. size == 4 == 4 digits
 * @returns {string} padded number as string
 */
export function pad(num, size) {
  return `0000${num}`.substr(-size);
}

/**
 * Calculates the keypad coordinates for a given latlng coordinate, e.g. "A5-3-7"
 * @param lat - latitude coordinate
 * @param lng - longitude coordinate
 * @returns {string} keypad coordinates as string
 */
export function getKP(lat, lng) {
  // to minimize confusion
  const x = lng;
  const y = lat;

  if (x < 0 || y < 0) {
    return "XXX-X-X"; // when outside of min bounds
  }
  const kp = 300 / 3 ** 0; // interval of main keypad, e.g "A5"
  const s1 = 300 / 3 ** 1; // interval of first sub keypad
  const s2 = 300 / 3 ** 2; // interval of second sub keypad

  // basic grid, e.g. B5
  const kpCharCode = 65 + Math.floor(x / kp);
  let kpLetter;
  // PostScriptum Arnhem Lane A->Z and then a->b letters fix
  if (kpCharCode > 90) {
    kpLetter = String.fromCharCode(kpCharCode + 6);
  } else {
    kpLetter = String.fromCharCode(kpCharCode);
  }

  const kpNumber = Math.floor(y / kp) + 1;

  // sub keypad 1, e.g. B5 - 5
  // ok when we go down, we have 3x3 pads and start with the left most column, i.e. 7,4,1
  // so we check which index y is in, either 1st (7), 2nd (4), or 3rd (1)
  const subY = Math.floor(y / s1) % 3;

  // now we substract the index times 3 from 10
  // 1st = 10 - 1*3 = 7
  // 1st = 10 - 2*3 = 4
  // 1st = 10 - 3*3 = 1
  let subNumber = 10 - (subY + 1) * 3;

  // now all we need to do is add the index for of x, but starting from 0
  subNumber += Math.floor(x / s1) % 3;

  // sub keypad 2, e.g. B5 - 5 - 3;
  // same as above for sub keypad 1
  const sub2Y = Math.floor(y / s2) % 3;
  let sub2Number = 10 - (sub2Y + 1) * 3;
  sub2Number += Math.floor(x / s2) % 3;

  return `${kpLetter}${pad(kpNumber, 2)}-${subNumber}-${sub2Number}`;
}

/**
 * Returns true if 'a' is a multiple of 'b' with a precision up to 4 decimals
 *
 * @param a
 * @param b
 * @returns {boolean} true if 'a' is a multiple of 'b' with a precision up to 4 decimals,
 *                    false otherwise
 */
export function isMultiple(a, b) {
  const t = b / a;
  const r = Math.round(t);
  const d = t >= r ? t - r : r - t;
  return d < 0.0001;
}

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
 * @returns {number || NaN} NATO mil if target in range, NaN otherwise
 */
export function getNatoElevation(x, y = 0, v = SQUAD_VELOCITY, g = GRAVITY) {
  const p1 = Math.sqrt(v ** 4 - g * (g * x ** 2 + 2 * y * v ** 2));
  const a1 = Math.atan((v ** 2 + p1) / (g * x));
  // const a2 = Math.atan((v ** 2 - p1) / (g * x));
  // no need to calculate, angle is always below 45°/800mil

  return radToNatoMil(a1);
}

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
export function getElevation(x, y = 0, v = SQUAD_VELOCITY, g = GRAVITY) {
  const p1 = Math.sqrt(v ** 4 - g * (g * x ** 2 + 2 * y * v ** 2));
  const a1 = Math.atan((v ** 2 + p1) / (g * x));
  // const a2 = Math.atan((v ** 2 - p1) / (g * x));
  // no need to calculate, angle is always below 45°/800mil

  return radToMil(a1);
}

/**
 * Format keypad input, setting text to uppercase and adding dashes
 * @param {string} text - keypad string to be formatted
 * @returns {string} formatted string
 */
export function formatKeyPad(text = "") {
  // special case if people prefer to input "A2-3-4" over "A0234"
  // check if length is 3 and third letter is a dash, then just convert to padded
  if (text.length === 3 && text[2] === "-") {
    // eslint-disable-next-line no-param-reassign
    text = text[0] + pad(text[1], 2);
  }
  const textND = text
    .toUpperCase()
    .split("-")
    .join("");
  const textParts = [];

  textParts.push(textND.slice(0, 3));

  // iteration through sub-keypads
  let i = 3;
  while (i < textND.length) {
    textParts.push(textND.slice(i, i + 1));
    i += 1;
  }

  return textParts.join("-");
}

/**
 * Returns the latlng coordinates based on the given keypad string.
 * Supports unlimited amount of sub-keypads.
 * Throws error if keypad string is too short or parsing results in invalid latlng coordinates.
 * @param {string} kp - keypad coordinates, e.g. "A02-3-5-2"
 * @returns {LatLng} converted coordinates
 */
export function getPos(kp) {
  const fkp = formatKeyPad(kp);

  if (!fkp || fkp.length < 2) {
    throw new Error(`invalid keypad string: ${fkp}`);
  }

  const parts = fkp.split("-");
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
        throw new Error(`Invalid keypad string: ${fkp}`);
      }
      const subX = (sub - 1) % 3;
      const subY = 2 - (Math.ceil(sub / 3) - 1);

      const interval = 300 / 3 ** i;
      x += interval * subX;
      y += interval * subY;
    }
    i += 1;
  }

  // at the end, add half of last interval, so it points to the center of the deepest sub-keypad
  const interval = 300 / 3 ** (i - 1);
  x += interval / 2;
  y += interval / 2;

  // might throw error
  return new LatLng(y, x);
}

/**
 * Calculates the distance between two points.
 *
 * @param {LatLng} a - point A
 * @param {LatLng} b - point B
 * @returns {number} distance A and B
 */
export function getDist(a, b) {
  const dLat = a.lat - b.lat;
  const dLng = a.lng - b.lng;

  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Calculates the bearing required to see point B from point A.
 *
 * @param {LatLng} a - base point A
 * @param {LatLng} b - target point B
 * @returns {number} - bearing required to see B from A
 */
export function getBearing(a, b) {
  // oh no, vector maths!
  let bearing = Math.atan2(b.lng - a.lng, b.lat - a.lat) * 180 / Math.PI;

  // point it north and do some rounding
  bearing = (180 - bearing) % 360;

  return bearing;
}

/**
 * Calculates mortar settings for a mortar to hit a target.
 *
 * @param {LatLng} mPos - mortar position
 * @param {LatLng} tPos - target position
 * @param {number} mVel - mortar shell velocity
 * @param {number} [dHeight] - height difference between mortar and target, defaults to 0
 * @param {boolean} [useNatoMils] - use regular Milliradians or NATO Milliradians (Squad uses NATO mils)
 * @returns {{bearing: number, elevation: (number|NaN), dist: number, dHeight: number}} - bearing and elevation settings
 *  required to hit target. Elevation is NaN if target is out of range.
 */
export function getMortarSettings(mPos, tPos, mVel, dHeight = 0, useNatoMils = true) {
  const bearing = getBearing(mPos, tPos);
  const dist = getDist(mPos, tPos);
  const elevation = useNatoMils ? getNatoElevation(dist, dHeight, mVel) : getElevation(dist, dHeight, mVel);

  return {
    bearing,
    elevation,
    dist,
    dHeight,
  };
}

/**
 * Get available mortar types for Squad
 *
 * @returns {MortarType[]} - list of mortar types
 */
export function getSquadMortarTypes() {
  return [new MortarType(SQUAD_NAME, SQUAD_VELOCITY, SQUAD_MAX_DISTANCE)];
}

/**
 * Get available mortar types for Post Scriptum
 *
 * @returns {MortarType[]} - list of mortar types
 */
export function getPSMortarTypes() {
  return [
    new MortarType(PS_8CM_NAME, PS_8CM_VELOCITY, PS_8CM_MAX_DISTANCE),
    new MortarType(PS_6CM_NAME, PS_6CM_VELOCITY, PS_6CM_MAX_DISTANCE),
    new MortarType(PS_3INCH_NAME, PS_3INCH_VELOCITY, PS_3INCH_MAX_DISTANCE),
    new MortarType(PS_4INCH_NAME, PS_4INCH_VELOCITY, PS_4INCH_MAX_DISTANCE),
  ];
}

export function pinToPSC(pinUrl) {
  // console.log("pinToPSC:", pinUrl);
  // pscss = [[[Pin, Symbol, Color]]]
  const pscss = Object.values(PIN_MAP);
  for (let i = 0; i < pscss.length; i++) {
    // pscs = [[Pin, Symbol, Color]]
    const pscs = pscss[i];
    for (let j = 0; j < pscs.length; j++) {
      // psc = [Pin, Symbol, Color]
      const psc = pscs[j];
      // return on match
      if (psc[0] === pinUrl) {
        return psc;
      }
    }
  }
  // no match was found, throw error
  throw new Error(`pinToPSC: No array found for pinUrl ${pinUrl}!`);
}

export function pinToSymbol(pinUrl) {
  console.log("pinToSymbol:", pinUrl);
  return pinToPSC(pinUrl)[1];
}

export function pinToColor(pinUrl) {
  console.log("pinToColor:", pinUrl);
  return pinToPSC(pinUrl)[2];
}

export function getPinUrls(type) {
  const pins = [];
  PIN_MAP[type].forEach((psc) => {
    pins.push(psc[0]);
  });
  return pins;
}

export function getSymbolUrls(type) {
  const symbols = [];
  PIN_MAP[type].forEach((psc) => {
    symbols.push(psc[1]);
  });
  return symbols;
}
