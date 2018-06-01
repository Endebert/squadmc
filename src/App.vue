<template>
  <v-app dark onselectstart="return false" class="fixed">
    <v-menu
        v-model="showMenu"
        absolute
        :open-on-click="false"
        :position-x="menuPos.x"
        :position-y="menuPos.y"
    >
      <v-card>
        <v-content class="pa-0">
          <v-layout row>
            <v-layout column style="border-right: 2px #212121 solid">
              <v-btn icon large v-for="(mUrl) in mortarColors" :key="mUrl" @click="onSelect(mUrl, PIN_TYPE.MORTAR)">
                <img :src="mUrl" width="48px" height="48px">
              </v-btn>
            </v-layout>
            <v-layout column>
              <v-btn icon large v-for="(mUrl) in targetColors" :key="mUrl" @click="onSelect(mUrl, PIN_TYPE.TARGET)">
                <img :src="mUrl" width="48px" height="48px">
              </v-btn>
            </v-layout>
            <v-layout column style="border-left: 2px #212121 solid">
              <v-btn icon large v-for="(mUrl) in fobColors" :key="mUrl" @click="onSelect(mUrl, PIN_TYPE.FOB)">
                <img :src="mUrl" width="48px" height="48px">
              </v-btn>
            </v-layout>
          </v-layout>
        </v-content>
      </v-card>
    </v-menu>
    <v-navigation-drawer
        v-model="drawer"
        fixed
        app
        clipped
    >
      <v-toolbar>
        <v-list class="pa-0">
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>SquadMC</v-list-tile-title>
              <v-list-tile-sub-title>The map-based mortar calculator for Squad</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pa-0" two-line>
        <v-list-tile @click="openGitHub()">
          <v-list-tile-content>
            <v-list-tile-title>View Code on GitHub</v-list-tile-title>
            <v-list-tile-sub-title>Submit issues, contribute, etc.</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-badge overlap="">
              <v-icon small slot="badge">open_in_new</v-icon>
              <img src="/img/svg/github.svg" width="40px" height="40px"/>
            </v-badge>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class="pa-0">
        <v-list-group :value="true">
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Map Settings</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch
                  v-model="showGrid"
              ></v-switch>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Show Keypad Grid</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-avatar>
              <v-icon>grid_on</v-icon>
            </v-list-tile-avatar>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch
                  v-model="showHeightmap"
                  :disabled="!squadMap || !squadMap.hasHeightmap"
              ></v-switch>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Show Heightmap</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-avatar>
              <v-icon>terrain</v-icon>
            </v-list-tile-avatar>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-switch
                  v-model="showLocations"
              ></v-switch>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Show Locations</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-avatar>
              <v-icon>location_on</v-icon>
            </v-list-tile-avatar>
          </v-list-tile>
        </v-list-group>
        <v-list-group :disabled="placedMortars.length + placedFobs.length + placedTargets.length === 0">
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Remove Pins</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="placedMortars.length > 0">
            <v-list-tile-content>
              <v-layout>
                <v-btn icon v-for="(aMortar, i) in placedMortars" :key="i" @click="removeMortar(i)">
                  <img :src="aMortar.mUrl" width="48px" height="48px">
                </v-btn>
              </v-layout>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="placedTargets.length > 0">
            <v-list-tile-content>
              <v-layout>
                <v-btn icon v-for="(aTarget, i) in placedTargets" :key="i" @click="removeTarget(i)">
                  <img :src="aTarget.mUrl" width="48px" height="48px">
                </v-btn>
              </v-layout>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-if="placedFobs.length > 0">
            <v-list-tile-content>
              <v-layout>
                <v-btn icon v-for="(aFob, i) in placedFobs" :key="i" @click="removeFob(i)">
                  <img :src="aFob.mUrl" width="48px" height="48px">
                </v-btn>
              </v-layout>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
        app
        dense
        fixed
        clipped-left
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
        <v-icon>menu</v-icon>
      </v-toolbar-side-icon>
      <img src="/img/svg/icon.svg" width="40px" height="40px">
      <v-toolbar-title style="margin-right: 17px">
        <v-select
            :items="maps"
            :loading="loading"
            append-icon="map"
            single-line
            v-model="selectedMap"
            item-value="text"
            max-height="90%"
            hide-details
        ></v-select>
      </v-toolbar-title>
    </v-toolbar>
    <v-content class="fixed">
      <div id="map" class="fixed"></div>
      <div class="bottom-bar">
        <v-card class="ma-2 d-inline-flex" v-if="showKeypadTimeout" style="width: fit-content">
          <v-card-text class="keypadLabel d-inline">
            {{mouseKeypad}}
          </v-card-text>
        </v-card>
        <v-footer v-if="mortar && target" class="front" height="auto">
          <v-speed-dial>
            <v-btn fab small slot="activator" class="secondary">
              <img :src="mortar.mUrl" width="48px" height="48px">
            </v-btn>
            <v-btn icon v-for="(aMortar, index) in placedMortars" :key="index" @click="mortar = placedMortars[index]">
              <img :src="aMortar.mUrl" width="48px" height="48px">
            </v-btn>
          </v-speed-dial>
          <v-icon :color="distLine && distLine.options.color">arrow_forward</v-icon>
          <v-speed-dial v-if="target">
            <v-btn fab small slot="activator" class="secondary">
              <img :src="target.mUrl" width="48px" height="48px">
            </v-btn>
            <v-btn icon v-for="(aTarget, index) in placedTargets" :key="index" @click="target = placedTargets[index]">
              <img :src="aTarget.mUrl" width="48px" height="48px">
            </v-btn>
          </v-speed-dial>
          <v-flex>
            <v-list class="d-inline-flex transparent pa-0">
              <v-list-tile style="font-family: monospace;">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <v-layout row>
                      <v-flex text-xs-center class="px-1">
                        {{`✵${pad((Math.round(bearing * 10) / 10).toFixed(1), 5)}°`}}
                      </v-flex>
                      <v-flex text-xs-center class="px-1">
                        {{Number.isNaN(elevation) ? "∠XXXXmil" : `∠${pad(Math.round(elevation), 4)}mil`}}
                      </v-flex>
                    </v-layout>
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <v-layout row>
                      <v-flex text-xs-center class="px-1">
                        {{`↔${pad(Math.round(dist), 4)}m`}}
                      </v-flex>
                      <v-flex text-xs-center class="px-1">
                        {{
                        heightDiff > 0 ?
                        `↕+${pad(Math.round(heightDiff), 3)}m` :
                        `↕-${pad(Math.round(-heightDiff), 3)}m`
                        }}
                      </v-flex>
                    </v-layout>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-footer>
      </div>
    </v-content>
    <canvas id="heightmap"></canvas>
  </v-app>
