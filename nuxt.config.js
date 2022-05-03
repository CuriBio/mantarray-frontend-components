module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: "waveform",
    meta: [
      { charset: "utf-8" },
      { name: "robots", content: "noindex" },
      { name: "googlebot", content: "noindex" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "noindex,nofollow" },
      {
        hid: "description",
        name: "description",
        content: "Genrating six waveform with features",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  css: ["~/node_modules/typeface-muli/index.css", "~/node_modules/typeface-anonymous-pro/index.css"],
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Build configuration
   */
  build: {
    // extend({ node }, { isDev, isClient }) {
    //   node = {
    //     fs: "empty"
    //   };
    // }
    /*
     ** Run ESLint on save
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        });
      }
    }, */
  },
  ssr: false,
  server: {
    port: 8080, // default: 3000
    host: "localhost", // default: localhost
  },
};
