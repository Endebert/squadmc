/* eslint-disable quote-props */
import SquadMap from "./SquadMap";

/**
 * This object holds all relevant information of the squad maps, including dimensions, heightmap, etc.
 * @type {*[]}
 */
export const MAPDATA = [
  {
    name: "Al Basrah",
    url: "/img/maps/albasrah/{z}_{x}_{y}.jpg",
    bounds: [3200, 3200], // map dimensions in meters
    heightmap: {
      url: "/img/heightmaps/albasrah.jpg",
      tile: "/img/heightmaps/albasrah/{z}_{x}_{y}.jpg",
      // scale is 512 color values (we use red and blue channels, i.e. 256*2),
      // multiplied by the optimized level range,
      //    (e.g. level is 0 to 1, and we optimize it so it is now 0.2 to 0.5, then factor is 0.3)
      // multiplied by z scaling from the heightmap itself (taken from SquadSDK),
      // divided by 512 (in UE4 heightmaps are scaled to represent 512 from black to white by default)
      scale: (512 * 0.2294 * 0.1) / 512,
    },
    locations: [
      ["Village", [2000, 760]],
      ["US Airfield", [770, 1070]],
      ["US Checkpoint", [1550, 1530]],
      ["Outskirts", [2050, 1600]],
      ["Refinery", [1939, 2070]],
      ["Mosque", [2107, 1882]],
      ["Oasis", [2448, 1575]],
      ["Suburbs", [2307, 1941]],
      ["Alleys", [2238, 2243]],
      ["Fringe", [2713, 1541]],
      ["Estates", [2705, 2087]],
    ],
    extra: { // extra information taken from SquadSDK and exported heightmap, used to scale + crop heightmaps
      // check printMapExtras() function for more information
      zScale: 10, // zScale in cm from SquadSDK
      minimap: [ // taken from blueprints in SquadSDK
        [-160000, -160000],
        [160000, 160000],
      ],
      hDim: [4065, 4065], // dimensions of exported heightmap
      lOrigin: [-203206, -203200], // origin of landscape in SquadSDK (sometimes extracted by placing actor in corner)
    },
  },
  {
    name: "Belaya",
    url: "/img/maps/belaya/{z}_{x}_{y}.jpg",
    bounds: [3905, 3905],
    heightmap: {
      url: "/img/heightmaps/belaya.jpg",
      tile: "/img/heightmaps/belaya/{z}_{x}_{y}.jpg",
      scale: (512 * 0.0726 * 1.00) / 512,
    },
    locations: [
      ["Militia Main", [3221, 554]],
      ["Radio Station", [2507, 1433]],
      ["Nikola", [2002, 1693]],
      ["Train Tunnel", [1376, 1425]],
      ["Tire Factory", [707, 1662]],
      ["Russia Main", [558, 2866]],
    ],
    extra: {
      zScale: 100,
      minimap: [
        [-195400, -208000],
        [195000, 182500],
      ],
      hDim: [4033, 4033],
      lOrigin: [-201600, -214200],
    },
  },
  {
    name: "Chora Valley",
    url: "/img/maps/chora/{z}_{x}_{y}.jpg",
    bounds: [4064, 4064],
    heightmap: {
      url: "/img/heightmaps/chora.jpg",
      tile: "/img/heightmaps/chora/{z}_{x}_{y}.jpg",
      scale: (512 * 0.0160 * 4.00) / 512,
    },
    locations: [
      ["Russia Main", [2730, 600]],
      ["Monolith", [2345, 850]],
      ["SW Nursery", [2529, 1213]],
      ["Orchard", [1835, 1428]],
      ["Large Mosque", [1808, 2631]],
      ["Provincial Estate", [2055, 2355]],
      ["East Poppy Farm", [1934, 1710]],
      ["West Poppy Farm", [2000, 1320]],
      ["Small Mosque", [2093, 921]],
      ["South Orchard", [2413, 1556]],
      ["Radio Station", [2224, 1898]],
      ["Hemp Farm", [1755, 2148]],
      ["Gas Station", [1817, 2511]],
      ["US Main", [1795, 2905]],
      ["Insurgent Checkpoint", [1541, 2436]],
    ],
    extra: {
      zScale: 400,
      xScale: 50,
      yScale: 50,
      minimap: [
        [-246400, -266400],
        [159990, 140000],
      ],
      hDim: [8129, 8129],
      lOrigin: [-246400, -266400],
    },

  },
  {
    name: "Fool's Road",
    url: "/img/maps/foolsroad/{z}_{x}_{y}.jpg",
    bounds: [1736, 1774],
    heightmap: {
      url: "/img/heightmaps/foolsroad.jpg",
      tile: "/img/heightmaps/foolsroad/{z}_{x}_{y}.jpg",
      scale: (512 * 0.0492 * 3.20) / 512,
    },
    locations: [
      ["Russian Main", [1718, 1584]],
      ["Mine Entrance", [1205, 962]],
      ["Train Station", [1516, 426]],
      ["Fortress", [309, 292]],
      ["Hilltop Encampment", [546, 959]],
      ["FOB Papanov", [168, 1401]],
      ["OP Fortress", [883, 354]],
      ["Ammo Depot | Hill", [777, 761]],
      ["North Village", [440, 1399]],
      ["Hill 123", [686, 1555]],
    ],
    extra: {
      zScale: 320,
      minimap: [
        [-128858, -132577],
        [44722, 44805],
      ],
      hDim: [2806, 2806],
      lOrigin: [-159810, -186630],
    },
  },
  {
    name: "Operation First Light",
    url: "/img/maps/forest/{z}_{x}_{y}.jpg",
    bounds: [1200, 1200],
    heightmap: {
      url: "/img/heightmaps/forest.jpg",
      tile: "/img/heightmaps/forest/{z}_{x}_{y}.jpg",
      scale: (512 * 0.6931 * 0.08) / 512,
    },
    locations: [
      ["Militia Main", [139, 852]],
      ["Railroad Village", [469, 882]],
      ["The Castle", [352, 502]],
      ["Storage Site", [632, 375]],
      ["Nirem Village", [870, 458]],
      ["Rail Docks", [788, 773]],
      ["US Main", [1049, 767]],
    ],
    extra: {
      zScale: 8,
      xScale: 50,
      yScale: 50,
      minimap: [
        [-110000, -110000],
        [10000, 10000],
      ],
      hDim: [2017, 2017],
      lOrigin: [-110000, -110000],
    },
  },
  {
    name: "Gorodok",
    url: "/img/maps/gorodok/{z}_{x}_{y}.jpg",
    bounds: [4340, 4340],
    heightmap: {
      url: "/img/heightmaps/gorodok.jpg",
      tile: "/img/heightmaps/gorodok/{z}_{x}_{y}.jpg",
      scale: (512 * 0.0119 * 10.00) / 512,
    },
    locations: [
      ["Militia Camp", [3608, 775]],
      ["Desna", [3264, 1405]],
      ["Bunker", [2017, 1645]],
      ["Shipping Yard", [666, 1840]],
      ["Akim", [1219, 3295]],
      ["The Mound", [2289, 3449]],
      ["Industrial Park", [3205, 3413]],
      ["Russian Main", [3681, 3626]],
    ],
    extra: {
      zScale: 1000,
      minimap: [
        [-207000, -207000],
        [227000, 227000],
      ],
      hDim: [4033, 4033],
      lOrigin: [-201600, -201600],
    },

  },
  {
    name: "Jensen's Range",
    url: "/img/maps/jensens/{z}_{x}_{y}.jpg",
    bounds: [1510, 1510],
    heightmap: {
      url: "/img/heightmaps/jensens.jpg",
      tile: "/img/heightmaps/jensens/{z}_{x}_{y}.jpg",
      scale: (512 * 0.569 * 0.15) / 512,
    },
    locations: [
      ["US Main", [336, 800]],
      ["Vehicles", [599, 977]],
    ],
    extra: {
      zScale: 15,
      xScale: 150,
      yScale: 150,
      minimap: [
        [-72301, -54409],
        [78781, 96523],
      ],
      hDim: [1009, 1009],
      lOrigin: [-72340, -54430],
    },

  },
  {
    name: "Kamdesh Highlands",
    url: "/img/maps/kamdesh/{z}_{x}_{y}.jpg",
    bounds: [4036, 4036],
    locations: [
      ["Sao", [2142, 1066]],
      ["Naray", [1890, 1500]],
      ["Paprok", [1581, 1829]],
      ["Manyal", [1334, 2197]],
      ["Shako", [1048, 2753]],
      ["Nahrain", [2097, 1805]],
      ["Godri", [2101, 2651]],
      ["Papra", [2869, 1175]],
      ["Khune", [2992, 2089]],
      ["Kaga", [2919, 3053]],
      ["Agasi", [1054, 1281]],
      ["Storage Bunker", [1492, 3086]],
      ["Toba", [3116, 859]],
      ["Aringshah", [3124, 1575]],
      ["Alingal", [3029, 2489]],
      ["Badeen", [2290, 3447]],
      ["Hemp Farm", [1888, 3238]],
      ["Nilaw", [1565, 2631]],
      ["Training Camp", [816, 2359]],
    ],
  },
  {
    name: "Kohat Toi River Valley",
    url: "/img/maps/kohat/{z}_{x}_{y}.jpg",
    bounds: [4017, 4017],
    heightmap: {
      url: "/img/heightmaps/kohat.jpg",
      tile: "/img/heightmaps/kohat/{z}_{x}_{y}.jpg",
      scale: (512 * 1 * 0.75) / 512,
    },
    locations: [
      ["US Main", [1453, 2666]],
      ["Jouzara", [2603, 2855]],
      ["Chakar Kot", [1423, 1755]],
      ["Malak Abad", [2070, 1856]],
      ["Mohd Zai", [2548, 1822]],
      ["Togh Sarai", [2435, 1196]],
      ["Sarozai", [1877, 281]],
      ["Russian Main", [2750, 638]],
      ["Khadizai", [2216, 2638]],
      ["Radio Tower", [2133, 2325]],
      ["Ali Abad", [1841, 2038]],
      ["Suni Khel", [1235, 1083]],
      ["North Bridge", [1340, 735]],
    ],
    extra: {
      zScale: 75,
      minimap: [
        [-200000, -200000],
        [201700, 201700],
      ],
      hDim: [4033, 4033],
      lOrigin: [-200000, -200000],
    },
  },
  {
    name: "Kokan",
    url: "/img/maps/kokan/{z}_{x}_{y}.jpg",
    bounds: [2496, 2496],
    heightmap: {
      url: "/img/heightmaps/kokan.jpg",
      tile: "/img/heightmaps/kokan/{z}_{x}_{y}.jpg",
      scale: (512 * 0.0164 * 1.00) / 512,
    },
    locations: [
      ["INS Main", [185, 1543]],
      ["Stonebend", [308, 996]],
      ["Ruins", [480, 717]],
      ["Market", [717, 897]],
      ["Tempest Estate", [1087, 803]],
      ["Village", [1350, 905]],
      ["Nexus", [1272, 1423]],
      ["First Stand", [1468, 1543]],
      ["US Main", [1838, 1770]],
    ],
    extra: {
      zScale: 100,
      minimap: [
        [-107635, -107567],
        [142014, 142014],
      ],
      hDim: [3049, 3684],
      lOrigin: [-133300, -171400],
    },
  },
  {
    name: "Logar Valley",
    url: "/img/maps/logarvalley/{z}_{x}_{y}.jpg",
    bounds: [1761, 1761],
    heightmap: {
      url: "/img/heightmaps/logarvalley.jpg",
      tile: "/img/heightmaps/logarvalley/{z}_{x}_{y}.jpg",
      scale: (512 * 0.2715 * 0.50) / 512,
    },
    locations: [
      ["Old Militia Main", [692, 144]],
      ["Mechanic Shop", [1018, 123]],
      ["Bend", [1193, 302]],
      ["South Residence / Compound", [1331, 455]],
      ["Lower / South DC", [1107, 749]],
      ["Lower Central DC", [1013, 774]],
      ["Upper Central DC", [909, 802]],
      ["Upper / North DC", [818, 857]],
      ["North Residence", [574, 1077]],
      ["Residence", [693, 1231]],
      ["Poppy Farm", [718, 1423]],
      ["Militia Main", [696, 1564]],
      ["Old Murika Main", [1113, 1483]],
    ],
    extra: {
      zScale: 50,
      minimap: [
        [-88145, -113239],
        [87978, 62922],
      ],
      hDim: [2773, 1891],
      lOrigin: [-138600, -126010],
    },
  },
  {
    name: "Mestia",
    url: "/img/maps/mestia/{z}_{x}_{y}.jpg",
    bounds: [2400, 2400],
    heightmap: {
      url: "/img/heightmaps/mestia.jpg",
      tile: "/img/heightmaps/mestia/{z}_{x}_{y}.jpg",
      scale: (512 * 0.3419 * 1.20) / 512,
    },
    locations: [
      ["Militia Main", [1062, 233]],
      ["The Armory", [1318, 594]],
      ["Fortification", [1017, 854]],
      ["Warehouse", [1769, 819]],
      ["Crucible Beta", [1233, 1275]],
      ["Crucible Alpha", [1123, 1305]],
      ["Quarry", [586, 1684]],
      ["Crucible Gamma", [1118, 1503]],
      ["Farmstead", [1381, 1794]],
      ["Russian Main", [1656, 2235]],
    ],
    extra: {
      zScale: 120,
      minimap: [
        [-120000, -110000],
        [120000, 130000],
      ],
      hDim: [4081, 4081],
      lOrigin: [-231000, -192690],
    },

  },
  {
    name: "Narva",
    url: "/img/maps/narva/{z}_{x}_{y}.jpg",
    bounds: [2800, 2800],
    heightmap: {
      url: "/img/heightmaps/narva.jpg",
      tile: "/img/heightmaps/narva/{z}_{x}_{y}.jpg",
      scale: (512 * 0.0583 * 1.00) / 512,
    },
    locations: [
      ["US Main", [570, 215]],
      ["Abandoned Airfield", [778, 598]],
      ["Ring Road", [1311, 717]],
      ["Quarry", [2000, 1181]],
      ["Shipping Yard", [1730, 1655]],
      ["Radio Station", [628, 836]],
      ["Old Barracks", [690, 1290]],
      ["Old Hospital", [1085, 1268]],
      ["Oru Village", [1540, 1129]],
      ["Kanepi Rd", [1831, 1372]],
      ["Power Plant", [1969, 1844]],
      ["Casle", [1242, 1898]],
      ["Church", [832, 1127]],
      ["Train Depot", [1343, 1647]],
      ["Fuel Storage", [1661, 853]],
      ["Foundry", [1744, 1103]],
      ["Lakeshore", [1683, 1464]],
      ["Warehouse", [1625, 1744]],
      ["Storefronts", [1118, 1641]],
      ["Factories", [1223, 1044]],
      ["Shopping Centre", [1024, 1524]],
      ["Council Towers", [1085, 1151]],
      ["University", [858, 1628]],
      ["Geneva Apts", [1249, 1417]],
      ["Kalda Court", [1550, 1587]],
      ["Parusinka", [1780, 2190]],
      ["Russian Main", [1757, 2658]],
    ],
    extra: {
      zScale: 100,
      minimap: [
        [-138971, -140207],
        [141029, 139793],
      ],
      hDim: [4033, 4033],
      lOrigin: [-201600, -201600],
    },

  },
  {
    name: "Sumari Bala",
    url: "/img/maps/sumari/{z}_{x}_{y}.jpg",
    bounds: [1300, 1300],
    heightmap: {
      url: "/img/heightmaps/sumari.jpg",
      tile: "/img/heightmaps/sumari/{z}_{x}_{y}.jpg",
      scale: (512 * 0.0479 * 0.75) / 512,
    },
    locations: [
      ["US Main", [743, 137]],
      ["Junction", [700, 362]],
      ["Police Station", [630, 575]],
      ["Ancient Qanat", [531, 716]],
      ["Raisin Dryers", [833, 479]],
      ["Commons", [510, 869]],
      ["School", [704, 885]],
      ["INS Hideout", [754, 1134]],
      ["Market", [584, 478]],
      ["Courtyard", [707, 436]],
      ["Checkpoint", [803, 283]],
      ["Palace", [712, 759]],
      ["Training Camp", [610, 1008]],
      ["INS Main", [517, 1181]],
    ],
    extra: {
      zScale: 75,
      minimap: [
        [-63974, -44728],
        [66034, 85297],
      ],
      hDim: [1985, 1985],
      lOrigin: [-99201, -99199],
    },
  },
  {
    name: "Yehorivka",
    url: "/img/maps/yehorivka/{z}_{x}_{y}.jpg",
    bounds: [4034, 4034],
    heightmap: {
      url: "/img/heightmaps/yehorivka.jpg",
      tile: "/img/heightmaps/yehorivka/{z}_{x}_{y}.jpg",
      scale: (512 * 0.0683 * 4.00) / 512,
    },
    locations: [
      ["Russian Main", [864, 986]],
      ["Upper Petrivka", [1090, 2206]],
      ["Central Petrivka", [1306, 1837]],
      ["Lower Petrivka", [1479, 2229]],
      ["Village", [1440, 2771]],
      ["Stepne", [1874, 3046]],
      ["Storage Site", [2141, 1605]],
      ["Upper Novo", [2336, 2350]],
      ["Central Novo", [2651, 1981]],
      ["Lower Novo", [2668, 2325]],
      ["Airfield", [3143, 2212]],
      ["US Main", [3455, 2827]],
    ],
    extra: {
      zScale: 400,
      minimap: [
        [-201700, -201700],
        [201700, 201700],
      ],
      hDim: [8129, 8129],
      lOrigin: [-406400, -406400],
    },
  },
];

