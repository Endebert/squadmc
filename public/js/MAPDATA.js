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
  // bounds calculated by taking screenshots in-game and counting pixels (of grid)
  const albasrah = L.tileLayer("./maps/albasrah/{z}_{x}_{y}.jpg", getTileOps([3200, 3200]));
  const chora = L.tileLayer("./maps/chora/{z}_{x}_{y}.jpg", getTileOps([4073, 4073]));
  const foolsroad = L.tileLayer("./maps/foolsroad/{z}_{x}_{y}.jpg", getTileOps([1775, 1739]));
  const forest = L.tileLayer("./maps/forest/{z}_{x}_{y}.jpg", getTileOps([1200, 1200]));
  const gorodok = L.tileLayer("./maps/gorodok/{z}_{x}_{y}.jpg", getTileOps([4347, 4347]));
  const jensens = L.tileLayer("./maps/jensens/{z}_{x}_{y}.jpg", getTileOps([1513, 1513]));
  const kohat = L.tileLayer("./maps/kohat/{z}_{x}_{y}.jpg", getTileOps([4026, 4026]));
  const kokan = L.tileLayer("./maps/kokan/{z}_{x}_{y}.jpg", getTileOps([2500, 2500]));
  const logarvalley = L.tileLayer("./maps/logarvalley/{z}_{x}_{y}.jpg", getTileOps([1765, 1765]));
  const mestia = L.tileLayer("./maps/mestia/{z}_{x}_{y}.jpg", getTileOps([2403, 2403]));
  const narva = L.tileLayer("./maps/narva/{z}_{x}_{y}.jpg", getTileOps([2205, 2205]));
  const sumari = L.tileLayer("./maps/sumari/{z}_{x}_{y}.jpg", getTileOps([1303, 1303]));
  const yehorivka = L.tileLayer("./maps/yehorivka/{z}_{x}_{y}.jpg", getTileOps([4041, 4041]));

  // debug maps (unused)
  const albasrah_l = L.imageOverlay("./maps/albasrah_l.jpg", [[0, 0], [3200, 3200]]);
  const chora_l = L.imageOverlay("./maps/chora_l.jpg", [[0, 0], [4073, 4073]]);
  const foolsroad_l = L.imageOverlay("./maps/foolsroad_l.jpg", [[0, 0], [1775, 1739]]);
  const forest_l = L.imageOverlay("./maps/forest_l.jpg", [[0, 0], [1200, 1200]]);
  const gorodok_l = L.imageOverlay("./maps/gorodok_l.jpg", [[0, 0], [4347, 4347]]);
  const jensens_l = L.imageOverlay("./maps/jensens_l.jpg", [[0, 0], [1513, 1513]]);
  const kohat_l = L.imageOverlay("./maps/kohat_l.jpg", [[0, 0], [4026, 4026]]);
  const kokan_l = L.imageOverlay("./maps/kokan_l.jpg", [[0, 0], [2500, 2500]]);
  const logarvalley_l = L.imageOverlay("./maps/logarvalley_l.jpg", [[0, 0], [1765, 1765]]);
  const mestia_l = L.imageOverlay("./maps/mestia_l.jpg", [[0, 0], [2403, 2403]]);
  const narva_l = L.imageOverlay("./maps/narva_l.jpg", [[0, 0], [2205, 2205]]);
  const sumari_l = L.imageOverlay("./maps/sumari_l.jpg", [[0, 0], [1303, 1303]]);
  const yehorivka_l = L.imageOverlay("./maps/yehorivka_l.jpg", [[0, 0], [4041, 4041]]);

  MAPDATA = {
    "Al Basrah": {
      map: Utils.isDebug() ? albasrah_l : albasrah,
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
    "Chora Valley": {
      map: Utils.isDebug() ? chora_l : chora,
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
      map: Utils.isDebug() ? foolsroad_l : foolsroad,
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
      map: Utils.isDebug() ? forest_l : forest,
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
      map: Utils.isDebug() ? gorodok_l : gorodok,
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
      map: Utils.isDebug() ? jensens_l : jensens,
      locations: [
        Utils.createLocation("US Main", [336, 800]),
        Utils.createLocation("Vehicles", [599, 977]),
      ],
    },
    "Kohat Toi River Valley": {
      map: Utils.isDebug() ? kohat_l : kohat,
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
      map: Utils.isDebug() ? kokan_l : kokan,
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
      map: Utils.isDebug() ? logarvalley_l : logarvalley,
      locations: [
        Utils.createLocation("Militia Main", [692, 144]),
        Utils.createLocation("Mechanic Shop", [1018, 123]),
        Utils.createLocation("South Residence", [1331, 455]),
        Utils.createLocation("South DC", [1099, 813]),
        Utils.createLocation("North DC", [834, 839]),
        Utils.createLocation("North Residence", [574, 1077]),
        Utils.createLocation("Poppy Farm", [718, 1423]),
        Utils.createLocation("Murika Main", [1113, 1483]),
      ],
    },
    "Mestia": {
      map: Utils.isDebug() ? mestia_l : mestia,
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
      map: Utils.isDebug() ? narva_l : narva,
      locations: [
        Utils.createLocation("US Main", [536, 842]),
        Utils.createLocation("Loading Dock", [598, 1032]),
        Utils.createLocation("Outskirts", [1603, 1141]),
        Utils.createLocation("Residences", [1423, 1434]),
        Utils.createLocation("Trash Pile", [1254, 1302]),
        Utils.createLocation("Train Station", [1049, 1359]),
        Utils.createLocation("Castle", [933, 1606]),
        Utils.createLocation("Playground", [705, 1334]),
        Utils.createLocation("Ruins", [1511, 1370]),
        Utils.createLocation("Russian Main", [1685, 1566]),
      ],
    },
    "Sumari Bala": {
      map: Utils.isDebug() ? sumari_l : sumari,
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
      map: Utils.isDebug() ? yehorivka_l : yehorivka,
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
