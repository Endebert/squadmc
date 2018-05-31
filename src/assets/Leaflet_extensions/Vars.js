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
export const VELOCITY_PWR_2 = VELOCITY ** 2;
export const VELOCITY_PWR_4 = VELOCITY ** 4;
export const GRAVITY = 9.81;
export const MIL_TO_DEG_FACTOR = 360 / 6400;
export const PIN_TYPE = {
  MORTAR: 0,
  TARGET: 1,
  FOB: 2,
};
