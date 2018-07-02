// polyfills
import "@babel/polyfill"; // babel
import "whatwg-fetch"; // fetch
import "raf"; // requestAnimationFrame

import Vue from "vue";
import Raven from "raven-js";
import RavenVue from "raven-js/plugins/vue";

// import "./plugins/vuetify";
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

new Vue({
  render: h => h(App),
}).$mount("#app");