</template>

<script>
import { CRS, Map, Point, Polyline, Transformation } from "./assets/Leaflet/dist/leaflet-src.esm";

import SquadGrid from "./assets/Leaflet_extensions/SquadGrid";
import LocationLayer from "./assets/Leaflet_extensions/LocationLayer";
import { getMapNames, getSquadMap } from "./assets/Leaflet_extensions/MAPDATA";
import { calcMortarAngle, getKP, pad } from "./assets/Leaflet_extensions/Utils";
import { PIN_TYPE } from "./assets/Leaflet_extensions/Vars";
import PinHolder from "./assets/Leaflet_extensions/PinHolder";

export default {
  name: "App",
  data() {
    return {
      showMenu: false, // menu when clicking on map
      drawer: undefined, // left navigation drawer
      map: undefined, // leaflet map object
      maps: getMapNames(), // map names for top selector
      grid: new SquadGrid(), // keypad grid
      locationLayer: new LocationLayer(), // locationlayer
      showGrid: this.fromStorage("showGrid", "true") === "true",
      showHeightmap: this.fromStorage("showHeightmap", "false") === "true",
      showLocations: this.fromStorage("showLocations", "true") === "true",
      selectedMap: this.fromStorage("selectedMap", undefined), // selected map in top selector
      mouseKeypad: undefined, // keypad shown in bottom left corner
      showKeypadTimeout: undefined, // value of timeout, set when mouse is moved, set undefined after 1 sec
      mortar: undefined, // active mortar (for line drawing)
      target: undefined, // active target (for line drawing)
      distLine: undefined, // the line
      // available colors
      mortarColors: ["/img/svg/mortar_pin_red.svg",
        "/img/svg/mortar_pin_green.svg", "/img/svg/mortar_pin_blue.svg", "/img/svg/mortar_pin.svg"],
      targetColors: ["/img/svg/target_pin_red.svg",
        "/img/svg/target_pin_green.svg", "/img/svg/target_pin_blue.svg", "/img/svg/target_pin.svg"],
      fobColors: ["/img/svg/fob_pin_red.svg",
        "/img/svg/fob_pin_green.svg", "/img/svg/fob_pin_blue.svg", "/img/svg/fob_pin.svg"],

      placedMortars: [], // mortars currently on map
      placedTargets: [], // targets currently on map
      placedFobs: [], // fobs currently on map

      menuPos: new Point(500, 500), // x:y position set just before click menu is shown
      menuLatlng: undefined, // same position but in latlng
      squadMap: undefined, // class that holds current map, see SquadMap class
      loading: true,

      // values for mortar settings, distance, etc.
      bearing: undefined,
      elevation: undefined,
      dist: undefined,
      heightDiff: undefined,

      PIN_TYPE, // reference to pin types
      pad, // reference to padding function used for formatting distance, heightDiff, etc.
    };
  },
  mounted() {
    // console.log("MOUNTED");

    // remove right click to fix context menu opening when long pressing pin for dragging
    document.oncontextmenu = function retFalse() {
      return false;
    };

    this.setupMap();

    // set selected map, defined already if loaded from localStorage
    if (!this.selectedMap || this.maps.indexOf(this.selectedMap) === -1) {
      this.selectedMap = this.maps[0];
    } else {
      // since selectedMap is already defined and doesn't trigger changeMap, we do it here manually
      this.changeMap(this.selectedMap);
    }
    setTimeout(() => {
      // dirty hack to set map position to fixed on mobile devices
      // on mobile safari, map doesn't show if not fixed
      // but if always fixed, persistent navbar is over map on desktop, which is clunky
      // so this is the compromise.
      if (this.drawer) {
        document.getElementById("map").style.position = "relative";
      }
      this.map.invalidateSize();
    }, 10);
  },
  methods: {
    /**
     * Does the inital leaflet map setup, adding listeners for mouse click and move
     */
    setupMap() {
      console.log("setupMap");
      // printMapExtras();

      this.map = new Map("map", {
        crs: CRS.Simple,
        minZoom: 0,
        maxZoom: 5,
        attributionControl: false,
        zoomControl: false,
        layers: [],
        // zoomSnap: 0, // not needed for new scaling with tile layers
      });

      this.map.on("mousemove", this.onMouseMove, this);
      this.map.on("click", this.onMapClick, this);
    },

    /**
     * Changes current map to the given map
     * @param newMap map to show
     */
    changeMap(newMap) {
      console.log("changeMap:", newMap);
      const squadMap = getSquadMap(newMap);

      // clear map completely
      this.map.eachLayer((layer) => {
        this.map.removeLayer(layer);
      });

      // clear map related objects
      this.mortar = undefined;
      this.target = undefined;
      this.placedTargets = [];
      this.placedMortars = [];
      this.placedFobs = [];

      console.log("setting up bounds");
      const x = 256 / squadMap.bounds.getNorth(); // 256 is inital tile size
      const y = 256 / squadMap.bounds.getEast();
      this.map.options.crs.transformation = new Transformation(y, 0, x, 0);
      this.map.fitBounds(squadMap.bounds);
      this.map.setMaxBounds(squadMap.bounds.pad(0.5));

      console.log("setting up grid");
      this.grid.setBounds(squadMap.bounds);
      if (this.showGrid) {
        this.map.addLayer(this.grid);
      }

      if (squadMap.hasLocations) {
        console.log("setting up location");
        const locations = squadMap.getLocations();
        this.locationLayer.setLocations(locations);
        if (this.showLocations) {
          this.map.addLayer(this.locationLayer);
        }
      }

      let layer = squadMap.getMapTileLayer();
      layer.on("loading", () => {
        this.loading = true;
      });
      layer.on("load", () => {
        this.loading = false;
      });
      if (this.showHeightmap && squadMap.hasHeightmap) {
        layer = squadMap.getHeightmapTileLayer();
        layer.on("loading", () => {
          this.loading = true;
        });
        layer.on("load", () => {
          this.loading = false;
        });
      }

      console.log("setting up map layer");

      this.map.addLayer(layer); // finally add the map

      this.map.setView(squadMap.bounds.getCenter());

      // hack to properly align map and squadgrid
      // eslint-disable-next-line no-underscore-dangle
      this.map._resetView(this.map.getCenter(), this.map.getZoom());

      this.squadMap = squadMap;
    },
    /**
     * Handles "mousemove" events on leaflet map
     * @param e "mousemove" event
     */
    onMouseMove(e) {
      // console.log("onMouseMove:", e);

      // format position as keypad for bottom left corner
      this.mouseKeypad = getKP(e.latlng.lat, e.latlng.lng);

      // black magic to only have bottom left keypad indicator shown for 1 second
      if (this.showKeypadTimeout) {
        clearTimeout(this.showKeypadTimeout);
      }
      this.showKeypadTimeout = setTimeout(() => {
        // console.log("clearing showKeypadTimeout MOVE", this.showKeypadTimeout);
        this.showKeypadTimeout = undefined;
      }, 1000);
    },
    /**
     * Handles "click" events on leaflet map
     * @param e "click" event
     */
    onMapClick(e) {
      console.log("onMapClick:", e);
      if (this.showKeypadTimeout) {
        clearTimeout(this.showKeypadTimeout);
        this.showKeypadTimeout = undefined;
      }

      // it is possible that mouse is moving too fast while dragging a pin
      // pin is lagging behind mouse position
      // and when releasing the pin, the map fires a click event when mouse is not over the pin
      // below is a hack to only show menu if no pin was recently dragged

      // only click if we weren't dragging anything
      let dragging = false;

      // check mortars first
      for (let i = 0; i < this.placedMortars.length; i += 1) {
        if (this.placedMortars[i].dragging) {
          dragging = true;
          break;
        }
      }

      // if no mortars were dragged, check targets
      if (!dragging) {
        for (let i = 0; i < this.placedTargets.length; i += 1) {
          if (this.placedTargets[i].dragging) {
            dragging = true;
            break;
          }
        }
      }

      // if no targets were dragged, check fobs
      if (!dragging) {
        for (let i = 0; i < this.placedFobs.length; i += 1) {
          if (this.placedFobs[i].dragging) {
            dragging = true;
            break;
          }
        }
      }

      if (!dragging) {
        this.menuLatlng = e.latlng;
        this.menuPos = new Point(e.originalEvent.x, e.originalEvent.y);
        this.showMenu = true;
      }
    },
    /**
     * Handles selected mortar/target/fob from map click menu, creating the pin or moving it to its new position
     * @param {String} mUrl - image url of pin graphic
     * @param {Number} type - type of pin, check PIN_TYPE in Vars
     */
    onSelect(mUrl, type) {
      console.log("onSelect", [mUrl, type]);

      // check placed pins. if pin exists already, just move it
      for (let i = 0; i < this.placedMortars.length; i += 1) {
        if (mUrl === this.placedMortars[i].mUrl) {
          this.placedMortars[i].pos = this.menuLatlng;
          this.mortar = this.placedMortars[i];
          return;
        }
      }

      // check placed pins. if pin exists already, just move it
      for (let i = 0; i < this.placedTargets.length; i += 1) {
        if (mUrl === this.placedTargets[i].mUrl) {
          this.placedTargets[i].pos = this.menuLatlng;
          this.target = this.placedTargets[i];
          return;
        }
      }

      // check placed pins. if pin exists already, just move it
      for (let i = 0; i < this.placedFobs.length; i += 1) {
        if (mUrl === this.placedFobs[i].mUrl) {
          this.placedFobs[i].pos = this.menuLatlng;
          return;
        }
      }

      // console.log("pin doesn't exist, yet, creating it...");

      const pin = new PinHolder(mUrl, type);
      pin.pos = this.menuLatlng;
      pin.addTo(this.map);

      switch (type) {
        case PIN_TYPE.MORTAR:
          this.mortar = pin;
          this.placedMortars.push(pin);
          break;
        case PIN_TYPE.TARGET:
          this.target = pin;
          this.placedTargets.push(pin);
          break;
        case PIN_TYPE.FOB:
          this.placedFobs.push(pin);
          break;
        default:
          console.error(`Unrecognized pin type ${type}!`);
      }
    },
    /**
     * Calculates mortar settings.
     *
     * @param {PinHolder} mortar - mortar pin
     * @param {PinHolder} target - target pin
     */
    calcMortar(mortar, target) {
      // console.log("calcMortar", [mortar, target]);
      // let time = Date.now();

      const s = mortar.pos;
      const e = target.pos;

      // oh no, vector maths!
      let bearing = Math.atan2(e.lng - s.lng, e.lat - s.lat) * 180 / Math.PI;

      const a = s.lat - e.lat;
      const b = s.lng - e.lng;

      const dist = Math.sqrt(a * a + b * b);

      // rotate so 0° is towards North, round to 1 decimal, mod 360 so that 360° = 0°
      bearing = (Math.round((180 - bearing) * 10) / 10) % 360;

      // now we get the height and calculate the difference
      const mortarHeight = this.squadMap.hasHeightmap ? this.squadMap.getHeightmapHolder().getHeight(s.lng, s.lat) : 0;
      const targetHeight = this.squadMap.hasHeightmap ? this.squadMap.getHeightmapHolder().getHeight(e.lng, e.lat) : 0;
      // console.log(`calcMortar: m:${mortarHeight} t:${targetHeight}`);

      const heightDiff = targetHeight - mortarHeight;
      const elevation = Math.round(calcMortarAngle(dist, heightDiff));

      // create or move the line
      if (!this.distLine) {
        this.distLine = new Polyline([s, e], {
          color: "green",
          interactive: false,
          clickable: false, // legacy support
        });
      } else {
        this.distLine.setLatLngs([s, e]);
      }

      // isNaN is used as elevation might be NaN
      this.distLine.setStyle({ color: Number.isNaN(elevation) || elevation > 1579 ? "red" : "green" });

      // add to map if it isn't shown yet
      if (!this.map.hasLayer(this.distLine)) {
        this.map.addLayer(this.distLine);
      }

      this.bearing = bearing;
      this.elevation = elevation;
      this.dist = dist;
      this.heightDiff = heightDiff;

      // time = Date.now() - time;

      // console.log(`calcMortar took ${time}ms`);
    },
    /**
     * Remove an already placed mortar, specified by its index in placedMortars
     * @param {Number} i - index of mortar in placedMortars
     */
    removeMortar(i) {
      const tMortar = this.placedMortars[i];
      this.placedMortars.splice(i, 1);
      if (tMortar === this.mortar) {
        if (this.placedMortars.length > 0) {
          this.mortar = this.placedMortars[i === 0 ? 0 : i - 1];
        } else {
          this.mortar = undefined;
        }
      }

      tMortar.removeFrom(this.map);
    },
    /**
     * Remove an already placed target, specified by its index in placedTargets
     * @param {Number} i - index of target in placedTargets
     */
    removeTarget(i) {
      const tTarget = this.placedTargets[i];
      this.placedTargets.splice(i, 1);
      if (tTarget === this.target) {
        if (this.placedTargets.length > 0) {
          this.target = this.placedTargets[i === 0 ? 0 : i - 1];
        } else {
          this.target = undefined;
        }
      }
      tTarget.removeFrom(this.map);
    },
    /**
     * Remove an already placed fob, specified by its index in placedFobs
     * @param {Number} i - index of fob in placedFobs
     */
    removeFob(i) {
      const tFob = this.placedFobs[i];
      this.placedFobs.splice(i, 1);
      tFob.removeFrom(this.map);
    },
    /**
     * Try to get item from localStorage, return defVal if it fails or item is not in storage
     * @param {String} item - item in localStorage
     * @param defVal - value returned if localStorage is missing, or item not present in localStorage
     * @returns {String|*} returns string if item in localStorage, defVal otherwise
     */
    fromStorage(item, defVal) {
      console.log("fromStorage:", [item, defVal]);
      return localStorage ? localStorage.getItem(item) || defVal : defVal;
    },
    /**
     * Try to save item in localStorage
     * @param item - item name
     * @param val - value of item
     */
    toStorage(item, val) {
      // console.log("toStorage:", [item, val]);
      if (localStorage) {
        localStorage.setItem(item, val.toString());
      } else {
        console.warn("No access to localStorage.");
      }
    },
    /**
     * Open GitHub page of this project in a new tab
     */
    openGitHub() {
      window.open("https://github.com/Endebert/squadmc", "_blank");
    },

    /**
     * This function works in tandem with showHeightmap watcher.
     * To bet set to layer.on("load"). Checks what layer to remove after one layer has finished loading.
     */
    showHeightmapOnLoad() {
      console.log("showHeightmapOnLoad");
      const heightmap = this.squadMap.getHeightmapTileLayer();
      const mapLayer = this.squadMap.getMapTileLayer();
      // make sure this function is not being called multiple times
      heightmap.off("load", this.showHeightmapOnLoad);
      mapLayer.off("load", this.showHeightmapOnLoad);
      setTimeout(() => {
        console.log("showHeightmapOnLoad timeout");
        // safety check if it should still be removed
        if (this.showHeightmap && this.map.hasLayer(mapLayer)) {
          this.map.removeLayer(mapLayer);
        } else if (!this.showHeightmap && this.map.hasLayer(heightmap)) {
          this.map.removeLayer(heightmap);
        }
      }, 250);
    },
  },
  watch: {
    /**
     * Changes to selected map and saves it in localStorage
     * @param newMap
     */
    selectedMap(newMap) {
      // console.log("watch selectedMap:", newMap);
      this.changeMap(newMap);
      this.toStorage("selectedMap", newMap);
    },
    /**
     * Toggles keypad grid visibility and saves state to localStorage
     * @param {Boolean} b
     */
    showGrid(b) {
      if (b) {
        this.map.addLayer(this.grid);
      } else {
        this.map.removeLayer(this.grid);
      }
      this.toStorage("showGrid", b);
    },
    /**
     * Toggles heightmap visibility and saves state to localStorage
     * @param {Boolean} b
     */
    showHeightmap(b) {
      // console.log("showHeightmap:", b);
      if (b && this.squadMap.hasHeightmap) {
        // console.log("adding heightmap");
        const heightmap = this.squadMap.getHeightmapTileLayer();
        if (!this.map.hasLayer(heightmap)) {
          this.map.addLayer(heightmap);
          heightmap.on("load", this.showHeightmapOnLoad);
        }
      } else {
        // console.log("removing heightmap");
        const mapLayer = this.squadMap.getMapTileLayer();
        if (!this.map.hasLayer(mapLayer)) {
          this.map.addLayer(mapLayer);
          mapLayer.on("load", this.showHeightmapOnLoad);
        }
      }
      this.toStorage("showHeightmap", b);
    },
    /**
     * Toggles locations visibility and saves state to localStorage
     * @param {Boolean} b
     */
    showLocations(b) {
      if (b) {
        this.map.addLayer(this.locationLayer);
      } else {
        this.map.removeLayer(this.locationLayer);
      }
      this.toStorage("showLocations", b);
    },
    /**
     * Triggers calculation on position change of active mortar
     */
    "mortar.pos": function mortarPosWatcher() {
      // console.log(`MORTAR CHANGED: ${latlng.lat}|${latlng.lng}`);
      if (this.mortar && this.target) {
        this.calcMortar(this.mortar, this.target);
      } else if (this.map.hasLayer(this.distLine)) {
        this.map.removeLayer(this.distLine);
      }
    },
    /**
     * Triggers calculation on position change of active target
     */
    "target.pos": function targetPosWatcher() {
      // console.log(`TARGET CHANGED: ${latlng.lat}|${latlng.lng}`);
      if (this.mortar && this.target) {
        this.calcMortar(this.mortar, this.target);
      } else if (this.map.hasLayer(this.distLine)) {
        this.map.removeLayer(this.distLine);
      }
    },
    /**
     * let new active mortar know that it is active now (in order to show min and max range circles)
     * @param newM - new active mortar
     * @param oldM - old active mortar
     */
    mortar(newM, oldM) {
      if (oldM) {
        oldM.setActive(false, this.map);
      }
      if (newM) {
        newM.setActive(true, this.map);
      }
    },
  },
};
</script>