export function getMapNames() {
  const names = [];
  MAPDATA.forEach((map) => {
    names.push(map.name);
  });
  // console.log(`returning map names: ${names}`);
  return names;
}

export function getSquadMap(mapName) {
  // console.log("getSquadMap:", mapName);
  for (let i = 0; i < MAPDATA.length; i += 1) {
    if (mapName === MAPDATA[i].name) {
      return new SquadMap(MAPDATA[i]);
    }
  }

  throw new Error(`No map named ${mapName} exists!`);
}

export function printMapExtras() {
  MAPDATA.forEach((map) => {
    const e = map.extra;
    if (e) {
      const mm = e.minimap;
      const xM = -mm[0][0] + mm[1][0];
      const yM = -mm[0][1] + mm[1][1];
      const xScale = e.xScale || 100;
      const yScale = e.yScale || 100;

      const xO = e.lOrigin[0] - mm[0][0];
      const yO = e.lOrigin[1] - mm[0][1];

      console.log(`${map.name}`);
      console.log(`map dimensions:    ${xM / 100}x${yM / 100}`);
      console.log(`orig heightmap:    ${e.hDim[0]}x${e.hDim[1]}`);

      console.log(`scale heightmap:   x:${xScale}% y:${yScale}%`);
      console.log(`crop with offset:  ${xO / 100}x${yO / 100}`);
      console.log("---");
    }
  });
}
