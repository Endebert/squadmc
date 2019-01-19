/* eslint-disable no-param-reassign */

// patching fs, otherwise project can't be built on windows machines
const realFs = require("fs");
const gracefulFs = require("graceful-fs");

gracefulFs.gracefulify(realFs);


module.exports = {
  chainWebpack: () => {
    if (process.env.NODE_ENV === "production") {
      // console.log("PLUGINS: ", config.plugins);
      // config.plugins.delete("prefetch");
    }
  },
  configureWebpack: (config) => {
    // this is probably not the right way to do it, but it works.
    // FIXME: do this properly
    if (process.env.NODE_ENV === "production") {
      config.optimization.splitChunks.cacheGroups.vuetify = {
        test: /[\\/]vuetify[\\/]/,
      };

      // remove console prints
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }

    config.module.rules.push({
      test: /\.md$/,
      loader: "vue-loader!vue-md-loader",
    });
  },
};
