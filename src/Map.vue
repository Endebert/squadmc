<template>
  <v-app dark>
    <!--CONTENT PLANE-->
    <v-content
      class="absolute-layer"
      style="position: fixed">

      <!--WRAPPER DIV-->
      <div
        class="absolute-layer"
        style="display: flex; flex-direction: column;">

        <!--MAP LAYERS-->
        <div style="display: flex; flex: 1 0 auto; position: relative">


          <div class="absolute-layer">
            <!--this div is at the top of the content plane and contains the toolbar and the quickmode buttons.
          it wrap the quickmode buttons below the toolbar, when there is not enough space.-->
            <div
              class="mt-3"
              style="position: absolute; left: 0; right: 0; display: flex; flex: 1 0 auto; flex-wrap: wrap">

              <!--FLOATING TOOLBAR-->
              <div style="display: flex; flex: 0 1 auto; align-items: baseline">
                <v-toolbar
                  dense
                  floating
                  style="z-index: 1"
                >
                  <v-app-bar-nav-icon @click.stop="drawer = !drawer">
                    <v-icon
                      v-if="ravenError"
                      color="#b71c1c">warning</v-icon>
                    <v-icon v-else>menu</v-icon>
                  </v-app-bar-nav-icon>
                  <!--<v-img src="/img/svg/icon.svg" width="40px">-->
                  <v-toolbar-title>
                    <v-autocomplete
                      class="pa-0"
                      :items="maps"
                      :loading="!hideLoadingBar && loading"
                      append-icon="map"
                      single-line
                      v-model="selectedMap"
                      item-value="text"
                      max-height="90%"
                      hide-details
                    />
                  </v-toolbar-title>
                </v-toolbar>
              </div>


              <!-- QUICK MODE MORTAR/TARGET REMOVE BUTTONS (TOP RIGHT) -->
              <div
                v-if="!advancedMode"
                class="mr-2"
                style="display: flex; flex-direction: column; flex: 1 0 auto; align-items: flex-end; z-index: 1">
                <v-badge
                  v-if="mortar"
                  class="mt-2"
                  color="red"
                  right
                  overlap
                  icon="clear">
                  <v-btn
                    icon
                    @click="removeMortar(0)">
                    <v-img :src="mortar.symbolUrl"/>
                  </v-btn>
                </v-badge>
                <v-badge
                  v-if="target"
                  class="mt-2"
                  color="red"
                  right
                  overlap
                  icon = "clear">
                  <v-btn
                    icon
                    @click="removeTarget(0)"
                    style="pointer-events: all">
                    <v-img :src="target.symbolUrl"/>
                  </v-btn>
                </v-badge>
              </div>
            </div>

            <!--BOTTOM LEFT MOUSE KEYPAD-->
            <div
              class="ma-3 px-1 grey darken-4 font-mono elevation-1"
              style="z-index: 1; position: absolute; left: 0; bottom: 0"
              v-if="showKeypadTimeout">
              {{ mouseKeypad }}
            </div>

            <!--BOTTOM RIGHT FLOATING ACTION BUTTON-->
            <div style="position: absolute; right: 0; bottom: 0">
              <v-dialog
                v-model="placePinVars.dialog"
                max-width="250">
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    v-on="on"
                    color="primary"
                    style="z-index: 1"
                    class="ma-3">
                    <v-icon style="width: 24px; height: 24px">add</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title style="background-color: #212121">Add Mortar/Target</v-card-title>
                  <v-divider/>
                  <v-card-text class="px-0">
                    <div><p align="center">Press icon buttons to cycle through marker colors</p></div>
                    <v-form>
                      <v-container>
                        <v-layout
                          column
                          wrap>
                          <v-flex>
                            <v-btn
                              icon
                              color="grey darken-4"
                              @click="placePinVars.mIndex = (placePinVars.mIndex + 1) % 4"
                            >
                              <v-img
                                :src="colors.symbol.mortar[placePinVars.mIndex]"/>
                            </v-btn>
                            <v-text-field
                              v-model="placePinVars.mText"
                              :error="placePinVars.mError"
                              label="Mortar pos"
                              placeholder="A01-3-3-7"
                              @input="placePinVars.mText = formatKP(placePinVars.mText, PIN_TYPE.MORTAR)"
                              style="width: min-content; font-family: monospace"/>
                            <v-btn
                              icon
                              color="grey darken-4"
                              :disabled="placePinVars.mError || !placePinVars.mText"
                              @click="placePin(placePinVars.mText, placePinVars.mIndex, PIN_TYPE.MORTAR)"
                              @click.stop="placePinVars.mText = undefined">
                              <v-icon>add</v-icon>
                            </v-btn>
                          </v-flex>
                          <v-flex>
                            <v-btn
                              icon
                              color="grey darken-4"
                              @click="placePinVars.tIndex = (placePinVars.tIndex + 1) % 4">
                              <v-img
                                :src="colors.symbol.target[placePinVars.tIndex]"/>
                            </v-btn>
                            <v-text-field
                              v-model="placePinVars.tText"
                              :error="placePinVars.tError"
                              label="Target pos"
                              placeholder="B13-3-7"
                              @input="placePinVars.tText = formatKP(placePinVars.tText, PIN_TYPE.TARGET)"
                              style="width: min-content; font-family: monospace"/>
                            <v-btn
                              icon
                              color="grey darken-4"
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
                  <v-divider/>
                  <v-card-actions>
                    <v-btn @click.native="placePinVars.dialog = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>

            <!--MORTAR/TARGET/FOB SELECTION POPUP MENU-->
            <v-menu
              v-model="showMenu"
              absolute
              :open-on-click="false"
              :position-x="menuPos.x"
              :position-y="menuPos.y">
              <v-content
                class="pa-0"
                style="background-color: #212121">
                <v-row no-gutters>
                  <v-col
                    style="border-right: 2px #212121 solid">
                    <v-list>
                      <v-list-item
                        style="padding: 0px"
                        v-for="(mUrl, i) in colors.symbol.mortar"
                        :key="i">
                        <v-btn
                          icon
                          large
                          @click="placePin(menuLatlng, i, PIN_TYPE.MORTAR)"
                          style="margin: 2px 2px 2px 2px">
                          <v-img
                            :src="mUrl"/>
                        </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col>
                    <v-list>
                      <v-list-item
                        style="padding: 0px"
                        v-for="(mUrl, i) in colors.symbol.target"
                        :key="i">
                        <v-btn
                          icon
                          large
                          @click="placePin(menuLatlng, i, PIN_TYPE.TARGET)"
                          style="margin: 2px 2px 2px 2px">
                          <v-img
                            :src="mUrl"/>
                        </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col
                    style="border-left: 2px #212121 solid">
                    <v-list>
                      <v-list-item
                        style="padding: 0px"
                        v-for="(mUrl, i) in colors.symbol.fob"
                        :key="i">
                        <v-btn
                          icon
                          large
                          @click="placePin(menuLatlng, i, PIN_TYPE.FOB)"
                          style="margin: 2px 2px 2px 2px">
                          <v-img
                            :src="mUrl"/>
                        </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-content>
            </v-menu>

            <!--CHANGELOG DIALOG-->
            <v-dialog
              v-model="changelogDialog"
              scrollable
              max-width="600px">
              <v-card>
                <v-card-text>
                  <Changelog/>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                  <v-btn @click.native="changelogDialog = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>

          <div
            id="map"
            class="absolute-layer"
            style="z-index: 0"/>
        </div>


        <!--FOOTER WITH MORTAR SETTINGS-->
        <v-footer
          height="auto"
          v-if="mortar && target"
          style="display: flex; flex: 0 0 auto">
          <!--POINT FIRE LAYOUT-->
          <v-row
            v-if="!secondaryTarget || targetType === TARGET_TYPE.POINT"
            no-gutters>
            <v-col
              cols="auto"
              class="d-flex justify-center align-center">
              <v-speed-dial>
                <v-btn
                  icon
                  slot="activator"
                  color="grey darken-3">
                  <v-img
                    :src="mortar.symbolUrl"/>
                </v-btn>
                <v-btn
                  icon
                  v-for="(aMortar, index) in placedMortars"
                  :key="index"
                  v-if="mortar && aMortar.symbolUrl !== mortar.symbolUrl"
                  @click="mortar = placedMortars[index]"
                >
                  <v-img
                    :src="aMortar.symbolUrl"/>
                </v-btn>
              </v-speed-dial>
              <v-icon small>arrow_forward</v-icon>
              <v-speed-dial v-if="target">
                <v-btn
                  icon
                  slot="activator"
                  color="grey darken-3">
                  <v-img
                    :src="target.symbolUrl"/>
                </v-btn>
                <v-btn
                  icon
                  v-for="(aTarget, index) in placedTargets"
                  :key="index"
                  v-if="target && aTarget.symbolUrl !== target.symbolUrl"
                  @click="target = placedTargets[index]">
                  <v-img
                    :src="aTarget.symbolUrl"/>
                </v-btn>
              </v-speed-dial>
            </v-col>
            <v-col cols="auto">
              <table class="font-mono">
                <tr style="font-size: small; opacity: 0.7" >
                  <td
                    class="px-1"
                    align="right">{{ DOMdist }}</td>
                  <td
                    class="px-1"
                    align="left">{{ DOMhDelta }}</td>
                </tr>
                <tr style="font-size: large">
                  <td
                    class="px-1"
                    align="right">{{ DOMbearing }}</td>
                  <td
                    class="px-1"
                    align="left">{{ DOMelevation }}</td>
                </tr>
              </table>
            </v-col>
          </v-row>

          <!--LINE/AREA FIRE LAYOUT-->
          <v-row
            v-if="targetType !== TARGET_TYPE.POINT && secondaryTarget"
            no-gutters>
            <v-col
              cols="auto"
              style="margin-right: 10px;">
              <v-row no-gutters>
                <v-col
                  class="d-flex justify-center">
                  <v-speed-dial justify="center">
                    <v-btn
                      icon
                      slot="activator"
                      color="grey darken-3">
                      <v-img
                        :src="mortar.symbolUrl"/>
                    </v-btn>
                    <v-btn
                      icon
                      v-for="(aMortar, index) in placedMortars"
                      :key="index"
                      @click="mortar = placedMortars[index]"
                    >
                      <v-img
                        :src="aMortar.symbolUrl"/>
                    </v-btn>
                  </v-speed-dial>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col
                  class="d-flex justify-center">
                  <v-speed-dial v-if="target">
                    <v-btn
                      icon
                      slot="activator"
                      color="grey darken-3">
                      <v-img
                        :src="secondaryTarget.symbolUrl"/>
                    </v-btn>
                    <v-btn
                      icon
                      v-for="(aTarget, index) in placedTargets"
                      :key="index"
                      v-if="aTarget !== target"
                      @click="secondaryTarget = placedTargets[index]">
                      <v-img
                        :src="aTarget.symbolUrl"/>
                    </v-btn>
                  </v-speed-dial>
                  <div
                    class="font-mono mx-1"
                    style="font-size: large; align-self: flex-start;">⊥</div>
                  <v-speed-dial>
                    <v-btn
                      icon
                      slot="activator"
                      color="grey darken-3">
                      <v-img
                        :src="target.symbolUrl"/>
                    </v-btn>
                    <v-btn
                      icon
                      v-for="(aTarget, index) in placedTargets"
                      :key="index"
                      v-if="aTarget !== secondaryTarget"
                      @click="target = placedTargets[index]">
                      <v-img
                        :src="aTarget.symbolUrl"/>
                    </v-btn>
                  </v-speed-dial>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="auto">
              <table class="font-mono">
                <tr
                  align="center"
                  style="font-size: small; color: #9e9e9e">
                  <td colspan="2">
                    <div class="flex-container">
                      <v-btn
                        icon
                        small
                        class="flex my-1"
                        color="grey darken-3"
                        :disabled="currentSubTarget <= 0">
                        <v-icon @click="currentSubTarget--">keyboard_arrow_left</v-icon>
                      </v-btn>

                      Round {{ pad(currentSubTarget + 1, 3) }} / {{ pad(subTargetsHolder.targets.length, 3) }}

                      <v-btn
                        icon
                        small
                        class="flex my-1"
                        color="grey darken-3"
                        :disabled="currentSubTarget >= subTargetsHolder.targets.length - 1">
                        <v-icon @click="currentSubTarget++">keyboard_arrow_right</v-icon>
                      </v-btn>
                    </div>
                  </td>
                </tr>
                <tr >
                  <td
                    align="center"
                    style="font-size: large"
                  >{{ DOMbearing }} {{ DOMelevation }}</td>
                </tr>
              </table>
            </v-col>
          </v-row>
        </v-footer>
      </div>
      <!--HEIGHTMAP CANVAS-->
      <canvas id="heightmap"/>
    </v-content>

    <!--FOOTER CONTAINING MORTAR SETTINGS-->


    <!--NAVIGATION DRAWER WITH SETTINGS-->
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
      :touchless="!drawer"
      disable-resize-watcher
      disable-route-watcher
      mobile-break-point="640"
      style="max-height: 100%"
      width="325"
    >
      <!--APP TITLE AND CHANGELOG BUTTON-->
      <v-toolbar>
        <v-toolbar-title
          class="flex"
          style="flex-grow: 1; justify-content: space-between">
          {{ postScriptum ? "PostScriptumMC" : "SquadMC" }}
          <v-btn
            color="primary"
            @click.stop="changelogDialog = true"
            style="min-width: 70px">{{ appVersion }}</v-btn>
        </v-toolbar-title>
      </v-toolbar>

      <!--LINK TO GITHUB-->
      <v-list
        class="pa-0"
        two-line>
        <v-list-item @click="openGitHub()">
          <v-list-item-content>
            <v-list-item-title>View Code on GitHub</v-list-item-title>
            <v-list-item-subtitle>Submit issues, contribute, etc.</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-badge
              overlap
              icon="open_in_new">
              <v-img
                :src="githubIcon"/>
            </v-badge>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider/>

      <!--ERROR DETECTED ENTRY-->
      <template v-if="ravenError">
        <!--<template>-->
        <v-list class="px-0">
          <v-list-item
            @click="showRavenReportDialog()"
            style="background-color: #b71c1c">
            <!--<v-list-item-action>-->
            <!--<v-switch-->
            <!--v-model="advancedMode"-->
            <!--&gt;</v-switch>-->
            <!--</v-list-item-action>-->
            <v-list-item-content>
              <!--<v-list-item-title>An Error occurred</v-list-item-title>-->
              <!--<v-list-item-subtitle>Please click here and fill out the error report</v-list-item-subtitle>-->
              An error occurred. Please click here and fill out the error report.
            </v-list-item-content>
            <v-list-item-avatar>
              <v-icon>warning</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-list>
        <v-divider/>
      </template>

      <!--ADVANCED MODE TOGGLE-->
      <v-list class="px-0">
        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="advancedMode"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Advanced Mode</v-list-item-title>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-icon>fast_forward</v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-content style="opacity: 0.7">
            Place FOBs, multiple markers & targets and create LINE and AREA fire
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider/>

      <!--MORTAR TYPE SELECTION-->
      <template v-if="postScriptum">
        <v-list
          class="pa-0"
          two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Set mortar type</v-list-item-title>
              <v-list-item-subtitle>
                <v-btn-toggle
                  v-model="mTypeIndex"
                  mandatory
                  style="display: flex">
                  <v-btn
                    text
                    v-for="(mType, i) in mortarTypes"
                    :key="i"
                    style="flex: 1 0 0; border: none">{{ mType.name }}</v-btn>
              </v-btn-toggle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider/>
      </template>

      <!--TARGET TYPE SELECTION-->
      <template v-if="advancedMode">
        <v-list
          two-line >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title style="display: flex">
                Set target type
                <div
                  class="primary px-2 font-mono mx-2"
                  style="border-radius: 2px; margin: 1px">BETA</div>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-btn-toggle
                  v-model="targetType"
                  mandatory
                  style="display: flex">
                  <v-btn
                    flex
                    v-for="(val, key) in TARGET_TYPE"
                    :key="val"
                    style="flex: 1 0 0; border: none">{{ key }}</v-btn>
                </v-btn-toggle>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!--ROUND SPACING SLIDER-->
        <template v-if="targetType !== TARGET_TYPE.POINT">
          <v-list class="pa-0">
            <v-list-item
              v-if="!secondaryTarget"
              style="background-color: #01579B">
              <v-list-item-content>
                Two target markers required
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon>info</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item>
              Round Spacing
              <v-slider
                v-model="subTargetSpacing"
                hide-details
                thumb-label
                class="pa-0 pr-3"
                step="5"
                min="5"
                max="50"
                ticks/>
            </v-list-item>
          </v-list>
          <v-divider/>
        </template>
      </template>

      <!--MAP SETTINGS-->
      <v-list-group
        prepend-icon="map"
        append-icon="keyboard_arrow_down">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Map Settings</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          style="background-color: #b71c1c"
          v-if="errorString">
          <v-list-item-content>
            <v-list-item-title>{{ errorString }}</v-list-item-title>
            <v-list-item-subtitle>Your settings won't be saved</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-icon>warning</v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="showGrid"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Show Keypad Grid</v-list-item-title>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-icon>grid_on</v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="showHeightmap"
              :disabled="!squadMap || !squadMap.hasHeightmap"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Show Heightmap</v-list-item-title>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-icon>terrain</v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="showLocations"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Show Locations</v-list-item-title>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-icon>location_on</v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="showAllRanges"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Show all Mortar Circles</v-list-item-title>
            <v-list-item-subtitle>instead of active only</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-icon>adjust</v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          Pin Size
          <v-slider
            v-model="pinSize"
            hide-details
            thumb-label
            class="pa-0 pr-3"
            step="12"
            min="24"
            max="96"
            ticks/>
        </v-list-item>
      </v-list-group>

      <!--PERFORMANCE SETTINGS-->
      <v-list-group
        prepend-icon="settings"
        append-icon="keyboard_arrow_down">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Performance Settings</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="delayCalcUpdate"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Delay mil update on drag</v-list-item-title>
            <v-list-item-subtitle>performance hack</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-icon>timelapse</v-icon>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="hideLoadingBar"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Hide loading bar</v-list-item-title>
            <v-list-item-subtitle>reduces zoom delay</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar>
            <v-icon>timelapse</v-icon>
          </v-list-item-avatar>
        </v-list-item>
      </v-list-group>

      <!--'REMOVE PINS' SECTION-->
      <v-list-group
        v-if="placedMortars.length + placedFobs.length + placedTargets.length > 0"
        prepend-icon="location_off"
        append-icon="keyboard_arrow_down">
        <template v-slot:activator>
          <v-list-item-title>Remove Pins</v-list-item-title>
        </template>
        <v-container>
          <v-item-group v-if="placedMortars.length">
            <v-item
              v-for="(aMortar, i) in placedMortars"
              :key="i">
              <v-btn
                icon
                @click="removeMortar(i)">
                <v-img
                  :src="aMortar.symbolUrl"/>
              </v-btn>
            </v-item>
          </v-item-group>

          <v-item-group v-if="placedTargets.length">
            <v-item
              v-for="(aTarget, i) in placedTargets"
              :key="i">
              <v-btn
                icon
                @click="removeTarget(i)">
                <v-img
                  :src="aTarget.symbolUrl"/>
              </v-btn>
            </v-item>
          </v-item-group>

          <v-item-group v-if="placedFobs.length">
            <v-item
              v-for="(aFob, i) in placedFobs"
              :key="i">
              <v-btn
                icon
                @click="removeFob(i)">
                <v-img
                  :src="aFob.symbolUrl"/>
              </v-btn>
            </v-item>
          </v-item-group>
        </v-container>
      </v-list-group>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import {
  CRS, LatLng, LatLngBounds, Map, Point, Polyline, Rectangle, Transformation,
} from "leaflet";
import Vue from "vue";
// required for Vuetify's a-la-carte functionality
import "vuetify/dist/vuetify.min.css";
import Vuetify, {
  VApp,
  VBadge,
  VBtn,
  VBtnToggle,
  VCard,
  VDialog,
  VDivider,
  VForm,
  VFooter,
  VInput,
  VIcon,
  VList,
  VLabel,
  VMenu,
  VNavigationDrawer,
  VSelect,
  VSlider,
  VSpeedDial,
  VSwitch,
  VTextField,
  VToolbar,
} from "vuetify/lib";
import Raven from "raven-js";
import semver from "semver";

