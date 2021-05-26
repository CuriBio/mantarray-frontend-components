// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import getters from "./getters";
import mutations from "./mutations";

const default_state = {
  heatmap_values: {
    "Twitch Force": { data: [], range_min: 0, range_max: 100 },
    "Twitch Period": { data: [], range_min: 0, range_max: 100 },
    "Twitch Frequency": { data: [], range_min: 0, range_max: 100 },
    "Twitch Width 80": { data: [], range_min: 0, range_max: 100 },
    "Contraction Velocity": { data: [], range_min: 0, range_max: 100 },
    "Relaxation Velocity": { data: [], range_min: 0, range_max: 100 },
  },
  heatmap_idx: null,
  heatmap_display_array: [
    "Twitch Force",
    "Twitch Period",
    "Twitch Frequency",
    "Twitch Width 80",
    "Contraction Velocity",
    "Relaxation Velocity",
  ],
  heatmap_display_idx: 0,
  heatmap_display_min_max: [],
  heatmap_display_user_min_max: {},
  heatmap_autoscale: false,
  heatmap_options_idx: 0,
  heatmap_options_gradient: [],
};

// adapted from https://itnext.io/eating-my-advice-efficiently-improving-on-understanding-and-using-nuxt-vuex-6d00769014a2
const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
