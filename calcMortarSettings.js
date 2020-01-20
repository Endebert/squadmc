// TABLES
const squadTable = [
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

const gerTable = [
  [100, 1536],
  [150, 1519],
  [200, 1502],
  [250, 1485],
  [300, 1467],
  [350, 1450],
  [400, 1432],
  [450, 1415],
  [500, 1397],
  [550, 1378],
  [600, 1360],
  [650, 1341],
  [700, 1322],
  [750, 1302],
  [800, 1282],
  [850, 1262],
  [900, 1241],
  [950, 1219],
  [1000, 1196],
  [1050, 1172],
  [1100, 1147],
  [1150, 1121],
  [1200, 1092],
  [1250, 1062],
  [1300, 1027],
  [1350, 988],
  [1400, 939],
];

const br3inchTable = [
  [100, 1536],
  [150, 1519],
  [200, 1502],
  [250, 1485],
  [300, 1467],
  [350, 1450],
  [400, 1432],
  [450, 1415],
  [500, 1397],
  [550, 1378],
  [600, 1360],
  [650, 1341],
  [700, 1322],
  [750, 1302],
  [800, 1282],
  [850, 1262],
  [900, 1241],
  [950, 1219],
  [1000, 1196],
  [1050, 1172],
  [1100, 1147],
  [1150, 1121],
  [1200, 1092],
  [1250, 1062],
  [1300, 1027],
  [1350, 988],
  [1400, 939],
];

const br4inchTable = [
  [200, 1535],
  [300, 1517],
  [400, 1500],
  [500, 1482],
  [600, 1464],
  [700, 1446],
  [800, 1428],
  [900, 1409],
  [1000, 1391],
  [1100, 1372],
  [1200, 1353],
  [1300, 1333],
  [1400, 1313],
  [1500, 1293],
  [1600, 1272],
  [1700, 1250],
  [1800, 1228],
  [1900, 1205],
  [2000, 1181],
  [2100, 1155],
  [2200, 1128],
  [2300, 1100],
  [2400, 1069],
  [2500, 1034],
];

const usa6cmTable = [
  [100, 1536],
  [150, 1519],
  [200, 1502],
  [250, 1485],
  [300, 1467],
  [350, 1450],
  [400, 1432],
  [450, 1415],
  [500, 1397],
  [550, 1378],
  [600, 1360],
  [650, 1341],
  [700, 1322],
  [750, 1302],
  [800, 1282],
  [850, 1262],
  [900, 1241],
  [950, 1219],
  [1000, 1196],
  [1050, 1172],
  [1100, 1147],
  [1150, 1121],
  [1200, 1092],
  [1250, 1062],
  [1300, 1027],
  [1350, 988],
  [1400, 939],
];

const tables = [
  ["SQU", squadTable],
  ["GER", gerTable],
  ["BR3", br3inchTable],
  ["BR4", br4inchTable],
  ["US6", usa6cmTable],
];

// gravity
const g = 9.8;

// deg to mil factor
// "1mil = 1/6400 of a circle in NATO countries."
const milF = 360 / 6400; // deg to mil factor

// conversions
function milToDeg(mil) {
  return mil * milF;
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

function degToMil(deg) {
  return deg / milF;
}

function radToMil(rad) {
  return degToMil(radToDeg(rad));
}

function milToRad(mil) {
  return degToRad(milToDeg(mil));
}

// calculate time needed to hit target at distance x
function getTime(x, rad) {
  return Math.sqrt((2 * x * Math.tan(rad)) / g);
}

// my own attempt. same result, but requires two calculations
// 1. calculate time for shell to reach target
// 2. calculate velocity using time
// eslint-disable-next-line no-unused-vars
function getVelOld(x, rad) {
  const t = getTime(x, rad);
  const r = x / (Math.cos(rad) * t);

  return r;
}

// following functions taken from wikipedia
// https://en.wikipedia.org/wiki/Projectile_motion

// calculate distance based on velocity and angle
function getDist(v, rad) {
  const x = (Math.tan(rad) * 2 * v * v * Math.cos(rad) * Math.cos(rad)) / g;
  return x;
}

// get velocity needed to hit target at distance x with angle a
function getVel(x, rad) {
  const vel = Math.sqrt((x * x * g) / (x * Math.sin(2 * rad)));
  return vel;
}

// get angle needed to hit target at distance x with velocity v
// eslint-disable-next-line no-unused-vars
function getAngle(x, v) {
  const a = 0.5 * Math.asin((g * x) / (v * v));
  return a;
}

// function getAngle2(x, v) {
//   return Math.atan(v * v - (Math.sqrt(v * v * v * v - g * g * x * x) / g) * x);
// }

// get angle to hit target at distance x and height y with velocity v
function findAngle(x, y, v) {
  const p1 = Math.sqrt(v ** 4 - g * (g * x ** 2 + 2 * y * v ** 2));
  const a1 = Math.atan((v ** 2 + p1) / (g * x));

  // a2 is always below 800 mil -> can't be used in the game
  // const a2 = Math.atan((v ** 2 - p1) / (g * x));

  return a1;
}

// zero-pad number
function pad(num, size) {
  return `000000000${num}`.substr(-size);
}

// max velocity decimal precision, up to which algorithm tries to optimize deviation from table
const maxPrecision = 6;

// main

const startTime = Date.now();

tables.forEach((t) => {
  const tName = t[0];
  const tTable = t[1];

  console.log(`${tName}: Gathering velocities...`);
  console.log(`${tName}: ===============================================`);

  // get velocity per table row
  const velocities = [];
  tTable.forEach((entry) => {
    const tDistance = entry[0];
    const tAngle = entry[1];
    const v = getVel(tDistance, milToRad(tAngle));
    velocities.push(v);

    console.log(`${tName}: ${pad(tDistance, 4)}m ${pad(tAngle, 4)}mil => ${v.toFixed(maxPrecision)}`);
  });

  // cut off first and last entries, might result in more accurate average
  const slicedVelocities = velocities.slice(1, velocities.length - 2);

  // calculate average velocity
  let avgVel = slicedVelocities.reduce((acc, cur) => acc + cur) / slicedVelocities.length;

  console.log(`${tName}: ===============================================`);
  console.log(`${tName}: average velocity: ${avgVel.toFixed(maxPrecision)}`);
  console.log(`${tName}: maximum distance: ${getDist(avgVel, milToRad(800)).toFixed(2)}`);
  console.log(`${tName}: ===============================================`);
  console.log(`${tName}: Minimizing deviation...`);
  console.log(`${tName}: ===============================================`);

  // initial average deviation to a value other than 0
  let avgDev = Number.MAX_VALUE;

  // deviation and velocity of previous loop
  let lAvgDev = avgDev;
  let lAvgVel = avgVel;

  // initial precision
  let curPrecision = 1;

  // loop until deviation can't be further optimized without going beyond velocity decimal precision
  while (true) {
    const step = 1 / 10 ** curPrecision;
    avgVel += avgDev >= 0 ? +step : -step;

    // get deviation per table row
    const deviations = [];
    // eslint-disable-next-line no-loop-func
    tTable.forEach((entry) => {
      const tDistance = entry[0];
      const tAngle = entry[1];
      const estimatedAngle = radToMil(findAngle(tDistance, 0, avgVel));
      const d = tAngle - estimatedAngle;
      deviations.push(d);
    });

    // cut off first and last entries, might result in more accurate average
    const slicedDeviations = deviations.slice(1, deviations.length - 2);

    // calculate average deviation
    avgDev = slicedDeviations.reduce((acc, cur) => acc + cur) / slicedDeviations.length;

    if (Math.abs(avgDev) <= Math.abs(lAvgDev)) {
      // if new deviation is smaller than previous, save velocity and deviation and loop again
      console.log(
        `${tName}: ${pad(curPrecision, 2)} | ${avgVel.toFixed(maxPrecision)} | ${Math.abs(avgDev).toFixed(
          maxPrecision + 1,
        )}`,
      );
      lAvgVel = avgVel;
      lAvgDev = avgDev;
    } else if (curPrecision < maxPrecision) {
      // if deviation is bigger, increase precision and reuse velocity from previous loop
      curPrecision++;
      avgVel = lAvgVel;
      avgDev = lAvgDev;
    } else {
      // max precision reached, break loop
      break;
    }
  }
  console.log(`${tName}: ===============================================`);
  console.log(`${tName}: FINAL VELOCITY     : ${lAvgVel.toFixed(maxPrecision)}`);
  console.log(`${tName}: FINAL AVG DEVIATION: ${lAvgDev.toFixed(maxPrecision + 1)}`);
  console.log(`${tName}: FINAL MAX RANGE    : ${getDist(lAvgVel, milToRad(800)).toFixed(2)}`);
  console.log(`${tName}: ===============================================`);
  console.log(`${tName}: Generating overview...`);
  console.log(`${tName}: ===============================================`);
  console.log(`${tName}:  DIST  T-MIL  |   F-MIL   |   DEV   |    VEL`);
  console.log(`${tName}: --------------|-----------|---------|----------`);

  // iterate through table yet again, printing table values,
  // calculated values based on optimized velocity, and deviation from table
  tTable.forEach((entry) => {
    const tDistance = entry[0];
    const tAngle = entry[1];
    const v = getVel(tDistance, milToRad(tAngle));

    const estimatedAngle = radToMil(findAngle(tDistance, 0, avgVel));
    const eAFormatted = pad(estimatedAngle.toFixed(1), 6);
    const d = tAngle - estimatedAngle;
    const dFormatted = (d < 0 ? "-" : "+") + pad(Math.abs(d).toFixed(2), 5);

    console.log(
      `${tName}: ${pad(tDistance, 4)}m ${pad(tAngle, 4)}mil | ${eAFormatted}mil | d=${dFormatted} | v=${v.toFixed(3)}`,
    );
  });
  console.log();
});
console.log(`done after ${Date.now() - startTime}ms`);
