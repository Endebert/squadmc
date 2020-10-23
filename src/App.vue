<template>
  <router-view :key="$route.fullPath"/>
</template>

<script>
import Loading from "./Loading.vue";
import MapData from "./assets/MapData";

// variable that determines PostScriptum mode
// based on this, mapData baseURL will be modified and condition for Map component set
const postScriptum = false;
const mapData = new MapData();

// adapt for local testing or when forking the project
let baseUrl = "https://maps.squadmc.ende.pro";
if (postScriptum) { baseUrl += "/ps"; }

export default {
  name: "App",
  mounted() {
    const mapComponentPromise = () => import(/* webpackChunkName: "map" */ "./Map.vue");
    // dynamically insert map routes
    mapData.init(baseUrl).then(() => {
      const mapNames = mapData.getMapNames();
      const routes = mapNames.map(mapName => ({
        name: mapName,
        path: `/${mapName}`,
        component: mapComponentPromise,
        loading: Loading,
        props: {
          mapData,
          postScriptum,
          initialMap: mapName,
        },
      }));
      // fallback to first map, if name in route could not be matched
      routes.push({
        path: "*", redirect: () => localStorage.getItem("selectedMap") || mapNames[0],
      });
      this.$router.addRoutes(routes);
    });
  },
};
</script>
<style>
  /*hide scrollbar*/
  body {
    overflow-y: hidden;
  }

  body::-webkit-scrollbar {
    display: none;
  }
</style>
