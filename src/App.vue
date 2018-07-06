<template>
  <Map :mapData="mapData"/>
  <!--<Loading />-->

</template>

<script>
import Loading from "./Loading.vue";
import MapData from "./assets/MapData";

const mapData = new MapData();

// adapt for local testing or when forking the project
const baseUrl = "https://maps.squadmc.ende.pro";

export default {
  name: "App",
  data() {
    return {
      mapData,
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
