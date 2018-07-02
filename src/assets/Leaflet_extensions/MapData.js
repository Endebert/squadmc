import SquadMap from "./SquadMap";

/**
 * This object holds all relevant information of the squad maps, including dimensions, heightmap, etc.
 * @type {*[]}
 */
export default class MapData {
  init(baseUrl) {
    console.log("init:", baseUrl);
    this.url = baseUrl;
    return fetch(`${baseUrl}/mapdata.json`).then(result => result.json()).then((json) => {
      // console.log("fetch result:", json);
      this.data = json;

      // now we adapt all relative urls so that they are absolute
      this.data.forEach((map) => {
        map.url = baseUrl + map.url;
        if (map.heightmap) {
          map.heightmap.url = baseUrl + map.heightmap.url;
          map.heightmap.tile = baseUrl + map.heightmap.tile;
        }
      });
    });
  }

  getMapNames() {
    const names = [];
    this.data.forEach((map) => {
      names.push(map.name);
    });
    console.log(`returning map names: ${names}`);
    return names;
  }

  getSquadMap(mapName) {
    console.log("getSquadMap:", mapName);
    for (let i = 0; i < this.data.length; i += 1) {
      if (mapName === this.data[i].name) {
        return new SquadMap(this.data[i]);
      }
    }

    throw new Error(`No map named ${mapName} exists!`);
  }
}