<style>
  @import "./assets/Leaflet/dist/leaflet.css";
  @import "~material-icons/iconfont/material-icons.css";

  /*hide scrollbar*/
  body {
    overflow-y: hidden;
  }

  body::-webkit-scrollbar {
    display: none;
  }

  .fixed {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .front {
    z-index: 1;
  }

  .leaflet-container {
    background-color: rgba(255, 0, 0, 0);
  }

  .leaflet-tooltip {
    color: white;
    /*border-radius: unset;*/
    /*border: unset;*/
    /*font-family: monospace;*/
    /*font-weight: bold;*/
    /*opacity: 0.5;*/
    /*box-shadow: unset;*/
    border-top: unset;
    border-left: unset;
    border-right: unset;
    padding: 0 0.5em;
    white-space: nowrap;
    border-radius: 1em;
    /*font-family: monospace;*/

    background-color: rgba(0, 0, 0, 0.33);
    text-shadow: 0.1em 0.1em 0.2em rgba(0, 0, 0, 1);
    font-size: large;
  }

  #map {
    cursor: crosshair;
    z-index: 0;
    width: 100%;
    height: 100%;
  }

  #heightmap {
    visibility: hidden;
    position: absolute;
  }

  .keypadLabel {
    padding: 0 0.5em;
    font-family: monospace;
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
