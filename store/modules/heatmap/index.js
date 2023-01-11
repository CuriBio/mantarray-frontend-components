// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import getters from "./getters";
import mutations from "./mutations";
import { METRIC_UNITS, MAX_NUM_DATAPOINTS_FOR_MEAN } from "./enums";

const default_state = {
  selected_wells: [],
  well_selection_statuses: new Array(24).fill(false),
  display_option: "Twitch Frequency",
  display_option_idx: 0,
  auto_scale: false,
};

// adapted from https://itnext.io/eating-my-advice-efficiently-improving-on-understanding-and-using-nuxt-vuex-6d00769014a2
const state = () => JSON.parse(JSON.stringify(default_state));

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  METRIC_UNITS,
  MAX_NUM_DATAPOINTS_FOR_MEAN,
};
