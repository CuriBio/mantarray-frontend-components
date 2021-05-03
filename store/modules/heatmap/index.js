// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  // heatmap_values: 24 element array. each element corresponds to a well in the plate
  heatmap_values: [],
  heatmap_idx: null,
  heatmap_display_array: [],
  heatmap_display_idx: null,
  heatmap_display_min_max: [],
  heatmap_display_user_min_max: {},
  heatmap_autoscale: false,
  heatmap_options_array: [],
  heatmap_options_idx: null,
};

// adapted from https://itnext.io/eating-my-advice-efficiently-improving-on-understanding-and-using-nuxt-vuex-6d00769014a2
const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
