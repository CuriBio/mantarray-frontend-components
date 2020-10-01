/**
 * Function to returns boolean
 * @param   {Object} caller the Object
 * @return {Boolean} true or false
 */
function isBabelLoader(caller) {
  return caller && caller.name === "babel-loader";
}

module.exports = function (api) {
  if (api.env("test") && !api.caller(isBabelLoader)) {
    return {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current",
            },
          },
        ],
      ],
    };
  }
  return {};
};
