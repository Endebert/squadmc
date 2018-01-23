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
  };

  // returns a copy of tileOps including custom bounds
  function getTileOps(maxBounds) {
    return Object.assign({}, tileOps, { bounds: window.L.latLngBounds([0, 0], maxBounds) });
  }

  // imageOverlays for each map
  // bounds calculated by taking screenshots in-game and counting pixels (of grid)
  const albasrah = window.L.tileLayer("./maps/albasrah/{z}/{x}/{y}.jpg", getTileOps([3200, 3200]));
  const chora = window.L.tileLayer("./maps/chora/{z}/{x}/{y}.jpg", getTileOps([4073, 4073]));
  const foolsroad = window.L.tileLayer("./maps/foolsroad/{z}/{x}/{y}.jpg", getTileOps([1775, 1739]));
  const forest = window.L.tileLayer("./maps/forest/{z}/{x}/{y}.jpg", getTileOps([1200, 1200]));
  const gorodok = window.L.tileLayer("./maps/gorodok/{z}/{x}/{y}.jpg", getTileOps([4347, 4347]));
  const jensens = window.L.tileLayer("./maps/jensens/{z}/{x}/{y}.jpg", getTileOps([1513, 1513]));
  const kohat = window.L.tileLayer("./maps/kohat/{z}/{x}/{y}.jpg", getTileOps([4026, 4026]));
  const kokan = window.L.tileLayer("./maps/kokan/{z}/{x}/{y}.jpg", getTileOps([2500, 2500]));
  const logarvalley = window.L.tileLayer("./maps/logarvalley/{z}/{x}/{y}.jpg", getTileOps([1765, 1765]));
  const mestia = window.L.tileLayer("./maps/mestia/{z}/{x}/{y}.jpg", getTileOps([2403, 2403]));
  const narva = window.L.tileLayer("./maps/narva/{z}/{x}/{y}.jpg", getTileOps([2205, 2205]));
  const sumari = window.L.tileLayer("./maps/sumari/{z}/{x}/{y}.jpg", getTileOps([1303, 1303]));
  const yehorivka = window.L.tileLayer("./maps/yehorivka/{z}/{x}/{y}.jpg", getTileOps([4041, 4041]));

  // debug maps (unused)
  const albasrah_l = window.L.imageOverlay("./maps/albasrah_l.jpg", [[0, 0], [3200, 3200]]);
  const chora_l = window.L.imageOverlay("./maps/chora_l.jpg", [[0, 0], [4073, 4073]]);
  const foolsroad_l = window.L.imageOverlay("./maps/foolsroad_l.jpg", [[0, 0], [1775, 1739]]);
  const forest_l = window.L.imageOverlay("./maps/forest_l.jpg", [[0, 0], [1200, 1200]]);
  const gorodok_l = window.L.imageOverlay("./maps/gorodok_l.jpg", [[0, 0], [4347, 4347]]);
  const jensens_l = window.L.imageOverlay("./maps/jensens_l.jpg", [[0, 0], [1513, 1513]]);
  const kohat_l = window.L.imageOverlay("./maps/kohat_l.jpg", [[0, 0], [4026, 4026]]);
  const kokan_l = window.L.imageOverlay("./maps/kokan_l.jpg", [[0, 0], [2500, 2500]]);
  const logarvalley_l = window.L.imageOverlay("./maps/logarvalley_l.jpg", [[0, 0], [1765, 1765]]);
  const mestia_l = window.L.imageOverlay("./maps/mestia_l.jpg", [[0, 0], [2403, 2403]]);
  const narva_l = window.L.imageOverlay("./maps/narva_l.jpg", [[0, 0], [2205, 2205]]);
  const sumari_l = window.L.imageOverlay("./maps/sumari_l.jpg", [[0, 0], [1303, 1303]]);
  const yehorivka_l = window.L.imageOverlay("./maps/yehorivka_l.jpg", [[0, 0], [4041, 4041]]);

  MAPDATA = {
    "Al Basrah": {
      map: window.DEBUG ? albasrah_l : albasrah,
      locations: [
        window.Utils.createLocation("Village", [2000, 760]),
        window.Utils.createLocation("US Airfield", [770, 1070]),
        window.Utils.createLocation("US Checkpoint", [1550, 1530]),
        window.Utils.createLocation("Outskirts", [2050, 1600]),
        window.Utils.createLocation("Refinery", [1939, 2070]),
        window.Utils.createLocation("Mosque", [2107, 1882]),
        window.Utils.createLocation("Oasis", [2448, 1575]),
        window.Utils.createLocation("Suburbs", [2307, 1941]),
        window.Utils.createLocation("Alleys", [2238, 2243]),
        window.Utils.createLocation("Fringe", [2713, 1541]),
        window.Utils.createLocation("Estates", [2705, 2087]),
      ],

    },
    "Chora Valley": {
      map: window.DEBUG ? chora_l : chora,
      locations: [
        window.Utils.createLocation("Russia Main", [2730, 600]),
        window.Utils.createLocation("Monolith", [2345, 850]),
        window.Utils.createLocation("SW Nursery", [2529, 1213]),
        window.Utils.createLocation("Orchard", [1835, 1428]),
        window.Utils.createLocation("Large Mosque", [1808, 2631]),
        window.Utils.createLocation("Provincial Estate", [2055, 2355]),
        window.Utils.createLocation("East Poppy Farm", [1934, 1710]),
        window.Utils.createLocation("West Poppy Farm", [2000, 1320]),
        window.Utils.createLocation("Small Mosque", [2093, 921]),
        window.Utils.createLocation("South Orchard", [2413, 1556]),
        window.Utils.createLocation("Radio Station", [2224, 1898]),
        window.Utils.createLocation("Hemp Farm", [1755, 2148]),
        window.Utils.createLocation("Gas Station", [1817, 2511]),
        window.Utils.createLocation("US Main", [1795, 2905]),
        window.Utils.createLocation("Insurgent Checkpoint", [1541, 2436]),
      ],
    },
    "Fool's Road": {
      map: window.DEBUG ? foolsroad_l : foolsroad,
      locations: [
        window.Utils.createLocation("Russian Main", [1718, 1584]),
        window.Utils.createLocation("Mine Entrance", [1205, 962]),
        window.Utils.createLocation("Train Station", [1516, 426]),
        window.Utils.createLocation("Fortress", [309, 292]),
        window.Utils.createLocation("Hilltop Encampment", [546, 959]),
        window.Utils.createLocation("FOB Papanov", [168, 1401]),
        window.Utils.createLocation("OP Fortress", [883, 354]),
        window.Utils.createLocation("Ammo Depot | Hill", [777, 761]),
        window.Utils.createLocation("North Village", [440, 1399]),
        window.Utils.createLocation("Hill 123", [686, 1555]),
      ],
    },
    "Operation First Light": {
      map: window.DEBUG ? forest_l : forest,
      locations: [
        window.Utils.createLocation("Militia Main", [139, 852]),
        window.Utils.createLocation("Railroad Village", [469, 882]),
        window.Utils.createLocation("The Castle", [352, 502]),
        window.Utils.createLocation("Storage Site", [632, 375]),
        window.Utils.createLocation("Nirem Village", [870, 458]),
        window.Utils.createLocation("Rail Docks", [788, 773]),
        window.Utils.createLocation("US Main", [1049, 767]),
      ],
    },
    "Gorodok": {
      map: window.DEBUG ? gorodok_l : gorodok,
      locations: [
        window.Utils.createLocation("Militia Camp", [3608, 775]),
        window.Utils.createLocation("Desna", [3264, 1405]),
        window.Utils.createLocation("Bunker", [2017, 1645]),
        window.Utils.createLocation("Shipping Yard", [666, 1840]),
        window.Utils.createLocation("Akim", [1219, 3295]),
        window.Utils.createLocation("The Mound", [2289, 3449]),
        window.Utils.createLocation("Industrial Park", [3205, 3413]),
        window.Utils.createLocation("Russian Main", [3681, 3626]),
      ],
    },
    "Jensen's Range": {
      map: window.DEBUG ? jensens_l : jensens,
      locations: [
        window.Utils.createLocation("US Main", [336, 800]),
        window.Utils.createLocation("Vehicles", [599, 977]),
      ],
    },
    "Kohat Toi River Valley": {
      map: window.DEBUG ? kohat_l : kohat,
      locations: [
        window.Utils.createLocation("US Main", [1453, 2666]),
        window.Utils.createLocation("Jouzara", [2603, 2855]),
        window.Utils.createLocation("Chakar Kot", [1423, 1755]),
        window.Utils.createLocation("Malak Abad", [2070, 1856]),
        window.Utils.createLocation("Mohd Zai", [2548, 1822]),
        window.Utils.createLocation("Togh Sarai", [2435, 1196]),
        window.Utils.createLocation("Sarozai", [1877, 281]),
        window.Utils.createLocation("Russian Main", [2750, 638]),
        window.Utils.createLocation("Khadizai", [2216, 2638]),
        window.Utils.createLocation("Radio Tower", [2133, 2325]),
        window.Utils.createLocation("Ali Abad", [1841, 2038]),
        window.Utils.createLocation("Suni Khel", [1235, 1083]),
        window.Utils.createLocation("North Bridge", [1340, 735]),
      ],
    },
    "Kokan": {
      map: window.DEBUG ? kokan_l : kokan,
      locations: [
        window.Utils.createLocation("INS Main", [185, 1543]),
        window.Utils.createLocation("Stonebend", [308, 996]),
        window.Utils.createLocation("Ruins", [480, 717]),
        window.Utils.createLocation("Market", [717, 897]),
        window.Utils.createLocation("Tempest Estate", [1087, 803]),
        window.Utils.createLocation("Village", [1350, 905]),
        window.Utils.createLocation("Nexus", [1272, 1423]),
        window.Utils.createLocation("First Stand", [1468, 1543]),
        window.Utils.createLocation("US Main", [1838, 1770]),
      ],
    },
    "Logar Valley": {
      map: window.DEBUG ? logarvalley_l : logarvalley,
      locations: [
        window.Utils.createLocation("Militia Main", [692, 144]),
        window.Utils.createLocation("Mechanic Shop", [1018, 123]),
        window.Utils.createLocation("South Residence", [1331, 455]),
        window.Utils.createLocation("South DC", [1099, 813]),
        window.Utils.createLocation("North DC", [834, 839]),
        window.Utils.createLocation("North Residence", [574, 1077]),
        window.Utils.createLocation("Poppy Farm", [718, 1423]),
        window.Utils.createLocation("Murika Main", [1113, 1483]),
      ],
    },
    "Mestia": {
      map: window.DEBUG ? mestia_l : mestia,
      locations: [
        window.Utils.createLocation("Militia Main", [1062, 233]),
        window.Utils.createLocation("The Armory", [1318, 594]),
        window.Utils.createLocation("Fortification", [1017, 854]),
        window.Utils.createLocation("Warehouse", [1769, 819]),
        window.Utils.createLocation("Crucible Beta", [1233, 1275]),
        window.Utils.createLocation("Crucible Alpha", [1123, 1305]),
        window.Utils.createLocation("Quarry", [586, 1684]),
        window.Utils.createLocation("Crucible Gamma", [1118, 1503]),
        window.Utils.createLocation("Farmstead", [1381, 1794]),
        window.Utils.createLocation("Russian Main", [1656, 2235]),
      ],
    },
    "Narva": {
      map: window.DEBUG ? narva_l : narva,
      locations: [
        window.Utils.createLocation("US Main", [536, 842]),
        window.Utils.createLocation("Loading Dock", [598, 1032]),
        window.Utils.createLocation("Outskirts", [1603, 1141]),
        window.Utils.createLocation("Residences", [1423, 1434]),
        window.Utils.createLocation("Trash Pile", [1254, 1302]),
        window.Utils.createLocation("Train Station", [1049, 1359]),
        window.Utils.createLocation("Castle", [933, 1606]),
        window.Utils.createLocation("Playground", [705, 1334]),
        window.Utils.createLocation("Ruins", [1511, 1370]),
        window.Utils.createLocation("Russian Main", [1685, 1566]),
      ],
    },
    "Sumari Bala": {
      map: window.DEBUG ? sumari_l : sumari,
      locations: [
        window.Utils.createLocation("US Main", [743, 137]),
        window.Utils.createLocation("Junction", [700, 362]),
        window.Utils.createLocation("Police Station", [630, 575]),
        window.Utils.createLocation("Ancient Qanat", [531, 716]),
        window.Utils.createLocation("Raisin Dryers", [833, 479]),
        window.Utils.createLocation("Commons", [510, 869]),
        window.Utils.createLocation("School", [704, 885]),
        window.Utils.createLocation("INS Hideout", [754, 1134]),
        window.Utils.createLocation("Market", [584, 478]),
        window.Utils.createLocation("Courtyard", [707, 436]),
        window.Utils.createLocation("Checkpoint", [803, 283]),
        window.Utils.createLocation("Palace", [712, 759]),
        window.Utils.createLocation("Training Camp", [610, 1008]),
        window.Utils.createLocation("INS Main", [517, 1181]),
      ],
    },
    "Yehorivka": {
      map: window.DEBUG ? yehorivka_l : yehorivka,
      locations: [
        window.Utils.createLocation("Russian Main", [864, 986]),
        window.Utils.createLocation("Upper Petrivka", [1090, 2206]),
        window.Utils.createLocation("Central Petrivka", [1306, 1837]),
        window.Utils.createLocation("Lower Petrivka", [1479, 2229]),
        window.Utils.createLocation("Village", [1440, 2771]),
        window.Utils.createLocation("Stepne", [1874, 3046]),
        window.Utils.createLocation("Storage Site", [2141, 1605]),
        window.Utils.createLocation("Upper Novo", [2336, 2350]),
        window.Utils.createLocation("Central Novo", [2651, 1981]),
        window.Utils.createLocation("Lower Novo", [2668, 2325]),
        window.Utils.createLocation("Airfield", [3143, 2212]),
        window.Utils.createLocation("US Main", [3455, 2827]),
      ],
    },
  };

  window.MAPDATA = MAPDATA;
})();
