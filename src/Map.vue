<template>
<v-app dark>
  <v-toolbar
      app
      dense
      fixed
      clipped-left
  >
    <v-toolbar-side-icon @click.stop="drawer = !drawer">
      <v-icon>menu</v-icon>
    </v-toolbar-side-icon>
    <img src="/img/svg/icon.svg" width="40px">
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
  <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      clipped
      touchless
      disable-resize-watcher
      disable-route-watcher
  >
    <v-toolbar dense>
      <v-toolbar-title>
        {{postScriptum ? "PostScriptumMC" : "SquadMC"}}
        <v-btn small color="primary" @click.stop="changelogDialog = true" style="min-width: 70px">{{appVersion}}</v-btn>
      </v-toolbar-title>
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
            <img src="/img/svg/github.svg" width="40px"/>
          </v-badge>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider v-if="postScriptum"></v-divider>
      <v-list-tile v-if="postScriptum">
        <v-list-tile-content>
          <v-list-tile-title>Set mortar type</v-list-tile-title>
          <v-list-tile-sub-title>
            <v-btn-toggle v-model="mTypeIndex" mandatory style="display: flex">
              <v-btn flat v-for="(mType, i) in mortarTypes" :key="i"
                     style="flex: 1 0 0; border: none">{{mType[0]}}</v-btn>
            </v-btn-toggle></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-divider v-if="postScriptum"></v-divider>
    <v-list class="pa-0">
      <v-list-group :value="true">
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>Map Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="background-color: #b71c1c" v-if="errorString">
          <v-list-tile-content>
            <v-list-tile-title>{{errorString}}</v-list-tile-title>
            <v-list-tile-sub-title>Your settings won't be saved</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-avatar>
            <v-icon>warning</v-icon>
          </v-list-tile-avatar>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-switch
                v-model="quickMode"
            ></v-switch>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Quick Mode</v-list-tile-title>
            <v-list-tile-sub-title>1-click placement</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-avatar>
            <v-icon>fast_forward</v-icon>
          </v-list-tile-avatar>
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
        <v-list-tile>
          <v-list-tile-action>
            <v-switch
                v-model="showAllRanges"
            ></v-switch>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Show All Mortar Circles</v-list-tile-title>
            <v-list-tile-sub-title>instead of active only</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-avatar>
            <v-icon>adjust</v-icon>
          </v-list-tile-avatar>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-switch
                v-model="delayCalcUpdate"
            ></v-switch>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Delay mil update on drag</v-list-tile-title>
            <v-list-tile-sub-title>performance hack</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-avatar>
            <v-icon>timelapse</v-icon>
          </v-list-tile-avatar>
        </v-list-tile>
        <v-list-tile>
          <div class="pr-3">Pin Size</div>
          <v-slider v-model="pinSize" hide-details thumb-label class="pa-0 pr-3"
                    step="12" min="24" max="96" ticks></v-slider>
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
              <v-btn icon style="margin: 2px 2px 2px 2px"
                     v-for="(aMortar, i) in placedMortars" :key="i" @click="removeMortar(i)">
                <img :src="aMortar.sUrl" width="48px">
              </v-btn>
            </v-layout>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="placedTargets.length > 0">
          <v-list-tile-content>
            <v-layout>
              <v-btn icon style="margin: 2px 2px 2px 2px"
                     v-for="(aTarget, i) in placedTargets" :key="i" @click="removeTarget(i)">
                <img :src="aTarget.sUrl" width="48px">
              </v-btn>
            </v-layout>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="placedFobs.length > 0">
          <v-list-tile-content>
            <v-layout>
              <v-btn icon style="margin: 2px 2px 2px 2px"
                     v-for="(aFob, i) in placedFobs" :key="i" @click="removeFob(i)">
                <img :src="aFob.sUrl" width="48px">
              </v-btn>
            </v-layout>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
  <v-content class="fixedPos">
    <div id="map" class="fixedPos"></div>
  </v-content>
  <v-content class="fixedPos" style="pointer-events: none" >
    <div class="bottom-bar front" style="pointer-events: none;">
      <div style="display: flex; align-items: flex-end">
        <div class="ma-2 px-1 secondary font-mono" style="width: fit-content; flex: 0 1 auto"
             v-if="showKeypadTimeout">{{mouseKeypad}}</div>
        <div style="display: flex; flex: 1 1 auto; justify-content: flex-end">
          <v-dialog v-model="placePinVars.dialog" max-width="250">
            <v-btn fab slot="activator" color="secondary darken-2" style="pointer-events: all">
              <v-icon style="width: 50%; height: 50%">add</v-icon>
            </v-btn>
            <v-card>
              <v-card-title style="background-color: #212121">Add Mortar/Target</v-card-title>
              <v-divider></v-divider>
              <v-card-text class="px-0">
                <v-form>
                  <v-container>
                    <v-layout column wrap>
                      <v-flex>
                        <v-btn icon color="secondary darken-2"
                               @click="placePinVars.mIndex = (placePinVars.mIndex + 1) % 4"
                        >
                          <img :src="colors.symbol.mortar[placePinVars.mIndex]" style="width: 48px;">
                        </v-btn>
                        <v-text-field
                            v-model="placePinVars.mText" :error="placePinVars.mError"
                            label="Mortar pos" placeholder="A01-3-3-7"
                            @input="placePinVars.mText = formatKP(placePinVars.mText, PIN_TYPE.MORTAR)"
                            style="width: min-content; font-family: monospace">
                        </v-text-field>
                        <v-btn
                            icon color="secondary darken-2" :disabled="placePinVars.mError || !placePinVars.mText"
                            @click="placePin(placePinVars.mText, placePinVars.mIndex, PIN_TYPE.MORTAR)"
                            @click.stop="placePinVars.mText = undefined">
                          <v-icon>add</v-icon>
                        </v-btn>
                      </v-flex>
                      <v-flex>
                        <v-btn
                            icon color="secondary darken-2"
                            @click="placePinVars.tIndex = (placePinVars.tIndex + 1) % 4">
                          <img :src="colors.symbol.target[placePinVars.tIndex]" style="width: 48px;">
                        </v-btn>
                        <v-text-field
                            v-model="placePinVars.tText" :error="placePinVars.tError"
                            label="Target pos" placeholder="B13-3-7"
                            @input="placePinVars.tText = formatKP(placePinVars.tText, PIN_TYPE.TARGET)"
                            style="width: min-content; font-family: monospace">
                        </v-text-field>
                        <v-btn
                            icon color="secondary darken-2"
                            :disabled="placePinVars.tError || !placePinVars.tText"
                            @click="placePin(placePinVars.tText, placePinVars.tIndex, PIN_TYPE.TARGET)"
                            @click.stop="placePinVars.tText = undefined">
                          <v-icon>add</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn @click.native="placePinVars.dialog = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
      <div id="my-footer" v-if="mortar && target" style="background-color: #212121">
        <v-speed-dial>
          <v-btn fab small slot="activator" class="secondary" style="width: 32px; height: 32px;">
            <img :src="mortar.sUrl" style="width: 48px;">
          </v-btn>
          <v-btn icon
                 v-for="(aMortar, index) in placedMortars"
                 :key="index"
                 @click="mortar = placedMortars[index]"
          >
            <img :src="aMortar.sUrl" style="width: 48px;">
          </v-btn>
        </v-speed-dial>
        <v-icon>arrow_forward</v-icon>
        <v-speed-dial v-if="target">
          <v-btn fab small slot="activator" class="secondary" style="width: 32px; height: 32px;">
            <img :src="target.sUrl" style="width: 48px;">
          </v-btn>
          <v-btn icon
                 v-for="(aTarget, index) in placedTargets"
                 :key="index"
                 @click="target = placedTargets[index]">
            <img :src="aTarget.sUrl" style="width: 48px;">
          </v-btn>
        </v-speed-dial>
        <div class="font-mono flex column" >
          <div class="flex" style="width: 100%;">
            <div class="px-1" style="flex: 1 0 auto; text-align: center; font-size: large"
            >{{DOMbearing}}
            </div>
            <div class="px-1" style="flex: 1 0 auto; text-align: center; font-size: large"
            >{{DOMelevation}}
            </div>
          </div>
          <div class="flex" style="width: 100%;">
            <div class="px-1 body-1" style="flex: 1 0 auto; text-align: center; font-size: small; color: #9e9e9e"
            >{{DOMdist}}</div>
            <div class="px-1 body-1" style="flex: 1 0 auto; text-align: center; font-size: small; color: #9e9e9e"
            >{{DOMhDelta}}</div>
          </div>
        </div>
      </div>
    </div>
  </v-content>
  <v-content class="fixedPos" style="pointer-events: none" v-if="quickMode">
    <div class="flex column" style="justify-content: flex-start; align-items: flex-start">
      <div class="flex column pt-2">
        <v-btn icon style="pointer-events: all" v-if="mortar" class="secondary" @click="removeMortar(0)">
          <v-badge color="red" right overlap style="margin-top: 6px">
            <span slot="badge"><v-icon>clear</v-icon></span>
            <!--<v-icon large>mail</v-icon>-->
            <img :src="mortar.sUrl" style="width: 36px;">
          </v-badge>
        </v-btn>
        <v-btn icon style="pointer-events: all" v-if="target" class="secondary" @click="removeTarget(0)">
          <v-badge color="red" right overlap  style="margin-top: 6px">
            <span slot="badge"><v-icon>clear</v-icon></span>
            <img :src="target.sUrl" style="width: 36px;">
          </v-badge>
        </v-btn>
      </div>
    </div>
  </v-content>
  <v-menu v-model="showMenu" absolute :open-on-click="false" :position-x="menuPos.x" :position-y="menuPos.y">
    <v-card style="border: none">
      <v-content class="pa-0">
        <v-layout row>
          <v-layout column style="border-right: 2px #212121 solid">
            <v-btn
                icon large v-for="(mUrl, i) in colors.symbol.mortar" :key="i"
                @click="placePin(menuLatlng, i, PIN_TYPE.MORTAR)"
                style="margin: 2px 2px 2px 2px">
              <img :src="mUrl" width="48px">
            </v-btn>
          </v-layout>
          <v-layout column>
            <v-btn
                icon large v-for="(mUrl, i) in colors.symbol.target" :key="i"
                @click="placePin(menuLatlng, i, PIN_TYPE.TARGET)"
                style="margin: 2px 2px 2px 2px">
              <img :src="mUrl" width="48px">
            </v-btn>
          </v-layout>
          <v-layout column style="border-left: 2px #212121 solid">
            <v-btn
                icon large v-for="(mUrl, i) in colors.symbol.fob" :key="i"
                @click="placePin(menuLatlng, i, PIN_TYPE.FOB)"
                style="margin: 2px 2px 2px 2px">
              <img :src="mUrl" width="48px">
            </v-btn>
          </v-layout>
        </v-layout>
      </v-content>
    </v-card>
  </v-menu>
  <v-dialog v-model="changelogDialog">
    <v-card>
      <v-card-text>
        <Changelog/>
      </v-card-text>
    </v-card>
  </v-dialog>
  <canvas id="heightmap"></canvas>
