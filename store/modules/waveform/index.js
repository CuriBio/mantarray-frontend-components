// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  x_zoom_levels: [],
  x_zoom_level_idx: null,
  y_zoom_levels: [],
  y_zoom_level_idx: null,
};

// adapted from https://itnext.io/eating-my-advice-efficiently-improving-on-understanding-and-using-nuxt-vuex-6d00769014a2
const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