import githubIcon from "./assets/svg/github.svg";

import SquadGrid from "./assets/Leaflet_extensions/SquadGrid";
import LocationLayer from "./assets/Leaflet_extensions/LocationLayer";
import * as Utils from "./assets/Utils";
import {
  COLORS,
  ICON_SIZE,
  MAX_SUBTARGETS_COUNT,
  PIN_TYPE,
  TARGET_TYPE,
} from "./assets/Vars";
import MapData from "./assets/MapData";

import { version as pkgVersion } from "../package.json";
import SubtargetsHolder from "./assets/SubtargetsHolder";
import PinHolder from "./assets/marker/pin/PinHolder";
import MortarPin from "./assets/marker/pin/MortarPin";
import TargetPin from "./assets/marker/pin/TargetPin";
import FobPin from "./assets/marker/pin/FobPin";

Vue.use(Vuetify, {
  components: {
    VApp,
    VBadge,
    VBtn,
    VBtnToggle,
    VCard,
    VDialog,
    VDivider,
    VFooter,
    VForm,
    VIcon,
    VInput,
    VLabel,
    VList,
    VMenu,
    VNavigationDrawer,
    VSelect,
    VSlider,
    VSpeedDial,
    VSwitch,
    VTextField,
    VToolbar,
  },
});

