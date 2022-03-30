// adapted from https://cli.vuejs.org/guide/build-targets.html#web-component, https://webpack.js.org/concepts/targets/, and https://stackoverflow.com/questions/53841364/how-to-resolve-fs-existssync-is-not-a-function
// This file is for npm run build using vue-cli-service build

// more extensive webpack config adapted from https://github.com/webpack/webpack/issues/1599
const path = require("path");
const fs = require("fs");

const nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function (x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

module.exports = {
  css: { extract: false }, // https://cli.vuejs.org/guide/build-targets.html#library
  configureWebpack: {
    entry: ["./index.js"],
    context: __dirname,
    cache: {
      // unless the cache type is explicitly specified, the default hash codes generated can sometimes cause git dirty issues in CodeBuild. https://webpack.js.org/configuration/other-options/
      type: "filesystem",
      name: "keep-this-constant",
      //  hashAlgorithm: "md4",
    },
    // node: {
    //   __filename: true,
    //   __dirname: false,
    // },
    // target: "node",
    // output: {
    //   path: path.join(__dirname, "dist"),
    //   filename: "[name].bundle.js",
    //   chunkFilename: "[id].bundle.js",
    // },
    externals: nodeModules,
    // plugins: [
    //   new webpack.IgnorePlugin(/\.(css|less)$/),
    //   new webpack.BannerPlugin('require("source-map-support").install();',
    //                           { raw: true, entryOnly: false }),
    // ],
    devtool: "sourcemap",
    resolve: {
      // adapted from https://goenning.net/2017/07/21/how-to-avoid-relative-path-hell-javascript-typescript-projects/
      alias: {
        "@": path.resolve(__dirname),
      },
    },
  },

  chainWebpack: (config) => {
    // https://cli.vuejs.org/guide/webpack.html#chaining-advanced
    config.module
      .rule("images") // -> Custom rule specification
      .use("url-loader")
      .loader("url-loader")
      .tap((options) => {
        options = {
          ...options,
          limit: 32000,
        };
        return options;
      })
      .end();

    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        // modify the options...
        options = { ...options, cacheIdentifier: "keepconstant" }; // the default hash codes for cacheIdentifier can sometimes cause git dirty issues in CodeBuild, so attempting to disable them.  keepconstant is a random string, but it seems to work
        return options;
      })
      .end();
  },
};
