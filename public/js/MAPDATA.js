/* eslint-disable camelcase,dot-notation */
/**
 * This file holds all static map data.
 * MAPDATA holds the maps and their imageOverlays, as well as their location markers.
 */

const MAPDATA = {
  "maps": {},
  "locations": {},
};

// imageOverlays for each map
// bounds calculated by taking screenshots in-game and counting pixels (of grid)
const albasrah = window.L.imageOverlay("./maps/albasrah.jpg", [[0, 0], [3200, 3200]]);
const chora = window.L.imageOverlay("./maps/chora.jpg", [[0, 0], [4073, 4073]]);
const foolsroad = window.L.imageOverlay("./maps/foolsroad.jpg", [[0, 0], [1775, 1739]]);
const forest = window.L.imageOverlay("./maps/forest.jpg", [[0, 0], [1200, 1200]]);
const gorodok = window.L.imageOverlay("./maps/gorodok.jpg", [[0, 0], [4347, 4347]]);
const jensens = window.L.imageOverlay("./maps/jensens.jpg", [[0, 0], [1513, 1513]]);
const kohat = window.L.imageOverlay("./maps/kohat.jpg", [[0, 0], [4026, 4026]]);
const kokan = window.L.imageOverlay("./maps/kokan.jpg", [[0, 0], [2500, 2500]]);
const logarvalley = window.L.imageOverlay("./maps/logarvalley.jpg", [[0, 0], [1765, 1765]]);
const mestia = window.L.imageOverlay("./maps/mestia.jpg", [[0, 0], [2403, 2403]]);
const narva = window.L.imageOverlay("./maps/narva.jpg", [[0, 0], [2205, 2205]]);
const sumari = window.L.imageOverlay("./maps/sumari.jpg", [[0, 0], [1303, 1303]]);
const yehorivka = window.L.imageOverlay("./maps/yehorivka.jpg", [[0, 0], [4041, 4041]]);

// debug maps
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

MAPDATA.maps = {
  "Al Basrah": albasrah,
  "Chora Valley": chora,
  "Fool's Road": foolsroad,
  "Operation First Light": forest,
  "Gorodok": gorodok,
  "Jensen's Range": jensens,
  "Kohat Toi River Valley": kohat,
  "Kokan": kokan,
  "Logar Valley": logarvalley,
  "Mestia": mestia,
  "Narva": narva,
  "Sumari Bala": sumari,
  "Yehorivka": yehorivka,

  "DEBUG: Al Basrah": albasrah_l,
  "DEBUG: Chora Valley": chora_l,
  "DEBUG: Fool's Road": foolsroad_l,
  "DEBUG: Operation First Light": forest_l,
  "DEBUG: Gorodok": gorodok_l,
  "DEBUG: Jensen's Range": jensens_l,
  "DEBUG: Kohat Toi River Valley": kohat_l,
  "DEBUG: Kokan": kokan_l,
  "DEBUG: Logar Valley": logarvalley_l,
  "DEBUG: Mestia": mestia_l,
  "DEBUG: Narva": narva_l,
  "DEBUG: Sumari Bala": sumari_l,
  "DEBUG: Yehorivka": yehorivka_l,
};

// location markers for each map. Simple string matching with map names above is used.
// protip: load page with "debug=true" query and click on map => copies coordinates into clipboard
MAPDATA.locations["Al Basrah"] = [
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
];

MAPDATA.locations["Chora Valley"] = [
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
];

MAPDATA.locations["Fool's Road"] = [
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
];

MAPDATA.locations["Operation First Light"] = [
  Utils.createLocation("Militia Main", [139, 852]),
  Utils.createLocation("Railroad Village", [469, 882]),
  Utils.createLocation("The Castle", [352, 502]),
  Utils.createLocation("Storage Site", [632, 375]),
  Utils.createLocation("Nirem Village", [870, 458]),
  Utils.createLocation("Rail Docks", [788, 773]),
  Utils.createLocation("US Main", [1049, 767]),

];

