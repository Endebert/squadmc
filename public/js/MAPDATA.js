/* eslint-disable camelcase */
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

// eslint-disable-next-line dot-notation
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

window.MAPDATA = MAPDATA;
