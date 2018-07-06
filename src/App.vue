<template>
  <Map :mapData="mapData" :postScriptum="postScriptum"/>
  <!--<Loading />-->

</template>

<script>
import Loading from "./Loading.vue";
import MapData from "./assets/MapData";

// variable that determines PostScriptum mode
// based on this, mapData baseURL will be modified and condition for Map component set
const postScriptum = true;
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