export default {
  name: "Map",
  props: {
    mapData: {
      type: MapData,
      default: () => undefined,
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

      /** @type {Map} */
      map: undefined, // leaflet map object
      maps: this.mapData.getMapNames(), // map names for top selector
      grid: new SquadGrid(), // keypad grid
      locationLayer: new LocationLayer(), // locationlayer
      showGrid: this.fromStorage("showGrid", "true") === "true",
      showHeightmap: this.fromStorage("showHeightmap", "false") === "true",
      showLocations: this.fromStorage("showLocations", "false") === "true",
      selectedMap: this.fromStorage("selectedMap", undefined), // selected map in top selector
      delayCalcUpdate: this.fromStorage("delayCalcUpdate", "true") === "true",
      hideLoadingBar: this.fromStorage("hideLoadingBar", "true") === "true",
      storedVersion: this.fromStorage("version", "v0.0.0"),
      mouseKeypad: "LOL", // keypad shown in bottom left corner
      showKeypadTimeout: undefined, // value of timeout, set when mouse is moved, set undefined after 1 sec
      calcTimeout: undefined, // value of timeout for delayed calculations set, see calcMortar()

      /** @type {MortarPin} */
      mortar: undefined, // active mortar (for line drawing)

      /** @type {TargetPin} */
      target: undefined, // active target (for line drawing)

      /** @type {TargetPin} */
      secondaryTarget: undefined, // secondary target (for line and area target type)
      subTargetSpacing: Number.parseInt(this.fromStorage("secondaryRoundsSpacing", "50"), 10),
      primaryLine: undefined, // line to primary target

      /** @type {Polyline} */
      fireLine: undefined, // line to secondary target
      /** @type {Rectangle} */
      fireArea: undefined, // line to secondary target
      subTargetLine: undefined, // line to subTarget
      aSubTargets: [], // list of precomputed subtargets (for line and area target)
      subtargetsPoints: [], // drawing subtargets on map
      warningTooMuchSubTargets: false,
      // available colors
      colors: {
        pin: {
          mortar: Utils.getPinUrls(PIN_TYPE.MORTAR),
          target: Utils.getPinUrls(PIN_TYPE.TARGET),
          fob: Utils.getPinUrls(PIN_TYPE.FOB),
        },
        symbol: {
          mortar: Utils.getSymbolUrls(PIN_TYPE.MORTAR),
          target: Utils.getSymbolUrls(PIN_TYPE.TARGET),
          fob: Utils.getSymbolUrls(PIN_TYPE.FOB),
        },
      },

      /** @type {MortarPin[]} */
      placedMortars: [], // mortars currently on map
      /** @type {TargetPin[]} */
      placedTargets: [], // targets currently on map
      /** @type {FobPin[]} */
      placedFobs: [], // fobs currently on map

      /** @type {Point} */
      menuPos: new Point(500, 500), // x:y position set just before click menu is shown
      /** @type {LatLng} */
      menuLatlng: undefined, // same position but in latlng
      /** @type {SquadMap} */
      squadMap: undefined, // class that holds current map, see SquadMap class
      loading: true,

      // values for mortar settings, distance, etc.
      mortarSettings: {
        /** @type {number} */
        bearing: undefined,
        /** @type {number} */
        elevation: undefined,
        /** @type {number} */
        dist: undefined,
        /** @type {number} */
        dHeight: undefined,
      },
      MAX_SUBTARGETS_COUNT, // max amount of subtargets to avoid perfs issues
      TARGET_TYPE, // reference to target types
      PIN_TYPE, // reference to pin types
      pad: Utils.pad, // reference to padding function used for formatting distance, heightDiff, etc.

      advancedMode: this.fromStorage("advancedMode", "false") === "true",
      pinSize: Number.parseInt(this.fromStorage("pinSize", ICON_SIZE), 10),
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

      /** @type {MortarType[]} */
      mortarTypes: this.postScriptum ? Utils.getPSMortarTypes() : Utils.getSquadMortarTypes(),

      mTypeIndex: 0,
      /** @type {SubtargetsHolder} */
      subTargetsHolder: undefined,
      currentSubTarget: 0,
      targetType: Number.parseInt(this.fromStorage("targetType", TARGET_TYPE.POINT), 10),

      githubIcon,
      ravenError: false,
    };
  },
  mounted() {
    console.log("mounted");

    document.addEventListener("ravenSuccess", (event) => {
      console.log("ravenSuccess!", event);
      if (event.data.event_id !== undefined) {
        this.ravenError = true;
      }
    }, false);

    this._keyListener = function keydown(e) {
      // disabled for basic mode
      if (this.advancedMode === false) {
        return;
      }

      // if alt key is pressed - place mortar, target otherwise
      const pinType = e.altKey ? PIN_TYPE.MORTAR : PIN_TYPE.TARGET;
      const number = Number(e.key);

      if (number > 0 && number < 5 && number !== Number.NaN) {
        this.placePin(this.LatLng, number - 1, pinType);
        return;
      }
    };

    document.addEventListener("keydown", this._keyListener.bind(this));

    // remove right click to fix context menu opening when long pressing pin for dragging
    document.oncontextmenu = function retFalse() {
      return false;
    };

    this.setupMap();
    this.subTargetsHolder = new SubtargetsHolder(this.map);
    this.subTargetsHolder.addOnTargetClickListener((i) => {
      this.currentSubTarget = i;
      this.showMenu = false;
    });

    // set selected map, defined already if loaded from localStorage
    if (!this.selectedMap || this.maps.indexOf(this.selectedMap) === -1) {
      this.selectedMap = this.maps[0];
    } else {
      // since selectedMap is already defined and doesn't trigger changeMap, we do it here manually
      this.changeMap(this.selectedMap);
    }

    let executions = 0;
    const interval = setInterval(() => {
      executions++;
      executions %= 4;
      // dirty hack to set map position to fixed on mobile devices
      // on mobile safari, map doesn't show if not fixed
      // but if always fixed, persistent navbar is over map on desktop, which is clunky
      // so this is the compromise.
      // if (this.drawer) { document.getElementById("map").style.position = "relative"; }
      this.map.invalidateSize();
      if (executions === 0) { clearInterval(interval); }
    }, 250);

    if (semver.gt(pkgVersion, this.storedVersion)) {
      // if first view of new version

      // open changelog
      this.changelogDialog = true;

      // put new version into localstorage
      this.toStorage("version", pkgVersion);
    }
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
        zoomSnap: 0,
        preferCanvas: true,
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
      this.secondaryTarget = undefined;
      this.placedTargets = [];
      this.placedMortars = [];
      this.placedFobs = [];

      console.log("setting up bounds");
      const x = 256 / squadMap.bounds.getNorth(); // 256 is inital tile size
      const y = 256 / squadMap.bounds.getEast();
      this.map.options.crs.transformation = new Transformation(y, 0, x, 0);
      // this.map.fitBounds(squadMap.bounds);
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
      this.map.setView(squadMap.bounds.getCenter(), this.map.getBoundsZoom(squadMap.bounds, true)); // center view

      // hack to properly align map and squadgrid
      // eslint-disable-next-line no-underscore-dangle
      this.map._resetView(this.map.getCenter(), this.map.getBoundsZoom(squadMap.bounds, true));

      this.squadMap = squadMap;
    },
    /**
     * Handles "mousemove" events on leaflet map
     * @param e "mousemove" event
     */
    onMouseMove(e) {
      console.debug("onMouseMove:", e);
      this.LatLng = e.latlng;
      // we don't want to show the indicator if any of the markers are being dragged
      // so we clear showKeypadTimeout (so that the indicator is not shown) and return early
      if (this.dragging) {
        this.showKeypadTimeout = undefined;
        return;
      }


      // format position as keypad for bottom left corner
      this.mouseKeypad = Utils.getKP(e.latlng.lat, e.latlng.lng);

      // black magic to only have bottom left keypad indicator shown for 1 second
      if (this.showKeypadTimeout) {
        clearTimeout(this.showKeypadTimeout);
      }
      this.showKeypadTimeout = setTimeout(() => {
        console.log("clearing showKeypadTimeout MOVE", this.showKeypadTimeout);
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
      if (!this.dragging) {
        this.menuLatlng = e.latlng;
        this.menuPos = new Point(e.originalEvent.x, e.originalEvent.y);

        // in simple mode, place mortar or target directly
        if (!this.advancedMode) {
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
        pos = Utils.getPos(pos);
      } else if (Array.isArray(pos)) {
        pos = new LatLng(pos);
      }

      let pin;
      switch (type) {
        case PIN_TYPE.MORTAR:
          // check placed pins. if pin exists already, just move it
          for (let i = 0; i < this.placedMortars.length; i += 1) {
            if (this.colors.pin.mortar[urlIndex] === this.placedMortars[i].pinUrl) {
              this.placedMortars[i].pos = pos;

              // automatically put it as main mortar for calculations
              this.mortar = this.placedMortars[i];
              return;
            }
          }
          // no pin was found, so we create it
          pin = new MortarPin(
            this.map, pos, PinHolder.createIcon(this.colors.pin.mortar[urlIndex], this.pinSize),
            true, this.mortarType.maxDistance,
          );
          this.placedMortars.push(pin);
          this.mortar = pin;
          break;
        case PIN_TYPE.TARGET:
          // check placed pins. if pin exists already, just move it
          for (let i = 0; i < this.placedTargets.length; i += 1) {
            if (this.colors.pin.target[urlIndex] === this.placedTargets[i].pinUrl) {
              this.placedTargets[i].pos = pos;

              // we found a matching target and moved it
              // if this target is not the current primary target,
              // we set the current primary target as secondary, and this one as the new primary target
              if (this.placedTargets[i] !== this.target) {
                this.secondaryTarget = this.target;
                this.target = this.placedTargets[i];
              }
              return;
            }
          }
          // no pin was found, so we create it
          pin = new TargetPin(this.map, pos, PinHolder.createIcon(this.colors.pin.target[urlIndex], this.pinSize));
          this.placedTargets.push(pin);

          // if there currently is a primary target, we set is as secondary,
          // and the new pin becomes the primary target.
          if (this.target) {
            this.secondaryTarget = this.target;
          }
          this.target = pin;
          break;
        case PIN_TYPE.FOB:
          // check placed pins. if pin exists already, just move it
          for (let i = 0; i < this.placedFobs.length; i += 1) {
            if (this.colors.pin.fob[urlIndex] === this.placedFobs[i].pinUrl) {
              this.placedFobs[i].pos = pos;
              return;
            }
          }
          // no pin was found, so we create it
          pin = new FobPin(this.map, pos, PinHolder.createIcon(this.colors.pin.fob[urlIndex], this.pinSize));
          this.placedFobs.push(pin);
          break;
        default:
          console.error(`Unrecognized pin type ${type}!`); // should never happen
      }

      // now a few things we do on all types of pin
      if (pin) {
        pin.addOnDragStartListener(this.onDragStartListener);
        pin.addOnDragEndListener(this.onDragEndListener);
        console.log("setting new pin at position:", pos);
        // pin.pos = pos;
        // pin.addTo(this.map);
        pin.show();
      }
    },
    /**
     * Draws or move the primary line from start (s) to end (e).
     *
     * @param {LatLng} s - starting position
     * @param {LatLng} e - ending position
     * @param {boolean} [inRange] - whether or not target is in range (determines line color)
     */
    drawPrimaryLine(s, e, inRange = true) {
      console.log("drawPrimaryLine:", s.toString(), e.toString());
      if (!this.primaryLine) {
        this.primaryLine = new Polyline([s, e], {
          // color: "#4caf50",
          interactive: false,
          clickable: false, // legacy support
        });
      } else {
        this.primaryLine.setLatLngs([s, e]);
      }

      this.primaryLine.setStyle({
        color: inRange ? COLORS.IN_RANGE : COLORS.OUT_OF_RANGE,
      });

      if (!this.map.hasLayer(this.primaryLine)) {
        this.map.addLayer(this.primaryLine);
      } else {
        this.primaryLine.bringToFront();
      }
    },
    /**
     * Draws or moves the secondary line from start (s) to end (e).
     *
     * @param {LatLng} [s] - starting position
     * @param {LatLng} [e] - ending position
     */
    drawFireLine(s = this.secondaryTarget.pos, e = this.target.pos) {
      console.log("drawFireLine:", s.toString(), e.toString(), this.fireLine);

      if (!this.fireLine) {
        this.fireLine = new Polyline([s, e], {
          color: COLORS.LINE_FIRE,
          interactive: false,
          clickable: false, // legacy support
        });
      } else {
        this.fireLine.setLatLngs([s, e]);
      }

      // isNaN is used as elevation might be NaN
      // const ele = this.mortarSettings.elevation;
      // this.fireLine.setStyle({
      //   color: Number.isNaN(ele) || ele > 1580 || ele < 800 ? "#f44336" : "#4caf50",
      // });

      if (!this.map.hasLayer(this.fireLine)) {
        this.map.addLayer(this.fireLine);
      } else {
        this.fireLine.bringToFront();
      }
    },
    /**
     * Draws or moves a rectangle between start (s) and end (e).
     *
     * @param {LatLng} s - starting position
     * @param {LatLng} e - ending position
     */
    drawFireArea(s = this.secondaryTarget.pos, e = this.target.pos) {
      console.log("drawFireArea:", s.toString(), e.toString());

      if (!this.fireArea) {
        this.fireArea = new Rectangle(new LatLngBounds(s, e), {
          color: COLORS.AREA_FIRE,
          fill: false,
          interactive: false,
          clickable: false, // legacy support
        });
      } else {
        this.fireArea.setBounds(new LatLngBounds(s, e));
      }

      // isNaN is used as elevation might be NaN
      // const ele = this.mortarSettings.elevation;
      // this.fireLine.setStyle({
      //   color: Number.isNaN(ele) || ele > 1580 || ele < 800 ? "#f44336" : "#4caf50",
      // });

      if (!this.map.hasLayer(this.fireArea)) {
        this.map.addLayer(this.fireArea);
      } else {
        this.fireArea.bringToFront();
      }
    },

    /**
     * Draws or moves a line specifically for subTargets of Line/Area fire, from start (s) to end (e).
     *
     * @param {LatLng} [s] - starting position
     * @param {LatLng} [e] - ending position
     * @param {boolean} [inRange] - whether or not target is in range (determines line color)
     */
    drawSubTargetLine(
      s = this.mortar.pos, e = this.subTargetsHolder.targets[this.currentSubTarget].pos,
      inRange = true,
    ) {
      console.log("drawSubTargetLine()");
      if (!this.subTargetLine) {
        this.subTargetLine = new Polyline([s, e], {
          // color: inRange ? "#4caf50" : "#f44336",
          interactive: false,
          clickable: false, // legacy support
        });
      } else {
        this.subTargetLine.setLatLngs([s, e]);
      }

      this.subTargetLine.setStyle({
        color: inRange ? COLORS.IN_RANGE : COLORS.OUT_OF_RANGE,
      });

      if (!this.map.hasLayer(this.subTargetLine)) {
        this.map.addLayer(this.subTargetLine);
      } else {
        this.subTargetLine.bringToFront();
      }
    },

    /**
     * Calculates the mortar settings based on the given mortar & target positions.
     *
     * @param {LatLng} mPos - mortar position
     * @param {LatLng} tPos - target position
     * @returns {{bearing: number, elevation: (number|NaN), dist: number, dHeight: number}} - bearing and elevation
     *  settings required to hit target. Elevation is NaN if target is out of range.
     */
    calcMortarSettings(mPos, tPos) {
      const mHeight = this.squadMap.hasHeightmap ? this.squadMap.getHeightmapHolder().getHeight(mPos.lng, mPos.lat) : 0;
      const tHeight = this.squadMap.hasHeightmap ? this.squadMap.getHeightmapHolder().getHeight(tPos.lng, tPos.lat) : 0;

      const dHeight = tHeight - mHeight;
      const mVel = this.mortarType.velocity;
      return Utils.getMortarSettings(mPos, tPos, mVel, dHeight);
    },
    setMortarSettings(settings, delayed = this.delayCalcUpdate) {
      if (delayed) {
        if (this.delayUpdateTimeout) {
          clearTimeout(this.delayUpdateTimeout);
        }
        this.delayUpdateTimeout = setTimeout(() => {
          this.mortarSettings = settings;
        }, 1000 / 4);
      } else {
        this.mortarSettings = settings;
      }
    },

    /**
     * Remove an already placed mortar, specified by its index in placedMortars
     * @param {Number|MortarPin} i - index of mortar in placedMortars, or MortarPin object
     */
    removeMortar(i) {
      console.log("removeMortar:", i);
      // if i is the pin object, we change it to the index
      if (i instanceof MortarPin) {
        i = this.placedMortars.indexOf(i);
      }
      const tMortar = this.placedMortars[i];
      this.placedMortars.splice(i, 1);
      if (tMortar === this.mortar) {
        if (this.placedMortars.length > 0) {
          this.mortar = this.placedMortars[i === 0 ? 0 : i - 1];
        } else {
          this.mortar = undefined;
        }
      }

      tMortar.hide();
    },
    /**
     * Remove an already placed target, specified by its index in placedTargets
     * @param {Number|TargetPin} i - index of target in placedTargets, or TargetPin object
     */
    removeTarget(i) {
      console.log("removeTarget:", i, this.placedTargets);
      // if i is the pin object, we change it to the index
      if (i instanceof TargetPin) {
        i = this.placedTargets.indexOf(i);
      }
      const rTarget = this.placedTargets[i];
      this.placedTargets.splice(i, 1);
      console.log("tTarget === this.target:", rTarget === this.target, this.placedTargets);
      console.log("tTarget === this.secondaryTarget:", rTarget === this.secondaryTarget, this.placedTargets);
      if (rTarget === this.target) {
        // if more than one is left, we can find new secondary target
        if (this.placedTargets.length > 1) {
          const newTarget = this.placedTargets[i === 0 ? 0 : i - 1];
          if (newTarget.pinUrl === this.secondaryTarget.pinUrl || this.target.pinUrl === this.secondaryTarget.pinUrl) {
            // find new secondary target
            // iterate through targets backwards, as behaviour is more intuitive to the user
            let newSecondary;
            for (let j = 1; j <= this.placedTargets.length; j++) {
              const target = this.placedTargets[this.placedTargets.length - j];
              console.log(`(${j}): ${target.pinUrl} !== ${newTarget.pinUrl} -> ${target.pinUrl !== newTarget.pinUrl}`);
              if (target.pinUrl !== newTarget.pinUrl) {
                newSecondary = target;
                break;
              }
            }
            console.log("new secondary target:", newSecondary);
            this.secondaryTarget = newSecondary;
          }
          console.log("new primary target:", newTarget);
          this.target = newTarget;
        } else if (this.placedTargets.length > 0) {
          // only one target left, which is primary target, so secondary target must be undefined
          this.target = this.placedTargets[0];
          this.secondaryTarget = undefined;
        } else {
          // no targets left, set primary and secondary target to undefined
          this.target = undefined;
          this.secondaryTarget = undefined;
        }
      } else if (rTarget === this.secondaryTarget) {
        if (this.placedTargets.length > 1) {
          // more than one targets are left, so we can find new secondary target
          // iterate through targets backwards, as behaviour is more intuitive to the user
          let newSecondary;
          for (let j = 1; j <= this.placedTargets.length; j++) {
            const target = this.placedTargets[this.placedTargets.length - j];
            // make sure it's not same target, and not primary target
            if (target.pinUrl !== this.target.pinUrl) {
              newSecondary = target;
              break;
            }
          }
          console.log("new secondary target:", newSecondary);
          this.secondaryTarget = newSecondary;
        } else {
          this.secondaryTarget = undefined;
        }
      }
      rTarget.hide();
    },
    formatDOMElevation(elevation) {
      if (Number.isNaN(elevation) || elevation > 1580 || elevation < 800) {
        return "XXXX.Xmil";
      }
      return `${Utils.pad((Math.round(elevation * 10) / 10).toFixed(1), 6)}mil`;
    },
    formatDOMBearing(bearing) {
      return `${Utils.pad((Math.round(bearing * 10) / 10).toFixed(1), 5)}°`;
    },
    /**
     * Remove an already placed fob, specified by its index in placedFobs
     * @param {Number} i - index of fob in placedFobs
     */
    removeFob(i) {
      console.log("removeFob:", i);
      const tFob = this.placedFobs[i];
      this.placedFobs.splice(i, 1);
      tFob.hide();
      // tFob.removeFrom(this.map);
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

    clearPrimaryLine() {
      if (this.primaryLine && this.map.hasLayer(this.primaryLine)) {
        this.map.removeLayer(this.primaryLine);
      }
    },

    clearFireLine() {
      if (this.fireLine && this.map.hasLayer(this.fireLine)) {
        this.map.removeLayer(this.fireLine);
      }
    },

    clearFireArea() {
      if (this.fireArea && this.map.hasLayer(this.fireArea)) {
        this.map.removeLayer(this.fireArea);
      }
    },

    clearSubTargetLine() {
      if (this.subTargetLine && this.map.hasLayer(this.subTargetLine)) {
        this.map.removeLayer(this.subTargetLine);
      }
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
      this.updateSubTargets(false);
      this.calcAndUpdate(false);
    },
    calcAndUpdate(delayUpdate = this.delayCalcUpdate) {
      console.log("calcAndUpdate", this.mortar, this.target, this.secondaryTarget);
      if (this.mortar && this.target) {
        // handle line/area fire
        if (this.targetType !== TARGET_TYPE.POINT && this.secondaryTarget) {
          this.clearPrimaryLine();
          // this.subTargetsHolder.genLineFire(this.secondaryTarget.pos, this.target.pos, this.subTargetSpacing);
          // this.subTargetsHolder.showAll();
          console.log("subTargets:", this.subTargetsHolder.targets.length, this.subTargetsHolder.targets);
          console.log("currentSubTarget:", this.currentSubTarget);
          const cSubTargetPos = this.subTargetsHolder.targets[this.currentSubTarget].pos;
          const settings = this.calcMortarSettings(this.mortar.pos, cSubTargetPos);
          this.setMortarSettings(settings, delayUpdate);

          const ele = settings.elevation;
          const inRange = !Number.isNaN(ele) && ele <= 1580 && ele >= 800;
          this.drawSubTargetLine(this.mortar.pos, cSubTargetPos, inRange);

          if (this.targetType === TARGET_TYPE.LINE) {
            this.clearFireArea();
            this.drawFireLine();
          } else {
            this.clearFireLine();
            this.drawFireArea();
          }
        } else {
          this.clearFireLine();
          this.clearFireArea();
          this.clearSubTargetLine();
          this.subTargetsHolder.hideAll();
          const settings = this.calcMortarSettings(this.mortar.pos, this.target.pos);
          this.setMortarSettings(settings, delayUpdate);

          const ele = settings.elevation;
          const inRange = !Number.isNaN(ele) && ele <= 1580 && ele >= 800;
          this.drawPrimaryLine(this.mortar.pos, this.target.pos, inRange);
        }
      } else {
        this.clearPrimaryLine();
        this.clearFireLine();
        this.clearFireArea();
        this.clearSubTargetLine();
        this.subTargetsHolder.hideAll();
      }
    },
    updateSubTargets() {
      if (this.mortar && this.target && this.secondaryTarget && this.targetType !== TARGET_TYPE.POINT) {
        // this.removeSubTargets();
        // this.calcMortarSecondary(this.mortar, this.secondaryTarget, this.delayCalcUpdate);
        switch (this.targetType) {
          case TARGET_TYPE.LINE:
            this.subTargetsHolder.genLineFire(this.secondaryTarget.pos, this.target.pos, this.subTargetSpacing);
            break;
          case TARGET_TYPE.AREA:
            this.subTargetsHolder.genAreaFire(this.secondaryTarget.pos, this.target.pos, this.subTargetSpacing);
            break;
          default:
            console.log("Trying invoke subTargetsHolder for target type:", this.targetType);
            break;
        }
        this.currentSubTarget = Math.min(this.currentSubTarget, this.subTargetsHolder.targets.length - 1);
        this.subTargetsHolder.showAll();
        this.subTargetsHolder.targets[this.currentSubTarget].setSelected(true);
      } else {
        this.subTargetsHolder.hideAll();
        // this.clearSecondaryLines();
      }
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
        Utils.getPos(kp);
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
        return Utils.formatKeyPad(kp);
      } catch (e) {
        // but just in case, we return initial value on error
        return kp;
      }
    },

    /**
     * Opens up Raven's error report dialog with custom text
     */
    showRavenReportDialog() {
      Raven.showReportDialog({
        lang: "en",
        title: "I flipped  the logi.",
        subtitle: "An error occurred.",
        labelName: "Name (mandatory, but can be fake)",
        labelEmail: "Email (mandatory, but can be fake)",
        user: {
          name: "John Doe",
          email: "john@doe.com",
        },
      });
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
      this.updateSubTargets();
      this.calcAndUpdate();
    },
    /**
     * Triggers calculation on position change of active target
     */
    "target.pos": function targetPosWatcher() {
      console.log("targetPosWatcher:", this.target);
      this.updateSubTargets();
      this.calcAndUpdate();
    },
    "secondaryTarget.pos": function secondaryTargetPosWatcher() {
      console.log("secondaryTargetPosWatcher:", this.secondaryTarget);
      this.updateSubTargets();
      this.calcAndUpdate();
    },
    warningTooMuchSubTargets(b) {
      console.log("warningTooMuchSubTargets", b);
      if (this.fireLine) {
        this.fireLine.setStyle({
          color: b ? "#ff3333" : "#3333ff",
        });
      }
    },
    /**
     * let new active mortar know that it is active now (in order to show min and max range circles)
     * @param {__PinHolder} newM - new active mortar
     * @param {__PinHolder} oldM - old active mortar
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
    subTargetSpacing(i) {
      this.toStorage("secondaryRoundsSpacing", i);
      this.updateSubTargets();
      this.calcAndUpdate(false);
      // if (this.advancedMode && this.target && this.secondaryTarget && this.targetType !== TARGET_TYPE.POINT) {
      //   this.calcSubTargets();
      // }
    },
    /**
     * Resets map when advancedMode is disabled (fixes orphaned markers)
     * @param {Boolean} b - advancedMode state boolean
     */
    advancedMode(b) {
      console.log("advancedMode watcher:", b);
      if (!b) {
        // remove mortars and targets
        while (this.placedMortars.length > 0) {
          this.removeMortar(0);
        }
        while (this.placedTargets.length > 0) {
          this.removeTarget(0);
        }
        // set targetType to point
        // this.targetType = TARGET_TYPE.POINT;
      }
      this.toStorage("advancedMode", b);
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
        // marker.removeFrom(this.map);
        // marker.addTo(this.map);
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

    /**
     * Stores hideLoadingBar state in localStorage.
     * @param {Boolean} b - hideLoadingBar state boolean
     */
    hideLoadingBar(b) {
      this.toStorage("hideLoadingBar", b);
    },

    /**
     * Updates maxDistance of placed mortars.
     *
     * @param {MortarType} mType - mortar type
     */
    mortarType(mType) {
      this.placedMortars.forEach((m) => {
        m.setMaxDistance(mType.maxDistance);
      });
    },

    /**
     * @param {TARGET_TYPE} tType - target type, one of TARGET_TYPE enum
     */
    targetType(tType) {
      this.updateSubTargets();
      this.calcAndUpdate(false);
      this.toStorage("targetType", tType);
    },
    /**
     * Keeps track fo the current subTarget and recalculates the mortar settings.
     */
    currentSubTarget(newI, oldI) {
      console.log("currentSubTarget:", [newI, oldI]);
      try {
        this.subTargetsHolder.targets[oldI].setSelected(false);
      } catch (e) {
        console.warn(`old current subtarget at ${oldI} does not exist anymore`);
      }
      this.subTargetsHolder.targets[newI].setSelected(true);
      this.calcAndUpdate(false);
    },
    /**
     * Saves the mortar type index in localStorage
     * and updates placed mortar markers to display correct the max distance.
     */
    mTypeIndex(newIndex) {
      this.calcAndUpdate(false);
      this.toStorage("mTypeIndex", newIndex);
    },
  },
  computed: {
    /**
     * Returns formatted bearing string for DOM element
     * @return {String} formatted string
     */
    DOMbearing() {
      return this.formatDOMBearing(this.mortarSettings.bearing);
    },
    /**
     * Returns formatted elevation string for DOM element
     * @return {String} formatted string
     */
    DOMelevation() {
      return this.formatDOMElevation(this.mortarSettings.elevation);
    },
    /**
     * Returns formatted dist string for DOM element
     * @return {String} formatted string
     */
    DOMdist() {
      return `↔${Utils.pad(Math.round(this.mortarSettings.dist), 4)}m`;
    },
    /**
     * Returns formatted dHeight string for DOM element
     * @return {String} formatted string
     */
    DOMhDelta() {
      if (this.mortarSettings.dHeight > 0) {
        return `↕+${Utils.pad(Math.round(this.mortarSettings.dHeight), 3)}m`;
      }
      return `↕-${Utils.pad(Math.round(-this.mortarSettings.dHeight), 3)}m`;
    },
    /**
     * Returns current mortar type as MortarType instance.
     *
     * @return {MortarType}
     */
    mortarType() {
      return this.mortarTypes[this.mTypeIndex];
    },
  },
};
</script>
