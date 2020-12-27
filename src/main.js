// polyfills
import "@babel/polyfill"; // babel
import "custom-event-polyfill"; // CustomEvent
import "whatwg-fetch"; // fetch
import "raf"; // requestAnimationFrame
import "performance-polyfill"; // performance

import Vue from "vue";
import VueRouter from "vue-router";
import Raven from "raven-js";
import RavenVue from "raven-js/plugins/vue";

import App from "./App.vue";

// Sentry.io error reporting tool
// only used in production mode
// please remove this when forking the project
if (process.env.NODE_ENV === "production") {
  Raven
    .config("https://b9ea0305d0364a6daf825925f36b4e0d@sentry.io/280614")
    .addPlugin(RavenVue, Vue)
    .install();
}

Vue.config.productionTip = true;

Vue.use(VueRouter);
const router = new VueRouter({
  // routes will be dynamically inserted after App has mounted
  routes: [],
});

new Vue({
  render: h => h(App),
  router,
}).$mount("#app");
