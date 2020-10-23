<template>
  <router-view :key="$route.fullPath"/>
  <!--<Loading />-->
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
  data() {
    return {
      mapData,
      postScriptum,
    };
  },
  components: {
    Loading,
    Map: () => ({
      // The component to load (should be a Promise)
      component: mapData.init(baseUrl).then(() => import(/* webpackChunkName: "map" */ "./Map.vue")),
      // A component to use while the async component is loading
      loading: Loading,
    }),
  },
  mounted() {
    // dynamically insert map routes
    mapData.init(baseUrl).then(() => {
      const mapNames = mapData.getMapNames();
      mapNames.forEach((mapName) => {
        this.$router.options.routes.push({
          name: mapName,
          path: `/${mapName}`,
          component: () => import(/* webpackChunkName: "map" */ "./Map.vue"),
          props: {
            mapData,
            postScriptum,
            initialMap: mapName,
          },
        });
        // fallback to first map, if name in route could not be matched
        this.$router.options.routes.push({
          path: "/*", redirect: mapNames[0],
        });
      });
      this.$router.addRoutes(this.$router.options.routes);
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
