import mortarPinRed from "./svg/mortar_pin_red.svg";
import mortarSymbolRed from "./svg/mortar_symbol_red.svg";
import mortarPinGreen from "./svg/mortar_pin_green.svg";
import mortarSymbolGreen from "./svg/mortar_symbol_green.svg";
import mortarPinBlue from "./svg/mortar_pin_blue.svg";
import mortarSymbolBlue from "./svg/mortar_symbol_blue.svg";
import mortarPin from "./svg/mortar_pin.svg";
import mortarSymbol from "./svg/mortar_symbol.svg";

import targetPinRed from "./svg/target_pin_red.svg";
import targetSymbolRed from "./svg/target_symbol_red.svg";
import targetPinGreen from "./svg/target_pin_green.svg";
import targetSymbolGreen from "./svg/target_symbol_green.svg";
import targetPinBlue from "./svg/target_pin_blue.svg";
import targetSymbolBlue from "./svg/target_symbol_blue.svg";
import targetPin from "./svg/target_pin.svg";
import targetSymbol from "./svg/target_symbol.svg";

import fobPinRed from "./svg/fob_pin_red.svg";
import fobSymbolRed from "./svg/fob_symbol_red.svg";
import fobPinGreen from "./svg/fob_pin_green.svg";
import fobSymbolGreen from "./svg/fob_symbol_green.svg";
import fobPinBlue from "./svg/fob_pin_blue.svg";
import fobSymbolBlue from "./svg/fob_symbol_blue.svg";
import fobPin from "./svg/fob_pin.svg";
import fobSymbol from "./svg/fob_symbol.svg";


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
export const PS_8CM_VELOCITY = 119.93;
export const PS_8CM_MAX_DISTANCE = 1467;

export const PS_3INCH_NAME = "BRIT 3″";
export const PS_3INCH_VELOCITY = 119.93;
export const PS_3INCH_MAX_DISTANCE = 1467;

export const PS_4INCH_NAME = "BRIT 4″";
export const PS_4INCH_VELOCITY = 166.94;
export const PS_4INCH_MAX_DISTANCE = 2818;

export const PS_6CM_NAME = "US 6cm";
export const PS_6CM_VELOCITY = 119.93;
export const PS_6CM_MAX_DISTANCE = 1467;

export const GRAVITY = 9.8;
export const MIL_TO_DEG_FACTOR = 360.0 / 6283.1853;
export const NATO_MIL_TO_DEG_FACTOR = 360 / 6400;
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
  [mortarPinRed, mortarSymbolRed, "#F44336"],
  [mortarPinGreen, mortarSymbolGreen, "#4CAF50"],
  [mortarPinBlue, mortarSymbolBlue, "#2196F3"],
  [mortarPin, mortarSymbol, "#212121"],
];
PIN_MAP[PIN_TYPE.TARGET] = [
  [targetPinRed, targetSymbolRed, "#F44336"],
  [targetPinGreen, targetSymbolGreen, "#4CAF50"],
  [targetPinBlue, targetSymbolBlue, "#2196F3"],
  [targetPin, targetSymbol, "#212121"],
];
PIN_MAP[PIN_TYPE.FOB] = [
  [fobPinRed, fobSymbolRed, "#F44336"],
  [fobPinGreen, fobSymbolGreen, "#4CAF50"],
  [fobPinBlue, fobSymbolBlue, "#2196F3"],
  [fobPin, fobSymbol, "#212121"],
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
