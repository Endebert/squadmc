/* eslint-disable camelcase,dot-notation */
/**
 * This file holds all static map data.
 * MAPDATA holds the maps and their imageOverlays, as well as their location markers.
 */

(() => {
// tileLayer options
  const tileOps = {
    minNativeZoom: 0,
    maxNativeZoom: 4,
    // zoomOffset: -3,
    attribution: "Map &copy; <a href='http://joinsquad.com/'>Offworld Inc.</a>",
  };

  // returns a copy of tileOps including custom bounds
  function getTileOps(maxBounds) {
    return Object.assign({}, tileOps, { bounds: L.latLngBounds([0, 0], maxBounds) });
  }

  // imageOverlays for each map
  // bounds calculated from Squad SDK
  const albasrah = L.tileLayer("./maps/albasrah/{z}_{x}_{y}.jpg", getTileOps([3200, 3200]));
  const belaya = L.tileLayer("./maps/belaya/{z}_{x}_{y}.jpg", getTileOps([3905, 3905]));
  const chora = L.tileLayer("./maps/chora/{z}_{x}_{y}.jpg", getTileOps([4064, 4064]));
  const foolsroad = L.tileLayer("./maps/foolsroad/{z}_{x}_{y}.jpg", getTileOps([1774, 1736]));
  const forest = L.tileLayer("./maps/forest/{z}_{x}_{y}.jpg", getTileOps([1200, 1200]));
  const gorodok = L.tileLayer("./maps/gorodok/{z}_{x}_{y}.jpg", getTileOps([4340, 4340]));
  const jensens = L.tileLayer("./maps/jensens/{z}_{x}_{y}.jpg", getTileOps([1510, 1510]));
  const kamdesh = L.tileLayer("./maps/kamdesh/{z}_{x}_{y}.jpg", getTileOps([4036, 4036]));
  const kohat = L.tileLayer("./maps/kohat/{z}_{x}_{y}.jpg", getTileOps([4017, 4017]));
  const kokan = L.tileLayer("./maps/kokan/{z}_{x}_{y}.jpg", getTileOps([2496, 2496]));
  const logarvalley = L.tileLayer("./maps/logarvalley/{z}_{x}_{y}.jpg", getTileOps([1761, 1761]));
  const mestia = L.tileLayer("./maps/mestia/{z}_{x}_{y}.jpg", getTileOps([2400, 2400]));
  const narva = L.tileLayer("./maps/narva/{z}_{x}_{y}.jpg", getTileOps([2805, 2805]));
  const sumari = L.tileLayer("./maps/sumari/{z}_{x}_{y}.jpg", getTileOps([1300, 1300]));
  const yehorivka = L.tileLayer("./maps/yehorivka/{z}_{x}_{y}.jpg", getTileOps([4034, 4034]));

  MAPDATA = {
    "Al Basrah": {
      map: albasrah,
      locations: [
        Utils.createLocation("Village", [2000, 760]),
        Utils.createLocation("US Airfield", [770, 1070]),
        Utils.createLocation("US Checkpoint", [1550, 1530]),
        Utils.createLocation("Outskirts", [2050, 1600]),
        Utils.createLocation("Refinery", [1939, 2070]),
        Utils.createLocation("Mosque", [2107, 1882]),
        Utils.createLocation("Oasis", [2448, 1575]),
        Utils.createLocation("Suburbs", [2307, 1941]),
        Utils.createLocation("Alleys", [2238, 2243]),
        Utils.createLocation("Fringe", [2713, 1541]),
        Utils.createLocation("Estates", [2705, 2087]),
      ],

    },
    "Belaya": {
      map: belaya,
      heightmap: {
        url: "./maps/belaya/heightmap_optimized.jpg",
        scale: ((20 * 2) * 1.00) / 255, // unoptimized: 58
      },
      locations: [
        Utils.createLocation("Militia Main", [3221, 554]),
        Utils.createLocation("Radio Station", [2507, 1433]),
        Utils.createLocation("Nikola", [2002, 1693]),
        Utils.createLocation("Train Tunnel", [1376, 1425]),
        Utils.createLocation("Tire Factory", [707, 1662]),
        Utils.createLocation("Russia Main", [558, 2866]),
      ],

    },
    "Chora Valley": {
      map: chora,
      heightmap: {
        url: "./maps/chora/heightmap_optimized.jpg",
        // short description of the scale values for calculation:
        // 16bit heightmap originally holds -256 to 256 meters * z-scaling
        // we optimize black-white range using photoshops exposure
        // image shows 256 shades of grey, representing 512 meters, therefore 256 * 2
        // using photoshops exposure, we optimize range,
        // e.g. from original 256 shades we only use 28-31, so 4 shades representing 512 meters now,
        // therefore 4 * 2
        // since base heightmap is 16bit, this is no problem
        // from landscape transform we know that z-scaling in this case is 4
        // we divide by 255 because we use 8bit jpeg greyscale images,
        // i.e. color value from canvas will be 0-255
        // examples:
        // black = 0; 4 * 2 * 4 / 255 * 0 = 0
        // white = 255; 4 * 2 * 4 / 255 * 255 = 32
        // so this heightmap goes from 0-32 meters
        scale: ((4 * 2) * 4.00) / 255, // unoptimized: 57
      },
      locations: [
        Utils.createLocation("Russia Main", [2730, 600]),
        Utils.createLocation("Monolith", [2345, 850]),
        Utils.createLocation("SW Nursery", [2529, 1213]),
        Utils.createLocation("Orchard", [1835, 1428]),
        Utils.createLocation("Large Mosque", [1808, 2631]),
        Utils.createLocation("Provincial Estate", [2055, 2355]),
        Utils.createLocation("East Poppy Farm", [1934, 1710]),
        Utils.createLocation("West Poppy Farm", [2000, 1320]),
        Utils.createLocation("Small Mosque", [2093, 921]),
        Utils.createLocation("South Orchard", [2413, 1556]),
        Utils.createLocation("Radio Station", [2224, 1898]),
        Utils.createLocation("Hemp Farm", [1755, 2148]),
        Utils.createLocation("Gas Station", [1817, 2511]),
        Utils.createLocation("US Main", [1795, 2905]),
        Utils.createLocation("Insurgent Checkpoint", [1541, 2436]),
      ],
    },
    "Fool's Road": {
      map: foolsroad,
      heightmap: {
        url: "./maps/foolsroad/heightmap.jpg",
        scale: ((13 * 2) * 3.20) / 255,
      },
      locations: [
        Utils.createLocation("Russian Main", [1718, 1584]),
        Utils.createLocation("Mine Entrance", [1205, 962]),
        Utils.createLocation("Train Station", [1516, 426]),
        Utils.createLocation("Fortress", [309, 292]),
        Utils.createLocation("Hilltop Encampment", [546, 959]),
        Utils.createLocation("FOB Papanov", [168, 1401]),
        Utils.createLocation("OP Fortress", [883, 354]),
        Utils.createLocation("Ammo Depot | Hill", [777, 761]),
        Utils.createLocation("North Village", [440, 1399]),
        Utils.createLocation("Hill 123", [686, 1555]),
      ],
    },
    "Operation First Light": {
      map: forest,
      heightmap: {
        url: "./maps/forest/heightmap.jpg",
        scale: ((176 * 2) * 0.08) / 255,
      },
      locations: [
        Utils.createLocation("Militia Main", [139, 852]),
        Utils.createLocation("Railroad Village", [469, 882]),
        Utils.createLocation("The Castle", [352, 502]),
        Utils.createLocation("Storage Site", [632, 375]),
        Utils.createLocation("Nirem Village", [870, 458]),
        Utils.createLocation("Rail Docks", [788, 773]),
        Utils.createLocation("US Main", [1049, 767]),
      ],
    },
    "Gorodok": {
      map: gorodok,
      heightmap: {
        url: "./maps/gorodok/heightmap.jpg",
        scale: ((4 * 2) * 10.00) / 255,
      },
      locations: [
        Utils.createLocation("Militia Camp", [3608, 775]),
        Utils.createLocation("Desna", [3264, 1405]),
        Utils.createLocation("Bunker", [2017, 1645]),
        Utils.createLocation("Shipping Yard", [666, 1840]),
        Utils.createLocation("Akim", [1219, 3295]),
        Utils.createLocation("The Mound", [2289, 3449]),
        Utils.createLocation("Industrial Park", [3205, 3413]),
        Utils.createLocation("Russian Main", [3681, 3626]),
      ],
    },
    "Jensen's Range": {
      map: jensens,
      heightmap: {
        url: "./maps/jensens/heightmap.jpg",
        scale: ((230 * 2) * 0.15) / 255,
      },
      locations: [
        Utils.createLocation("US Main", [336, 800]),
        Utils.createLocation("Vehicles", [599, 977]),
      ],
    },
    "Kamdesh Highlands": {
      map: kamdesh,
      locations: [
        Utils.createLocation("Sao", [2142, 1066]),
        Utils.createLocation("Naray", [1890, 1500]),
        Utils.createLocation("Paprok", [1581, 1829]),
        Utils.createLocation("Manyal", [1334, 2197]),
        Utils.createLocation("Shako", [1048, 2753]),
        Utils.createLocation("Nahrain", [2097, 1805]),
        Utils.createLocation("Godri", [2101, 2651]),
        Utils.createLocation("Papra", [2869, 1175]),
        Utils.createLocation("Khune", [2992, 2089]),
        Utils.createLocation("Kaga", [2919, 3053]),
        Utils.createLocation("Agasi", [1054, 1281]),
        Utils.createLocation("Storage Bunker", [1492, 3086]),
        Utils.createLocation("Toba", [3116, 859]),
        Utils.createLocation("Aringshah", [3124, 1575]),
        Utils.createLocation("Alingal", [3029, 2489]),
        Utils.createLocation("Badeen", [2290, 3447]),
        Utils.createLocation("Hemp Farm", [1888, 3238]),
        Utils.createLocation("Nilaw", [1565, 2631]),
        Utils.createLocation("Training Camp", [816, 2359]),
      ],
    },
    "Kohat Toi River Valley": {
      map: kohat,
      heightmap: {
        url: "./maps/kohat/heightmap.jpg",
        scale: ((242 * 2) * 0.75) / 255,
      },
      locations: [
        Utils.createLocation("US Main", [1453, 2666]),
        Utils.createLocation("Jouzara", [2603, 2855]),
        Utils.createLocation("Chakar Kot", [1423, 1755]),
        Utils.createLocation("Malak Abad", [2070, 1856]),
        Utils.createLocation("Mohd Zai", [2548, 1822]),
        Utils.createLocation("Togh Sarai", [2435, 1196]),
        Utils.createLocation("Sarozai", [1877, 281]),
        Utils.createLocation("Russian Main", [2750, 638]),
        Utils.createLocation("Khadizai", [2216, 2638]),
        Utils.createLocation("Radio Tower", [2133, 2325]),
        Utils.createLocation("Ali Abad", [1841, 2038]),
        Utils.createLocation("Suni Khel", [1235, 1083]),
        Utils.createLocation("North Bridge", [1340, 735]),
      ],
    },
    "Kokan": {
      map: kokan,
      heightmap: {
        url: "./maps/kokan/heightmap_optimized.jpg",
        scale: ((23 * 2) * 1.00) / 255, // unoptimized: 43
      },
      locations: [
        Utils.createLocation("INS Main", [185, 1543]),
        Utils.createLocation("Stonebend", [308, 996]),
        Utils.createLocation("Ruins", [480, 717]),
        Utils.createLocation("Market", [717, 897]),
        Utils.createLocation("Tempest Estate", [1087, 803]),
        Utils.createLocation("Village", [1350, 905]),
        Utils.createLocation("Nexus", [1272, 1423]),
        Utils.createLocation("First Stand", [1468, 1543]),
        Utils.createLocation("US Main", [1838, 1770]),
      ],
    },
    "Logar Valley": {
      map: logarvalley,
      heightmap: {
        url: "./maps/logarvalley/heightmap_optimized.jpg",
        scale: ((68 * 2) * 0.50) / 255, // unoptimized: 123
      },
      locations: [
        Utils.createLocation("Old Militia Main", [692, 144]),
        Utils.createLocation("Mechanic Shop", [1018, 123]),
        Utils.createLocation("Bend", [1193, 302]),
        Utils.createLocation("South Residence / Compound", [1331, 455]),
        Utils.createLocation("Lower / South DC", [1107, 749]),
        Utils.createLocation("Lower Central DC", [1013, 774]),
        Utils.createLocation("Upper Central DC", [909, 802]),
        Utils.createLocation("Upper / North DC", [818, 857]),
        Utils.createLocation("North Residence", [574, 1077]),
        Utils.createLocation("Residence", [693, 1231]),
        Utils.createLocation("Poppy Farm", [718, 1423]),
        Utils.createLocation("Militia Main", [696, 1564]),
        Utils.createLocation("Old Murika Main", [1113, 1483]),
      ],
    },
    "Mestia": {
      map: mestia,
      heightmap: {
        url: "./maps/mestia/heightmap_optimized.jpg",
        scale: ((82 * 2) * 1.20) / 255, // unoptimized: 96
      },
      locations: [
        Utils.createLocation("Militia Main", [1062, 233]),
        Utils.createLocation("The Armory", [1318, 594]),
        Utils.createLocation("Fortification", [1017, 854]),
        Utils.createLocation("Warehouse", [1769, 819]),
        Utils.createLocation("Crucible Beta", [1233, 1275]),
        Utils.createLocation("Crucible Alpha", [1123, 1305]),
        Utils.createLocation("Quarry", [586, 1684]),
        Utils.createLocation("Crucible Gamma", [1118, 1503]),
        Utils.createLocation("Farmstead", [1381, 1794]),
        Utils.createLocation("Russian Main", [1656, 2235]),
      ],
    },
    "Narva": {
      map: narva,
      locations: [
        Utils.createLocation("US Main", [570, 215]),
        Utils.createLocation("Abandoned Airfield", [778, 598]),
        Utils.createLocation("Ring Road", [1311, 717]),
        Utils.createLocation("Quarry", [2000, 1181]),
        Utils.createLocation("Shipping Yard", [1730, 1655]),
        Utils.createLocation("Radio Station", [628, 836]),
        Utils.createLocation("Old Barracks", [690, 1290]),
        Utils.createLocation("Old Hospital", [1085, 1268]),
        Utils.createLocation("Oru Village", [1540, 1129]),
        Utils.createLocation("Kanepi Rd", [1831, 1372]),
        Utils.createLocation("Power Plant", [1969, 1844]),
        Utils.createLocation("Casle", [1242, 1898]),
        Utils.createLocation("Church", [832, 1127]),
        Utils.createLocation("Train Depot", [1343, 1647]),
        Utils.createLocation("Fuel Storage", [1661, 853]),
        Utils.createLocation("Foundry", [1744, 1103]),
        Utils.createLocation("Lakeshore", [1683, 1464]),
        Utils.createLocation("Warehouse", [1625, 1744]),
        Utils.createLocation("Storefronts", [1118, 1641]),
        Utils.createLocation("Factories", [1223, 1044]),
        Utils.createLocation("Shopping Centre", [1024, 1524]),
        Utils.createLocation("Council Towers", [1085, 1151]),
        Utils.createLocation("University", [858, 1628]),
        Utils.createLocation("Geneva Apts", [1249, 1417]),
        Utils.createLocation("Kalda Court", [1550, 1587]),
        Utils.createLocation("Parusinka", [1780, 2190]),
        Utils.createLocation("Russian Main", [1757, 2658]),
      ],
    },
    "Sumari Bala": {
      map: sumari,
      heightmap: {
        url: "./maps/sumari/heightmap_optimized.jpg",
        scale: ((12 * 2) * 0.75) / 255, // unoptimized: 80
      },
      locations: [
        Utils.createLocation("US Main", [743, 137]),
        Utils.createLocation("Junction", [700, 362]),
        Utils.createLocation("Police Station", [630, 575]),
        Utils.createLocation("Ancient Qanat", [531, 716]),
        Utils.createLocation("Raisin Dryers", [833, 479]),
        Utils.createLocation("Commons", [510, 869]),
        Utils.createLocation("School", [704, 885]),
        Utils.createLocation("INS Hideout", [754, 1134]),
        Utils.createLocation("Market", [584, 478]),
        Utils.createLocation("Courtyard", [707, 436]),
        Utils.createLocation("Checkpoint", [803, 283]),
        Utils.createLocation("Palace", [712, 759]),
        Utils.createLocation("Training Camp", [610, 1008]),
        Utils.createLocation("INS Main", [517, 1181]),
      ],
    },
    "Yehorivka": {
      map: yehorivka,
      heightmap: {
        url: "./maps/yehorivka/heightmap.jpg",
        scale: ((18 * 2) * 4.00) / 255,
      },
      locations: [
        Utils.createLocation("Russian Main", [864, 986]),
        Utils.createLocation("Upper Petrivka", [1090, 2206]),
        Utils.createLocation("Central Petrivka", [1306, 1837]),
        Utils.createLocation("Lower Petrivka", [1479, 2229]),
        Utils.createLocation("Village", [1440, 2771]),
        Utils.createLocation("Stepne", [1874, 3046]),
        Utils.createLocation("Storage Site", [2141, 1605]),
        Utils.createLocation("Upper Novo", [2336, 2350]),
        Utils.createLocation("Central Novo", [2651, 1981]),
        Utils.createLocation("Lower Novo", [2668, 2325]),
        Utils.createLocation("Airfield", [3143, 2212]),
        Utils.createLocation("US Main", [3455, 2827]),
      ],
    },
  };

  window.MAPDATA = MAPDATA;
})();
