/**
 * Stuff taken from squadcalc.com
 */
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

const TOO_FAR = 'TOO_FAR';
const TOO_CLOSE = 'TOO_CLOSE';

function interpolateElevation(distance) {
  if (distance < MIN_DISTANCE) return TOO_CLOSE;
  if (distance > MAX_DISTANCE) return TOO_FAR;

  for (let i = 0; i < MORTAR_TABLE.length; i++) {
    let currentTableEntry = MORTAR_TABLE[i],
      nextTableEntry = MORTAR_TABLE[i + 1],
      currentX = currentTableEntry[0],
      currentY = currentTableEntry[1];
    if (distance === currentX) return currentY;

    const nextX = nextTableEntry[0];

    if (distance >= nextX) continue;

    let nextY = nextTableEntry[1],
      slope = (nextY - currentY) / (nextX - currentX),
      deltaX = distance - currentX
        ;

        // rounded to nearest .1
    return Math.round((slope * deltaX + currentY) * 10) / 10;
  }
}
