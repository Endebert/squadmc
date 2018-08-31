/**
 * Small utility file exporting static values that are reused often
 * @type {number}
 */
export const ICON_SIZE = 48;
export const MIN_DISTANCE = 50;

export const FOB_RANGE = 150;
export const FOB_DISTANCE = 400;

export const SQUAD_NAME = "SQUAD";
export const SQUAD_VELOCITY = 109.890938;
export const SQUAD_MAX_DISTANCE = 1232;

export const PS_8CM_NAME = "GER 8cm";
export const PS_8CM_VELOCITY = 108.395845;
export const PS_8CM_MAX_DISTANCE = 1198;

export const PS_3INCH_NAME = "BRIT 3″";
export const PS_3INCH_VELOCITY = 119.874256;
export const PS_3INCH_MAX_DISTANCE = 1466;

export const PS_4INCH_NAME = "BRIT 4″";
export const PS_4INCH_VELOCITY = 159.666038;
export const PS_4INCH_MAX_DISTANCE = 2601;

export const GRAVITY = 9.8;
export const MIL_TO_DEG_FACTOR = 360 / 6400;
export const MAX_SUBTARGETS_COUNT = 49;

/**
 * @enum {number}
 */
export const PIN_TYPE = Object.freeze({
  UNKNOWN: -1,
  MORTAR: 0,
  TARGET: 1,
  SUBTARGET: 2,
  FOB: 3,
});

/**
 * @enum {number}
 */
export const TARGET_TYPE = Object.freeze({
  POINT: 0,
  LINE: 1,
  AREA: 2,
});

/**
 * @type {Object.<PIN_TYPE, string[][]>}
 */
const PIN_MAP = {};
PIN_MAP[PIN_TYPE.MORTAR] = [
  ["/img/svg/mortar_pin_red.svg", "/img/svg/mortar_symbol_red.svg", "#F44336"],
  ["/img/svg/mortar_pin_green.svg", "/img/svg/mortar_symbol_green.svg", "#4CAF50"],
  ["/img/svg/mortar_pin_blue.svg", "/img/svg/mortar_symbol_blue.svg", "#2196F3"],
  ["/img/svg/mortar_pin.svg", "/img/svg/mortar_symbol.svg", "#212121"],
];
PIN_MAP[PIN_TYPE.TARGET] = [
  ["/img/svg/target_pin_red.svg", "/img/svg/target_symbol_red.svg", "#F44336"],
  ["/img/svg/target_pin_green.svg", "/img/svg/target_symbol_green.svg", "#4CAF50"],
  ["/img/svg/target_pin_blue.svg", "/img/svg/target_symbol_blue.svg", "#2196F3"],
  ["/img/svg/target_pin.svg", "/img/svg/target_symbol.svg", "#212121"],
];
PIN_MAP[PIN_TYPE.FOB] = [
  ["/img/svg/fob_pin_red.svg", "/img/svg/fob_symbol_red.svg", "#F44336"],
  ["/img/svg/fob_pin_green.svg", "/img/svg/fob_symbol_green.svg", "#4CAF50"],
  ["/img/svg/fob_pin_blue.svg", "/img/svg/fob_symbol_blue.svg", "#2196F3"],
  ["/img/svg/fob_pin.svg", "/img/svg/fob_symbol.svg", "#212121"],
];
export { PIN_MAP };

export const COLORS = Object.freeze({
  IN_RANGE: "#1B5E20",
  OUT_OF_RANGE: "#B71C1C",
  LINE_FIRE: "#F57F17",
  AREA_FIRE: "#F57F17",
  SUBTARGET: "#01579B",
  SUBTARGET_SELECTED: "#F57F17",
});
