/**
 * Small utility file exporting static values that are reused often
 * @type {number}
 */

export const ICON_SIZE = 48;
export const MIN_DISTANCE = 50;
export const FOB_RANGE = 150;
export const FOB_DISTANCE = 400;
export const MAX_DISTANCE = 1234;
export const VELOCITY = 110;
export const GRAVITY = 9.80;
export const MIL_TO_DEG_FACTOR = 360 / 6400;
export const PIN_TYPE = Object.freeze({
  MORTAR: 0,
  TARGET: 1,
  FOB: 2,
});
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