MAPDATA.locations["Gorodok"] = [
  window.Utils.createLocation("Militia Camp", [3608, 775]),
  window.Utils.createLocation("Desna", [3264, 1405]),
  window.Utils.createLocation("Bunker", [2017, 1645]),
  window.Utils.createLocation("Shipping Yard", [666, 1840]),
  window.Utils.createLocation("Akim", [1219, 3295]),
  window.Utils.createLocation("The Mound", [2289, 3449]),
  window.Utils.createLocation("Industrial Park", [3205, 3413]),
  window.Utils.createLocation("Russian Main", [3681, 3626]),
];

MAPDATA.locations["Jensen's Range"] = [
  Utils.createLocation("US Main", [336, 800]),
  Utils.createLocation("Vehicles", [599, 977]),
];

MAPDATA.locations["Kohat Toi River Valley"] = [
  Utils.createLocation("US Main", [1453, 2666]),
  Utils.createLocation("Jouzara", [2603, 2855]),
  Utils.createLocation("Chakar Kot", [1423, 1755]),
  Utils.createLocation("Malak Abad", [2070, 1856]),
  Utils.createLocation("Mohd Zai", [2548, 1822]),
  Utils.createLocation("Togh Sarai", [2435, 1196]),
  Utils.createLocation("Sarozai", [1877, 281]),
  Utils.createLocation("Russian Main", [2750, 638]),
];

MAPDATA.locations["Kokan"] = [
  Utils.createLocation("INS Main", [185, 1543]),
  Utils.createLocation("Stonebend", [308, 996]),
  Utils.createLocation("Ruins", [480, 717]),
  Utils.createLocation("Market", [717, 897]),
  Utils.createLocation("Tempest Estate", [1087, 803]),
  Utils.createLocation("Village", [1350, 905]),
  Utils.createLocation("Nexus", [1272, 1423]),
  Utils.createLocation("First Stand", [1468, 1543]),
  Utils.createLocation("US Main", [1838, 1770]),
];

MAPDATA.locations["Logar Valley"] = [
  Utils.createLocation("Militia Main", [692, 144]),
  Utils.createLocation("Mechanic Shop", [1018, 123]),
  Utils.createLocation("South Residence", [1331, 455]),
  Utils.createLocation("South DC", [1099, 813]),
  Utils.createLocation("North DC", [834, 839]),
  Utils.createLocation("North Residence", [574, 1077]),
  Utils.createLocation("Poppy Farm", [718, 1423]),
  Utils.createLocation("Murika Main", [1113, 1483]),
];

MAPDATA.locations["Mestia"] = [
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
];

MAPDATA.locations["Narva"] = [
  Utils.createLocation("US Main", [536, 842]),
  Utils.createLocation("Loading Dock", [598, 1032]),
  Utils.createLocation("Alpha", [782, 865]),
  Utils.createLocation("Bravo", [819, 1175]),
  Utils.createLocation("Charlie", [1037, 1249]),
  Utils.createLocation("Delta", [1249, 1299]),
  Utils.createLocation("Echo", [1412, 1343]),
  Utils.createLocation("Foxtrot", [1444, 1605]),
  // Utils.createLocation("PAAS Alpha", [1557, 1150]),
  // Utils.createLocation("PAAS Bravo", [1322, 1462]),
  // Utils.createLocation("PAAS Charlie", [1249, 1124]),
  // Utils.createLocation("PAAS Delta", [1014, 1474]),
  // Utils.createLocation("PAAS Echo", [874, 862]),
  // Utils.createLocation("PAAS Foxtrot", [720, 1200]),
  Utils.createLocation("Ruins", [1511, 1370]),
  Utils.createLocation("Russian Main", [1685, 1566]),
];

MAPDATA.locations["Sumari Bala"] = [
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
];

MAPDATA.locations["Yehorivka"] = [
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
];

window.MAPDATA = MAPDATA;