</v-app>
</template>

<script>
import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

import { CRS, LatLng, Map, Point, Polyline, Transformation } from "./assets/Leaflet/dist/leaflet-src.esm";

import SquadGrid from "./assets/Leaflet_extensions/SquadGrid";
import LocationLayer from "./assets/Leaflet_extensions/LocationLayer";
import {
  calcMortarAngle,
  formatKeyPad,
  getKP,
  getPos,
  pad,
  pinUrls,
  symbolUrls,
} from "./assets/Utils";
import {
  ICON_SIZE,
  PIN_TYPE, PS_3INCH_MAX_DISTANCE, PS_3INCH_VELOCITY,
  PS_4INCH_MAX_DISTANCE,
  PS_4INCH_VELOCITY,
  PS_8CM_MAX_DISTANCE,
  PS_8CM_VELOCITY, SQUAD_MAX_DISTANCE, SQUAD_VELOCITY,
} from "./assets/Vars";
import PinHolder from "./assets/PinHolder";
import MapData from "./assets/MapData";

import { version as pkgVersion } from "../package.json";

Vue.use(Vuetify, {});

export default {
  name: "Map",
  props: {
    mapData: {
      type: MapData,
    },

    // whether to add PostScriptum features or not
    postScriptum: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Changelog: () => import(/* webpackChunkName: "changelog" */ "../CHANGELOG.md"),
  },
  data() {
    return {
      showMenu: false, // menu when clicking on map
      drawer: undefined, // left navigation drawer
      map: undefined, // leaflet map object
      maps: this.mapData.getMapNames(), // map names for top selector
      grid: new SquadGrid(), // keypad grid
      locationLayer: new LocationLayer(), // locationlayer
      showGrid: this.fromStorage("showGrid", "true") === "true",
      showHeightmap: this.fromStorage("showHeightmap", "false") === "true",
      showLocations: this.fromStorage("showLocations", "false") === "true",
      selectedMap: this.fromStorage("selectedMap", undefined), // selected map in top selector
      delayCalcUpdate: this.fromStorage("delayCalcUpdate", "true") === "true",
      mouseKeypad: undefined, // keypad shown in bottom left corner
      showKeypadTimeout: undefined, // value of timeout, set when mouse is moved, set undefined after 1 sec
      calcTimeout: undefined, // value of timeout for delayed calculations set, see calcMortar()
      mortar: undefined, // active mortar (for line drawing)
      target: undefined, // active target (for line drawing)
      distLine: undefined, // the line
      // available colors
      colors: {
        pin: {
          mortar: pinUrls(PIN_TYPE.MORTAR),
          target: pinUrls(PIN_TYPE.TARGET),
          fob: pinUrls(PIN_TYPE.FOB),
        },
        symbol: {
          mortar: symbolUrls(PIN_TYPE.MORTAR),
          target: symbolUrls(PIN_TYPE.TARGET),
          fob: symbolUrls(PIN_TYPE.FOB),
        },
      },

      placedMortars: [], // mortars currently on map
      placedTargets: [], // targets currently on map
      placedFobs: [], // fobs currently on map

      menuPos: new Point(500, 500), // x:y position set just before click menu is shown
      menuLatlng: undefined, // same position but in latlng
      squadMap: undefined, // class that holds current map, see SquadMap class
      loading: true,

      // values for mortar settings, distance, etc.
      c: {
        bearing: undefined,
        elevation: undefined,
        dist: undefined,
        hDelta: undefined,
      },

      PIN_TYPE, // reference to pin types
      pad, // reference to padding function used for formatting distance, heightDiff, etc.

      quickMode: this.fromStorage("quickMode", "true") === "true",
      pinSize: Number.parseInt(this.fromStorage("pinSize", `${ICON_SIZE}`), 10),
      showAllRanges: this.fromStorage("showAllRanges", "false") === "true",
      errorString: localStorage === undefined ? "No localStorage!" : undefined,
      errorStringSub: "Your settings won't be saved",
      dragging: false,
      changelogDialog: false,
      appVersion: `v${pkgVersion}`,
      placePinVars: {
        dialog: false,
        mIndex: 2,
        tIndex: 2,
        mText: undefined,
        tText: undefined,
        mError: false,
        tError: false,
      },

      /* PostScriptum exclusive */
      mortarTypes: [
        ["GER 8cm", PS_8CM_VELOCITY, PS_8CM_MAX_DISTANCE],
        ["BRIT 4″", PS_4INCH_VELOCITY, PS_4INCH_MAX_DISTANCE],
        ["BRIT 3″", PS_3INCH_VELOCITY, PS_3INCH_MAX_DISTANCE],
      ],
      mTypeIndex: Number.parseInt(this.fromStorage("mTypeIndex", "0"), 10),
    };
  },
  mounted() {
    console.log("mounted");

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

      this.map = new Map("map", {
        crs: CRS.Simple,
        minZoom: 0,
        maxZoom: 6,
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
      const squadMap = this.mapData.getSquadMap(newMap);

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
      if (squadMap.hasHeightmap) {
        const hLayer = squadMap.getHeightmapTileLayer();

        // we set loading callbacks even if its not to be shown yet
        hLayer.on("loading", () => {
          this.loading = true;
        });
        hLayer.on("load", () => {
          this.loading = false;
        });
        if (this.showHeightmap) {
          layer = hLayer;
        }
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
      console.debug("onMouseMove:", e);

      // we don't want to show the indicator if any of the markers are being dragged
      // so we clear showKeypadTimeout (so that the indicator is not shown) and return early
      if (this.dragging) {
        this.showKeypadTimeout = undefined;
        return;
      }


      // format position as keypad for bottom left corner
      this.mouseKeypad = getKP(e.latlng.lat, e.latlng.lng);

      // black magic to only have bottom left keypad indicator shown for 1 second
      if (this.showKeypadTimeout) {
        clearTimeout(this.showKeypadTimeout);
      }
      this.showKeypadTimeout = setTimeout(() => {
        console.log("clearing showKeypadTimeout MOVE", this.showKeypadTimeout);
        // this.showKeypadTimeout = undefined;
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
      if (!this.dragging) {
        this.menuLatlng = e.latlng;
        this.menuPos = new Point(e.originalEvent.x, e.originalEvent.y);

        // in simple mode, place mortar or target directly
        if (this.quickMode) {
          if (this.placedMortars.length === 0) {
            this.placePin(this.menuLatlng, 2, PIN_TYPE.MORTAR);
          } else {
            this.placePin(this.menuLatlng, 2, PIN_TYPE.TARGET);
          }
        } else {
          this.showMenu = true;
        }
      }
    },
    /**
     * Places pin at desired position of given type with the icon based on urlIndex
     *
     * @param {String|Array|LatLng} pos - target pin position
     * @param {Number} urlIndex - image url index of pin & symbol graphic
     * @param {Number} type - type of pin, check PIN_TYPE in Vars
     */
    placePin(pos, urlIndex, type) {
      console.log("placePin", [pos, urlIndex, type]);

      // check type of pos var
      // string -> keypad string e.g. A03-1-1 -> convert to LatLng
      // Array -> "raw" LatLng -> convert to LatLng
      if (typeof pos === "string") {
        pos = getPos(pos);
      } else if (Array.isArray(pos)) {
        pos = new LatLng(pos);
      }

      let pin;
      switch (type) {
        case PIN_TYPE.MORTAR:
          // check placed pins. if pin exists already, just move it
          for (let i = 0; i < this.placedMortars.length; i += 1) {
            if (this.colors.pin.mortar[urlIndex] === this.placedMortars[i].pUrl) {
              this.placedMortars[i].pos = pos;
              this.mortar = this.placedMortars[i];
              return;
            }
          }
          pin = new PinHolder(
            type, this.colors.pin.mortar[urlIndex], this.pinSize,
            this.postScriptum ? this.currentMType[2] : SQUAD_MAX_DISTANCE, // use max distance of current mortar for PS
          );
          this.placedMortars.push(pin);
          this.mortar = pin;
          break;
        case PIN_TYPE.TARGET:
          for (let i = 0; i < this.placedTargets.length; i += 1) {
            if (this.colors.pin.target[urlIndex] === this.placedTargets[i].pUrl) {
              this.placedTargets[i].pos = pos;
              this.target = this.placedTargets[i];
              return;
            }
          }
          pin = new PinHolder(type, this.colors.pin.target[urlIndex], this.pinSize);
          this.placedTargets.push(pin);
          this.target = pin;
          break;
        case PIN_TYPE.FOB:
          for (let i = 0; i < this.placedFobs.length; i += 1) {
            if (this.colors.pin.fob[urlIndex] === this.placedFobs[i].pUrl) {
              this.placedFobs[i].pos = pos;
              return;
            }
          }
          pin = new PinHolder(type, this.colors.pin.fob[urlIndex], this.pinSize);
          this.placedFobs.push(pin);
          break;
        default:
          console.error(`Unrecognized pin type ${type}!`); // should never happen
      }

      // no a few things we do on all types of pin
      if (pin) {
        pin.addOnDragStartListener(this.onDragStartListener);
        pin.addOnDragEndListener(this.onDragEndListener);
        console.log("setting new pin at position:", pos);
        pin.pos = pos;
        pin.addTo(this.map);
      }
    },
    /**
     * Calculates mortar settings.
     *
     * @param {PinHolder} mortar - mortar pin
     * @param {PinHolder} target - target pin
     * @param {Boolean} delayUpdate - whether or not to delay updating values for DOM
     */
    calcMortar(mortar, target, delayUpdate = true) {
      console.log("calcMortar", [mortar, target]);

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

      const hDelta = targetHeight - mortarHeight;
      const mVelocity = this.postScriptum ? this.currentMType[1] : SQUAD_VELOCITY;
      const elevation = calcMortarAngle(dist, hDelta, mVelocity);

      // create or move the line
      if (!this.distLine) {
        this.distLine = new Polyline([s, e], {
          color: "#4caf50",
          interactive: false,
          clickable: false, // legacy support
        });
      } else {
        this.distLine.setLatLngs([s, e]);
      }

      // isNaN is used as elevation might be NaN
      this.distLine.setStyle({
        color: Number.isNaN(elevation) || elevation > 1580 || elevation < 800 ? "#f44336" : "#4caf50",
      });

      // add to map if it isn't shown yet
      if (!this.map.hasLayer(this.distLine)) {
        this.map.addLayer(this.distLine);
      }

      // new this.c object before setting it
      const newC = {
        bearing,
        elevation,
        dist,
        hDelta,
      };

      if (this.calcTimeout) { clearTimeout(this.calcTimeout); }

      // if we want to delay the calc update, we set a timer that will set this.c
      if (delayUpdate) {
        this.calcTimeout = setTimeout(() => {
          this.c = newC;
        }, 250);
      } else {
        this.c = newC;
      }
    },
    /**
     * Remove an already placed mortar, specified by its index in placedMortars
     * @param {Number} i - index of mortar in placedMortars
     */
    removeMortar(i) {
      console.log("removeMortar:", i);
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
      console.log("removeTarget:", i);
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
      console.log("removeFob:", i);
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
      if (localStorage) {
        try {
          return localStorage.getItem(item) || defVal;
        } catch (e) {
          console.error(`Can't load ${item} from localStorage:`, e);
          this.errorString = "Can't load from localStorage!";
          this.errorStringSub = `${e.name}: ${e.message}`;
        }
      }

      // if retrieving failed or localStorage does not exist, return default value
      return defVal;
    },
    /**
     * Try to save item in localStorage
     * @param item - item name
     * @param val - value of item
     */
    toStorage(item, val) {
      console.log("toStorage:", [item, val]);
      if (localStorage) {
        try {
          localStorage.setItem(item, val.toString());
        } catch (e) {
          console.error("Can't save to localStorage");
          this.errorString = "Can't save to localStorage!";
          this.errorStringSub = `${e.name}: ${e.message}`;
        }
      } else {
        console.warn("No access to localStorage");
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
    onDragStartListener() {
      this.dragging = true;
    },
    onDragEndListener() {
      this.dragging = false;
      if (this.mortar && this.target) { this.calcMortar(this.mortar, this.target, false); }
    },

    /**
     * Formats a keypad string. If type is given, sets error state for placePin textField for that type.
     * @param {String} kp - keypad string
     * @param {Number} type - type of PIN_TYPE
     * @returns {String} returns formatted string, or initial string if formatting fails
     */
    formatKP(kp, type) {
      // check if keypad is valid by calculating position
      let gotError = false;
      try {
        // fails when keypad is invalid
        getPos(kp);
      } catch (e) {
        // keypad is invalid, set error state of textField based on type
        gotError = true;
      }

      if (type === PIN_TYPE.MORTAR) {
        this.placePinVars.mError = gotError;
      } else if (type === PIN_TYPE.TARGET) {
        this.placePinVars.tError = gotError;
      }

      // formatKeyPad() should never fail, so we return it
      try {
        return formatKeyPad(kp);
      } catch (e) {
        // but just in case, we return initial value on error
        return kp;
      }
    },
  },
  watch: {
    /**
     * Changes to selected map and saves it in localStorage
     * @param {String} newMap - name of new map
     */
    selectedMap(newMap) {
      console.log("selectedMap:", newMap);
      this.changeMap(newMap);
      this.toStorage("selectedMap", newMap);
    },
    /**
     * Toggles keypad grid visibility and saves state to localStorage
     * @param {Boolean} b - showGrid state boolean
     */
    showGrid(b) {
      console.log("showGrid:", b);
      if (b) {
        this.map.addLayer(this.grid);
      } else {
        this.map.removeLayer(this.grid);
      }
      this.toStorage("showGrid", b);
    },
    /**
     * Toggles heightmap visibility and saves state to localStorage
     * @param {Boolean} b - showHeightmap state boolean
     */
    showHeightmap(b) {
      console.log("showHeightmap:", b);
      if (b && this.squadMap.hasHeightmap) {
        console.log("adding heightmap");
        const heightmap = this.squadMap.getHeightmapTileLayer();
        if (!this.map.hasLayer(heightmap)) {
          this.map.addLayer(heightmap);
          heightmap.on("load", this.showHeightmapOnLoad);
        }
      } else {
        console.log("removing heightmap");
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
     * @param {Boolean} b - showLocations state boolean
     */
    showLocations(b) {
      console.log("showLocations:", b);
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
      console.log("mortarPosWatcher");
      if (this.mortar && this.target) {
        this.calcMortar(this.mortar, this.target, this.delayCalcUpdate);
      } else if (this.map.hasLayer(this.distLine)) {
        this.map.removeLayer(this.distLine);
      }
    },
    /**
     * Triggers calculation on position change of active target
     */
    "target.pos": function targetPosWatcher() {
      console.log("targetPosWatcher");
      if (this.mortar && this.target) {
        this.calcMortar(this.mortar, this.target, this.delayCalcUpdate);
      } else if (this.map.hasLayer(this.distLine)) {
        this.map.removeLayer(this.distLine);
      }
    },
    /**
     * let new active mortar know that it is active now (in order to show min and max range circles)
     * @param {PinHolder} newM - new active mortar
     * @param {PinHolder} oldM - old active mortar
     */
    mortar(newM, oldM) {
      console.log("mortar:", [newM, oldM]);

      // we skip setting it inactive, if all mortars are supposed to have range circles
      if (oldM && !this.showAllRanges) {
        oldM.setActive(false, this.map);
      }
      if (newM) {
        newM.setActive(true, this.map);
      }
    },
    /**
     * Resets map when quickMode is enabled (fixes orphaned markers)
     * @param {Boolean} b - quickMode state boolean
     */
    quickMode(b) {
      console.log("quickMode watcher:", b);
      if (b) {
        // reset map
        this.changeMap(this.selectedMap);
      }
      this.toStorage("quickMode", b);
    },

    /**
     * Let's all markers know that the pin size has changed. Removes them from map,
     * then adds them again to force redraw.
     * @param {Number} newSize - new pin size
     */
    pinSize(newSize) {
      console.log("pinSize:", newSize);
      this.placedMortars.forEach((marker) => {
        marker.size = newSize;
        marker.removeFrom(this.map);
        marker.addTo(this.map);
      });
      this.placedTargets.forEach((marker) => {
        marker.size = newSize;
      });
      this.placedFobs.forEach((marker) => {
        marker.size = newSize;
      });
      this.toStorage("pinSize", `${newSize}`);
    },

    /**
     * Sets all mortars as "active" in order for all of them to show range circles.
     * @param {Boolean} b - showAllRanges state boolean
     */
    showAllRanges(b) {
      this.placedMortars.forEach((mortar) => {
        // we just need to update the mortars that are not active
        if (mortar !== this.mortar) {
          mortar.setActive(b, this.map);
        }
      });
      this.toStorage("showAllRanges", b);
    },

    /**
     * Stores delayCalcUpdate state in localStorage.
     * @param {Boolean} b - delayCalcUpdate state boolean
     */
    delayCalcUpdate(b) {
      this.toStorage("delayCalcUpdate", b);
    },

    /* PostScriptum exclusive */

    /**
     * Saves the mortar type index in localStorage
     * and updates placed mortar markers to display correct the max distance.
     */
    mTypeIndex(newIndex) {
      const newMaxDist = this.currentMType[2];
      this.placedMortars.forEach((m) => {
        m.setMaxDistance(newMaxDist);
      });

      if (this.mortar && this.target) {
        this.calcMortar(this.mortar, this.target);
      }

      this.toStorage("mTypeIndex", newIndex);
    },
  },
  computed: {
    /**
     * Returns formatted bearing string for DOM element
     * @return {String} formatted string
     */
    DOMbearing() {
      return `✵${pad((Math.round(this.c.bearing * 10) / 10).toFixed(1), 5)}°`;
    },
    /**
     * Returns formatted elevation string for DOM element
     * @return {String} formatted string
     */
    DOMelevation() {
      if (Number.isNaN(this.c.elevation) || this.c.elevation > 1580 || this.c.elevation < 800) {
        return "∠XXXX.Xmil";
      }
      return `∠${pad((Math.round(this.c.elevation * 10) / 10).toFixed(1), 6)}mil`;
    },
    /**
     * Returns formatted dist string for DOM element
     * @return {String} formatted string
     */
    DOMdist() {
      return `↔${pad(Math.round(this.c.dist), 4)}m`;
    },
    /**
     * Returns formatted hDelta string for DOM element
     * @return {String} formatted string
     */
    DOMhDelta() {
      if (this.c.hDelta > 0) {
        return `↕+${pad(Math.round(this.c.hDelta), 3)}m`;
      }
      return `↕-${pad(Math.round(-this.c.hDelta), 3)}m`;
    },

    /* PostScriptum exclusive */

    /**
     * Returns the current mortar Type array based on mTypeIndex.
     * @returns {Array} 3-element array containing mortar name, velocity, and max distance
     */
    currentMType() {
      return this.mortarTypes[this.mTypeIndex];
    },
  },
};
</script>

<style>
@import "~material-icons/iconfont/material-icons.css";
@import "./assets/Leaflet/dist/leaflet.css";
@import "~typeface-roboto/index.css";
@import "~typeface-roboto-mono/index.css";

/*hide scrollbar*/
body {
  overflow-y: hidden;
}

body::-webkit-scrollbar {
  display: none;
}

.fixedPos {
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

  font-family: "Roboto Mono", monospace;
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
  /*position: fixed;*/
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
}

#my-footer {
  display: flex; align-items: center; pointer-events: all
}

.font-mono {
  font-family: "Roboto Mono", monospace;
}

.flex {
  display: flex;
  flex: 0 0 auto;
}

.column {
  flex-direction: column;
}

/* for bottom bar to work in safari 8*/
.content--wrap {
  height: 100%!important;
}
</style>
